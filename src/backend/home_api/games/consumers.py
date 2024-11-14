import json
from channels.generic.websocket import AsyncWebsocketConsumer
from games.models import Match, MatchPlayer
from django.contrib.auth.models import User
from channels.db import database_sync_to_async
import asyncio
class GameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'game_{self.game_id}'
        self.user = self.scope['user']

        can_join = await self.can_join_match()
        if not can_join:
            print("===== User can't join match ❌=====")
            await self.close()
            return

        print(f"User {self.user} connected to game {self.game_id} in group {self.room_group_name}")

        self.player1_name = None
        self.player2_name = None

        
        self.ball = {
            "pos": [50, 50],
            "vel": [1, 1],
            "radius": 1
        }
        self.player1 = {
            "pos_y": 50,
            "vel": 10,
            "width": 1,
            "height": 20,
            "padding": 2
        }
        self.player2 = {
            "pos_y": 50,
            "vel": 10,
            "width": 1,
            "height": 20,
            "padding": 2
        }
        self.score = {"player1": 0, "player2": 0}

        await self.assign_player_roles()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.update_player_connection_status(connected=True)
        await self.check_both_players_connected()

    @database_sync_to_async
    def assign_player_roles(self):
        """
        Assigne les IDs de player1 et player2
        """
        match = Match.objects.get(id=self.game_id)
        players = MatchPlayer.objects.filter(match_id=match)

        for player in players:
            if player.is_player1:
                self.player1_name = player.player_id
            else:
                self.player2_name = player.player_id


    async def disconnect(self, close_code):
        await self.update_player_connection_status(connected=False)
        print(f"User {self.user} disconnected from game {self.game_id} with close code {close_code}")

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )




    async def check_both_players_connected(self):
        player_connected = await database_sync_to_async(
            MatchPlayer.objects.filter(match_id=self.game_id, connected=True).count
        )()

        if player_connected == 2:
            print('=====> Both players connected to game ', self.game_id)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_start',
                }
            )
            asyncio.create_task(self.game_loop())
        else:
            print('=====> Not all players are connected to game', self.game_id)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_waiting',
                }
            )

    async def game_loop(self):

        while True:
            print("Game loop - pos_y Player 1:", self.player1['pos_y'])
            print("Game loop - pos_y Player 2:", self.player2['pos_y'])
            self.ball["pos"][0] += self.ball["vel"][0]
            self.ball["pos"][1] += self.ball["vel"][1]

            # Up Down
            if self.ball["pos"][1] - self.ball["radius"] <= 0 or self.ball["pos"][1] + self.ball["radius"] >= 100:
                self.ball["vel"][1] *= -1

            # Left Pad
            if (self.ball["pos"][0] - self.ball["radius"] <= self.player1["padding"] + self.player1["width"] and
                self.player1["pos_y"] <= self.ball["pos"][1] <= self.player1["pos_y"] + self.player1["height"]):
                self.ball["vel"][0] *= -1  # Inverser la direction horizontale

            # Right Pad
            elif (self.ball["pos"][0] + self.ball["radius"] >= 100 - self.player2["padding"] - self.player2["width"] and
                  self.player2["pos_y"] <= self.ball["pos"][1] <= self.player2["pos_y"] + self.player2["height"]):
                self.ball["vel"][0] *= -1  # Inverser la direction horizontale

            # Left Wall
            if self.ball["pos"][0] - self.ball["radius"] <= 0:
                self.score["player2"] += 1
                self.ball["pos"] = [50, 50]

            # Right Wall
            elif self.ball["pos"][0] + self.ball["radius"] >= 100:
                self.score["player1"] += 1
                self.ball["pos"] = [50, 50]

            # Envoie de l’état de la partie aux joueurs
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_update',
                    'game_state': {
                      'ball': self.ball,
                      'player1': self.player1,
                      'player2': self.player2,
                      'score': self.score
                    }
                }
            )

            #await asyncio.sleep(0.02)  # 50 FPS
            await asyncio.sleep(1)  # 50 FPS


    async def game_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_update',
            'game_state': event['game_state']
        }))
  
    async def game_start(self, event):
        await self.send(text_data=json.dumps({
                    'type': 'START',
                }))
  
    async def game_waiting(self, event):
        
        await self.send(text_data=json.dumps({
                    'type': 'Waiting for the other player to connect...',
                }))
  

        
    @database_sync_to_async
    def update_player_connection_status(self, connected):
        match_player = MatchPlayer.objects.get(match_id=self.game_id, player_id=self.user.id)
        match_player.connected = connected
        match_player.save()

    @database_sync_to_async
    def can_join_match(self):
        """
          Check:
            - If the match exists
            - If the user is in the match
            - If the user is not in another ongoing match
        """
        try:
            match = Match.objects.get(id=self.game_id)
        except Match.DoesNotExist:
            return False
        
        is_player_in_match = MatchPlayer.objects.filter(match_id=match, player_id=self.user).exists()
        if not is_player_in_match:
            return False
        
        ## A REMETTRE PLUS TARD
        #ongoing_matches = Match.objects.filter(
        #    matchplayer__player_id=self.user,
        #    end_time__isnull=True
        #).exclude(id=self.game_id)

        #if ongoing_matches.exists():
        #    return False
        
        return True

    async def receive(self, text_data):
        data = json.loads(text_data)

        # Vérifier que le type d'action est bien 'paddle_move'
        if data['type'] == 'paddle_move':
            direction = data['direction']
            print("USER NAME:",   self.scope['user'], "PLAYER 1 NAME:", self.player1_name)
            if self.scope['user'] == self.player1_name:
                print("POS Y PLAYER 1 before:", self.player1['pos_y'])
                self.player1['pos_y'] = self.update_paddle_position(self.player1, direction)
                print("POS Y PLAYER 1:", self.player1['pos_y'])
            else:
                print("player2")
                self.player2['pos_y'] = self.update_paddle_position(self.player2, direction)

    def update_paddle_position(self, player, direction):
        new_pos_y = player['pos_y'] + (direction * player['vel'])
        new_pos_y = max(0, min(new_pos_y, 100 - player['height']))
        return new_pos_y


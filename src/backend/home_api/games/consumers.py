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

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.update_player_connection_status(connected=True)
        await self.check_both_players_connected()

    async def disconnect(self, close_code):
        await self.update_player_connection_status(connected=False)
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
                    'message': 'START'
                }
            )
            asyncio.create_task(self.game_loop())
        else:
            print('=====> Not all players are connected to game', self.game_id)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_waiting',
                    'message': 'Waiting for the other player to connect...'
                }
            )

    async def game_loop(self):
        ball_position = [50, 50]
        ball_velocity = [1, 1]
        player1_position = 50
        player2_position = 50
        score = {"player1": 0, "player2": 0}

        while True:
            ball_position[0] += ball_velocity[0]
            ball_position[1] += ball_velocity[1]

            if ball_position[1] <= 0 or ball_position[1] >= 100:  # Bords haut et bas
                ball_velocity[1] *= -1

            if ball_position[0] <= 0:  # Collision avec le mur 1
                score['player1'] += 1
                ball_position = [50, 50] 

            elif ball_position[0] >= 100:  # Collision avec le mur 2
                score['player2'] += 1
                ball_position = [50, 50]

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_update',
                    'ball_position': ball_position,
                    'ball_velocity': ball_velocity,
                    'player1_position': player1_position,
                    'player2_position': player2_position,
                    'score': score
                }
            )
            #await asyncio.sleep(0.02) # 50 FPS
            await asyncio.sleep(1) 

    async def game_update(self, event):
        await self.send(text_data=json.dumps({
            'ball_position': event['ball_position'],
            'ball_velocity': event['ball_velocity'],
            'player1_position': event['player1_position'],
            'player2_position': event['player2_position'],
            'score': event['score']
        }))
  
    async def game_start(self, event):
        
        message = event['message']
        await self.send(text_data=json.dumps({
                    'message': message
                }))
  
  
    async def game_waiting(self, event):
        
        message = event['message']
        await self.send(text_data=json.dumps({
                    'message': message
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

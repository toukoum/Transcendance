import json
from channels.generic.websocket import AsyncWebsocketConsumer
from games.models import Match, MatchPlayer
from django.contrib.auth.models import User
from channels.db import database_sync_to_async
from django.db.models import Q
import asyncio
from datetime import datetime

class GameConsumer(AsyncWebsocketConsumer):
    state_lock = asyncio.Lock()
    # players = {}

    game_data = {
        'ball': {
            'pos': [50, 50],
            'vel': [1, 1],
            'radius': 2,
        },
        'players': {}
    }

    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'game_{self.game_id}'
        self.user = self.scope['user']
        self.user_id = self.user.id

        can_join = await self.can_join_match(self.user, self.game_id)
        if not can_join:
            print("===== User can't join match ❌=====")
            await self.close()
            return


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.update_player_state(self.user, self.game_id, MatchPlayer.State.CONNECTED)
        print(f"User {self.user} (ID: {self.user_id}) connected to game {self.game_id} in group {self.room_group_name}")

        await self.check_all_players_connected()

    async def disconnect(self, close_code):
        await self.update_player_state(self.user, self.game_id, MatchPlayer.State.DISCONNECTED)
        print(f"User {self.user} disconnected from game {self.game_id} with close code {close_code}")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data['type'] == 'ping':
            await self.handle_ping(data)

# ---------------------------------------------------------------------------- #
#                                     GAME                                     #
# ---------------------------------------------------------------------------- #

    async def game_loop(self):
        """
        Main game loop
        """
        while True:
            async with self.state_lock:
                print('=====> Game loop')
                pass

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_state',
                    'state': 'in_progress',
                    'data': self.game_data
                }
            )
            await asyncio.sleep(0.02)


    async def start_game(self, match):
        """
        Start the game
        """
        players = await self.get_connected_players_details(match.id)
        async with self.state_lock:
            self.game_data['players'] = {}
            for index, player in enumerate(players):
                self.game_data['players'][str(player.id)] = {
                    'pos_y': 50,
                    'score': 0,
                    'padding': 5,
                    'width': 2,
                    'height': 10,
                    'vel': 1,
                    'role': f'player{index + 1}'
                }
                

        await self.update_match_state(match.id, Match.State.IN_PROGRESS)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_state',
                'state': 'in_progress',
                'data': self.game_data
            }
        )
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'game_start',
        #     }
        # )
        asyncio.create_task(self.game_loop())
    

# ---------------------------------------------------------------------------- #
#                                PING MANAGEMENT                               #
# ---------------------------------------------------------------------------- #

    async def handle_ping(self, data):
        """
        
        """
        print(f"=====> Received ping from user {self.user}")
        timestamp = data.get('timestamp', self.get_current_timestamp())
        # Send pong
        await self.send(text_data=json.dumps({
            'type': 'pong',
            'message': 'Pong',
            'timestamp': timestamp
        }))


# ---------------------------------------------------------------------------- #
#                                  WS HANDLERS                                 #
# ---------------------------------------------------------------------------- #

    async def game_state(self, event):
        """
        
        """
        state = event.get('state', 'waiting')
        data = event.get('data', {})
        await self.send(text_data=json.dumps({
            'type': 'state',
            'state': state,
            'data': data
        }))

    # async def game_pong(self, event):
    #     """
        
    #     """
    #     message = event.get('message', 'Pong')
    #     timestamp = event.get('timestamp', self.get_current_timestamp())
    #     await self.send(text_data=json.dumps({
    #         'type': 'pong',
    #         'message': message,
    #         'timestamp': timestamp
    #     }))

# ---------------------------------------------------------------------------- #




    async def check_all_players_connected(self):
        match = await self.get_match(self.game_id)

        if match.state == Match.State.WAITING:
            connected_players = await self.get_connected_players(self.game_id)
            
            print(f"=====> Connected players: {connected_players}/{match.max_players}")
            if connected_players == match.max_players:
                await self.start_game(match)
            else:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_state',
                        'state': 'waiting',
                        'data': {
                            'connected_players': connected_players,
                            'max_players': match.max_players
                        }
                    }
                )

# ---------------------------------------------------------------------------- #
#                                     UTILS                                    #
# ---------------------------------------------------------------------------- #

    @database_sync_to_async
    def get_match(self, game_id):
        """
        Récupérer les informations du match.
        """
        return Match.objects.get(id=game_id)
    
    @database_sync_to_async
    def get_connected_players(self, game_id):
        """
        Get connected players (asynchronous version)
        """
        return self.get_connected_players_sync(game_id)
    
    def get_connected_players_sync(self, game_id):
        """
        Get connected players (synchronous version)
        """
        return list(MatchPlayer.objects.filter(match_id=game_id, state=MatchPlayer.State.CONNECTED).select_related('player_id'))

    @database_sync_to_async
    def get_connected_players_details(self, game_id):
        """
        Get connected players details
        """
        return MatchPlayer.objects.filter(match_id=game_id, state=MatchPlayer.State.CONNECTED).values('player_id')
    
    @database_sync_to_async
    def can_join_match(self, user, game_id):
        """
        Check if the user can join the match

        Conditions:
        - The user is authenticated
        - The match exists and is not finished or cancelled
        - The user is in the match and has not left

        :param user: User
        :param game_id: int

        :return: bool True if the user can join the match, False otherwise
        """
        if not user.is_authenticated:
            return False
        
        if not Match.objects.filter(
                Q(id=game_id),
                ~Q(state__in=[Match.State.FINISHED, Match.State.CANCELLED]),
                Q(match_players__player_id=user),
                ~Q(match_players__state=MatchPlayer.State.LEFT)
        ).exists():
            return False
        
        # TODO: Check if the user is not in another ongoing match

        return True

    @database_sync_to_async
    def update_player_state(self, user, game_id, state):
        """
        Update the player state in the match

        :param user: User
        :param game_id: int
        :param state: str
        """
        try:
            match_player = MatchPlayer.objects.get(match_id=game_id, player_id=user)
            if match_player.state == MatchPlayer.State.LEFT:
                return
            match_player.state = state
            match_player.save()
        except MatchPlayer.DoesNotExist:
            pass # TODO: Handle exception

    @database_sync_to_async
    def update_match_state(self, game_id, state):
        """
        Update the match state

        :param game_id: int
        :param state: str
        """
        try:
            match = Match.objects.get(id=game_id)
            # Do not update the state if the match is finished or cancelled
            if match.state == Match.State.FINISHED or match.state == Match.State.CANCELLED:
                return
            match.state = state
            match.save()
        except Match.DoesNotExist:
            pass
    
    # get current timestamp
    @staticmethod
    def get_current_timestamp():
        return int(datetime.now().timestamp() * 1000)

# ---------------------------------------------------------------------------- #




    # @database_sync_to_async
    # def assign_player_roles(self):
    #     """
    #     Assigne les IDs de player1 et player2
    #     """
    #     match = Match.objects.get(id=self.game_id)
    #     players = MatchPlayer.objects.filter(match_id=match)

    #     for player in players:
    #         if player.is_player1:
    #             self.player1_id = player.player_id.id
    #         else:
    #             self.player2_id = player.player_id.id

    # async def check_both_players_connected(self):
    #     player_connected = await database_sync_to_async(
    #         MatchPlayer.objects.filter(match_id=self.game_id, connected=True).count
    #     )()

    #     if player_connected == 2:
    #         print('=====> Both players connected to game ', self.game_id)
    #         await self.channel_layer.group_send(
    #             self.room_group_name,
    #             {
    #                 'type': 'game_start',
    #             }
    #         )
    #         asyncio.create_task(self.game_loop())
    #     else:
    #         print('=====> Not all players are connected to game', self.game_id)
    #         await self.channel_layer.group_send(
    #             self.room_group_name,
    #             {
    #                 'type': 'game_waiting',
    #             }
    #         )

    # async def game_loop(self):
        
    #     while True:
    #         async with self.state_lock:
    #             player1 = self.players[self.player1_id]
    #             player2 = self.players[self.player2_id]
    #             ball = self.ball
                
    #             ball["pos"][0] += ball["vel"][0]
    #             ball["pos"][1] += ball["vel"][1]

    #             # Up Down
    #             if ball["pos"][1] - ball["radius"] <= 0 or ball["pos"][1] + ball["radius"] >= 100:
    #                 ball["vel"][1] *= -1

    #             # Left Pad
    #             if (ball["pos"][0] - ball["radius"] <= player1["padding"] + player1["width"] and
    #                 player1["pos_y"] <= ball["pos"][1] <= player1["pos_y"] + player1["height"]):
    #                 ball["vel"][0] *= -1

    #             # Right Pad
    #             elif (ball["pos"][0] + ball["radius"] >= 100 - player2["padding"] - player2["width"] and
    #                 player2["pos_y"] <= ball["pos"][1] <= player2["pos_y"] + player2["height"]):
    #                 ball["vel"][0] *= -1

    #             # Left Wall
    #             if ball["pos"][0] - ball["radius"] <= 0:
    #                 player2["score"] += 1
    #                 ball["pos"] = [50, 50]

    #             # Right Wall
    #             elif ball["pos"][0] + ball["radius"] >= 100:
    #                 player1["score"] += 1
    #                 ball["pos"] = [50, 50]
                    
    #             # Envoie de l’état de la partie aux joueurs
    #             await self.channel_layer.group_send(
    #                 self.room_group_name,
    #                 {
    #                     'type': 'game_update',
    #                     'game_state': {
    #                         'ball': ball,
    #                         'player1': player1,
    #                         'player2': player2,
    #                     }
    #                 }
    #             )
    #         await asyncio.sleep(0.02)  # 50 FPS
    #         # await asyncio.sleep(1)  # 50 FPS

    # async def game_update(self, event):
    #     await self.send(text_data=json.dumps({
    #         'type': 'game_update',
    #         'game_state': event['game_state']
    #     }))
  
    # async def game_start(self, event):
    #     await self.send(text_data=json.dumps({
    #                 'type': 'START',
    #             }))
  
    # async def game_waiting(self, event):
        
    #     await self.send(text_data=json.dumps({
    #                 'type': 'Waiting for the other player to connect...',
    #             }))
        
    # @database_sync_to_async
    # def update_player_connection_status(self, connected):
    #     match_player = MatchPlayer.objects.get(match_id=self.game_id, player_id=self.user.id)
    #     match_player.connected = connected
    #     match_player.save()






        # """
        #   Check:
        #     - If the match exists
        #     - If the user is in the match
        #     - If the user is not in another ongoing match
        # """
        # try:
        #     match = Match.objects.get(id=self.game_id)
        # except Match.DoesNotExist:
        #     return False
        
        # is_player_in_match = MatchPlayer.objects.filter(match_id=match, player_id=self.user).exists()
        # if not is_player_in_match:
        #     return False
        
        ## A REMETTRE PLUS TARD
        #ongoing_matches = Match.objects.filter(
        #    match_players__player_id=self.user,
        #    end_time__isnull=True
        #).exclude(id=self.game_id)

        #if ongoing_matches.exists():
        #    return False
    

    # async def receive(self, text_data):
    #         data = json.loads(text_data)

    #         # Vérifier que le type d'action est bien 'paddle_move'
    #         if data['type'] == 'paddle_move':
    #             direction = data['direction']
    #             print(f"==== PLAYER {self.user_id} MOVE (Username: {self.user}) ====")
    #             async with self.state_lock:
    #                 self.players[self.user_id]["pos_y"] = self.update_paddle_position(self.players[self.user_id], direction)
                
    # def update_paddle_position(self, player, direction):
    #     new_pos_y = player['pos_y'] + (direction * player['vel'])
    #     new_pos_y = max(0, min(new_pos_y, 100 - player['height']))
    #     return new_pos_y



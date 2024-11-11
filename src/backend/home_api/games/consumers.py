from asyncio import sleep
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from asgiref.sync import sync_to_async
import json

from .models import Match, MatchPlayer
from django.contrib.auth.models import User

class GameConsumer(AsyncWebsocketConsumer):
    
    active_connections = {}

    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.group_name = f'game_{self.game_id}'

        # Ajouter le joueur au groupe de la partie
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        print("\n\n===========")
        print(f"User {self.scope['user']} connected to game {self.game_id} in group {self.group_name}")
        print(f"Added {self.channel_name} to group {self.group_name}")

        if self.game_id not in self.active_connections:
            self.active_connections[self.game_id] = set()
        self.active_connections[self.game_id].add(self.channel_name)
        
        print(f"Active connections for game {self.game_id}: {self.active_connections[self.game_id]}")
        print("\n\n===========")

        await self.accept()

        # Notifier et vérifier la connexion des deux joueurs
        await self.check_both_players_connected()



    async def check_both_players_connected(self):
        """
        Check if both players are connected to the game.
        """

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'test_message',
                'message': 'Test MESSSAGGGEEEEE mon gars'
            }
        )

        if len(self.active_connections[self.game_id]) == 2:
            # Notify both players that the game can start
            print('=====> Both players connected to game', self.game_id)
            await self.send_start_game()
        else:
            # Envoyer un message d'attente si les deux joueurs ne sont pas encore connectés
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'game_waiting',
                    'message': 'Waiting for the other player to connect...'
                }
            )

    async def test_message(self, event):
        message = event['message']
        print(f"Test message received by {self.scope['user']} in game {self.game_id}")
        await self.send(text_data=json.dumps({
            'message': message
        }))


    async def disconnect(self, close_code):
        
        if self.game_id in self.active_connections:
          self.active_connections[self.game_id].discard(self.channel_name)
          if not self.active_connections[self.game_id]:
              # Supprimer la clé si plus personne n'est connecté
              del self.active_connections[self.game_id]

        print("\n\n===========")
        print(f"User {self.scope['user']} disconnected from game {self.game_id} in group {self.group_name}")
        # Retirer le joueur du groupe de la partie
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        
    async def send_start_game(self):
        # Notifie les deux joueurs que la partie peut commencer
        print(f"Sending 'Game starting!' to group {self.group_name} for game {self.game_id}")

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'game_start',
                'message': 'Game starting!'
            }
        )

        # launch the game
        await self.launch_game()

    async def game_start(self, event):
        message = event['message']
        print(f"Sending start message to= {self.scope['user']} in game= {self.game_id}")

        await self.send(text_data=json.dumps({
            'message': message
        }))

    

    async def game_waiting(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))


    async def launch_game(self):
        """
        Simule le lancement du jeu avec une balle en mouvement.
        """
        # Position initiale de la balle
        ball = {
            'x': 0,
            'y': 0,
            'dx': 1,
            'dy': 1
        }

        # Scores des joueurs
        score = {
            'player1': 0,
            'player2': 0
        }

        # Boucle de jeu pour envoyer les mises à jour de l'état
        while True:
            # Met à jour la position de la balle
            ball['x'] += ball['dx']
            ball['y'] += ball['dy']

            # Vérifie les rebonds (exemple de simple logique pour tester)
            if ball['x'] <= 0 or ball['x'] >= 100:  # Limites horizontales
                ball['dx'] *= -1  # Change de direction
            if ball['y'] <= 0 or ball['y'] >= 100:  # Limites verticales
                ball['dy'] *= -1  # Change de direction

            # Envoie l'update de l'état du jeu à tous les clients connectés
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'game_update',
                    'ball': ball,
                    'score': score
                }
            )

            # Pause de 1 seconde avant la prochaine mise à jour
            await sleep(1)
    
    async def game_update(self, event):
        """
        Envoie l'update de l'état du jeu au client.
        """
        await self.send(text_data=json.dumps({
            'type': 'game_update',
            'ball': event['ball'],
            'score': event['score']
        }))



    async def receive(self, text_data):
        data = json.loads(text_data)
        action_type = data.get('action')

        if action_type == 'update_score':
            player = self.scope['user']
            score = data.get('score')
            await self.update_player_score(player, score)

        elif action_type == 'end_game':
            winner_id = data.get('winner_id')
            await self.end_match(winner_id)

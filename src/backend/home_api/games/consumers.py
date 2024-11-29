import json
import logging
import asyncio
from games.models import Match, MatchPlayer
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q

# Utils
from games.utils.AsyncLockedDict import AsyncLockedDict
from games.game.index import Game

USER_CHANNELS = AsyncLockedDict() # key: user_id, value: channel_name
GAMES = AsyncLockedDict() # key: game_id, value: Game (class)
LOBBY = AsyncLockedDict() # key: user_id, value: game_id (if user is waiting for specific game) or None (if user is waiting for any game)

logger = logging.getLogger('django')

class GameConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		self.game_id = self.scope['url_route']['kwargs']['game_id']
		self.user = self.scope['user']

		game = await GAMES.get(self.game_id)
		if game is None:
			logger.warning(f"Game with id {self.game_id} not found.")
			return await self.close()

		if not self.user.is_authenticated:
			logger.warning(f"Unauthenticated user {self.user.id} tried to connect.")
			return await self.close()

		if not await self.is_player_in_game(self.user.id, self.game_id):
			logger.warning(f"User {self.user} is not a player in game {self.game_id}.")
			return await self.close()


		await self.accept()

		# Save the user channel
		await USER_CHANNELS.set(self.user.id, self.channel_name)
		# Add player to the game
		await game.handle_player_connect(self.user)

		# If the game is ready, start it
		if game.match.state == Match.State.READY:
			asyncio.create_task(game.start())
	
	async def disconnect(self, close_code):
		await USER_CHANNELS.delete(self.user.id)
		game = await GAMES.get(self.game_id)
		if game is not None:
			await game.handle_player_disconnect(self.user)

	async def receive(self, text_data):
		data = json.loads(text_data)

		if 'type' not in data:
			return
		
		# Handle ping
		if data['type'] == 'ping':
			await self.send(text_data=json.dumps({
				'type': 'pong',
				'message': 'pong',
				'timestamp': data['timestamp']
			}))
			return
		
		game = await GAMES.get(self.game_id)
		if game is not None:
			await game.handle_message(self.user, data)

		
# ----------------------------------- Utils ---------------------------------- #

	@database_sync_to_async
	def get_game(self, game_id):
		return Match.objects.get(id=game_id)
	
	@database_sync_to_async
	def is_player_in_game(self, user, game_id):
		return MatchPlayer.objects.filter(
			Q(match=game_id) &
			Q(user=user) &
			~Q(state=MatchPlayer.State.LEFT)
		).exists()


# ---------------------------------------------------------------------------- #
#                                  WS HANDLERS                                 #
# ---------------------------------------------------------------------------- #

	async def game_state(self, event):
		await self.send(text_data=json.dumps(event))
	
	async def game_player(self, event):
		await self.send(text_data=json.dumps(event))

	async def game_playing_update(self, event):
		"""
		Handle the game playing update
		"""
		await self.send(text_data=json.dumps({
			'type': 'game.playing_update',
			'message': event['message'],
			'data': event['data']
		}))
	
	async def game_round_winner(self, event):
		"""
		Handle the round winner
		"""
		await self.send(text_data=json.dumps({
			'type': 'game.round_winner',
			'message': event['message'],
			'data': event['data']
		}))
	
	async def game_countdown(self, event):
		"""
		Handle the countdown
		"""
		await self.send(text_data=json.dumps({
			'type': 'game.countdown',
			'message': event['message'],
			'data': event['data']
		}))
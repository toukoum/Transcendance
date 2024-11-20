import json
import logging
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

		# Create the game
		if not await self.create_game(self.game_id):
			return await self.close()

		logger.info(f'User {self.user.id} connected to game {self.game_id}')
		if not await self.handle_connection(self.user, self.game_id):
			return await self.close()
		else:
			await self.accept()
		
	
	async def handle_connection(self, user, game_id):
		"""
		Handle the connection of the user to the game

		Conditions:
		- The user is authenticated
		- The game exists in GAMES
		"""



		logger.info("[GameConsumer] handle_connection: step 1")
		if not user.is_authenticated:
			return False
		
		logger.info("[GameConsumer] handle_connection: step 2")
		
		print("GAMES BEFORE")
		GAMES.print()
		game = await GAMES.get(game_id)
		print("GAMES AFTER")
		GAMES.print()
		if game is None:
			return False
		
		logger.info("[GameConsumer] handle_connection: step 3")
		
		if not Match.objects.filter(
			Q(id=game_id) &
			~Q(state__in=[Match.State.FINISHED, Match.State.CANCELLED]),
			Q(match_players__player_id=user),
			~Q(match_players__state=MatchPlayer.State.LEFT)
		).exists():
			return False
		
		logger.info("[GameConsumer] handle_connection: step 4")
		
		# TODO: Check if the user is not in another game

		# Add the user to the USER_CHANNELS
		await USER_CHANNELS.set(user.id, self.channel_name)

		logger.info("[GameConsumer] handle_connection: step 5")

		# Add the user to the game
		await game.add_player(user)

		logger.info("[GameConsumer] handle_connection: step 6")

		# Add group to the channel layer
		await self.channel_layer.group_add(
			game.group_name,
			self.channel_name
		)

		logger.info("[GameConsumer] handle_connection: step 7")

		return True


	async def create_game(self, game_id) -> bool:
		"""
		Create a new game
		"""
		if not await GAMES.get(game_id):
			match = await Match.objects.get(
				Q(id=game_id) &
				~Q(state__in=[Match.State.FINISHED, Match.State.CANCELLED])
			)
			if match is None:
				return False
			await GAMES.set(game_id, Game(match))
		return True
		


		
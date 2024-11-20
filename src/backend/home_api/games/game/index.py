import logging
import random
import asyncio

from datetime import datetime
from games.models import Match, MatchPlayer
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django.db.models import Q


# Game
from games.game.models.Player import Player
from games.game.models.Ball import Ball
from games.game.models.Paddle import Paddle
from games.game.constants import FIELD_WIDTH, PADDLE_Y, PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_SPEED

logger = logging.getLogger('django')

class Game:
	def __init__(self, match: Match):
		logger.info(f'Game created for match {match.id}')
		self.match = match
		# Websocket
		self.group_name = f'game_{self.match.id}'
		self.channel_layer = get_channel_layer()
		self.players: list[Player] = []

		# Game
		self.ball = None
		self.player_1 = None
		self.player_2 = None

		# Time
		self.start_time = None
		self.end_time = None
	
	async def initialize(self):
		logger.info(f'Game initialized for match {self.match.id}')
		self.match.state = Match.State.INITIALIZING
		await self.sync_to()

		# send the message to the group


		self.ball = Ball()

		random.shuffle(self.players)
		self.player_1 = self.players[0]
		self.player_2 = self.players[1]

		self.player_1.paddle = Paddle(0, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED)
		self.player_2.paddle = Paddle(FIELD_WIDTH - PADDLE_WIDTH, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED)
		
		print("send the message to the group")
		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'game.state_initialized',
				'message': 'Game initialized',
				'data': {
					'player_1': self.player_1.to_dict(),
					'player_2': self.player_2.to_dict(),
				}
			}
		)
		print("message sended")

		self.start()
	
	async def start(self):
		# Initialize the game
		await self.initialize()

		# Start the game
		logger.info(f'Game started for match {self.match.id}')
		self.match.state = Match.State.IN_PROGRESS
		self.match.started_at = datetime.now()
		await self.sync_to()

		# ADD GAME LOGIC HERE
		# fake waiting time
		await asyncio.sleep(20)

		# End the game
		await self.end()

	async def end(self):
		logger.info(f'Game ended for match {self.match.id}')
		self.match.state = Match.State.FINISHED
		self.match.ended_at = datetime.now()
		await self.sync_to()

		# Send the message to the group
		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'game.finished',
				'message': 'Game finished'
			}
		)

		# Remove the group from the channel layer
		await self.channel_layer.group_discard(self.group_name, self.channel_name)

		# Remove the game from the GAMES
		from games.consumers import GAMES
		await GAMES.delete(self.match.id)


	# ---------------------------------- PLAYER ---------------------------------- #
	async def handle_player_connect(self, user: User):
		logger.info(f'User {user.id} added to game {self.match.id}')

		existing_player = await self.update_player_state(user, MatchPlayer.State.CONNECTED)

		if existing_player:
			await self.channel_layer.group_send(
				self.group_name,
				{
					'type': 'game.player_reconnected',
					'message': f'{user.username} reconnected'
				}
			)
		
		else:
			playerMatch = await self.get_player(user.id)
			print("player id : ", playerMatch.user)
			print("====step 0====")
			player = Player(playerMatch)
			print("====step 1====")
			self.players.append(player)
			print("====step 2====")

			# add group to channel layer
			from games.consumers import USER_CHANNELS
			player_channel_name = await USER_CHANNELS.get(user.id)
			await self.channel_layer.group_add(self.group_name, player_channel_name)

			print(f"There is {len(self.players)} players / {self.match.max_players} players in the game")
			
			# Check if the game is ready to start
			if len(self.players) == self.match.max_players:
				self.update_state(Match.State.READY)
			
			await self.channel_layer.group_send(
				self.group_name,
				{
					'type': 'game.player_connected',
					'message': f'{user.username} connected'
				}
			)


	
	async def handle_player_disconnect(self, user: User):
		logger.info(f'User {user.id} removed from game {self.match.id}')

		

	async def update_player_state(self, user: User, state: MatchPlayer.State) -> Player:
		print(f"============> UPDATE PLAYER STATE {state}")
		for player in self.players:
			print(f"============> PLAYER {player}")

			if player.player.user.id == user.id:
				print(f"============> ALREADY IN GAME WITH STATE {player.player.state}")
				await player.update_state(state)
				return player
		return None

	# ---------------------------------------------------------------------------- #
	#                                   MESSAGES                                   #
	# ---------------------------------------------------------------------------- #

	async def send_state(self):
		"""
		Send the game state to the group
		"""
		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'game.state',
				'message': 'Game state',
				'data': {
					'ball': self.ball.__dict__,
					'player_1': self.player_1.__dict__,
					'player_2': self.player_2.__dict__
				}
			}
		)


	# ----------------------------------- Utils ---------------------------------- #

	async def update_state(self, state):
		self.match.state = state
		await self.sync_to()

	# --------------------------------- Database --------------------------------- #


	@database_sync_to_async
	def get_players(self):
		return MatchPlayer.objects.filter(match_id=self.match.id).values_list('player_id', flat=True)
	
	@database_sync_to_async
	def get_match(self):
		return Match.objects.get(id=self.match.id)
	
	
	@database_sync_to_async
	def get_player(self, user_id):
		return MatchPlayer.objects.select_related('user').get(
			match=self.match,
			user=user_id,
		)
	
	@database_sync_to_async
	def is_player_in_game(self, player_id):
		return MatchPlayer.objects.filter(
			Q(match_id=self.match.id) &
			Q(player_id=player_id)
		).exists()
	
	@database_sync_to_async
	def sync_to(self):
		self.match.save()

	@database_sync_to_async
	def sync_from(self):
		self.match.refresh_from_db()


	# add str method to print the game state
	def __str__(self):
		return f"""
		========================
		Match: {self.match.id}
		Players: {self.players}
		========================
		"""

		




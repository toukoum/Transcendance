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
from games.game.constants import FIELD_WIDTH, FIELD_HEIGHT, PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_SPEED

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
		self.elapsed_time = 0
		self.ball = None
		self.player_1 = None
		self.player_2 = None

		# Time
		self.start_time = None
		self.end_time = None

	# ---------------------------------------------------------------------------- #
	#                                     GAMES                                    #
	# ---------------------------------------------------------------------------- #
	
	async def initialize(self):
		logger.info(f'Game initialized for match {self.match.id}')

		await self.update_state(Match.State.INITIALIZING)

		self.ball = Ball()

		random.shuffle(self.players)
		self.player_1 = self.players[0]
		self.player_2 = self.players[1]

		self.player_1.paddle = Paddle((-FIELD_WIDTH / 2) - (PADDLE_WIDTH / 2), 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED)
		self.player_2.paddle = Paddle((FIELD_WIDTH / 2) + (PADDLE_WIDTH / 2), 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED)

		await self.send_state()
	
	async def start(self):
		# Initialize the game
		await self.initialize()

		# Start the game
		logger.info(f'Game started for match {self.match.id}')
		self.match.started_at = datetime.now()
		await self.update_state(Match.State.IN_PROGRESS)

		# while self.game_running():
		while not self.is_game_over():
			# reset
			self.ball.reset()
			self.player_1.paddle.reset()
			self.player_2.paddle.reset()

			round_winner = await self.play_round()
			if round_winner is None: # Game over (in loop of play_round)
				break

			round_winner.score_point()
			await self.send_state({
				'round_winner': round_winner.to_dict()
			})
			await asyncio.sleep(2)
		
		self.winner = self.player_1 if self.player_1.player.score > self.player_2.player.score else self.player_2

		# End the game
		await self.end()

	async def end(self):
		logger.info(f'Game ended for match {self.match.id}')
		self.match.winner = self.winner.player.user
		self.match.finished_at = datetime.now()
		await self.update_state(Match.State.FINISHED)

		await self.send_state()

		# Remove the game from the GAMES
		from games.consumers import GAMES
		await GAMES.delete(self.match.id)

		# close socket for all player
		from games.consumers import USER_CHANNELS
		for player in self.players:
			await player.update_state(MatchPlayer.State.LEFT)
			player_channel_name = await USER_CHANNELS.get(player.player.user.id)
			if player_channel_name:
				await self.channel_layer.group_discard(self.group_name, player_channel_name)
				await self.channel_layer.send(player_channel_name, {
					'type': 'websocket.disconnect',
					'code': 1000
				})
				await USER_CHANNELS.delete(player.player.user.id)

	async def play_round(self) -> Player:
		"""
		Play a round of the game
		"""
		logger.info(f'Playing round for match {self.match.id}')

		countdown_time = 3
		countdown_end = datetime.now().timestamp() + countdown_time

		round_start = datetime.now()
		winner = None
		while winner is None:
			# is_countdown = datetime.now().timestamp() < countdown_end
			countdown_left = countdown_end - datetime.now().timestamp()
			is_countdown = countdown_left > 0

			self.elapsed_time += (datetime.now() - round_start).total_seconds()
			round_start = datetime.now()
			if self.is_game_over():
				return None
			

			# Move the ball
			if not is_countdown:
				self.ball.move()

			# Allow the paddles to move even during the countdown
			self.player_1.paddle.move()
			self.player_2.paddle.move()

			if not is_countdown:
				self.ball.check_collision_with_wall()
				self.ball.check_collision_with_paddle(self.player_1.paddle)
				self.ball.check_collision_with_paddle(self.player_2.paddle)

				# Check if the ball is out of the field
				if self.ball.is_out_of_field(FIELD_WIDTH, FIELD_HEIGHT):
					print("Ball is out of the field")
					if self.ball.x < 0:
						winner = self.player_2
					else:
						winner = self.player_1
			
			if not is_countdown:
				await self.send_state()
			else:
				await self.send_state({
					'countdown': countdown_left
				})
			# await self.send_state()
			await asyncio.sleep(0.01)

		# Check the winner

		return winner
		# return random.choice([self.player_1, self.player_2])

	# -------------------------------- Games Utils ------------------------------- #
	
	def is_game_over(self):
		"""
		Check if the game is over

		Conditons:
		- The match is finished or cancelled
		- The max score is reached
		- The duration is over

		"""
		if self.match.state == Match.State.FINISHED or self.match.state == Match.State.CANCELLED:
			return True
		
		if self.match.max_score is not None:
			if self.player_1.player.score >= self.match.max_score or self.player_2.player.score >= self.match.max_score:
				return True
			
		if self.match.duration is not None and self.elapsed_time >= self.match.duration:
			if self.player_1.player.score != self.player_2.player.score:
				return True
			else:
				return False

		return False

	# ---------------------------------------------------------------------------- #



	# ---------------------------------- PLAYER ---------------------------------- #
	async def handle_player_connect(self, user: User):
		logger.info(f'User {user.id} added to game {self.match.id}')

		# Add the player to the group
		from games.consumers import USER_CHANNELS
		player_channel_name = await USER_CHANNELS.get(user.id)
		await self.channel_layer.group_add(self.group_name, player_channel_name)


		existing_player = await self.update_player_state(user, MatchPlayer.State.CONNECTED)

		if existing_player:
			logger.info(f'User {user.id} reconnected to game {self.match.id}')
			await self.channel_layer.group_send(
				self.group_name,
				{
					'type': 'game.player',
					'action': 'reconnected',
					'message': f'{user.username} reconnected',
					'data': existing_player.to_dict()
				}
			)
		else:
			playerMatch = await self.get_player(user.id)
			player = Player(playerMatch)
			self.players.append(player)

			await self.channel_layer.group_send(
				self.group_name,
				{
					'type': 'game.player',
					'action': 'connected',
					'message': f'{user.username} connected',
					'data': player.to_dict()
				}
			)

		print(f"There is {len(self.players)} players / {self.match.max_players} players in the game")
			
		# Check if the game is ready to start (only if the game is waiting)
		if self.match.state == Match.State.WAITING and len(self.players) == self.match.max_players:
			await self.update_state(Match.State.READY)
			print(f"======> Game {self.match.id} is {self.match.state}")

		# Send the game state
		await self.send_state()


	async def handle_player_disconnect(self, user: User):
		logger.info(f'User {user.id} removed from game {self.match.id}')
		await self.update_player_state(user, MatchPlayer.State.DISCONNECTED)
		await self.send_state()
		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'game.player',
				'action': 'disconnected',
				'message': f'{user.username} disconnected',
				'data': {
					'user': user.id
				}
			}
		)


	async def update_player_state(self, user: User, state: MatchPlayer.State) -> Player:
		for player in self.players:
			if player.player.user.id == user.id:
				await player.update_state(state)
				return player
		return None
	

	# ---------------------------------- PADDLE ---------------------------------- #

	async def move_paddle(self, user: User, data):
		"""
		Move the paddle
		"""
		paddle = self.get_paddle(user)
		if paddle is None:
			print("Paddle not found")
			return
		
		direction = data.get('direction')
		if direction is None:
			print("Paddle direction not found")
			return

		paddle.move_up(direction.get('up') if 'up' in direction else False)
		paddle.move_down(direction.get('down') if 'down' in direction else False)

	def get_paddle(self, user: User):
		for player in self.players:
			if player.player.user.id == user.id:
				return player.paddle
		return None
	

	# ---------------------------------------------------------------------------- #
	#                                   MESSAGES                                   #
	# ---------------------------------------------------------------------------- #

	async def handle_message(self, user: User, data):
		"""
		Handle the message from the player
		"""
		logger.info(f'Message from user {user.id} in game {self.match.id}')

		type = data.get('type')
		if type == 'paddle.move':
			await self.move_paddle(user, data)
		


	async def send_state(self, data = {}):
		"""
		Send the game state to the group
		"""
		if (self.match.state == Match.State.WAITING):
			data['players'] = [player.to_dict() for player in self.players]
		if (self.match.state == Match.State.FINISHED):
			data['winner'] = self.winner.to_dict()
		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'game.state',
				'message': f'Game state: {self.match.state}',
				'data': data,
				'dataMatch': self.to_dict(),
				'state': self.match.state
			}
		)
	
	async def send_waiting_state(self, data):
		"""
		Send the game state to the group
		"""
		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'game.state',
				'message': 'Waiting for players',
				'data': {
					'players': [player.to_dict() for player in self.players],
				},
				'dataMatch': self.to_dict(),
				'state': self.match.state
			}
		)
	
	async def send_finished_state(self, data):
		"""
		Send the game state to the group
		"""
		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'game.state',
				'message': 'Game finished',
				'data': data,
				'dataMatch': self.to_dict(),
				'state': self.match.state
			}
		)


	# ----------------------------------- Utils ---------------------------------- #

	async def update_state(self, state):
		self.match.state = state
		await self.sync_to()

	def to_dict(self):
		return {
			'match': {
				'id': self.match.id,
				'state': self.match.state,
				'max_players': self.match.max_players,
				'max_score': self.match.max_score,
			},
			# 'players': [player.to_dict() for player in self.players],
			'player_1': self.player_1.to_dict() if self.player_1 else None,
			'player_2': self.player_2.to_dict() if self.player_2 else None,
			'ball': self.ball.to_dict() if self.ball else None,
			'field': {
				'width': FIELD_WIDTH,
				'height': FIELD_HEIGHT
			},
			'elapsed_time': self.elapsed_time
		}

	# --------------------------------- Database --------------------------------- #


	@database_sync_to_async
	def get_players(self):
		return MatchPlayer.objects.filter(match_id=self.match.id).values_list('player_id', flat=True)
	
	@database_sync_to_async
	def get_match(self):
		return Match.objects.get(id=self.match.id)
	
	
	@database_sync_to_async
	def get_player(self, user_id):
		return MatchPlayer.objects.select_related('user', 'user__profile').get(
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

		




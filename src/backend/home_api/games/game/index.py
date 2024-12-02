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
from games.game.constants import FIELD_WIDTH, FIELD_HEIGHT, PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_SPEED, COUNTDOWN_DURATION, TICK_RATE, BALL_ACCELERATION_FACTOR, BALL_MAX_SPEED

logger = logging.getLogger('django')

class Game:
	def __init__(self, match: Match, tournament=None):
		logger.info(f'Game created for match {match.id}')
		self.match = match
		self.tournament = tournament
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

		self.ball = Ball(BALL_ACCELERATION_FACTOR[self.match.difficulty], BALL_MAX_SPEED[self.match.difficulty])

		random.shuffle(self.players)
		self.player_1 = self.players[0]
		self.player_2 = self.players[1]

		self.player_1.paddle = Paddle((-FIELD_WIDTH / 2) - (PADDLE_WIDTH / 2), 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED.get(self.match.difficulty))
		self.player_2.paddle = Paddle((FIELD_WIDTH / 2) + (PADDLE_WIDTH / 2), 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED.get(self.match.difficulty))

		await self.send_state()
	
	async def start(self):
		await self.initialize()

		self.match.started_at = datetime.now()
		await self.update_state(Match.State.IN_PROGRESS)

		while not self.is_game_over():
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

		await self.end()

	async def end(self):
		logger.info(f'Game ended for match {self.match.id}')

		winner = None
		if self.match.state not in [Match.State.FINISHED, Match.State.CANCELLED]:
			self.match.winner = self.player_1.player.user if self.player_1.player.score > self.player_2.player.score else self.player_2.player.user
			self.match.finished_at = datetime.now()
			await self.update_state(Match.State.FINISHED)
		
		winner = await self.get_winner()

		await self.send_state({
			'winner': {
				'id': winner.id,
				'username': winner.username
			}
		} if winner else None)
  
		# Remove the game from the GAMES
		# Now id done in signals.py
		# from games.consumers import GAMES
		# await GAMES.delete(self.match.id)

		# close socket for all player
		from games.consumers import USER_CHANNELS
		for player in self.players:
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

		countdown_end = datetime.now().timestamp() + COUNTDOWN_DURATION
		winner = None

		tick_duration = 1 / TICK_RATE
		next_tick_time = datetime.now().timestamp() + tick_duration

		last_time = datetime.now().timestamp()  # Initialisation du dernier tick

		while winner is None:
			if self.is_game_over():
				return None
			current_time = datetime.now().timestamp()
			delta_time = current_time - last_time
			last_time = current_time  # Met à jour le dernier tick
			
			# Gestion du countdown
			countdown_left = countdown_end - current_time
			is_countdown = countdown_left > 0

			# Ajoute le temps uniquement si le countdown est terminé
			if not is_countdown:
				self.elapsed_time += delta_time
			
			# Mise à jour de la balle et des paddles
			if not is_countdown:
				self.ball.move(delta_time)
			
			self.player_1.paddle.move(delta_time)
			self.player_2.paddle.move(delta_time)

			if not is_countdown:
				self.ball.check_collision_with_wall()
				self.ball.check_collision_with_paddle(self.player_1.paddle)
				self.ball.check_collision_with_paddle(self.player_2.paddle)

				if self.ball.is_out_of_field(FIELD_WIDTH, FIELD_HEIGHT):
					winner = self.player_2 if self.ball.x < 0 else self.player_1

			# Envoie l'état du jeu (pendant ou hors countdown)
			await self.send_state({'countdown': countdown_left} if is_countdown else None)

			# Calculez le temps restant jusqu'au prochain tick
			next_tick_time += tick_duration
			sleep_time = max(0, next_tick_time - datetime.now().timestamp())
			await asyncio.sleep(sleep_time)

		return winner

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
		# Check if the game is ready to start (only if the game is waiting)
		if self.match.state == Match.State.WAITING and len(self.players) == self.match.max_players:
			await self.update_state(Match.State.READY)
		
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
	
	async def handle_player_leave(self, user: User):
		logger.info(f'User {user.id} left the game {self.match.id}')
		await self.update_player_state(user, MatchPlayer.State.LEFT)
		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'game.player',
				'action': 'left',
				'message': f'{user.username} left',
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
			return
		
		direction = data.get('direction')
		if direction is None:
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
		type = data.get('type')
		if type == 'paddle.move':
			await self.move_paddle(user, data)
		if type == 'game.leave':
			await self.handle_player_leave(user)
		


	async def send_state(self, data = {}):
		"""
		Send the game state to the group
		"""
		if (self.match.state == Match.State.WAITING):
			data['players'] = [player.to_dict() for player in self.players]
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


	# ----------------------------------- Utils ---------------------------------- #

	async def update_state(self, state):
		self.match.state = state
		await self.sync_to()

	def to_dict(self):
		return {
			'match': {
				'id': self.match.id,
				'state': self.match.state,
				'duration': self.match.duration,
				'max_players': self.match.max_players,
				'max_score': self.match.max_score,
				'map': self.match.map,
				'difficulty': self.match.difficulty,
				'tournament': self.tournament.id if self.tournament else None,
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
	def get_match(self):
		# return Match.objects.get(id=self.match.id)
		return Match.objects.select_related('winner').get(id=self.match.id)
	
	@database_sync_to_async
	def get_player(self, user_id):
		return MatchPlayer.objects.select_related('user', 'user__profile').get(
			match=self.match,
			user=user_id,
		)

	@database_sync_to_async
	def get_winner(self):
		return Match.objects.select_related('winner').get(id=self.match.id).winner
	
	@database_sync_to_async
	def sync_to(self):
		self.match.save()

	@database_sync_to_async
	def sync_from(self):
		# include winner
		self.match.refresh_from_db()

	def sync_player_from(self, id):
		for player in self.players:
			if player.player.id == id:
				player.sync_from()
				return


	def __str__(self):
		return f"""
		========================
		Match:
			id: {self.match.id}
			state: {self.match.state}
			max_players: {self.match.max_players}
			max_score: {self.match.max_score}
			map: {self.match.map}
			difficulty: {self.match.difficulty}
			tournament: {self.tournament.id if self.tournament else None}
			
		Players: {self.players}
		========================
		"""

		




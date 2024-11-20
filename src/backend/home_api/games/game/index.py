import logging

from datetime import datetime
from games.models import Match, MatchPlayer
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async

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
		self.players = []

		# Game
		self.ball = None
		self.player_1 = None
		self.player_2 = None

		# Time
		self.start_time = None
		self.end_time = None
	
	def initialize(self):
		logger.info(f'Game initialized for match {self.match.id}')
		self.ball = Ball()
		self.player_1 = Player(self.players[0].id, self.players[0].username)
		self.player_2 = Player(self.players[1].id, self.players[1].username)
		# Add paddles
		self.player_1.paddle = Paddle(0, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED)
		self.player_2.paddle = Paddle(FIELD_WIDTH - PADDLE_WIDTH, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED)
		
		self.start()

	
	def start(self):
		logger.info(f'Game started for match {self.match.id}')
		self.match.state = Match.State.IN_PROGRESS
		self.match.started_at = datetime.now()
		self.match.save()

		# ADD GAME LOGIC HERE


	# ---------------------------------- PLAYER ---------------------------------- #
	def add_player(self, player: MatchPlayer):
		logger.info(f'Player {player.player_id} added to game {self.match.id}')
		if player in self.players:
			return
		self.players.append(player)
		if len(self.players) == self.match.max_players:
			self.initialize()

		




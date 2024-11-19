from enum import Enum
from games.models import Match, MatchPlayer
from channels.db import database_sync_to_async

# Game
from games.game.models.Player import Player
from games.game.models.Ball import Ball
from games.game.models.Paddle import Paddle
from games.game.constants import FIELD_WIDTH, PADDLE_Y, PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_SPEED

class Game:
	def __init__(self, players):
		self.status = Match.State.WAITING

		# Items
		self.ball = Ball()
		self.player_1 = Player(players[0].id, players[0].username)
		self.player_2 = Player(players[1].id, players[1].username)
		# Add paddles
		self.player_1.paddle = Paddle(0, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED)
		self.player_2.paddle = Paddle(FIELD_WIDTH - PADDLE_WIDTH, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED)

		# Time
		self.start_time = None
		self.end_time = None

	
	def start(self):
		
		# self.status = Match.State.IN_PROGRESS


	async def update_status(self, status: Match.State):
		self.status = status
		await self.save_status()

	async def save_status(self):
		match = Match.objects.get(id=self.id)
		match.status = self.status
		database_sync_to_async(match.save)()




import random
from games.game.constants import FIELD_HEIGHT, FIELD_WIDTH, BALL_RADIUS, BALL_SPEED

class Ball:
	def __init__(self):
		self.x = FIELD_WIDTH / 2
		self.y = FIELD_HEIGHT / 2
		self.radius = BALL_RADIUS
		self.speed = BALL_SPEED
		self.vx = 1
		self.vy = random.choice([-1, 1])
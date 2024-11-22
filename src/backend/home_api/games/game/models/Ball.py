import random
from games.game.constants import FIELD_HEIGHT, FIELD_WIDTH, BALL_RADIUS, BALL_SPEED

class Ball:
	def __init__(self):
		self.x = 0
		self.y = 0
		self.radius = BALL_RADIUS
		self.speed = BALL_SPEED
		self.vx = random.choice([-1, 1]) # at start the ball can go either left or right
		# self.vy = random.choice([-1, 1]) 
		self.vy = 0 # at start the ball go straight

		# Backup previous side
		self.previous_side = self.vx


	# ---------------------------------- Collide --------------------------------- #

	def collide_paddle(self, paddle):
		if self.x + self.radius >= paddle.x and self.x - self.radius <= paddle.x + paddle.width:
			if self.y + self.radius >= paddle.y and self.y - self.radius <= paddle.y + paddle.height:
				self.vx = -self.vx
				self.vy = paddle.vy

	# ---------------------------------- Bounce ---------------------------------- #

	def bounce_x(self):
		self.vx = -self.vx

	def bounce_y(self):
		self.vy = -self.vy
	
	# ---------------------------------------------------------------------------- #

	def move(self):
		self.x += self.vx * self.speed
		self.y += self.vy * self.speed

	def in_field(self, field_width, field_height):
		return self.x >= 0 and self.x <= field_width and self.y >= 0 and self.y <= field_height
	
	def reset(self):
		self.x = 0
		self.y = 0
		self.vx = self.prevoius_side * -1
		self.vy = random.choice([-1, 1])
		# each reset should have a different side

	def to_dict(self):
		return {
			'x': self.x,
			'y': self.y,
			'radius': self.radius,
			'vx': self.vx,
			'vy': self.vy,
		}
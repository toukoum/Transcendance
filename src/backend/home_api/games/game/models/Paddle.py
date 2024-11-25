from games.game.models.Ball import Ball
from games.game.constants import FIELD_HEIGHT

class Paddle:
	def __init__(self, x, y, width, height, speed):
		"""
		:param x: int (x position)
		:param y: int (y position)
		:param width: int
		:param height: int
		:param vy: int (y velocity)
		"""
		self.default_x = x
		self.default_y = y
		self.default_width = width
		self.default_height = height
		self.default_speed = speed
		self.default_vy = 0

		self.x = self.default_x
		self.y = self.default_y
		self.width = self.default_width
		self.height = self.default_height
		self.speed = self.default_speed
		self.vy = self.default_vy

	def move(self, dt):
		"""
		Update the paddle's position based on its velocity (`vy`).
		Ensure it does not go out of bounds.
		"""
		self.y += self.vy * dt
		# Check top boundary
		if self.y - self.height / 2 < -FIELD_HEIGHT / 2:
			self.y = -FIELD_HEIGHT / 2 + self.height / 2
		# Check bottom boundary
		elif self.y + self.height / 2 > FIELD_HEIGHT / 2:
			self.y = FIELD_HEIGHT / 2 - self.height / 2

	def move_up(self, is_pressed):
		if is_pressed:
			self.vy = -self.speed
		else:
			self.vy = 0 if self.vy < 0 else self.vy # prevent erase down movement
		
	def move_down(self, is_pressed):
		if is_pressed:
			self.vy = self.speed
		else:
			self.vy = 0 if self.vy > 0 else self.vy # prevent erase up movement

	def to_dict(self):
		return {
			'x': self.x,
			'y': self.y,
			'width': self.width,
			'height': self.height,
			'vy': self.vy
		}
	
	def reset(self):
		self.x = self.default_x
		self.y = self.default_y
		self.width = self.default_width
		self.height = self.default_height
		self.vy = self.default_vy

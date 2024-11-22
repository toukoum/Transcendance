from games.game.models.Ball import Ball

class Paddle:
	def __init__(self, x, y, width, height, vy):
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
		self.default_vy = vy

		self.x = self.default_x
		self.y = self.default_y
		self.width = self.default_width
		self.height = self.default_height
		self.vy = self.default_vy

	def collide(self, ball: Ball):
		"""
		:param ball: Ball
		"""
		if ball.x + ball.radius >= self.x and ball.x - ball.radius <= self.x + self.width:
			if ball.y + ball.radius >= self.y and ball.y - ball.radius <= self.y + self.height:
				ball.vx = -ball.vx
				ball.vy = self.vy

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

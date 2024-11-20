class Paddle:
	def __init__(self, x, y, width, height, vy):
		"""
		:param x: int (x position)
		:param y: int (y position)
		:param width: int
		:param height: int
		:param vy: int (y velocity)
		"""
		self.x = x
		self.y = y
		self.width = width
		self.height = height
		self.vy = vy

	def to_dict(self):
		return {
			'x': self.x,
			'y': self.y,
			'width': self.width,
			'height': self.height,
			'vy': self.vy
		}

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

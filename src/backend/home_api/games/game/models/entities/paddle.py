from .player import Player

class Paddle:
	def __init__(self, player: Player, width: int = 2, height: int = 10, padding: int = 2):
		self.paddle_id = id(self)
		self.player = player
		self.width = width
		self.height = height
		self.padding = padding

	def __str__(self):
		return f"Paddle {self.paddle_id} at ({self.x}, {self.y}) with dimensions {self.width}x{self.height}"
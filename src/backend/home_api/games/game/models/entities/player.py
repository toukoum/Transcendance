from .base_entity import BaseEntity
from .paddle import Paddle
from ..utils.vector3 import Vector3

class Player(BaseEntity):
	def __init__(self, player_id, position: Vector3 = None, rotation: Vector3 = None, scale: Vector3 = None, speed=1, score=0):
		"""
		:param player_id: int
		:param position: Vector3
		:param rotation: Vector3
		:param scale: Vector3
		:param speed: float
		:param score: int
		:param paddle_width: int
		:param paddle_height: int
		:param paddle_padding: int
		"""
		super().__init__(position, rotation, scale)
		self.player_id = player_id
		self.speed = speed
		self.score = score
		self.paddle = Paddle(self)
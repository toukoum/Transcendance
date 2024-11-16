from ..utils.vector3 import Vector3

class BaseEntity:
	def __init__(self, position=None, rotation=None, scale=None):
		"""
		:param position: Vector3
		:param rotation: Vector3
		:param scale: Vector3
		"""
		self.position = position or Vector3()
		self.rotation = rotation or Vector3()
		self.scale = scale or Vector3(1, 1, 1)

	def move(self, delta):
		"""
		Move the entity by adding a Vector3 delta to its current position.
		"""
		if isinstance(delta, Vector3):
			self.position += delta
		else:
			raise TypeError("Delta must be of type Vector3")

	def set_position(self, new_position):
		"""
		Define a new position for the entity.
		"""
		if isinstance(new_position, Vector3):
			self.position = new_position
		else:
			raise TypeError("new_position must be of type Vector3")

	def rotate(self, delta):
		"""
		Rotate the entity by adding a Vector3 delta to its current rotation.
		"""
		if isinstance(delta, Vector3):
			self.rotation += delta
		else:
			raise TypeError("Delta must be of type Vector3")

	def set_rotation(self, new_rotation):
		"""
		Define a new rotation for the entity.
		"""
		if isinstance(new_rotation, Vector3):
			self.rotation = new_rotation
		else:
			raise TypeError("new_rotation must be of type Vector3")

	def scale_entity(self, scale_factor):
		"""
		Scale the entity by multiplying its current scale by a Vector3 scale_factor.
		"""
		if isinstance(scale_factor, Vector3):
			self.scale *= scale_factor
		else:
			raise TypeError("scale_factor must be of type Vector3")

	def set_scale(self, new_scale):
		"""
		Define a new scale for the entity.
		"""
		if isinstance(new_scale, Vector3):
			self.scale = new_scale
		else:
			raise TypeError("new_scale must be of type Vector3")

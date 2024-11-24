import random
import math
from games.game.constants import FIELD_HEIGHT, FIELD_WIDTH, BALL_RADIUS, BALL_SPEED
class Ball:
	def __init__(self):
		self.x = 0
		self.y = 0
		self.radius = BALL_RADIUS
		self.speed = BALL_SPEED
		self.vx = 1
		self.vy = 0

		# Backup previous side
		self.previous_side = self.vx


	# ---------------------------------- Collide --------------------------------- #
	
	def check_collision_with_wall(self):
		if self.y + self.radius >= FIELD_HEIGHT / 2:
			self.vy = -abs(self.vy)
		elif self.y - self.radius <= -FIELD_HEIGHT / 2:
			self.vy = abs(self.vy)
		
	def check_collision_with_paddle(self, paddle):
		"""
		Gère les collisions avec un paddle donné en calculant un rebond basé sur l'angle d'incidence.
		"""
		# Vérifie si la balle est au même x que le paddle (collision horizontale)
		if (
			self.x - self.radius <= paddle.x + paddle.width / 2
			and self.x + self.radius >= paddle.x - paddle.width / 2
		):
			# Vérifie si la balle est au même y que le paddle (collision verticale)
			if (
				self.y + self.radius >= paddle.y - paddle.height / 2
				and self.y - self.radius <= paddle.y + paddle.height / 2
			):
				# Inverse la direction horizontale
				self.vx = -self.vx

				# Calcul de l'offset vertical de la balle par rapport au centre du paddle
				offset = (self.y - paddle.y) / (paddle.height / 2)

				# Limite l'offset pour éviter des valeurs extrêmes (entre -1 et 1)
				offset = max(min(offset, 1), -1)

				# Calcule le nouvel angle en radians (ex : 45° max d'inclinaison)
				max_angle = math.radians(45)
				angle = offset * max_angle

				# Met à jour les vecteurs de direction (vx, vy) en fonction de l'angle
				speed = math.sqrt(self.vx**2 + self.vy**2)  # Conserve la vitesse constante
				self.vx = math.copysign(math.cos(angle) * speed, self.vx)
				self.vy = math.sin(angle) * speed
		
	def is_out_of_field(self, field_width = FIELD_WIDTH, field_height = FIELD_HEIGHT):
		return (
			self.x + self.radius < -field_width / 2
			or self.x - self.radius > field_width / 2
		)

	# ---------------------------------------------------------------------------- #

	def move(self):
		self.x += self.vx * self.speed
		self.y += self.vy * self.speed
		
	def reset(self):
		self.x = 0
		self.y = 0
		self.vy = 0
		self.previous_side = -self.previous_side
		self.vx = self.previous_side

		# each reset should have a different side

	def to_dict(self):
		return {
			'x': self.x,
			'y': self.y,
			'radius': self.radius,
			'vx': self.vx,
			'vy': self.vy,
		}
import random
import math
from games.game.constants import FIELD_HEIGHT, FIELD_WIDTH, BALL_RADIUS, BALL_SPEED, BALL_ACCELERATION_FACTOR, BALL_MAX_SPEED
class Ball:
	def __init__(self, acceleration_factor = BALL_ACCELERATION_FACTOR.get('medium'), max_speed = BALL_MAX_SPEED.get('medium')):
		self.x = 0
		self.y = 0
		self.radius = BALL_RADIUS
		self.speed = BALL_SPEED
		self.acceleration_factor = acceleration_factor
		self.max_speed = max_speed
		self.vx = random.choice([-1, 1])
		self.vy = self.generate_vy()

		# Backup previous side
		self.previous_side = self.vx


	# ---------------------------------- Collide --------------------------------- #
	
	def check_collision_with_wall(self):
		"""
		Vérifie les collisions de la balle avec les murs supérieur et inférieur.
		Ignore les rebonds si la balle est hors du terrain en X (côté paddle).
		"""
		# Vérifie si la balle est dans la zone de jeu en X
		if -FIELD_WIDTH / 2 <= self.x <= FIELD_WIDTH / 2:
			# Collision avec le mur supérieur
			if self.y + self.radius >= FIELD_HEIGHT / 2:
				self.vy = -abs(self.vy)
			# Collision avec le mur inférieur
			elif self.y - self.radius <= -FIELD_HEIGHT / 2:
				self.vy = abs(self.vy)
		
	def check_collision_with_paddle(self, paddle):
		"""
		Vérifie si la balle entre en collision avec un paddle, y compris sur ses côtés.
		Inverse les directions (vx, vy) en fonction de la zone de collision.
		"""
		# Limites du paddle
		paddle_top = paddle.y + paddle.height / 2
		paddle_bottom = paddle.y - paddle.height / 2
		paddle_left = paddle.x - paddle.width / 2
		paddle_right = paddle.x + paddle.width / 2

		# Vérification des collisions globales (rectangle englobant)
		if (self.x + self.radius >= paddle_left and self.x - self.radius <= paddle_right and
			self.y + self.radius >= paddle_bottom and self.y - self.radius <= paddle_top):

			# Détecter la face avant/arrière (collision principale)
			if self.x < paddle_left:  # Balle touche la face arrière (gauche du paddle)
				self.x = paddle_left - self.radius
				self.vx = -abs(self.vx)  # Rebondir vers la gauche
			elif self.x > paddle_right:  # Balle touche la face avant (droite du paddle)
				self.x = paddle_right + self.radius
				self.vx = abs(self.vx)  # Rebondir vers la droite

			# Détecter les côtés (haut/bas du paddle)
			if self.y > paddle_top:  # Touche le haut du paddle
				self.y = paddle_top + self.radius
				self.vy = abs(self.vy)  # Rebondir vers le bas
			elif self.y < paddle_bottom:  # Touche le bas du paddle
				self.y = paddle_bottom - self.radius
				self.vy = -abs(self.vy)  # Rebondir vers le haut
			
			# Augmenter la vitesse de la balle
			self.speed *= self.acceleration_factor
			# Limiter la vitesse maximale
			self.speed = min(self.speed, self.max_speed)
		
	def is_out_of_field(self, field_width = FIELD_WIDTH, field_height = FIELD_HEIGHT):
		return (
			self.x + self.radius < -field_width / 2
			or self.x - self.radius > field_width / 2
		)

	# ---------------------------------------------------------------------------- #

	def move(self, dt):
		self.x += self.vx * self.speed * dt
		self.y += self.vy * self.speed * dt
		
	def reset(self):
		self.x = 0
		self.y = 0
		self.speed = BALL_SPEED
		self.vy = self.generate_vy()
		self.previous_side = -self.previous_side
		self.vx = self.previous_side

	def to_dict(self):
		return {
			'x': self.x,
			'y': self.y,
			'radius': self.radius,
			'vx': self.vx,
			'vy': self.vy,
		}
	
	def generate_vy(self):
		return random.uniform(0.5, 1) if random.random() < 0.5 else random.uniform(-1, -0.5)

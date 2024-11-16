
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

class Match(models.Model):
		class State(models.TextChoices):
				CREATED = 'created', 'Match created'
				WAITING = 'wainting', 'Waiting for players'
				IN_PROGRESS = 'in_progress', 'Match in progress'
				PAUSED = 'paused', 'Match paused'
				FINISHED = 'finished', 'Match finished'
				CANCELLED = 'cancelled', 'Match cancelled'
		
		state = models.CharField(
				max_length=20,
				choices=State.choices,
				default=State.CREATED,
		)
		created_at = models.DateTimeField(auto_now_add=True)
		updated_at = models.DateTimeField(auto_now=True)

		# Game
		started_at = models.DateTimeField(blank=True, null=True)
		finished_at = models.DateTimeField(blank=True, null=True)

		# Config
		duration = models.IntegerField(default=300, blank=True, null=True) # in seconds
		max_players = models.IntegerField(default=2) # max players in the match
		max_score = models.IntegerField(default=None, blank=True, null=True) # max score to win the match

		def __str__(self):
				return f'{self.id}'
		
		def clean(self):
			if self.duration is None and self.max_score is None:
				raise ValidationError('Either duration or max_score must be set')
			if self.duration is not None and self.duration < 30:
				raise ValidationError('Duration must be at least 30 seconds')
			if self.max_score is not None and self.max_score < 1:
				raise ValidationError('Max score must be at least 1')
			if self.max_players < 2:
				raise ValidationError('Max players must be at least 2')
			
			super().clean()
		
		def save(self, *args, **kwargs):
			self.full_clean()
			super().save(*args, **kwargs)

class MatchPlayer(models.Model):
		class State(models.TextChoices):
			CONNECTED = 'connected', 'Player connected' # Player is connected to the match
			READY = 'ready', 'Player ready' # Player is ready to start the match
			PLAYING = 'playing', 'Player playing' # Player is playing the match
			DISCONNECTED = 'disconnected', 'Player disconnected' # Player disconnected during the match (internet issue, etc.)
			LEFT = 'left', 'Player left' # Player left the match before it finished (rage quit, etc.)


		match_id = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='match_players')
		player_id = models.ForeignKey(User, on_delete=models.CASCADE)
		created_at = models.DateTimeField(auto_now_add=True)
		state = models.CharField(
				max_length=20,
				choices=State.choices,
				default=State.CONNECTED,
		)

		# Game
		score = models.IntegerField(default=0)

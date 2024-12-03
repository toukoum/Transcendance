
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

from tournaments.models import Tournament


class Match(models.Model):
	class State(models.TextChoices):
			CREATED = 'created', 'Match created'
			WAITING = 'waiting', 'Waiting for players'
			READY = 'ready', 'Match ready'
			INITIALIZING = 'initializing', 'Match initializing'
			IN_PROGRESS = 'in_progress', 'Match in progress'
			PAUSED = 'paused', 'Match paused'
			FINISHED = 'finished', 'Match finished'
			CANCELLED = 'cancelled', 'Match cancelled'
	
	class MapChoices(models.TextChoices):
		SYNTHWAVE = 'synthwave', 'Synthwave'
		WATER = 'water', 'Water'
	
	class Difficulty(models.TextChoices):
		EASY = 'easy', 'Easy'
		MEDIUM = 'medium', 'Medium'
		HARD = 'hard', 'Hard'
	
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

	# winner = models.ForeignKey('MatchPlayer', on_delete=models.CASCADE, related_name='won_matches', blank=True, null=True)
	winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='won_matches', blank=True, null=True)

	# Config
	duration = models.IntegerField(default=300, blank=True, null=True) # in seconds
	max_players = models.IntegerField(default=2)
	max_score = models.IntegerField(default=None, blank=True, null=True) # max score to win the match
	map = models.CharField(
		max_length=20,
		choices=MapChoices.choices,
		default=MapChoices.SYNTHWAVE,
	)
	difficulty = models.CharField(
		max_length=20,
		choices=Difficulty.choices,
		default=Difficulty.MEDIUM,
	)

	#Tournament
	tournament = models.ForeignKey(
		Tournament,
		on_delete=models.CASCADE,
		related_name='matches',
		null=True, # if match is not part of a tournament
		blank=True
	)
	round = models.IntegerField(default=1)

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
	class Meta: [
		models.UniqueConstraint(fields=['match', 'user'], name='unique_match_player')
	]
	class State(models.TextChoices):
		CONNECTED = 'connected', 'Player connected' # Player is connected to the match
		DISCONNECTED = 'disconnected', 'Player disconnected' # Player disconnected during the match (internet issue, etc.)
		LEFT = 'left', 'Player left' # Player left the match before it finished (rage quit, etc.)

	match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='match_players')
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
	created_at = models.DateTimeField(auto_now_add=True)
	state = models.CharField(
			max_length=20,
			choices=State.choices,
			default=State.DISCONNECTED,
	)

	# Game
	score = models.IntegerField(default=0)

	def __str__(self):
			return f'{self.user} in match {self.match}'
	
	def clean(self):
		if self.pk is not None:  # Si l'objet existe déjà
			current_state = MatchPlayer.objects.filter(pk=self.pk).values_list('state', flat=True).first()
			if current_state == MatchPlayer.State.LEFT and self.state != MatchPlayer.State.LEFT:
				raise ValidationError('Cannot change state from LEFT to any other state.')
		
		# Check if the player already connected to another match
		if self.state == MatchPlayer.State.CONNECTED:
			if MatchPlayer.objects.filter(
				user=self.user,
				state=MatchPlayer.State.CONNECTED
			).exclude(match=self.match).exists():
				raise ValidationError('Player already connected to another match')

		# Check if the match is full
		match = self.match
		if match.match_players.count() > match.max_players:
			raise ValidationError('Match is full')
		
		super().clean()
	
	def save(self, *args, **kwargs):
		self.full_clean()
		super().save(*args, **kwargs)

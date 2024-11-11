
from django.db import models
from django.contrib.auth.models import User

class Match(models.Model):
		start_time = models.DateTimeField(blank=True, null=True)
		end_time = models.DateTimeField(blank=True, null=True)

		winner_id = models.ForeignKey('MatchPlayer', on_delete=models.CASCADE, related_name='winner', blank=True, null=True)

		#TODO: add tournament_id

		def __str__(self):
				return f'{self.id}'


class MatchPlayer(models.Model):
		match = models.ForeignKey(Match, on_delete=models.CASCADE)
		player_id = models.ForeignKey(User, on_delete=models.CASCADE)
		score = models.IntegerField(default=0)

		def __str__(self):
				return f'{self.player_id.username} in match {self.match.id}'
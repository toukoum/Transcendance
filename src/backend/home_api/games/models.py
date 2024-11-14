
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
		match_id = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='match_players')
		player_id = models.ForeignKey(User, on_delete=models.CASCADE)
		score = models.IntegerField(default=0)
		connected = models.BooleanField(default=False)
		is_player1 = models.BooleanField(default=False)  # Nouveau champ pour indiquer si le joueur est le joueur 1

		def __str__(self):
				return f'{self.player_id.username} in match {self.match_id.id}'
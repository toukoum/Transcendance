from random import shuffle
from django.db import models
from django.contrib.auth.models import User

from django.core.exceptions import ValidationError
from asgiref.sync import async_to_sync

class Tournament(models.Model):
    class State(models.TextChoices):
        CREATED = 'created', 'Tournament created'
        WAITING = 'waiting', 'Waiting for players'
        IN_PROGRESS = 'in_progress', 'Tournament in progress'
        FINISHED = 'finished', 'Tournament finished'
        CANCELLED = 'cancelled', 'Tournament cancelled'

    state = models.CharField(
        max_length=20,
        choices=State.choices,
        default=State.CREATED,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=255)

    # Config
    duration = models.IntegerField(default=300, blank=True, null=True) # in seconds
    max_players_game = models.IntegerField(default=2)
    number_players = models.IntegerField(default=4)
    max_score = models.IntegerField(default=None, blank=True, null=True) # max score to win the match
    connected_players = models.IntegerField(default=0)
    address_tournament = models.CharField(max_length=255, blank=True, null=True)
    winner = models.CharField(null=True, blank=True)

    def clean(self):
      if self.max_players_game < 2:
          raise ValidationError("The number of players must be at least 2.")
      if self.number_players & (self.number_players - 1) != 0:
          raise ValidationError("The number of players must be a power of 2.")

    def __str__(self):
        return f'{self.name}'
    
    def save(self, *args, **kwargs):
      self.full_clean()
      super().save(*args, **kwargs)
    
    
    def start_tournament(self):
      """
      Once everyone has joined the tournament, the tournament can be started.
      """
      participants = list(TournamentParticipant.objects.filter(tournament=self))
      
      if (len(participants) != self.number_players):
        raise ValidationError("The number of participants does not match the number of players.")

      self.create_matches(participants, 1)


    def create_round(self, round_number):
        from games.models import Match
        """
        Once a round is finished, the next round can be created.
        """

        matches = Match.objects.filter(tournament=self, round=round_number - 1)
        if matches.filter(winner__isnull=True).exists():
            raise ValueError("All matches must be finished before creating the next round.")

        winner_ids = matches.filter(winner__isnull=False).values_list('winner', flat=True)
        
        participant_next_round = list(TournamentParticipant.objects.filter(player_id__in=winner_ids, tournament=self))

        self.create_matches(participant_next_round, round_number)

    def create_matches(self, participants, round_number):
      from games.models import Match, MatchPlayer
      shuffle(participants)
      for i in range(0, len(participants), 2):
          match = Match.objects.create(
              tournament=self,
              max_players=self.max_players_game,
              max_score=self.max_score,
              duration=self.duration,
              round=round_number,
              state=Match.State.WAITING
          )
          MatchPlayer.objects.create(match=match, user=participants[i].player)
          MatchPlayer.objects.create(match=match, user=participants[i + 1].player)


class TournamentParticipant(models.Model):
    class Meta:
        #Ensures that the combination of 'tournament' and 'player' fields is unique across the database.
        unique_together = ['tournament', 'player']

    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    pseudo = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'{self.tournament} - {self.player}'
    








#tournament = Tournament.objects.get(id=some_id)
#matches = tournament.matches.all()
#round_matches = tournament.matches.filter(round_number=some_round_number)

        

      
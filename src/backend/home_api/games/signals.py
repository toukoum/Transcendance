from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import MatchPlayer, Match

# set all player left when game is finished or cancelled
@receiver(post_save, sender=Match)
def handle_match_finished(sender, instance, **kwargs):
	if instance.state in [Match.State.FINISHED, Match.State.CANCELLED]:
		instance.match_players.update(state=MatchPlayer.State.LEFT)

@receiver(post_save, sender=MatchPlayer)
def handle_player_left(sender, instance, **kwargs):
	# Si le joueur a quitté (state == LEFT)
	if instance.state == MatchPlayer.State.LEFT:
		match = instance.match
		
		# Si le match est en cours
		if match.state == Match.State.IN_PROGRESS:
			# Récupérer l'autre joueur
			other_players = match.match_players.exclude(user=instance.user)
			if other_players.exists():
				other_player = other_players.first()
				# Définir l'autre joueur comme gagnant
				match.winner = other_player.user
				match.state = Match.State.FINISHED
				match.save()
		
		# Si le match est avant in_progress (e.g., READY, WAITING)
		elif match.state in [Match.State.CREATED, Match.State.WAITING, Match.State.READY, Match.State.INITIALIZING]:
			match.state = Match.State.CANCELLED
			match.save()

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import MatchPlayer, Match
from asgiref.sync import async_to_sync

@receiver(post_save, sender=Match)
def handle_match_update(sender, instance, **kwargs):
	from games.consumers import GAMES
	from games.game.index import Game

	if instance.state in [Match.State.FINISHED, Match.State.CANCELLED]:
		instance.match_players.update(state=MatchPlayer.State.LEFT)
	elif instance.state in [Match.State.CREATED, Match.State.WAITING]:
		if not async_to_sync(GAMES.get)(instance.id):
			# async_to_sync(GAMES.set)(instance.id, Game(instance))
			# add tournament
			async_to_sync(GAMES.set)(instance.id, Game(instance, instance.tournament))

	game = async_to_sync(GAMES.get)(instance.id)
	if game:
		async_to_sync(game.sync_from)()

	if instance.state in [Match.State.FINISHED, Match.State.CANCELLED]:
		async_to_sync(GAMES.delete)(instance.id)

@receiver(post_save, sender=MatchPlayer)
def handle_match_player_update(sender, instance, **kwargs):
	match = instance.match
	match.refresh_from_db()
	if instance.state == MatchPlayer.State.LEFT:
		if match.state == Match.State.IN_PROGRESS:
			other_players = match.match_players.exclude(user=instance.user)
			if other_players.exists():
				other_player = other_players.first()
				match.winner = other_player.user
				match.state = Match.State.FINISHED
				match.save()
		elif match.state in [Match.State.CREATED, Match.State.WAITING, Match.State.READY, Match.State.INITIALIZING]:
			match.state = Match.State.CANCELLED
			match.save()

	from games.consumers import GAMES
	game = async_to_sync(GAMES.get)(instance.match_id)
	if game:
		game.sync_player_from(instance.id)
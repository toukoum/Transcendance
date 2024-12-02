from django.apps import AppConfig
import asyncio
from channels.db import database_sync_to_async
from django.db.models import Q


class GamesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'games'

    def ready(self):
        super(GamesConfig, self).ready()
        import games.signals

        # asyncio.run(self.initialize_games())


    # ----------------------------------- GAMES ---------------------------------- #
    async def initialize_games(self):
        from games.models import Match
        from games.consumers import GAMES
        from games.game.index import Game

        # Get all games in CREATED state
        games = await database_sync_to_async(list)(
            Match.objects
                .select_related('tournament')
                .filter(
                    ~Q(state__in=[Match.State.FINISHED, Match.State.CANCELLED])
                )
        )
        for game in games:
            if game.state in [Match.State.READY, Match.State.INITIALIZING, Match.State.IN_PROGRESS]:
                game.state = Match.State.WAITING
                await database_sync_to_async(game.save)()
                
            if game.state in [Match.State.WAITING, Match.State.READY]:
                await GAMES.set(game.id, Game(game, game.tournament))
            
        # await GAMES.print()
        return True
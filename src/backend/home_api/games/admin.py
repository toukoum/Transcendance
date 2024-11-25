from django.contrib import admin

from games.models import Match, MatchPlayer, MatchLocal

admin.site.register(Match)
admin.site.register(MatchLocal)
admin.site.register(MatchPlayer)

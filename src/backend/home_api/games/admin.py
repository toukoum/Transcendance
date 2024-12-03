from django.contrib import admin

from games.models import Match, MatchPlayer

admin.site.register(Match)
admin.site.register(MatchPlayer)

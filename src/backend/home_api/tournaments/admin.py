from django.contrib import admin

from .models import Tournament, TournamentParticipant


class TournamentAdmin(admin.ModelAdmin):
		list_display = ('name', 'state', 'created_at', 'updated_at')
		list_filter = ('state', 'created_at', 'updated_at')
		search_fields = ('name',)

class TournamentParticipantAdmin(admin.ModelAdmin):
		list_display = ('tournament', 'player', 'created_at')
		list_filter = ('tournament', 'created_at')
		search_fields = ('tournament', 'player')
	
	
admin.site.register(Tournament, TournamentAdmin)
admin.site.register(TournamentParticipant, TournamentParticipantAdmin)


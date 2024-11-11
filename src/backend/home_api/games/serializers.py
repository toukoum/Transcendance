

from rest_framework import serializers
from games.models import Match

class MatchSerializer(serializers.ModelSerializer):
		
		opponent = serializers.CharField(write_only=True)
		start_time = serializers.DateTimeField(read_only=True)
		end_time = serializers.DateTimeField(read_only=True)
		winner_id = serializers.IntegerField(read_only=True)

		class Meta:
				model = Match
				fields = ['id', 'start_time', 'end_time', 'winner_id', 'opponent']

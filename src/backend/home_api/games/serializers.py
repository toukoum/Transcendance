

from rest_framework import serializers
from games.models import Match, MatchPlayer

class MatchSerializer(serializers.ModelSerializer):
        
    opponent = serializers.CharField(write_only=True)
    start_time = serializers.DateTimeField(read_only=True)
    end_time = serializers.DateTimeField(read_only=True)
    winner_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'start_time', 'end_time', 'winner_id', 'opponent']



class MatchPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchPlayer
        fields = ['player_id', 'score', 'connected']
        

class MatchListSerializer(serializers.ModelSerializer):
    match_players = MatchPlayerSerializer(many=True, read_only=True)
    class Meta:
        model = Match
        fields = ['id', 'start_time', 'end_time', 'winner_id', 'match_players']

        
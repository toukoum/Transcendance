

from rest_framework import serializers
from games.models import Match, MatchPlayer

class MatchPlayerSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField(source='player_id.username', read_only=True)
    class Meta:
        model = MatchPlayer
        fields = ['id', 'username', 'score', 'match_id', 'player_id']
        

class MatchSerializer(serializers.ModelSerializer):
    
    match_players = MatchPlayerSerializer(many=True, read_only=True)
    class Meta:
        model = Match
        fields = '__all__'
        
    # opponent = serializers.CharField(write_only=True)
    # start_time = serializers.DateTimeField(read_only=True)
    # end_time = serializers.DateTimeField(read_only=True)
    # winner_id = serializers.IntegerField(read_only=True)

    # class Meta:
    #     model = Match
    #     fields = ['id', 'start_time', 'end_time', 'winner_id', 'opponent']


class MatchCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['duration', 'max_players', 'max_score'] # When creating a match, we only need to specify the duration, max_players, and max_score
    
    def validate(self, data):
        if data.get('duration') is None and data.get('max_score') is None:
            raise serializers.ValidationError('Either duration or max_score must be set')
        if data.get('duration') is not None and data.get('duration') < 30:
            raise serializers.ValidationError('Duration must be at least 30 seconds')
        if data.get('max_score') is not None and data.get('max_score') < 1:
            raise serializers.ValidationError('Max score must be at least 1')

        return data


        

class MatchListSerializer(serializers.ModelSerializer):
    match_players = MatchPlayerSerializer(many=True, read_only=True)
    class Meta:
        model = Match
        fields = '__all__'

        
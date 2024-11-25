

from rest_framework import serializers
from games.models import Match, MatchPlayer, MatchLocal

class MatchPlayerSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = MatchPlayer
        fields = ['id', 'username', 'score', 'match', 'user']
        

class MatchSerializer(serializers.ModelSerializer):
    
    match_players = MatchPlayerSerializer(many=True, read_only=True)
    class Meta:
        model = Match
        fields = '__all__'
        


class MatchCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['duration', 'max_players', 'max_score', 'map'] # When creating a match, we only need to specify the duration, max_players, max_score, and map
    
    def validate(self, data):
        if data.get('duration') is None and data.get('max_score') is None:
            raise serializers.ValidationError('Either duration or max_score must be set')
        if data.get('duration') is not None and data.get('duration') < 30:
            raise serializers.ValidationError('Duration must be at least 30 seconds')
        if data.get('max_score') is not None and data.get('max_score') < 1:
            raise serializers.ValidationError('Max score must be at least 1')

        return data
        

class MatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

        
class MatchLocalSerializer(serializers.ModelSerializer):
		class Meta:
				model = MatchLocal
				fields = '__all__'
				read_only_fields = ['user', 'state', 'winner', 'created_at', 'updated_at', 'started_at', 'finished_at']
				
		def validate(self, data):
				if data.get('duration') is None and data.get('max_score') is None:
						raise serializers.ValidationError('Either duration or max_score must be set')
				if data.get('duration') is not None and data.get('duration') < 30:
						raise serializers.ValidationError('Duration must be at least 30 seconds')
				if data.get('max_score') is not None and data.get('max_score') < 1:
						raise serializers.ValidationError('Max score must be at least 1')
				return data
                
		def create(self, validated_data):
			validated_data['user'] = self.context['request'].user
			return super().create(validated_data)
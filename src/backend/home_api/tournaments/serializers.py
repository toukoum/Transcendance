
from rest_framework import serializers

from home_api.utils import format_response
from .models import Tournament, TournamentParticipant


class TournamentSerializer(serializers.ModelSerializer):
    pseudo = serializers.CharField(max_length=50, required=False)
    
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'max_score', 'duration', 'created_at', 'updated_at', 'pseudo']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        pseudo = validated_data.pop('pseudo', None)
        tournament = super().create(validated_data)
        
        # check if the pseudo is already taken
        if pseudo is not None and TournamentParticipant.objects.filter(pseudo=pseudo).exists():
            raise serializers.ValidationError(format_response('error', 'Pseudo already taken'))

        user = self.context['request'].user
        TournamentParticipant.objects.create(
            tournament=tournament,
            player=user,
            pseudo=pseudo
        )
        return tournament

class TournamentParticipantSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TournamentParticipant
        fields = ['id', 'tournament', 'player', 'pseudo', 'created_at']
        read_only_fields = ['created_at']
    
    #TODO
    #def validate_pseudo(self, value):
    #    if value is None:
    #        return self.instance.player.username
    #    if len(value) < 3:
    #        raise serializers.ValidationError('Pseudo must be at least 3 characters long')
    #    return value
    

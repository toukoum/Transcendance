
from rest_framework import serializers

from home_api.utils import format_response
from .models import Tournament, TournamentParticipant
from games.serializers import MatchSerializer


class TournamentSerializer(serializers.ModelSerializer):
    pseudo = serializers.CharField(max_length=50, required=False)
    
    class Meta:
        model = Tournament
        # REMETTRE
        # fields = ['id', 'name', 'max_score', 'duration', 'created_at', 'updated_at', 'pseudo', 'address_tournament']
        fields = ['id', 'name', 'max_score', 'duration', 'created_at', 'updated_at', 'pseudo', 'winner', 'state', 'address_tournament']
        
        read_only_fields = ['created_at', 'updated_at', 'winner', 'state']

    def create(self, validated_data):
        pseudo = validated_data.pop('pseudo', None)
        tournament = super().create(validated_data)
        
        # check if the pseudo is already taken
        if pseudo is not None and TournamentParticipant.objects.filter(tournament=tournament, pseudo=pseudo).exists():
            raise serializers.ValidationError({'pseudo': 'Pseudo already taken'})

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
    

class TournamentDetailSerializer(serializers.ModelSerializer):
    participants = TournamentParticipantSerializer(many=True, read_only=True)
    matches = MatchSerializer(many=True, read_only=True)
    
    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'participants']

    
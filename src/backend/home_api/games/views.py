from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from games.models import Match, MatchPlayer

from games.serializers import MatchSerializer, MatchListSerializer

from django.contrib.auth.models import User
from rest_framework.views import APIView

from home_api.utils import format_response
from rest_framework.permissions import IsAuthenticated
from home_api.utils import BaseViewSet


class MatchViewSet(BaseViewSet):
    serializer_class = MatchListSerializer
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.request.user.id
        return Match.objects.filter(match_players__player_id=user_id)
        
    
  


class CreateMatchViewSet(BaseViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        player1 = request.user
        opponent_username = request.data.get('opponent')

        try:
            player2 = User.objects.get(username=opponent_username)
        except User.DoesNotExist:
            return format_response(error='User not found', status=404)

        if player1 == player2:
            return format_response(error='You cannot play against yourself', status=400)

				# A REMETTRE QUAND ON VOUDRA VERIFIE SI UN JOUEUR A DEJA UNE PARTIE EN COURS
        # ongoing_matches_player1 = Match.objects.filter(
        #     match_players__player_id=player1.id,
        #     end_time__isnull=True
        # )

        # if ongoing_matches_player1.exists():
        #     return Response({'error': 'You already have a Game on going'})

        # ongoing_matches_player2 = Match.objects.filter(
        #     match_players__player_id=player1.id,
        #     end_time__isnull=True
        # )

        # if ongoing_matches_player2.exists():
        #     return Response({'error': f'{opponent_username} is already in game'})

        match = Match.objects.create()

        match_player1 = MatchPlayer.objects.create(match_id=match, player_id=player1, is_player1=True)
        match_player2 = MatchPlayer.objects.create(match_id=match, player_id=player2, is_player1=False)

        serializer = MatchSerializer(match)

        return format_response(data=serializer.data, status=201)

class MatchInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return the match info for the current player or nothing
        """
        player_id = request.user.id
        match = Match.objects.filter(
            match_players__player_id=player_id,
            end_time__isnull=True
        ).order_by('-start_time').first()

        if match is None:
            return format_response(data=None)

        serializer = MatchSerializer(match)
        return format_response(data=serializer.data)

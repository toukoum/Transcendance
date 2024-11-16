from django.shortcuts import render
from django.db.models import Q

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from games.models import Match, MatchPlayer

from games.serializers import MatchSerializer, MatchListSerializer, MatchCreateSerializer

from django.contrib.auth.models import User
from rest_framework.views import APIView


from rest_framework.permissions import IsAuthenticated


class MatchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchListSerializer
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.request.user.id
        return Match.objects.filter(match_players__player_id=user_id)
    
  


# class CreateMatchViewSet(viewsets.ModelViewSet):
#     queryset = Match.objects.all()
#     serializer_class = MatchSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         player1 = request.user
#         opponent_username = request.data.get('opponent')

#         try:
#             player2 = User.objects.get(username=opponent_username)
#         except User.DoesNotExist:
#             return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

#         if player1 == player2:
#             return Response({'error': 'You cannot play against yourself'}, status=status.HTTP_400_BAD_REQUEST)

#         # ongoing_matches_player1 = Match.objects.filter(
#         #     match_players__player_id=player1.id,
#         #     end_time__isnull=True
#         # )

#         # if ongoing_matches_player1.exists():
#         #     return Response({'error': 'You already have a Game on going'})

#         # ongoing_matches_player2 = Match.objects.filter(
#         #     match_players__player_id=player1.id,
#         #     end_time__isnull=True
#         # )

#         # if ongoing_matches_player2.exists():
#         #     return Response({'error': f'{opponent_username} is already in game'})

#         match = Match.objects.create()

#         match_player1 = MatchPlayer.objects.create(match_id=match, player_id=player1, is_player1=True)
#         match_player2 = MatchPlayer.objects.create(match_id=match, player_id=player2, is_player1=False)

#         serializer = MatchSerializer(match)

#         return Response(serializer.data, status=status.HTTP_201_CREATED)

class MatchView(APIView):
    """
    Get a match by id
    """
    def get(self, request):
        try:
            match = Match.objects.get(id=request.data.get('id'))
        except Match.DoesNotExist:
            return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = MatchSerializer(match)
        return Response(serializer.data)

    """
    Create a new match
    """
    def post(self, request):
        # Check if the user already has an ongoing match
        if MatchPlayer.objects.filter(
            Q(player_id=request.user.id) &
            ~Q(match_id__state__in=[Match.State.FINISHED, Match.State.CANCELLED])
        ).exists():
            return Response({"error": "You already have an ongoing match"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = MatchCreateSerializer(data=request.data)
        if serializer.is_valid():
            match = serializer.save() # Create the match
            MatchPlayer.objects.create(
                match_id=match,
                player_id_id=request.user.id
            )
            return Response(MatchSerializer(match).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    """
    Join a match
    """
    # TODO: use PUT to join a match

class MatchCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Check if the current player is in a match
        """
        player_id = request.user.id
        match = MatchPlayer.objects.filter(
            Q(player_id=player_id) &
            ~Q(match_id__state__in=[Match.State.FINISHED, Match.State.CANCELLED])
        ).first()

        if match is None:
            return Response({ "data": None, "error": None })
        
        # Here match as None isnt an error, it just means the player is not in a match
        # if match is None:
        #     return Reponse({ "data": None, "error": "Player is not in a match" })
    
        serializer = MatchSerializer(match.match_id)
        return Response({ "data": serializer.data, "error": None })



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
            return Response({"id": None})

        serializer = MatchSerializer(match)
        return Response(serializer.data)

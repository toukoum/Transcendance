from django.shortcuts import render
from django.db.models import Q
from asgiref.sync import async_to_sync


from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from games.models import Match, MatchPlayer, MatchLocal

from games.serializers import MatchSerializer, MatchCreateSerializer, MatchLocalSerializer

from django.contrib.auth.models import User
from rest_framework.views import APIView

from home_api.utils import format_response
from rest_framework.permissions import IsAuthenticated
from home_api.utils import BaseViewSet


class MatchViewSet(BaseViewSet):
	serializer_class = MatchSerializer
	
	permission_classes = [IsAuthenticated]
	
	def get_queryset(self):
		user_id = self.request.user.id
		return Match.objects.filter(match_players__user=user_id)
	

class MatchLocalViewSet(BaseViewSet):
	serializer_class = MatchLocalSerializer
	
	permission_classes = [IsAuthenticated]
	
	def get_queryset(self):
		user_id = self.request.user.id
		return MatchLocal.objects.filter(user=user_id)

	def create(self, request, *args, **kwargs):
			serializer = self.get_serializer(data=request.data)
			serializer.is_valid(raise_exception=True)

			# Appelle la méthode de création sur le serializer
			match = serializer.save(user=request.user)

			# Personnalise la réponse si nécessaire
			return format_response(data=MatchLocalSerializer(match).data, status=201)



class MatchView(APIView):
	permission_classes = [IsAuthenticated]
	"""
	Create a new match
	"""
	def post(self, request):
		# Check if the user already has an ongoing match
		if MatchPlayer.objects.filter(
			Q(user=request.user.id) &
			~Q(match__state__in=[Match.State.FINISHED, Match.State.CANCELLED])
		).exists():
			return format_response(error="You already have an ongoing match", status=400)
			# return Response({"error": "You already have an ongoing match"}, status=status.HTTP_400_BAD_REQUEST)

		print('request.data', request.data)
		serializer = MatchCreateSerializer(data=request.data)
		if serializer.is_valid():
			print('serializer.validated_data', serializer.validated_data)
			match = serializer.save() # Create the match
			match.state = Match.State.WAITING # Set the match state to waiting
			match.save()

			# Add the current player to the match
			MatchPlayer.objects.create(
				match=match,
				user=request.user
			)

			# # Create Game in consumer
			from games.consumers import GAMES
			from games.game.index import Game
			async_to_sync(GAMES.set)(match.id, Game(match))

			return format_response(data=MatchSerializer(match).data, status=201)
			# return Response(MatchSerializer(match).data, status=status.HTTP_201_CREATED)
		# return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		return format_response(error=serializer.errors, status=400)
	
class MatchJoinView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, game_id):
		"""
		Join a match

		Conditions:
		- The user is authenticated
		- The match exists and his state is waiting for players
		"""
		match = None

		try:
			match = Match.objects.get(id=game_id)
		except Match.DoesNotExist:
			return format_response(error="Match not found", status=404)

		if match.state != Match.State.WAITING:
			return format_response(error="Match is not waiting for players", status=400)
		
		try:
			MatchPlayer.objects.create(
				match=match,
				user=request.user
			)
		except Exception as e:
			return format_response(error=str(e), status=400)


		return format_response(data=MatchSerializer(match).data)


class MatchCheckView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		"""
		Check if the current player is in a match
		"""
		player = MatchPlayer.objects.filter(
			Q(user=request.user) &
			~Q(match__state__in=[Match.State.FINISHED, Match.State.CANCELLED])
		).first()

		if player is None:
			return format_response(data=None)
			# return Response({ "data": None, "error": None })
		
		# Here match as None isnt an error, it just means the player is not in a match
		# if match is None:
		#     return Reponse({ "data": None, "error": "Player is not in a match" })
	
		serializer = MatchSerializer(player.match)
		# return Response({ "data": serializer.data, "error": None })
		return format_response(data=serializer.data)



class MatchInfoView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		"""
		Return the match info for the current player or nothing
		"""
		match = Match.objects.filter(
			match_players__user=request.user,
			end_time__isnull=True
		).order_by('-start_time').first()

		if match is None:
			return format_response(data=None)

		serializer = MatchSerializer(match)
		return format_response(data=serializer.data)

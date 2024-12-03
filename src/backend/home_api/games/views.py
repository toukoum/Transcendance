from django.shortcuts import render
from django.db.models import Q
from asgiref.sync import async_to_sync


from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from games.models import Match, MatchPlayer

from games.serializers import MatchSerializer, MatchCreateSerializer

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
		return Match.objects.filter(match_players__user=user_id).order_by('-created_at')



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

		serializer = MatchCreateSerializer(data=request.data)
		if serializer.is_valid():
			match = serializer.save() # Create the match
			match.state = Match.State.WAITING # Set the match state to waiting
			match.save()

			# Add the current player to the match
			MatchPlayer.objects.create(
				match=match,
				user=request.user
			)

			return format_response(data=MatchSerializer(match).data, status=201)
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
			~Q(state=MatchPlayer.State.LEFT) &
			~Q(match__state__in=[Match.State.FINISHED, Match.State.CANCELLED])
		).first()

		if player is None:
			return format_response(data=None)

	
		serializer = MatchSerializer(player.match)
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

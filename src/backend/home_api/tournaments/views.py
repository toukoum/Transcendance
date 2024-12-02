from django.shortcuts import render
from home_api.utils import BaseViewSet, BaseReadOnlyViewSet, format_response
from tournaments.models import Tournament

from rest_framework.permissions import IsAuthenticated
from tournaments.serializers import TournamentSerializer, TournamentParticipantSerializer, TournamentDetailSerializer

from rest_framework.decorators import action
from django.db.models.signals import post_save
from games.models import Match
from django.dispatch import receiver

from notification.utils import send_notification
from django.contrib.auth.models import User

from tournaments.models import Tournament, TournamentParticipant

class TournamentViewSet(BaseViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Condition to create a tournament:
        - The user is authenticated
        - The user is not already in a tournament
        - The user is not already in a match
        """
        
        #A REMETRE
        #if (TournamentParticipant.objects.filter(player=request.user).exists()):
        #    return format_response(error='User is already in a tournament', status=400)
        
        #if (Match.objects.filter(winner=request.user).exists()):
        #    return format_response(error='User is already in a match', status=400)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tournament = serializer.save()
        

        tournament.state = Tournament.State.WAITING
        tournament.connected_players += 1
        tournament.save()

        return format_response(data=serializer.data, status=201)
    
    @action (detail=True, methods=['post'])
    def start(self, request, pk=None):
        tournament = self.get_object()
        if (tournament.state == Tournament.State.IN_PROGRESS):
            return format_response(data={'message': 'Tournament already started'}, status=200)
        if (tournament.state != Tournament.State.WAITING):
            return format_response(error='Tournament must be waiting to start', status=400)
        if (tournament.connected_players < tournament.number_players):
            return format_response(error='Not all players have joined the tournament', status=400)
        tournament.start_tournament()
        tournament.state = Tournament.State.IN_PROGRESS
        tournament.save()
        return format_response(data={'message': 'Tournament started'}, status=200)

    @action (detail=True, methods=['post'], url_path='add-player')
    def addPlayer(self, request, pk=None):
        """
          The condition to add player are:
          - The tournament is waiting for players
          - The tournament is not full
          - The player is not already in
        """

        tournament = self.get_object()
        player = request.user
        pseudo = request.data.get('pseudo')


        if tournament.connected_players >= tournament.number_players:
            return format_response(error='Tournament is full', status=400)

        if tournament.participants.filter(player=player).exists():
            return format_response(error='Player is already in the tournament', status=400)

        if tournament.participants.filter(pseudo=pseudo).exists():
            return format_response(error='Pseudo is already taken', status=400)

        if tournament.state != Tournament.State.WAITING:
            return format_response(error='Tournament is not waiting for players', status=400)

        serializer = TournamentParticipantSerializer(data={'tournament': tournament.id, 'player': player.id, 'pseudo': pseudo})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        tournament.connected_players += 1
        tournament.save()

        return format_response(data=serializer.data, status=201)

    
    @action(detail=True, methods=['post'], url_path='invite-player')
    def invitePlayer(self, request, pk=None):
        tournament = self.get_object()
        player_from = request.user
        player_to_invite = request.data.get('player')

        try:
            player_to_invite = User.objects.get(username=player_to_invite)
        except User.DoesNotExist:
            return format_response(error='Player not found', status=404)

        # Vérifie si le joueur est déjà inscrit
        if tournament.participants.filter(player=player_to_invite).exists():
            return format_response(error='Player is already in the tournament', status=400)

        # Envoie une notification
        send_notification(
            user=player_to_invite,
            user_from=player_from,
            event_type='tournament_invite',
            data={
                'message': f'{player_from.username} invited you to a tournament'
            },
            action={
                'primary': {
                    'is_link': True,
                    'url': f'tournaments/join/{pk}',
                    'label': 'Join'
                },
                'secondary': {
                    'url': f'tournaments/{pk}/reject/',
                    'label': 'Reject'
                }
            },
    
        )

        return format_response(data={'message': f'Invitation sent to {player_to_invite.username}'}, status=200)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        send_notification(
            user=request.user,
            event_type='tournament_reject',
            data={
                'message': 'You have rejected the invitation'
            }
        )
        return format_response(data={'message': 'Invitation rejected'}, status=200)
                

    #upgrade retrieve method
    def retrieve(self, request, *args, **kwargs):
        tournament = self.get_object()
        serializer = TournamentDetailSerializer(tournament)
        return format_response(data=serializer.data, status=200)

    def update(self, request, *args, **kwargs):
        return format_response(error='Method not allowed', status=405)
    
    def destroy(self, request, *args, **kwargs):
        return format_response(error='Method not allowed', status=405)

    @action (detail=True, methods=['get'], url_path='players')
    def getPlayers(self, request, pk=None):
        tournament = self.get_object()
        players = tournament.participants.all()
        serializer = TournamentParticipantSerializer(players, many=True)
        return format_response(data=serializer.data, status=200)
    

    @receiver(post_save, sender=Match)
    def check_match_finished(sender, instance, **kwargs):
        """
        Signal triggered when a Match is saved.
        """
        if instance.state == Match.State.FINISHED and instance.tournament:
            tournament = instance.tournament
            try:
                # Check if all matches in the current round are finished
                matches_in_round = Match.objects.filter(
                    tournament=tournament,
                    round=instance.round
                )
                
                if matches_in_round.count() == 1:
                    match = matches_in_round.first()
                    tournament.winner = match.winner
                    tournament.save()
                    return
                            
                if all(match.state == Match.State.FINISHED for match in matches_in_round):
                    # If all matches are finished, generate the next round
                    tournament.create_round(instance.round + 1)
            except Exception as e:
                # Log any errors
                print(f"Error processing tournament round for tournament {tournament.id}: {e}")

        
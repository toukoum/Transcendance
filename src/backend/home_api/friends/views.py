
from home_api.utils import format_response
from friends.models import Friendship
from friends.serializers import FriendshipSerializer, DetailFriendshipSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.decorators import action
from django.contrib.auth.models import User

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from notification.utils import send_notification
from home_api.utils import BaseViewSet


class FriendshipViewSet(BaseViewSet):

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(Q(user1=user) | Q(user2=user))

    serializer_class = FriendshipSerializer

    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        user1 = request.user

        try:
            user2 = User.objects.get(username=data['user2'])
        except User.DoesNotExist:
            return format_response(error='User not found', status=404)
        
        if not data.get('user1'):
          data['user1'] = user1.username
        
        if (data['user1'] != user1.username):
            return format_response(error='You can not create a friendship for another user', status=400)

        if user1 == user2:
            return format_response(error='You can not be friends with yourself', status=400)


        existing_friendship = Friendship.objects.filter(
            Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)
        ).first()

        if existing_friendship:
            if existing_friendship.status == 'accepted':
                return format_response(error='You are already friends with this user', status=400)
            elif existing_friendship.status == 'pending':
                return format_response(error='There is already a pending friendship request with this user', status=400)
        
        try:
            user2 = User.objects.get(id=user2.id)
        except User.DoesNotExist:
            return format_response(error='User not found', status=404)
        

        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user1=user1, user2=user2)


        send_notification(
          user=user2,
          event_type='friend_request',
          data={
            'message': f'{user1.username} sent you a friendship request'
          },
          action={
            'primary': {
              'url': f'friends/{serializer.data["id"]}/accept/',
              'label': 'Accept'
            },
            'secondary': {
              'url': f'friends/{serializer.data["id"]}/reject/',
              'label': 'Reject'
            }
          },
          user_from=user1
        )
    
        return format_response(data=serializer.data, status=201)


    def list(self, request, *args, **kwargs):
        """
        get all friends of the authenticated user
        """
        user = request.user
        friendship = Friendship.objects.filter(((Q(user1=user) | Q(user2=user)) & Q(status='accepted')) | Q(user1=user, status='pending'))
        serializer = self.get_serializer(friendship, many=True)
        return format_response(data=serializer.data, status=200)


    @action (detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """
        accept a friendship request
        """

        try:
            friendship = self.get_object()
        except:
            return format_response(error='Friendship not found', status=404)

        if friendship.user2 != request.user:
            return format_response(error='You can not accept this friendship request', status=400)
        
        #check if the friendship request is still pending
        if friendship.status != 'pending':
            return format_response(error='This friendship request is not pending', status=400)

        friendship.status = 'accepted'
        friendship.save()
        
        send_notification(
          user=friendship.user1,
          event_type='friend_request',
          data={
            'message': f'{request.user.username} accepted your friendship request'
          },
        )

        send_notification(
          event_type='friend_request',
          user=friendship.user2,
          data={
            'message': f'You are now friends with {friendship.user1.username}'
          },    
        )              
        
        return format_response(data=self.get_serializer(friendship).data, status=200)

    @action (detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        try:
            friendship = self.get_object()
        except:
            return format_response(error='Friendship not found', status=404)

        if friendship.user2 != request.user:
            return format_response(error='You can not reject this friendship request', status=400)
        
        if (friendship.status != 'pending'):
            return format_response(error='This friendship request is not pending', status=400)
        
        friendship.delete()

        send_notification(
          event_type='friend_request',
          user=friendship.user1,
          data={
            'message': f'{request.user.username} rejected your friendship request'
          },
        )

        send_notification(
          event_type='friend_request',
          user=friendship.user2,
          data={
            'message': f'You rejected the friendship request from {friendship.user1.username}'
          },    
        )

        return format_response(data=self.get_serializer(friendship).data, status=200)
    


    @action (detail=False, methods=['get'], url_path='sent')
    def sent_requests(self, request):
        """
        get all friendship requests sent by the authenticated user
        """
        user = request.user
        sent_requests = Friendship.objects.filter(user1=user, status='pending')
        serializer = self.get_serializer(sent_requests, many=True)
        return format_response(data=serializer.data, status=200)
    
    @action (detail=False, methods=['get'], url_path='received')
    def received_requests(self, request):
        user = request.user
        received_requests = Friendship.objects.filter(user2=user, status='pending')
        serializer = self.get_serializer(received_requests, many=True)
        return format_response(data=serializer.data, status=200)
    

    @action (detail=True, methods=['delete'])
    def delete(self, request, pk=None):
        if pk is None:
            return format_response(error='You must provide a friendship id', status=400)
        friendship = self.get_object()
        if friendship.user1 != request.user and friendship.user2 != request.user and friendship.status == 'accepted':
            return format_response(error='You can not delete this friendship', status=400)
        elif friendship.user1 != request.user and friendship.status == 'pending':
            return format_response(error='You can not delete this friendship request', status=400)

        friendship.delete()

        

        other_user = friendship.user2 if friendship.user1 == request.user else friendship.user1
        send_notification(
            event_type='friend_request',
            user=other_user,
            data={
          'message': f'{request.user.username} deleted the friendship'
            },
        )

        return format_response(data={'status': 'Friendship deleted'}, status=200)
    

    def update(self, request, *args, **kwargs):
        # Disable PUT requests
        return format_response(error='PUT requests are not allowed on friendships', status=405)

    def partial_update(self, request, *args, **kwargs):
        # Disable PATCH requests
        return format_response(error='PATCH requests are not allowed on friendships', status=405)
    
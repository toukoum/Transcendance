
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
        data = request.data
        user1 = request.user
        user2_id = data.get('user2')

        if not user2_id:
            return Response({'error': 'You must provide a user2 id'}, status=status.HTTP_400_BAD_REQUEST)
        
        if int(user1.id) == int(user2_id):
            return Response({'error': 'You can not be friends with yourself'}, status=status.HTTP_400_BAD_REQUEST)


        existing_friendship = Friendship.objects.filter(Q(user1=user1, user2_id=user2_id) | Q(user1=user2_id, user2=user1))
        if existing_friendship.exists() and existing_friendship[0].status == 'accepted':
            return Response({'error': 'You are already friends with this user'}, status=status.HTTP_400_BAD_REQUEST)
        elif existing_friendship.exists() and existing_friendship[0].status == 'pending':
            return Response({'error': 'You already sent a friendship request to this user'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user2 = User.objects.get(id=user2_id)
        except User.DoesNotExist:
            return format_response(error='User not found', status=404)
        

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user1=user1, user2=user2)


        send_notification(
          data={
              'event_type': 'friendship_request',
              'details': f'{user1.username} wants to be friends with you',
              'user_id_from': user1.id,
              'action': {
                  'accept': f'http://localhost:3000/friends/accept/{serializer.data.get("id")}/',
                  'reject': f'http://localhost:3000/friends/reject/{serializer.data.get("id")}/'
              }
          },
          user2_id=user2_id,
        )
    
        return format_response(data=serializer.data, status=201)


    def list(self, request, *args, **kwargs):
        """
        get all friends of the authenticated user
        """
        user = request.user
        #friendship = Friendship.objects.filter((Q(user1=user) | Q(user2=user)) & Q(status='accepted'))
        friendship = Friendship.objects.filter((Q(user1=user) | Q(user2=user)))
        serializer = self.get_serializer(friendship, many=True)
        return format_response(data=serializer.data, status=200)


    @action (detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """
        accept a friendship request
        """
        print(request.data)
        friendship = self.get_object()
        if friendship.user2 != request.user:
            return format_response(error='You can not accept this friendship request', status=400)
        
        friendship.status = 'accepted'
        friendship.save()
        
        return format_response(data=self.get_serializer(friendship).data, status=200)

    @action (detail=True, methods=['post'])
    def reject(self, request, pk=None):
        print(request.data)
        friendship = self.get_object()
        if friendship.user2 != request.user:
            return format_response(error='You can not reject this friendship request', status=400)
        
        friendship.status = 'rejected'
        #suppression de la demande d'amitié
        friendship.delete()

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

        return format_response(data={'status': 'Friendship deleted'}, status=200)
    

    def update(self, request, *args, **kwargs):
        # Disable PUT requests
        return format_response(error='PUT requests are not allowed on friendships', status=405)

    def partial_update(self, request, *args, **kwargs):
        # Disable PATCH requests
        return format_response(error='PATCH requests are not allowed on friendships', status=405)
    
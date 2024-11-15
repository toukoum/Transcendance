
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


class FriendshipViewSet(viewsets.ModelViewSet):

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
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user1=user1, user2=user2)


        send_notification(
            data={
                'message': f'{user1.username} wants to be friends with you',
                'type': 'friendship_request',
                'user1_id': user1.id,
                'user1_username': user1.username,
                'request_id': serializer.data['id'],
            },
            user2_id=user2_id,
        )
    
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def list(self, request, *args, **kwargs):
        """
        get all friends of the authenticated user
        """
        user = request.user
        #friendship = Friendship.objects.filter((Q(user1=user) | Q(user2=user)) & Q(status='accepted'))
        friendship = Friendship.objects.filter((Q(user1=user) | Q(user2=user)))
        serializer = self.get_serializer(friendship, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    @action (detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """
        accept a friendship request
        """
        print(request.data)
        friendship = self.get_object()
        if friendship.user2 != request.user:
            return Response({'error': 'You can not accept this friendship request'}, status=status.HTTP_400_BAD_REQUEST)
        
        friendship.status = 'accepted'
        friendship.save()

        return Response({'status': 'Friendship accepted'}, status=status.HTTP_200_OK)

    @action (detail=True, methods=['post'])
    def reject(self, request, pk=None):
        print(request.data)
        friendship = self.get_object()
        if friendship.user2 != request.user:
            return Response({'error': 'You can not reject this friendship request'}, status=status.HTTP_400_BAD_REQUEST)
        
        friendship.status = 'rejected'
        #suppression de la demande d'amitié
        friendship.delete()

        return Response({'status': 'Friendship rejected'}, status=status.HTTP_200_OK)
    


    @action (detail=False, methods=['get'], url_path='sent')
    def sent_requests(self, request):
        """
        get all friendship requests sent by the authenticated user
        """
        user = request.user
        sent_requests = Friendship.objects.filter(user1=user, status='pending')
        serializer = self.get_serializer(sent_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action (detail=False, methods=['get'], url_path='received')
    def received_requests(self, request):
        user = request.user
        received_requests = Friendship.objects.filter(user2=user, status='pending')
        serializer = self.get_serializer(received_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @action (detail=True, methods=['delete'])
    def delete(self, request, pk=None):
        if pk is None:
            return Response({'error': 'You must provide a friendship id'}, status=status.HTTP_400_BAD_REQUEST)
        friendship = self.get_object()
        if friendship.user1 != request.user and friendship.user2 != request.user and friendship.status == 'accepted':
            return Response({'error': 'You can not delete this friendship request'}, status=status.HTTP_400_BAD_REQUEST)
        elif friendship.user1 != request.user and friendship.status == 'pending':
            return Response({'error': 'You can not delete this friendship request'}, status=status.HTTP_400_BAD_REQUEST)

        friendship.delete()

        return Response({'status': 'Friendship deleted'}, status=status.HTTP_200_OK)
    

    def update(self, request, *args, **kwargs):
        # Disable PUT requests
        return Response({'error': 'PUT requests are not allowed on friendships'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        # Disable PATCH requests
        return Response({'error': 'PATCH requests are not allowed on friendships'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
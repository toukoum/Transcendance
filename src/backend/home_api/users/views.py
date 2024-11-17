from rest_framework import status

from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import viewsets
from users.serializers import (
    UserSelfSerializer,
    UserListSerializer,
    UserWrapperSerializer,
    UserDetailSerializer,
    ProfileAvatarSerializer,
)

from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView

from home_api.utils import BaseViewSet, BaseReadOnlyViewSet, format_response
from friends.models import Friendship
from django.db.models import Case, When, Value, BooleanField


class UserViewSet(BaseReadOnlyViewSet):

    serializer_class = UserListSerializer
    detail_serializer_class = UserDetailSerializer

    queryset = User.objects.all()
    lookup_field = 'username'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return self.detail_serializer_class
        return super().get_serializer_class()

class UserUpdateProfileViewSet(BaseViewSet):
    serializer_class = UserSelfSerializer
    permission_classes = [IsAuthenticated]


    def get_object(self):
        return self.request.user 

class UserWrapperViewSet(BaseViewSet):
    serializer_class = UserWrapperSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserSearchView(BaseReadOnlyViewSet):
    serializer_class = UserListSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        query = self.request.query_params.get('q', '').strip()

        if len(query) < 3:
            return User.objects.none()

        # List d'amis actuel
        friends = Friendship.objects.filter(
            user1=self.request.user,
            status='accepted'
        ).values_list('user2', flat=True)

        # Annoter les utilisateurs pour indiquer si ce sont des amis
        users = User.objects.filter(
            is_active=True,
            username__icontains=query
        ).annotate(
            is_friend=Case(
                When(id__in=friends, then=Value(1)),
                default=Value(0),
                output_field=BooleanField()
            )
        )
        
        # Retourner amis d'abord, puis par username, A TESTER
        return users.order_by('-is_friend', 'username')
				
class UploadAvatar(APIView):
    """
			Update avatar of the user
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user_profile = request.user.profile
        serializer = ProfileAvatarSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return format_response(data=serializer.data)
        return format_response(error=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
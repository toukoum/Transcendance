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
    UserSearchSerializer
)

from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView

from home_api.utils import BaseViewSet, BaseReadOnlyViewSet, format_response
from friends.models import Friendship
from django.db.models import Case, When, Value, BooleanField

from rest_framework.exceptions import ValidationError


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
    
    def update(self, request, *args, **kwargs):
      partial = kwargs.pop('partial', False)
      
      if request.method.lower() == 'patch':
          partial = True

      instance = self.get_object()
      serializer = self.get_serializer(instance, data=request.data, partial=partial)
      serializer.is_valid(raise_exception=True)
      self.perform_update(serializer)

      return Response(serializer.data, status=status.HTTP_200_OK)

class UserWrapperViewSet(BaseViewSet):
    serializer_class = UserWrapperSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserSearchView(BaseReadOnlyViewSet):
    serializer_class = UserSearchSerializer
    queryset = User.objects.all()

    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        query = self.request.query_params.get('q', '').strip()

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return format_response(data=serializer.data)

    def get_queryset(self):
        query = self.request.query_params.get('q', '').strip()

        friends = Friendship.objects.filter(
            user1=self.request.user,
            status='accepted'
        ).values_list('user2', flat=True)

        users = User.objects.filter(
            is_active=True,
            username__icontains=query
        ).annotate(
            is_friend=Case(
                When(id__in=friends, then=Value(1)),
                default=Value(0),
                output_field=BooleanField()
            )
        ).exclude(id=self.request.user.id)

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
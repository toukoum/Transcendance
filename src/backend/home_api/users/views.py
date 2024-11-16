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

    #TODO : friends management
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if (len(query) < 3):
            return User.objects.none()
        return User.objects.filter(username__icontains=query).filter(email__icontains=query).filter(is_active=True).distinct()
    
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
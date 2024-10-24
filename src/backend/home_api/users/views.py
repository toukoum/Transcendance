from rest_framework import status

from django.contrib.auth.models import User
from requests import Response
from rest_framework import viewsets
from users.serializers import UserDetailSerializer, UserListSerializer

from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = UserListSerializer
    detail_serializer_class = UserDetailSerializer

    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return self.detail_serializer_class
        return super().get_serializer_class()


class UserUpdateProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserDetailSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

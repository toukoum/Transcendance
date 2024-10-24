from django.shortcuts import render

from django.contrib.auth.models import User
from rest_framework import viewsets
from users.serializers import UserDetailSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer


from django.urls import path
from users.views import UserUpdateProfileViewSet

urlpatterns = [
    path('me/', UserUpdateProfileViewSet.as_view({'get': 'retrieve', 'put': 'update'})),
]
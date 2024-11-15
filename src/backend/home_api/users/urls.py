

from django.urls import path
from users.views import (
    UserUpdateProfileViewSet,
    UserSearchView,
    UploadAvatar,
)

urlpatterns = [
    path('me/', UserUpdateProfileViewSet.as_view({'get': 'retrieve', 'patch': 'update'}), name='user-profile'),
    path('search/', UserSearchView.as_view({'get': 'list'}), name='user-search'),
    path('avatar/upload/', UploadAvatar.as_view(), name='upload avatar')
]
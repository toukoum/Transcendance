"""
URL configuration for home_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter

from users.views import UserViewSet
from friends.views import FriendshipViewSet

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='users')
router.register(r'friends', FriendshipViewSet, basename='friends')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('v1/', include(router.urls)),
    path('v1/', include('users.urls')),
    path('v1/auth/', include('authentification.urls')),
    path('v1/chat/', include('chat.urls')),

    path('v1/notif/', include('notification.urls')),

    path('v1/games/', include('games.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)




from django.urls import path

from .consumers import GameConsumer

websocket_urlpatterns = [
		path('ws/game/<int:game_id>/', GameConsumer.as_asgi()),
]
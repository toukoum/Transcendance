
from django.urls import path

from notification import consumers


websocket_urlpatterns = [
		path('ws/notification/', consumers.NotificationConsumer.as_asgi()),
]

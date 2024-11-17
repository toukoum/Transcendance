from django.shortcuts import render

from rest_framework.response import Response

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from rest_framework.decorators import api_view

from notification.utils import send_notification

from home_api.utils import (
	format_response,
	BaseReadOnlyViewSet,
	BaseViewSet,
)

from rest_framework.permissions import IsAuthenticated
from notification.serializers import NotificationListSerializer
from notification.models import Notification

@api_view(['POST'])
def testNotif(request):
		
		send_notification(
			user=request.user,
			data={
				'message': 'Bonjour je suis une NOTIF batard'
			},
			event_type='TESTING',
			action={
				'primary': {
					'url': 'http://localhost:8000/v1/me/',
					'label': 'User profile'
				}
			}
		)



@api_view(['POST'])
def testNotifUser(request):
		userId = request.data['userId']
		userIdRequest = request.user.id
		print(userIdRequest)
		data = {
			'message': 'Bonjour je suis une NOTIF batard',
			'userFrom': userIdRequest,
		}

		send_notification(data, userId)
		return format_response(data='Notification sent')

class NotificationsViewSet(BaseViewSet):

	permission_classes = [IsAuthenticated]
	serializer_class = NotificationListSerializer

	def get_queryset(self):
		user_id = self.request.user.id
		return Notification.objects.filter(user_id=user_id).order_by('-created_at')\

	
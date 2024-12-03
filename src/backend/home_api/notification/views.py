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

from rest_framework.decorators import action

from rest_framework.permissions import IsAuthenticated
from notification.serializers import NotificationListSerializer
from notification.models import Notification

from django.contrib.auth.models import User

@api_view(['POST'])
def testNotif(request):
		
		return send_notification(
			user=request.user,
			data={
				'message': 'Bonjour je suis une NOTIF batard'
			},
		)



@api_view(['POST'])
def testNotifUser(request):
		user = User.objects.get(id=request.data['userId'])
		
		return send_notification(
			user=user,
			data={
				'message': 'Bonjour je suis une NOTIF batard'
			},
			action={
				'primary': {
					'url': 'http://10.32.8.13:8000/v1/me/',
					'label': 'User profile'
				}
			},
			user_from=request.user
		)




class NotificationsViewSet(BaseViewSet):

	permission_classes = [IsAuthenticated]
	serializer_class = NotificationListSerializer

	def get_queryset(self):
		user = self.request.user
		return Notification.objects.filter(user=user).order_by('-created_at')
	
	def destroy(self, request, *args, **kwargs):
		try: 
			instance = self.get_object()
			instance.delete()
			return format_response(data={'message': 'Notification deleted'}, status=200)
		except:
			return format_response(data={'message': 'Notification not found'}, status=404)
	
	@action(detail=True, methods=['POST'], url_path='mark-as-read')
	def mark_as_read(self, request, pk=None):
		notification = self.get_object()
		notification.isRead = True
		notification.save()
		return format_response(data={'message': 'Notification marked as read'}, status=200)
	
from django.shortcuts import render

from rest_framework.response import Response

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from rest_framework.decorators import api_view

from notification.utils import send_notification

from home_api.utils import format_response


@api_view(['POST'])
def testNotif(request):
		
		channel_layer = get_channel_layer()
		userId = request.user.id
		group_name = f'user_{userId}'
		async_to_sync(channel_layer.group_send)(
			group_name,
			{
				'type': 'send_notification',
				'data': {
					'type': 'TEST',
					'message': 'Salutttttt bg, je suis une notification',
				}
			}
		)

		return format_response(data='Notification sent')



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
from django.shortcuts import render

from rest_framework.response import Response

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from rest_framework.decorators import api_view

from notification.utils import send_notification


@api_view(['POST'])
def testNotif(request):
		
		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(
			'notification',
			{
				'type': 'send_notification',
				'data': {
					'type': 'friendship_request',
					'message': 'Salutttttt bg, je suis une notification',
				}
			}
		)

		return Response({"message": "Hello, world!"})



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
		return Response({"message": "Notif bien envoye"})
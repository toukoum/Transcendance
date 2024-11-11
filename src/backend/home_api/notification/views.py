from django.shortcuts import render

from rest_framework.response import Response

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from rest_framework.decorators import api_view



@api_view(['POST'])
def testNotif(request, other_id):
		
		
		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(
			'notifications',
			{
				'type': 'send_notification',
				'message': 'Salutttttt bg, je suis une notification'
			}
		)
		
		return Response({"message": "Hello, world!"})
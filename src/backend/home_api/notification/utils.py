
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_notification(data, user2_id):
		"""
		send a notification to a user by his id
		"""
		# send notification to user2
		group_name = f'user_{user2_id}'

		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(
				group_name,
				{
						'type': 'send_notification_consumer',
						'data': data
				}
	)
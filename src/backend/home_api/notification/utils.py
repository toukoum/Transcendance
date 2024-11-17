
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from notification.models import Notification
from django.contrib.auth.models import User

def send_notification(user, data, event_type="divers", user_from=None, action=None):		
  """
  send a notification to a user by his id
  """
  
  group_name = f'user_{user.id}'

  Notification.objects.create(
      user=user,
      user_from=user_from,
      event_type=event_type,
      data=data,
      action=action
  )

  channel_layer = get_channel_layer()
  async_to_sync(channel_layer.group_send)(
      group_name,
      {
          'type': 'send_notification',
          'data': {
              'event_type': event_type,
              'data': data,
              'user_from': user_from,
              'action': action
          }
      }
)
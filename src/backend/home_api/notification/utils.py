
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from notification.models import Notification
from django.contrib.auth.models import User

VALID_EVENT_TYPES = ["information", "game_request", "friend_request", "tournament_invite"]
from home_api.utils import format_response

def send_notification(user, data, event_type="information", user_from=None, action=None):		
  """
  send a notification to a user by his id
  """
  
  group_name = f'user_{user.id}'
  
  if not user or not data:
      return format_response(error='Invalid data')
  
  if event_type not in VALID_EVENT_TYPES:
      return format_response(error='Invalid event type')

  notification = Notification.objects.create(
      user=user,
      user_from=user_from,
      event_type=event_type,
      data=data,
      action=action
  )

  channel_layer = get_channel_layer()
  try:
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_notification',
            'data': {
                'event_type': event_type,
                'data': data,
                'user_from': user_from.id if user_from else None,
                'action': action
            }
        }
    )
    notification.isRead = True
  except Exception as e:
      print("=====> La notif n'est pas LUUUUUUU")
      print(e)
  notification.save()
  return format_response(data='Notification sent')


import json

from channels.generic.websocket import AsyncWebsocketConsumer

from notification.models import Notification
from channels.db import database_sync_to_async
from users.models import Profile

from asgiref.sync import sync_to_async

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
      user = self.scope["user"]
      self.user_group_name = f'user_{user.id}'

      await self.channel_layer.group_add(
        self.user_group_name,
        self.channel_name
      )
      
      if (user.is_authenticated):
           await self.update_user_status(user, True)
      
      await self.accept()

    @staticmethod
    async def update_user_status(user, is_online):
        try:
            def update_status():
                Profile.objects.filter(user=user).update(is_online=is_online)
            await sync_to_async(update_status)()
        except Profile.DoesNotExist:
            pass


    async def disconnect(self, close_code):
      # Retirer l’utilisateur du groupe de notifications
      user = self.scope["user"]
      if (user.is_authenticated):
          await self.update_user_status(user, False)

      await self.channel_layer.group_discard(
          self.user_group_name,
          self.channel_name
      )

    async def receive(self, text_data):
        # Peut être utilisé si on veut recevoir des messages du client
        pass

    async def send_notification(self, event):
        # Méthode pour envoyer une notification
        data = event['data']

        await self.send(text_data=json.dumps(data))
                                
        notification_id = data.get('notification_id')
        if notification_id:
            await self.mark_notification_as_read(notification_id)

    
    @sync_to_async
    def mark_notification_as_read(self, notif_id):
        try:
            notification = Notification.objects.get(id=notif_id)
            notification.isRead = True
            notification.save()
        except Notification.DoesNotExist:
            pass

  
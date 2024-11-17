

import json

from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
		async def connect(self):
			self.user_group_name = f'user_{self.scope["user"].id}'

			await self.channel_layer.group_add(
				self.user_group_name,
				self.channel_name
			)

			await self.accept()


		async def disconnect(self, close_code):
			# Retirer l’utilisateur du groupe de notifications
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

				await self.send(text_data=json.dumps({
						'data': data
				}))
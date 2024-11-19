import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q

# Utils
from games.utils.AsyncLockedDict import AsyncLockedDict

class GameConsumer(AsyncWebsocketConsumer):
	games = AsyncLockedDict() # key: game_id, value: Game (class)
	
	async def connect(self):
		self.game_id = self.scope['url_route']['kwargs']['game_id']
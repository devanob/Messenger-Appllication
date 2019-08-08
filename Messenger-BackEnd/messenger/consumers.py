from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class MessengerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("connection")
        await self.accept() 
        
    async def disconnect(self,close_code):
        pass
        #print(close_code)
    async def receive_json(self,content):
        print(content)


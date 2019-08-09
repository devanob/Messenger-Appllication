from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class MessengerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_authenticated and user.is_active:
            print("User authenticated")
            await self.accept() 
        else:
            print("user rejected")
            await self.close("User Is Not Authenicated")
        return
        
    async def disconnect(self,close_code):
        print(close_code)
    async def receive_json(self,content):
        print(content)


from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class MessengerConsumer(AsyncJsonWebsocketConsumer):
    group_name = None
    async def connect(self):
        user = self.scope["user"]
        isAuthenticated = await self.isUserAuthenticated(user) 
        if isAuthenticated:
            print("User authenticated")
            uuidToken = await self.getUUID(user)
            self.group_name = uuidToken
            print(uuidToken)
            await self.channel_layer.group_add(
                self.group_name,self.channel_name
            )
            await self.accept() 
        else:
            print("user rejected")
            await self.close("User Is Not Authenicated")
        return
        
    async def disconnect(self,close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(close_code)
    
    async def receive_json(self,content):
        print(content)

    async def message(self,event):
        message = {
        "type": "message",
        "to_User": event["to_User"],
        "from_User": event["from_User"],
        "message": event["message"]
       }
        await self.send_json(message);

    @database_sync_to_async
    def isUserAuthenticated(self,user):
        return user.is_authenticated and user.is_active

    @database_sync_to_async
    def  getUUID(self,user):
        return str(user.uuid)




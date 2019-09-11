from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import DirectConversationRecords, Messages
from django.db.models import Q
from django.core import serializers
import json
import asyncio
class MessengerConsumer(AsyncJsonWebsocketConsumer):
    group_name = None
    # this is a list of cached users you are talking to to avoid database queries
    cached_user = {}
    cached_conversations= {}
    user = None
    connected = False
    async def connect(self):
        user = self.scope["user"]
        self.user = user
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
            # self.connected = True
            # asyncio.ensure_future(self.checkActive())
        else:
            print("user rejected")
            await self.close("User Is Not Authenicated")
        return
        
    async def disconnect(self,close_code):
        try:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        except:
            pass
        self.connected = False
        print(close_code)

    async def checkActive(self):
        while self.connected:
            await asyncio.sleep(8)
            print(self.channel_name)
            print("Still Here")
        print("Web Socket IS Disconnected")

    
    async def receive_json(self,content):
        ##check if the user sent a message with type
        if "type" in content:
            # //if the user sent a message
           if (content["type"] == "message"):
               await self.typeMessageHandlier(content);
        else :
            return
       
    async def typeMessageHandlier(self, content):
        message = await self.processMessage(content)
        serialized_obj = serializers.serialize('json', [ message, ])
        messageDict= json.loads(serialized_obj)
        messageDict[0]["fields"]['id'] = messageDict[0]["pk"]
        message = messageDict[0]["fields"]
        message['type'] = "message"
        to_User = message["to_User"]
        from_User = message["from_User"]
        if (to_User == from_User):
            await self.channel_layer.group_send(to_User, message)
        else:
            await self.channel_layer.group_send(from_User, message)
            await self.channel_layer.group_send(to_User, message)
        

    async def message(self,event):
        event['type'] = 'message'
        message = event
        await self.send_json(message);

    @database_sync_to_async
    def isUserAuthenticated(self,user):
        return user.is_authenticated and user.is_active

    @database_sync_to_async
    def  getUUID(self,user):
        return str(user.uuid)

    @database_sync_to_async
    def processMessage(self,message):
        # tries to catch the any errors
        try:
            #check if we already have the user
            to_User_model = None
            to_User = message["toUser"]
            if to_User in self.cached_user:
                to_User_model = self.cached_user[to_User]
                #try and get the user 
            else: ## get user model
                userModel = get_user_model()
                to_User_model = userModel.objects.get(uuid=to_User)
                self.cached_user[to_User] = to_User_model;
                ##add it to the cached list
            #conversation
            conversation_Model = None
            if to_User in self.cached_conversations:
                conversation_Model = self.cached_conversations[to_User]
            #hit the database to get it
            else:
                query1 = Q(user_one=self.user)  & Q(user_two=to_User_model)
                query2 = Q(user_one=to_User_model) & Q(user_two=self.user)
                conversation_Model = DirectConversationRecords.objects.filter(query1 | query2).first()
                # if such conversation exist cached it and use it 
                if conversation_Model:
                    self.cached_conversations[to_User]= conversation_Model 
                    #we need to make a conversation id
                else:
                    conversation_Model =  DirectConversationRecords(user_one =self.user, user_two = to_User_model)
                    conversation_Model.save()
                    self.cached_conversations[to_User]=conversation_Model
            mssg = Messages(from_User = self.user,  
                            to_User = to_User_model, 
                            direct_conversation_id = conversation_Model,
                            message = message["message"]
                            )
            conversation_Model.save()
            mssg.save()
           
            return (mssg)

        except  Exception as e:
            print(e)
            return None
        


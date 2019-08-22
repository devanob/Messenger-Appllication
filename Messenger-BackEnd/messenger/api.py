
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from .serializers import MessagesBasicSerializers
from django.db import transaction
from .models import Messages


class UserMessages(viewsets.ViewSet):
    item_per_group = 50
    "Retrieve Messages API User Authentication Required"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self,request):
        user_uuid = request.user.uuid.hex
        query= Messages.objects.raw("select * from Messages where  ( \
        select count(*) from Messages as mssg \
        where mssg.direct_conversation_id = Messages.direct_conversation_id and mssg.mssg_date_stamp > Messages.mssg_date_stamp \
        and (from_User_id = %s or to_User_id =  %s ) \
        ) < %s  and (from_User_id = %s or to_User_id = %s) \
        order by direct_conversation_id, mssg_date_stamp;", 
        [user_uuid,user_uuid,self.item_per_group, user_uuid,user_uuid])
        messages_serialized = MessagesBasicSerializers(query, many=True)
        return Response(messages_serialized.data)
    def retrieve(self, request, pk):
        pass

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
from .models import Messages, DirectConversationRecords
from django.db.models import Q


class UserMessages(viewsets.ViewSet):
    item_per_group = 40
    "Retrieve Messages API User Authentication Required"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self,request):
        user = request.user
        query_conditon= Q(user_one=user) | Q(user_two=user)
        message_record = DirectConversationRecords.objects.filter(query_conditon)
        messageQueries = []
        subQuery= "SELECT  * FROM ({})";

        for record in message_record:
            query = Messages.objects.filter(direct_conversation_id=record).order_by('-mssg_date_stamp')[:self.item_per_group]
            messageQueries.append(subQuery.format(str(query.query)))
        finalQuery = query = " UNION ALL ".join(messageQueries)
        finalQuery += " ORDER BY direct_conversation_id, mssg_date_stamp"
        finalQuery = Messages.objects.raw(finalQuery)
        #serializedData.orderby("-direct_conversation_id").orderby("-direct_conversation_id")
        serializedData = MessagesBasicSerializers(finalQuery, many=True)
        return Response(serializedData.data)
        
    def retrieve(self, request, pk):
        pass

from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from .serializers import MessagesBasicSerializers, ContactsBasicSerializers
from django.db import transaction
from .models import Messages, DirectConversationRecords
from django.db.models import Q
from User.models import contactList 


class UserMessages(viewsets.ViewSet):
    item_per_group = 50  
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

class UserActiveContact(viewsets.ViewSet):
    item_per_group = 50 
    "Retrieve Messages API User Authentication Required"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self,request):
        from django.db import connection
        user = request.user
        query_conditon= (Q(friend_ship_initiator=user) | Q(friend=user)) & Q(active_contact=True)
        contacts = contactList.objects.select_related('friend_ship_initiator').\
            select_related('friend').filter(query_conditon)
        serializeContact = ContactsBasicSerializers(contacts, many=True)
        return Response({"contacts":serializeContact.data,"current_user": user.uuid})
    def retrieve(self, request, pk):
        pass

class UserPendingContact(viewsets.ViewSet):
    item_per_group = 50 
    "Retrieve Messages API User Authentication Required"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self,request):
        user = request.user
        query_conditon= (Q(friend_ship_initiator=user) | Q(friend=user)) & Q(active_contact=False)
        contacts = contactList.objects.select_related('friend_ship_initiator').\
            select_related('friend').filter(query_conditon)
        serializeContact = ContactsBasicSerializers(contacts, many=True)
        serializeContact.data
       

        return Response({"contacts":serializeContact.data,"current_user": user.uuid})
    def retrieve(self, request, pk):
        pass
    #create  A Pending Contact 
    def create(self, request): 
        user = request.user
        with transaction.atomic():
            contact=contactList(friend_ship_initiator=request.user,\
            friend=self.USER_MODEL.objects.get(uuid=request.data["uuid"]))
            try:
                contact.save()
            except Exception as e:
                return Response("contact-exists", status=status.HTTP_208_ALREADY_REPORTED)      
        return Response("contact-created", status=status.HTTP_201_CREATED)
    def update(self, request, pk=None):
        if  pk:
            try:
                contactInst = contactList.objects.get(id=int(pk))
                contactInst.active_contact = True
                contactInst.save()
                return Response(pk,status=status.HTTP_200_OK)

            except Exception as e:
                return Response("user-not-found", status=status.HTTP_204_NO_CONTENT)
        else:
            return Response("No Pending User Given", status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, pk=None):
        if  pk:
            try:
                contactInst = contactList.objects.get(id=int(pk))
                contactInst.delete()
                return Response(pk, status=status.HTTP_200_OK)

            except Exception as e:
                print(e)
                return Response(pk, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response("no-pending-user-given", status=status.HTTP_400_BAD_REQUEST)
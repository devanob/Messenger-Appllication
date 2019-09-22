
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
from django.contrib.auth import get_user_model
from .customException import LengthToLarge
from uuid import UUID
from collections import OrderedDict

class UserMessages(viewsets.ViewSet):
    item_per_group = 20
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
    @action(detail=False, methods=['post'], name='Get Message  When  List OF UUID Are Given')
    def getMessageUUID(self, request):
        try:
            #user must provide this list or else an exception will be thrown
            list_uuid = request.data["list_uuid"]
            if len(list_uuid) > self.item_per_group:
                raise LengthToLarge("length array to long")
            ## time to validate uuid prevent sql injections
            for uuid_user in list_uuid:
                UUID(str(uuid_user))
            user = request.user
            query_conditon_one= Q(user_one=user) & Q(user_two__in=list_uuid)
            query_conditon_two= Q(user_one__in=list_uuid) & Q(user_two=user)
            message_record = DirectConversationRecords.objects.filter(query_conditon_one | query_conditon_two)
            messageQueries = []
            subQuery= "SELECT  * FROM ({})";
            for record in message_record:
                query = Messages.objects.filter(direct_conversation_id=record).order_by('-mssg_date_stamp')[:self.item_per_group]
                messageQueries.append(subQuery.format(str(query.query)))
            finalQuery = " UNION ALL ".join(messageQueries)

            finalQuery += " ORDER BY direct_conversation_id, mssg_date_stamp"
            finalQuery = Messages.objects.raw(finalQuery)
        #serializedData.orderby("-direct_conversation_id").orderby("-direct_conversation_id")
            serializedData = MessagesBasicSerializers(finalQuery, many=True)
            return Response(serializedData.data)
        #exception handling
        except KeyError as  e:
            print(e)
            return Response("key-not-found-list_uuid", status=status.HTTP_400_BAD_REQUEST)
        except LengthToLarge as  e:
            print(e)
            return Response("list-array-length-to-large", status=status.HTTP_400_BAD_REQUEST)
        except AttributeError as e:
            print(e)
            return Response("contain-none valid-uuid-objects", status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            print(e)
            return Response("atleast-one-uuid-invalid", status=status.HTTP_400_BAD_REQUEST)

        
 
from rest_framework.pagination import PageNumberPagination
#Pagination Class 
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))
class UserActiveContact(viewsets.ViewSet,StandardResultsSetPagination ):
    item_per_group = 10
    "Retrieve Messages API User Authentication Required"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self,request):
        from django.db import connection
        user = request.user
        query_conditon= (Q(friend_ship_initiator=user) | Q(friend=user)) & Q(active_contact=True)
        contacts = contactList.objects.select_related('friend_ship_initiator').\
            select_related('friend').select_related('contact_conversation').filter(query_conditon)\
                .order_by("-contact_conversation__last_spoken_to")
        queryset_paginated= self.paginate_queryset(contacts,request)
        serializeContact = ContactsBasicSerializers(queryset_paginated, many=True)
        return self.get_paginated_response(serializeContact.data)
    def retrieve(self, request, pk):
        pass

class UserPendingContact(viewsets.ViewSet,StandardResultsSetPagination):
    item_per_group = 50 
    "Retrieve Messages API User Authentication Required"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    USER_MODEL = get_user_model()
    def list(self,request):
        user = request.user
        query_conditon= (Q(friend=user)) & Q(active_contact=False)
        contacts = contactList.objects.select_related('friend_ship_initiator').\
            select_related('friend').filter(query_conditon)
        queryset_paginated= self.paginate_queryset(contacts,request)
        serializeContact = ContactsBasicSerializers(queryset_paginated, many=True)
        return self.get_paginated_response(serializeContact.data) 
    def retrieve(self, request, pk):
        pass
    #create  A Pending Contact 
    def create(self, request):
        print(request.data["uuid"])
        user = request.user
        with transaction.atomic():
            contact=contactList(friend_ship_initiator=request.user,\
            friend=self.USER_MODEL.objects.get(uuid=request.data["uuid"]))
            contact.active_contact = False;
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
from .models import User
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from .form import CustomAuthenticationForm
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from django.contrib.auth import get_user_model
from .serializers import UserBasicSerializers as UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login, logout
from .models import contactList
from django.db import transaction
import uuid
##rest_log_in_view


class AuthenticationUser(viewsets.ViewSet):
    "User Authentication API Basic And Session Based Authentication"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    @action(detail=False, methods=['get'], name="Verifies If The User Is Already LoggIn ")
    def islogin(self,request):
        if request.user.is_authenticated:
            return Response(
                    {
                        "isLoggedIn":True,
                        "user": UserSerializer(request.user).data
                    },status=status.HTTP_200_OK)
        else:
            return Response(
                    {"isLoggedIn" : False, "user": None
                     },status=status.HTTP_200_OK)
    @action(detail=False, methods=['post'], name='Log In User Basic Cookie Authentication')
    def login(self,request):
        form = CustomAuthenticationForm(request,data=request.data)
        # print(request.META["CONTENT_TYPE"])
        if form.is_valid():
            user = form.get_user()
            token, created = Token.objects.get_or_create(user=user)
            login(request,user)
            if created:
                token.save()
            return Response({"token": token.key, "username": user.username}, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_404_NOT_FOUND)


    @action(detail=False, methods=['get'], name='Log Out User')
    def logout(self,request):
         if request.user.is_authenticated:
             logout(request)
             return Response("user-log-out", status=status.HTTP_200_OK)

from rest_framework.pagination import PageNumberPagination
#Pagination Class 
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserInfoViewSet(viewsets.ViewSet,StandardResultsSetPagination):
    "Viwset For Modifying, Friends, Pending Friends"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    USER_MODEL = get_user_model()
    permission_classes = [IsAuthenticated]
    def list(self,request):
        search = self.request.query_params.get('search', None)
        your_contacts = request.user.get_active_contacts()
        print(your_contacts.query)
        queryset = None
        if search:
            queryset = self.USER_MODEL.objects \
            .filter(username__icontains=search).exclude(uuid=request.user.uuid) \
            #  .exclude(username__in=your_contacts)
            print(queryset.query)
        else:
            queryset = self.USER_MODEL.objects.all().order_by('-username')
        queryset_paginated= self.paginate_queryset(queryset,request)
        serializer =  UserSerializer(queryset_paginated, many=True)
        return self.get_paginated_response(serializer.data)
    
    def retrieve(self, request, pk=None):
        print(pk)
        queryset = self.USER_MODEL.objects.all()
        try:
            user = get_object_or_404(queryset, pk=pk)
        except:
            user = get_object_or_404(queryset, username=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], name='Get Active Contact')
    def active_contacts(self,request):
        queryset = request.user.get_active_contacts()
        #queryset_paginated= self.paginate_queryset(queryset,request)
        serializer =  UserSerializer(queryset , many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], name='Get Pending Contact')
    def pending_contacts(self,request):
        queryset = request.user.get_pending_contacts()
        #queryset_paginated= self.paginate_queryset(queryset,request)
        serializer = UserSerializer(queryset , many=True)
        return Response(serializer.data)

class ActiveContactsViewSet(viewsets.ViewSet,StandardResultsSetPagination):
    "Viwset For Modifying  Active Contacts"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    USER_MODEL = get_user_model()
    permission_classes = [IsAuthenticated]
    def list(self,request):
        queryset = request.user.get_active_contacts()
        #queryset_paginated= self.paginate_queryset(queryset,request)
        serializer =  UserSerializer(queryset , many=True)
        return Response(serializer.data)

class PendingContactsViewSet(viewsets.ViewSet,StandardResultsSetPagination):
    "Viwset For Modifying  Pending Contacts"
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    USER_MODEL = get_user_model()
    permission_classes = [IsAuthenticated]
    #list all Pending Contact
    def list(self,request):
        queryset = request.user.get_pending_contacts()
        #queryset_paginated= self.paginate_queryset(queryset,request)
        serializer = UserSerializer(queryset , many=True)
        return Response(serializer.data)
    #create  A Pending Contact 
    def create(self, request): 
        from django.db import connection
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
                pendingUser = self.USER_MODEL.objects.get(uuid=str(pk))
                contactInst = contactList.objects.get(friend_ship_initiator=pendingUser,friend=request.user)
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
                pendingUser = self.USER_MODEL.objects.get(uuid=pk)
                contactInst = contactList.objects.get(friend_ship_initiator=pendingUser,friend=request.user)
                contactInst.delete()
                return Response("User Contact Deleted=True", status=status.HTTP_200_OK)

            except Exception as e:
                print(e)
                return Response(pk, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response("No Pending User Given", status=status.HTTP_400_BAD_REQUEST)
        
    

    
        


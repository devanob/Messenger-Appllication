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
from django.contrib.auth import login
##rest_log_in_view


class AuthenticationUser(viewsets.ViewSet):
    "User Authentication API Basic And Session Based Authentication"
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    @action(detail=False, methods=['post'], name='Log In User Basic Cookie Authentication')
    def login(self,request):
        form = CustomAuthenticationForm(request,data=request.data)
        print(request.data)
        # print(request.META["CONTENT_TYPE"])

        if form.is_valid():
            user = form.get_user()
            token, created = Token.objects.get_or_create(user=user)
            if "session-login" in request.data:
                login(request,user)
            if created:
                token.save()
            return Response({"token": token.key, "username": user.username}, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_404_NOT_FOUND)


    @action(detail=False, methods=['post'], name='Log Out User')
    def logout(self,request):
        print(request.user)
        return Response("Testing Logout", status=status.HTTP_201_CREATED)

from rest_framework.pagination import PageNumberPagination
#Pagination Class 
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserInfoViewSet(viewsets.ViewSet,StandardResultsSetPagination):
    "Viwset For Modifying, Friends, Pending Friends "
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    USER_MODEL = get_user_model()
    permission_classes = [IsAuthenticated]
    def list(self,request):
        search = self.request.query_params.get('user-name', None)
        #print(search)
        queryset = self.USER_MODEL.objects.all().order_by('-username')
        queryset_paginated= self.paginate_queryset(queryset,request)
        serializer =  UserSerializer(queryset_paginated, many=True)
        return self.get_paginated_response(serializer.data)
    
    def retrieve(self, request, pk=None):
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
    

    
        


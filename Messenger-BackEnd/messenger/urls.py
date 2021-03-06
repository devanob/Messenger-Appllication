from rest_framework import routers
"""ProjectOne URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from .api import UserMessages, UserActiveContact, UserPendingContact
from rest_framework import routers
from .views import messengerView

router = routers.DefaultRouter()
router.register(r'active-contacts',UserActiveContact, basename="active-contacts")
router.register(r'message', UserMessages, basename="messages")
router.register(r'pending-contacts',UserPendingContact, base_name='pending-contacts')



urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'', messengerView.as_view(), name = "messenger"),
]


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
from .api import AuthenticationUser,UserInfoViewSet, ActiveContactsViewSet,PendingContactsViewSet
from rest_framework import routers
router = routers.DefaultRouter()

router.register(r'auth', AuthenticationUser, basename="auth")
router.register(r'users', UserInfoViewSet, basename="users")
router.register(r'active-contacts', ActiveContactsViewSet, basename="active-users")
router.register(r'pending-contacts', PendingContactsViewSet, basename="pending-users")

urlpatterns = [
    path(r'api/', include(router.urls)),
]


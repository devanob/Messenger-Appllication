"""ProjectApplication URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
from django.urls import path,include
from User.urls import router as user_api
from messenger.urls  import router as messenger_api
from  .routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

# url_api = []
# url_api+= messenger_api.urls
# url_api+= user_api.urls
router = DefaultRouter()
router.extend(user_api)
router.extend(messenger_api)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include("User.urls")),
    path('api/', include(router.urls)), 
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from messenger.routing import websocket_urlpatterns
from django.urls import re_path
import messenger.routing 
from messenger.auth import TokenGetAuthMiddlewareStack

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
    'websocket' : TokenGetAuthMiddlewareStack(
        URLRouter(
                messenger.routing.websocket_urlpatterns
            )
    )
})
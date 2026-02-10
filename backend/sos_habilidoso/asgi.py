"""
Configuración ASGI para SOS-HABILIDOSO con soporte para WebSockets
"""
import os

# CRÍTICO: Configurar PyMySQL ANTES de cualquier cosa de Django
import pymysql
pymysql.install_as_MySQLdb()

import django

# Configurar Django DESPUÉS de PyMySQL
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

# Ahora importar todo lo demás
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from apps.posts.middleware import TokenAuthMiddlewareStack

# Importar routing después de configurar Django
django_asgi_app = get_asgi_application()

from apps.messaging.routing import websocket_urlpatterns as messaging_websocket_urlpatterns
from apps.posts.routing import websocket_urlpatterns as posts_websocket_urlpatterns
from apps.notifications.routing import websocket_urlpatterns as notifications_websocket_urlpatterns

# Combinar todas las rutas WebSocket
websocket_urlpatterns = messaging_websocket_urlpatterns + posts_websocket_urlpatterns + notifications_websocket_urlpatterns

application = ProtocolTypeRouter({
    # HTTP requests
    "http": django_asgi_app,
    
    # WebSocket requests
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
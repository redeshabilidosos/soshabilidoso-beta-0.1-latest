# 🔧 Guía de Implementación - Backend WebSocket

## 📋 Requisitos

Para que el chat en tiempo real funcione, necesitas implementar el endpoint WebSocket en Django.

---

## 🛠️ Instalación de Dependencias

```bash
pip install channels channels-redis daphne
```

---

## ⚙️ Configuración de Django

### 1. Actualizar `settings.py`:

```python
INSTALLED_APPS = [
    'daphne',  # Debe estar PRIMERO
    'django.contrib.admin',
    # ... otras apps
    'channels',
]

# Configuración de Channels
ASGI_APPLICATION = 'sos_habilidoso.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

### 2. Crear `asgi.py`:

```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')

django_asgi_app = get_asgi_application()

from apps.messaging import routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                routing.websocket_urlpatterns
            )
        )
    ),
})
```

---

## 📁 Estructura de Archivos

```
backend/
├── apps/
│   └── messaging/
│       ├── consumers.py      # ← CREAR
│       ├── routing.py         # ← CREAR
│       └── middleware.py      # ← CREAR (autenticación)
```

---

## 💻 Código del Consumer

### `apps/messaging/consumers.py`:

```python
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close()
            return

        # Verificar que el usuario es miembro del chat
        is_member = await self.check_chat_membership()
        if not is_member:
            await self.close()
            return

        # Unirse al grupo del chat
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Salir del grupo del chat
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'typing_start':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_notification',
                    'action': 'start',
                    'user_id': str(self.user.id),
                    'username': self.user.display_name or self.user.username,
                }
            )
        
        elif message_type == 'typing_stop':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_notification',
                    'action': 'stop',
                    'user_id': str(self.user.id),
                }
            )
        
        elif message_type == 'new_message':
            message_data = data.get('message')
            # Broadcast del mensaje a todos en el grupo
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_data,
                }
            )

    async def typing_notification(self, event):
        # Enviar notificación de escritura al WebSocket
        await self.send(text_data=json.dumps({
            'type': f'typing_{event["action"]}',
            'user_id': event['user_id'],
            'username': event.get('username', ''),
        }))

    async def chat_message(self, event):
        # Enviar mensaje al WebSocket
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'message': event['message'],
        }))

    @database_sync_to_async
    def check_chat_membership(self):
        try:
            chat = ChatRoom.objects.get(id=self.chat_id)
            return chat.participants.filter(user=self.user).exists()
        except ChatRoom.DoesNotExist:
            return False
```

---

## 🔐 Middleware de Autenticación

### `apps/messaging/middleware.py`:

```python
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token_key):
    try:
        token = AccessToken(token_key)
        user_id = token['user_id']
        return User.objects.get(id=user_id)
    except Exception:
        return AnonymousUser()

class TokenAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Obtener token de la query string
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token:
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)
```

---

## 🛣️ Routing

### `apps/messaging/routing.py`:

```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<chat_id>[^/]+)/$', consumers.ChatConsumer.as_asgi()),
]
```

---

## 🔄 Actualizar `asgi.py` con Middleware:

```python
from apps.messaging.middleware import TokenAuthMiddleware

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddleware(  # ← Agregar middleware
            URLRouter(
                routing.websocket_urlpatterns
            )
        )
    ),
})
```

---

## 🚀 Ejecutar el Servidor

### Opción 1: Daphne (Producción)
```bash
daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

### Opción 2: Runserver (Desarrollo)
```bash
python manage.py runserver
```

---

## 🧪 Probar la Conexión

### Desde el navegador (consola):
```javascript
const ws = new WebSocket('ws://127.0.0.1:8000/ws/chat/CHAT_ID/?token=YOUR_TOKEN');

ws.onopen = () => console.log('Conectado!');
ws.onmessage = (e) => console.log('Mensaje:', JSON.parse(e.data));

// Enviar typing_start
ws.send(JSON.stringify({ type: 'typing_start' }));

// Enviar typing_stop
ws.send(JSON.stringify({ type: 'typing_stop' }));
```

---

## 📊 Eventos Soportados

### Cliente → Servidor:

#### 1. Typing Start
```json
{
  "type": "typing_start"
}
```

#### 2. Typing Stop
```json
{
  "type": "typing_stop"
}
```

#### 3. New Message
```json
{
  "type": "new_message",
  "message": {
    "id": "123",
    "content": "Hola!",
    "sender": { ... },
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

### Servidor → Cliente:

#### 1. Typing Start
```json
{
  "type": "typing_start",
  "user_id": "456",
  "username": "Juan Pérez"
}
```

#### 2. Typing Stop
```json
{
  "type": "typing_stop",
  "user_id": "456"
}
```

#### 3. New Message
```json
{
  "type": "new_message",
  "message": { ...messageData }
}
```

---

## 🐛 Debugging

### Ver logs de Channels:
```python
# En settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'channels': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

### Verificar Redis:
```bash
redis-cli ping
# Debe responder: PONG
```

---

## ✅ Checklist de Implementación

- [ ] Instalar channels, channels-redis, daphne
- [ ] Configurar CHANNEL_LAYERS en settings.py
- [ ] Crear consumers.py
- [ ] Crear routing.py
- [ ] Crear middleware.py
- [ ] Actualizar asgi.py
- [ ] Instalar y ejecutar Redis
- [ ] Probar conexión WebSocket
- [ ] Verificar eventos typing
- [ ] Verificar broadcast de mensajes

---

## 🎉 Resultado Esperado

Una vez implementado:
1. ✅ Frontend se conecta al WebSocket
2. ✅ Indicador "● Conectado" aparece en verde
3. ✅ Al escribir, otros usuarios ven "está escribiendo..."
4. ✅ Mensajes llegan instantáneamente
5. ✅ Reconexión automática funciona

---

## 📞 Ayuda Adicional

Si encuentras errores:
1. Verifica que Redis esté corriendo
2. Revisa los logs de Django
3. Verifica la autenticación del token
4. Comprueba que el usuario sea miembro del chat

¡Éxito con la implementación! 🚀

# 🚀 Implementación Completa de WebSocket para Chat en Tiempo Real

## ✅ Estado de la Implementación

### Backend (COMPLETADO)
- ✅ Consumer de WebSocket (`ChatConsumer`)
- ✅ Routing de WebSocket
- ✅ Middleware de autenticación por JWT
- ✅ Modelos de base de datos
- ✅ Configuración ASGI
- ✅ Configuración de Channel Layers

### Frontend (COMPLETADO)
- ✅ Hook personalizado `useChatWebSocket`
- ✅ Componente `TypingIndicator`
- ✅ Integración en `ChatWindow`
- ✅ Manejo de reconexión automática
- ✅ Indicador de estado de conexión

---

## 📋 Características Implementadas

### 1. Mensajería en Tiempo Real
- ✅ Envío y recepción instantánea de mensajes
- ✅ Soporte para diferentes tipos de mensajes (texto, imagen, video, audio)
- ✅ Respuestas a mensajes
- ✅ Edición de mensajes
- ✅ Eliminación de mensajes

### 2. Indicador de "Está Escribiendo"
- ✅ Detección automática cuando el usuario escribe
- ✅ Timeout de 3 segundos de inactividad
- ✅ Animación de 3 puntos pulsantes
- ✅ Muestra nombre del usuario que está escribiendo

### 3. Estado de Usuarios
- ✅ Notificación de conexión/desconexión
- ✅ Indicador visual de estado (online/offline)

### 4. Lectura de Mensajes
- ✅ Marcado de mensajes como leídos
- ✅ Notificación de lectura a otros usuarios

### 5. Reacciones a Mensajes
- ✅ Sistema de reacciones tipo Facebook
- ✅ Toggle de reacciones (agregar/quitar)

### 6. Reconexión Automática
- ✅ Backoff exponencial (1s, 2s, 4s, 8s, 16s)
- ✅ Máximo 5 intentos de reconexión
- ✅ Reconexión automática al perder conexión

---

## 🔧 Configuración del Backend

### 1. Dependencias Instaladas
```txt
channels==4.0.0
channels-redis==4.1.0
daphne==4.0.0
redis==5.0.1
```

### 2. Configuración en `settings.py`

#### INSTALLED_APPS
```python
INSTALLED_APPS = [
    # ...
    'channels',  # WebSocket support
    # ...
]
```

#### ASGI Application
```python
ASGI_APPLICATION = 'sos_habilidoso.asgi.application'
```

#### Channel Layers (Redis)
```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

**Nota:** Si Redis no está disponible, puedes usar `InMemoryChannelLayer` para desarrollo:
```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}
```

### 3. Configuración ASGI (`asgi.py`)
```python
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from apps.posts.middleware import TokenAuthMiddlewareStack
from apps.messaging.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
```

### 4. Routing de WebSocket (`apps/messaging/routing.py`)
```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<chat_room_id>[0-9a-f-]+)/$', consumers.ChatConsumer.as_asgi()),
]
```

---

## 🎨 Configuración del Frontend

### 1. Hook `useChatWebSocket`

**Ubicación:** `hooks/use-chat-websocket.ts`

**Uso:**
```typescript
const {
  isConnected,
  sendTypingStart,
  sendTypingStop,
  sendMessage,
} = useChatWebSocket({
  chatId: 'uuid-del-chat',
  userId: 'uuid-del-usuario',
  onNewMessage: (message) => {
    // Manejar nuevo mensaje
  },
  onTypingStart: (userId, username) => {
    // Usuario empezó a escribir
  },
  onTypingStop: (userId) => {
    // Usuario dejó de escribir
  },
});
```

### 2. Componente `TypingIndicator`

**Ubicación:** `components/messaging/typing-indicator.tsx`

**Uso:**
```tsx
<TypingIndicator username="Juan" />
```

### 3. Integración en `ChatWindow`

```tsx
// Estado para usuarios escribiendo
const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());

// Hook de WebSocket
const { isConnected, sendTypingStart, sendTypingStop, sendMessage } = useChatWebSocket({
  chatId: selectedChat.id,
  userId: currentUser.id,
  onNewMessage: handleNewMessage,
  onTypingStart: (userId, username) => {
    setTypingUsers(prev => new Map(prev).set(userId, username));
  },
  onTypingStop: (userId) => {
    setTypingUsers(prev => {
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  },
});

// Detectar escritura
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNewMessage(e.target.value);
  sendTypingStart();
};

// Mostrar indicadores
{Array.from(typingUsers.values()).map(username => (
  <TypingIndicator key={username} username={username} />
))}
```

---

## 🚀 Cómo Iniciar el Servidor

### Opción 1: Con Daphne (Recomendado para WebSockets)
```bash
cd backend
daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

### Opción 2: Con el script batch
```bash
cd backend
start_server_websocket.bat
```

### Opción 3: Con Django runserver (solo desarrollo)
```bash
cd backend
python manage.py runserver
```

---

## 🧪 Pruebas

### 1. Verificar Redis
```bash
cd backend
python test_redis_connection.py
```

**Salida esperada:**
```
✅ Módulo redis instalado correctamente
✅ Redis está corriendo y responde correctamente
✅ Redis puede almacenar y recuperar datos
✅ Módulo channels-redis instalado correctamente
✅ TODO LISTO - Redis está configurado correctamente
```

### 2. Probar WebSocket
```bash
cd backend
python test_websocket_complete.py
```

**Necesitarás:**
- Un token JWT válido (obtenerlo desde el login)
- Un ID de chat room (UUID)

### 3. Probar desde el Frontend
1. Iniciar el backend: `cd backend && daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application`
2. Iniciar el frontend: `npm run dev` (puerto 4000)
3. Ir a `http://localhost:4000/messages`
4. Seleccionar un chat
5. Empezar a escribir → Debería aparecer el indicador de "está escribiendo"
6. Enviar mensaje → Debería aparecer instantáneamente

---

## 🔌 Protocolo de Comunicación WebSocket

### URL de Conexión
```
ws://127.0.0.1:8000/ws/chat/{chat_room_id}/?token={jwt_token}
```

### Mensajes del Cliente → Servidor

#### 1. Enviar Mensaje
```json
{
  "type": "chat_message",
  "content": "Hola!",
  "message_type": "text",
  "reply_to": "uuid-opcional"
}
```

#### 2. Indicador de Escritura
```json
{
  "type": "typing",
  "is_typing": true
}
```

#### 3. Marcar Mensaje como Leído
```json
{
  "type": "read_message",
  "message_id": "uuid-del-mensaje"
}
```

#### 4. Reaccionar a Mensaje
```json
{
  "type": "react_message",
  "message_id": "uuid-del-mensaje",
  "reaction_type": "like"
}
```

#### 5. Editar Mensaje
```json
{
  "type": "edit_message",
  "message_id": "uuid-del-mensaje",
  "content": "Nuevo contenido"
}
```

#### 6. Eliminar Mensaje
```json
{
  "type": "delete_message",
  "message_id": "uuid-del-mensaje"
}
```

### Mensajes del Servidor → Cliente

#### 1. Nuevo Mensaje
```json
{
  "type": "chat_message",
  "message": {
    "id": "uuid",
    "content": "Hola!",
    "sender": {
      "id": "uuid",
      "username": "juan",
      "display_name": "Juan Pérez"
    },
    "created_at": "2026-02-01T10:30:00Z"
  }
}
```

#### 2. Estado de Escritura
```json
{
  "type": "typing_status",
  "user_id": "uuid",
  "username": "juan",
  "is_typing": true
}
```

#### 3. Estado de Usuario
```json
{
  "type": "user_status",
  "user_id": "uuid",
  "username": "juan",
  "status": "online"
}
```

#### 4. Mensaje Leído
```json
{
  "type": "message_read",
  "message_id": "uuid",
  "user_id": "uuid",
  "username": "juan"
}
```

#### 5. Reacción a Mensaje
```json
{
  "type": "message_reaction",
  "message_id": "uuid",
  "user_id": "uuid",
  "username": "juan",
  "reaction_type": "like",
  "added": true
}
```

#### 6. Mensaje Editado
```json
{
  "type": "message_edited",
  "message": { /* mensaje completo */ }
}
```

#### 7. Mensaje Eliminado
```json
{
  "type": "message_deleted",
  "message_id": "uuid",
  "user_id": "uuid"
}
```

#### 8. Error
```json
{
  "type": "error",
  "message": "Descripción del error"
}
```

---

## 🐛 Solución de Problemas

### Problema: "No se puede conectar al WebSocket"

**Solución:**
1. Verificar que el servidor esté corriendo con Daphne
2. Verificar que el token JWT sea válido
3. Verificar que el usuario sea participante del chat
4. Revisar la consola del navegador para errores

### Problema: "Redis connection refused"

**Solución:**
1. Instalar Redis:
   - Windows: Descargar desde https://github.com/microsoftarchive/redis/releases
   - WSL: `sudo apt-get install redis-server`
2. Iniciar Redis:
   - Windows: `redis-server.exe`
   - WSL: `sudo service redis-server start`
3. O usar `InMemoryChannelLayer` en `settings.py`

### Problema: "El indicador de 'está escribiendo' no aparece"

**Solución:**
1. Verificar que el WebSocket esté conectado (`isConnected === true`)
2. Verificar que `sendTypingStart()` se llame en el `onChange` del input
3. Revisar la consola del navegador para errores
4. Verificar que el backend esté enviando eventos `typing_status`

### Problema: "Los mensajes no llegan instantáneamente"

**Solución:**
1. Verificar que el WebSocket esté conectado
2. Verificar que `sendMessage()` se llame correctamente
3. Revisar la consola del backend para errores
4. Verificar que Redis esté funcionando (si se usa)

---

## 📊 Arquitectura del Sistema

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
│                 │
│  ChatWindow     │
│  ↓              │
│  useChatWebSocket│
└────────┬────────┘
         │ WebSocket
         │ ws://127.0.0.1:8000/ws/chat/{id}/?token={jwt}
         ↓
┌─────────────────┐
│   Backend       │
│   (Django)      │
│                 │
│  ASGI Server    │
│  (Daphne)       │
│  ↓              │
│  ChatConsumer   │
│  ↓              │
│  Channel Layer  │
│  (Redis)        │
│  ↓              │
│  Database       │
│  (MySQL)        │
└─────────────────┘
```

---

## 🎯 Próximos Pasos (Opcional)

### Mejoras Futuras
- [ ] Notificaciones push para mensajes
- [ ] Soporte para llamadas de voz/video
- [ ] Compartir ubicación en tiempo real
- [ ] Mensajes temporales (tipo Snapchat)
- [ ] Encriptación end-to-end
- [ ] Búsqueda de mensajes
- [ ] Exportar conversaciones
- [ ] Mensajes programados
- [ ] Bots de chat
- [ ] Integración con IA

---

## 📝 Notas Importantes

1. **Autenticación:** El WebSocket usa JWT tokens en la query string
2. **Seguridad:** En producción, usar `wss://` (WebSocket Secure)
3. **Escalabilidad:** Redis es necesario para múltiples workers
4. **Performance:** Daphne es más eficiente que runserver para WebSockets
5. **Debugging:** Revisar logs del backend y consola del navegador

---

## 📚 Recursos

- [Documentación de Django Channels](https://channels.readthedocs.io/)
- [Documentación de Redis](https://redis.io/documentation)
- [Documentación de Daphne](https://github.com/django/daphne)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

## ✅ Checklist de Implementación

### Backend
- [x] Instalar dependencias (channels, channels-redis, daphne, redis)
- [x] Configurar INSTALLED_APPS
- [x] Configurar ASGI_APPLICATION
- [x] Configurar CHANNEL_LAYERS
- [x] Crear Consumer (ChatConsumer)
- [x] Crear Routing (websocket_urlpatterns)
- [x] Crear Middleware de autenticación
- [x] Actualizar asgi.py
- [x] Instalar y configurar Redis

### Frontend
- [x] Crear hook useChatWebSocket
- [x] Crear componente TypingIndicator
- [x] Integrar en ChatWindow
- [x] Manejar reconexión automática
- [x] Agregar indicador de conexión
- [x] Manejar eventos de escritura
- [x] Manejar nuevos mensajes

### Pruebas
- [ ] Probar conexión a Redis
- [ ] Probar WebSocket desde Python
- [ ] Probar desde el frontend
- [ ] Probar con múltiples usuarios
- [ ] Probar reconexión automática
- [ ] Probar indicador de escritura
- [ ] Probar envío de mensajes

---

**Fecha de implementación:** 1 de febrero de 2026
**Versión:** 1.0.0
**Estado:** ✅ COMPLETADO

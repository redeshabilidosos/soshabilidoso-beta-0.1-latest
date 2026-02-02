# 🔌 WebSocket Backend - SOS-HABILIDOSO

## 📦 Instalación Rápida

```bash
# Instalar todas las dependencias de WebSocket
instalar_dependencias_websocket.bat
```

---

## 🚀 Iniciar Servidor

### Opción 1: Con Daphne (Recomendado para WebSockets)
```bash
start_server_websocket.bat
```

O manualmente:
```bash
daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

### Opción 2: Con Django runserver (Solo desarrollo)
```bash
python manage.py runserver
```

---

## 🧪 Pruebas

### Verificar Redis
```bash
python test_redis_connection.py
```

### Probar WebSocket
```bash
python test_websocket_complete.py
```

---

## 📁 Archivos Importantes

### Configuración
- `sos_habilidoso/settings.py` - Configuración de Channels y Redis
- `sos_habilidoso/asgi.py` - Configuración ASGI para WebSocket

### WebSocket
- `apps/messaging/consumers.py` - Consumer principal del chat
- `apps/messaging/routing.py` - Rutas de WebSocket
- `apps/posts/middleware.py` - Middleware de autenticación JWT

### Scripts de Utilidad
- `instalar_dependencias_websocket.bat` - Instalar dependencias
- `start_server_websocket.bat` - Iniciar servidor con Daphne
- `test_redis_connection.py` - Verificar Redis
- `test_websocket_complete.py` - Probar WebSocket
- `install_redis_windows.bat` - Instalar Redis

---

## 🔧 Dependencias

```txt
channels==4.0.0
channels-redis==4.1.0
daphne==4.0.0
redis==5.0.1
websockets
```

---

## 🌐 Endpoints WebSocket

### Chat en Tiempo Real
```
ws://127.0.0.1:8000/ws/chat/{chat_room_id}/?token={jwt_token}
```

**Parámetros:**
- `chat_room_id` - UUID del chat room
- `token` - JWT access token del usuario

---

## 📊 Eventos Soportados

### Cliente → Servidor

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

### Servidor → Cliente

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

---

## 🔐 Autenticación

El WebSocket usa JWT tokens para autenticación:

1. El cliente obtiene un token JWT al hacer login
2. El token se envía en la query string: `?token={jwt_token}`
3. El middleware `TokenAuthMiddleware` valida el token
4. Si es válido, el usuario se autentica
5. Si no es válido, la conexión se cierra

---

## 🗄️ Channel Layers

### Con Redis (Producción)
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

### Sin Redis (Desarrollo)
```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}
```

---

## 🐛 Debugging

### Ver logs de Channels
Agrega en `settings.py`:
```python
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

### Verificar Redis
```bash
redis-cli ping
# Debe responder: PONG
```

### Probar conexión desde Python
```python
import redis
r = redis.Redis(host='127.0.0.1', port=6379, db=0)
r.ping()  # Debe retornar True
```

---

## 📈 Arquitectura

```
Cliente (WebSocket)
    ↓
Daphne (ASGI Server)
    ↓
TokenAuthMiddleware (JWT)
    ↓
ChatConsumer
    ↓
Channel Layer (Redis)
    ↓
Database (MySQL)
```

---

## 🔄 Flujo de Mensajes

1. **Cliente envía mensaje:**
   - Cliente → WebSocket → ChatConsumer
   - ChatConsumer guarda en DB
   - ChatConsumer → Channel Layer → Broadcast a todos los participantes

2. **Cliente recibe mensaje:**
   - Channel Layer → ChatConsumer
   - ChatConsumer → WebSocket → Cliente

---

## 🚨 Solución de Problemas

### "ModuleNotFoundError: No module named 'channels'"
```bash
instalar_dependencias_websocket.bat
```

### "Redis connection refused"
```bash
# Opción 1: Instalar Redis
install_redis_windows.bat

# Opción 2: Usar InMemoryChannelLayer
# (Ya configurado como fallback en settings.py)
```

### "WebSocket connection failed"
1. Verificar que el servidor esté corriendo
2. Verificar que el token JWT sea válido
3. Verificar que el usuario sea participante del chat

---

## 📚 Documentación Adicional

- **`../WEBSOCKET_IMPLEMENTACION_COMPLETA.md`** - Documentación completa
- **`../RESUMEN_WEBSOCKET_COMPLETADO.md`** - Resumen de implementación
- **`../BACKEND_WEBSOCKET_GUIA.md`** - Guía detallada del backend
- **`../INSTRUCCIONES_WEBSOCKET_INICIO.md`** - Instrucciones de inicio

---

## ✅ Checklist

- [ ] Instalar dependencias: `instalar_dependencias_websocket.bat`
- [ ] Verificar Redis: `python test_redis_connection.py`
- [ ] Iniciar servidor: `start_server_websocket.bat`
- [ ] Probar WebSocket: `python test_websocket_complete.py`
- [ ] Verificar en navegador: `http://localhost:4000/messages`

---

**¡Backend WebSocket listo para usar! 🚀**

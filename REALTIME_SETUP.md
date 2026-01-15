# 🚀 Configuración de Actualizaciones en Tiempo Real

Este documento explica cómo configurar y probar las actualizaciones en tiempo real del feed usando WebSockets.

## 📋 Características Implementadas

### ✅ Backend (Django Channels)
- **WebSocket Consumers**: Para feed general y posts específicos
- **Signals**: Actualizaciones automáticas cuando se crean/modifican posts
- **Autenticación JWT**: Middleware personalizado para WebSockets
- **Grupos dinámicos**: Cada usuario tiene su propio canal de feed

### ✅ Frontend (Next.js)
- **Hooks personalizados**: `useFeedWebSocket` y `usePostWebSocket`
- **Reconexión automática**: Manejo inteligente de desconexiones
- **Notificaciones**: Toast notifications para nuevos posts
- **Indicador visual**: Estado de conexión en tiempo real

## 🔧 Configuración

### 1. Backend (Django)

#### Instalar dependencias
```bash
cd backend
pip install channels channels-redis
```

#### Configurar Redis (opcional, para producción)
```bash
# Instalar Redis
sudo apt-get install redis-server  # Ubuntu/Debian
brew install redis                 # macOS

# Iniciar Redis
redis-server
```

#### Configurar settings.py
```python
# En backend/sos_habilidoso/settings/base.py
INSTALLED_APPS = [
    # ... otras apps
    'channels',
]

# Configuración de Channels
ASGI_APPLICATION = 'sos_habilidoso.asgi.application'

# Para desarrollo (en memoria)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

# Para producción (Redis)
# CHANNEL_LAYERS = {
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             "hosts": [('127.0.0.1', 6379)],
#         },
#     },
# }
```

#### Ejecutar migraciones
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 2. Frontend (Next.js)

#### Variables de entorno
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=localhost:8000
```

## 🧪 Pruebas

### 1. Prueba Básica con Script Python
```bash
cd backend
python ../test-realtime-posts.py
```

### 2. Prueba Manual con HTML
1. Abre `test-websocket.html` en tu navegador
2. Obtén un JWT token desde la aplicación web (DevTools > Application > Local Storage)
3. Pega el token y conecta
4. Crea posts desde la aplicación web
5. Observa las actualizaciones en tiempo real

### 3. Prueba Completa en la Aplicación
1. Inicia el backend: `cd backend && python manage.py runserver`
2. Inicia el frontend: `npm run dev`
3. Abre dos ventanas del navegador con usuarios diferentes
4. Crea posts en una ventana
5. Observa las actualizaciones automáticas en la otra

## 📡 Endpoints WebSocket

### Feed General
```
ws://localhost:8000/ws/feed/?token=<JWT_TOKEN>
```
- Recibe nuevos posts de usuarios seguidos
- Actualizaciones de reacciones
- Eliminaciones de posts

### Post Específico
```
ws://localhost:8000/ws/post/<POST_ID>/?token=<JWT_TOKEN>
```
- Nuevos comentarios
- Actualizaciones de reacciones
- Likes en comentarios

## 🔄 Tipos de Mensajes WebSocket

### Mensajes del Feed
```json
{
  "type": "new_post",
  "post": { /* datos del post */ }
}

{
  "type": "post_updated", 
  "post": { /* datos actualizados */ }
}

{
  "type": "post_deleted",
  "post_id": "uuid-del-post"
}

{
  "type": "post_reaction",
  "post_id": "uuid-del-post",
  "reaction_data": { /* contadores actualizados */ }
}
```

### Mensajes de Control
```json
{
  "type": "ping",
  "timestamp": 1234567890
}

{
  "type": "pong", 
  "timestamp": 1234567890
}

{
  "type": "connection_established",
  "message": "Conectado al feed en tiempo real"
}
```

## 🐛 Troubleshooting

### Error: "WebSocket connection failed"
- Verifica que el backend esté ejecutándose
- Confirma que el token JWT sea válido
- Revisa la consola del navegador para errores

### Error: "Token authentication failed"
- El token puede haber expirado
- Verifica que el middleware esté configurado correctamente
- Asegúrate de pasar el token en la query string

### Posts no aparecen en tiempo real
- Verifica que los signals estén registrados en `apps.py`
- Confirma que el usuario esté siguiendo al autor del post
- Revisa los logs del servidor para errores

### Reconexión constante
- Puede ser un problema de red
- Verifica la configuración de CORS
- Revisa los logs del WebSocket consumer

## 📈 Optimizaciones para Producción

### 1. Redis como Channel Layer
```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis-server', 6379)],
        },
    },
}
```

### 2. Configuración de Nginx
```nginx
location /ws/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 3. Variables de Entorno de Producción
```bash
NEXT_PUBLIC_WS_URL=wss://tu-dominio.com
REDIS_URL=redis://redis-server:6379/0
```

## 🎯 Próximas Mejoras

- [ ] Notificaciones push del navegador
- [ ] Indicadores de "usuario escribiendo"
- [ ] Sincronización offline/online
- [ ] Compresión de mensajes WebSocket
- [ ] Métricas de conexiones activas
- [ ] Rate limiting para WebSockets

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del servidor Django
2. Verifica la consola del navegador
3. Usa `test-websocket.html` para debugging
4. Ejecuta `test-realtime-posts.py` para verificar el backend
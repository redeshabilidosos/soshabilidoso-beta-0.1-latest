# ⚡ COMANDOS RÁPIDOS: WEBSOCKET CON DAPHNE

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```bash
.\iniciar-daphne.bat
```

### Opción 2: Manual
```bash
cd backend
daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

---

## 🔍 Verificación

### Verificar configuración completa
```bash
python backend/verificar_websocket_completo.py
```

### Verificar Daphne instalado
```bash
pip show daphne
```

### Instalar Daphne (si no está)
```bash
pip install daphne
```

---

## 🧪 Testing

### Test de conexión WebSocket (desde navegador)
```javascript
// Abrir consola del navegador (F12)
const token = localStorage.getItem('access_token');
const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/CHAT_ID/?token=${token}`);

ws.onopen = () => console.log('✅ Conectado');
ws.onmessage = (e) => console.log('📨 Mensaje:', JSON.parse(e.data));
ws.onerror = (e) => console.error('❌ Error:', e);
ws.onclose = () => console.log('🔌 Desconectado');

// Enviar mensaje de prueba
ws.send(JSON.stringify({
  type: 'chat_message',
  content: 'Hola desde WebSocket!'
}));
```

### Test de notificaciones
```javascript
const token = localStorage.getItem('access_token');
const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`);

ws.onopen = () => console.log('✅ Conectado a notificaciones');
ws.onmessage = (e) => console.log('🔔 Notificación:', JSON.parse(e.data));
```

---

## 📊 Monitoreo

### Ver logs de Daphne
```bash
# Los logs aparecen en la terminal donde ejecutaste Daphne
# Busca líneas como:
# [INFO] WebSocket CONNECT /ws/chat/...
# [INFO] WebSocket DISCONNECT /ws/chat/...
```

### Ver conexiones activas (DevTools)
1. Presiona F12
2. Ve a Network → WS
3. Verás todas las conexiones WebSocket activas

---

## 🐛 Troubleshooting

### Problema: "Module not found: daphne"
```bash
pip install daphne
```

### Problema: "Port 8000 already in use"
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# O usa otro puerto
daphne -b 0.0.0.0 -p 8001 sos_habilidoso.asgi:application
```

### Problema: WebSocket no conecta
```bash
# 1. Verifica que Daphne esté corriendo (no runserver)
# 2. Verifica el token JWT
# 3. Revisa la consola del navegador
# 4. Verifica ALLOWED_HOSTS en settings.py
```

### Problema: "Channel layer not configured"
```bash
# Verifica que en settings.py esté:
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}
```

---

## 🔧 Configuración

### Ver configuración actual
```bash
python backend/verificar_websocket_completo.py
```

### Cambiar a Redis (producción)
```bash
# 1. Instalar Redis
pip install channels-redis

# 2. Actualizar settings.py
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# 3. Iniciar Redis
redis-server
```

---

## 📝 URLs Importantes

### Backend
- HTTP API: `http://127.0.0.1:8000/api/`
- Admin: `http://127.0.0.1:8000/admin/`
- WebSocket Chat: `ws://127.0.0.1:8000/ws/chat/<chat_id>/?token=<token>`
- WebSocket Notifications: `ws://127.0.0.1:8000/ws/notifications/?token=<token>`

### Frontend
- App: `http://localhost:3000`
- Chat: `http://localhost:3000/messages`

---

## 🎯 Comandos de Desarrollo

### Iniciar todo el sistema
```bash
# Terminal 1: Backend con Daphne
.\iniciar-daphne.bat

# Terminal 2: Frontend
npm run dev
```

### Reiniciar solo backend
```bash
# Ctrl+C en la terminal de Daphne
# Luego:
.\iniciar-daphne.bat
```

### Ver logs en tiempo real
```bash
# Los logs aparecen automáticamente en la terminal de Daphne
# Para más detalle, agrega en settings.py:
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'daphne': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

---

## 🔐 Obtener Token JWT

### Desde el navegador (consola)
```javascript
// Ver token actual
console.log(localStorage.getItem('access_token'));

// Copiar token
copy(localStorage.getItem('access_token'));
```

### Desde API
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"usuario1","password":"password123"}'
```

---

## 📦 Dependencias

### Verificar instaladas
```bash
pip list | findstr "daphne channels"
```

### Instalar todas
```bash
pip install daphne channels channels-redis
```

### Versiones recomendadas
```
daphne==4.0.0
channels==4.0.0
channels-redis==4.1.0  # Opcional, solo para producción
```

---

## 🎨 Personalización

### Cambiar puerto de Daphne
```bash
daphne -b 0.0.0.0 -p 8001 sos_habilidoso.asgi:application
```

### Habilitar logs detallados
```bash
daphne -v 2 -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

### Usar con SSL (producción)
```bash
daphne -e ssl:443:privateKey=key.pem:certKey=cert.pem sos_habilidoso.asgi:application
```

---

## 📚 Documentación

| Comando | Descripción |
|---------|-------------|
| `.\iniciar-daphne.bat` | Inicia Daphne con verificación |
| `python backend/verificar_websocket_completo.py` | Verifica configuración |
| Ver `VERIFICACION_WEBSOCKET_TIEMPO_REAL.md` | Documentación técnica |
| Ver `PRUEBA_CHAT_TIEMPO_REAL.md` | Guía de pruebas |
| Ver `RESUMEN_WEBSOCKET_DAPHNE.md` | Resumen ejecutivo |

---

## ⚡ Atajos de Teclado

### En la terminal de Daphne
- `Ctrl+C` - Detener servidor
- `Ctrl+Z` - Pausar (no recomendado)

### En DevTools (F12)
- `Ctrl+Shift+I` - Abrir DevTools
- `Ctrl+Shift+C` - Inspeccionar elemento
- `Ctrl+R` - Recargar página
- `Ctrl+Shift+R` - Recargar sin caché

---

## 🎯 Checklist Rápido

Antes de empezar a desarrollar:

- [ ] Daphne instalado
- [ ] Backend corriendo con Daphne (no runserver)
- [ ] Frontend corriendo
- [ ] MySQL corriendo
- [ ] Token JWT válido
- [ ] WebSocket conectado (ver "● Conectado")

---

**Última actualización:** 6 de Febrero de 2026

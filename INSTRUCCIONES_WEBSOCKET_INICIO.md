# 🚀 Instrucciones de Inicio - Chat en Tiempo Real

## ⚡ Inicio Rápido (3 Pasos)

### 1️⃣ Instalar Dependencias del Backend
```bash
cd backend
instalar_dependencias_websocket.bat
```

**Nota:** No necesitas instalar Redis. El sistema funciona perfectamente sin él.

### 2️⃣ Iniciar el Sistema Completo
```bash
# Volver a la raíz del proyecto
cd ..
iniciar-chat-tiempo-real.bat
```

### 3️⃣ Probar el Chat
1. El navegador se abrirá automáticamente en `http://localhost:4000/messages`
2. Inicia sesión si no lo has hecho
3. Selecciona un chat
4. ¡Empieza a escribir y verás el indicador "está escribiendo"!

---

## 📋 Requisitos Previos

### Obligatorios
- ✅ Python 3.8+ instalado
- ✅ Node.js 16+ instalado
- ✅ Backend de Django configurado
- ✅ Frontend de Next.js configurado

### Opcionales (pero recomendados)
- ⚠️ Redis instalado (para producción con múltiples servidores)
  - **NO es necesario para desarrollo local**
  - El sistema funciona perfectamente con `InMemoryChannelLayer`
  - Para instalar Redis (opcional): `cd backend && install_redis_windows.bat`

---

## 🔧 Instalación Detallada

### Paso 1: Instalar Dependencias de Python

#### Opción A: Con el script (Recomendado)
```bash
cd backend
instalar_dependencias_websocket.bat
```

#### Opción B: Manual
```bash
cd backend
pip install channels==4.0.0
pip install channels-redis==4.1.0
pip install daphne==4.0.0
pip install redis==5.0.1
pip install websockets
```

### Paso 2: Verificar Redis (Opcional)

#### Si quieres usar Redis:
```bash
cd backend
python test_redis_connection.py
```

**Si Redis no está instalado:**
```bash
install_redis_windows.bat
```

**Si no quieres instalar Redis:**
El sistema funcionará con `InMemoryChannelLayer` (ya configurado como fallback).

### Paso 3: Iniciar el Sistema

#### Opción A: Script de inicio rápido (Recomendado)
```bash
# Desde la raíz del proyecto
iniciar-chat-tiempo-real.bat
```

Este script:
- ✅ Verifica Redis
- ✅ Inicia el backend con Daphne
- ✅ Inicia el frontend con Next.js
- ✅ Abre el navegador automáticamente
- ✅ Muestra la documentación

#### Opción B: Inicio manual

**Terminal 1 - Backend:**
```bash
cd backend
daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Navegador:**
```
http://localhost:4000/messages
```

---

## 🧪 Verificación

### 1. Verificar que el backend está corriendo
Abre: `http://127.0.0.1:8000/admin/`

### 2. Verificar que el frontend está corriendo
Abre: `http://localhost:4000/`

### 3. Verificar WebSocket
1. Abre la consola del navegador (F12)
2. Ve a `/messages`
3. Selecciona un chat
4. Deberías ver en la consola:
   ```
   WebSocket connected
   ```

### 4. Probar el indicador de "está escribiendo"
1. Abre dos navegadores (o dos ventanas en incógnito)
2. Inicia sesión con dos usuarios diferentes
3. Abre el mismo chat en ambos navegadores
4. Empieza a escribir en uno
5. Deberías ver el indicador en el otro

---

## 🎯 Características Disponibles

### ✅ Implementadas y Funcionando
- Mensajes en tiempo real
- Indicador de "está escribiendo"
- Reconexión automática
- Estado de usuarios (online/offline)
- Reacciones a mensajes
- Edición de mensajes
- Eliminación de mensajes
- Lectura de mensajes

### 🔄 Eventos WebSocket

#### Cliente → Servidor
- `chat_message` - Enviar mensaje
- `typing` - Indicador de escritura
- `read_message` - Marcar como leído
- `react_message` - Reaccionar a mensaje
- `edit_message` - Editar mensaje
- `delete_message` - Eliminar mensaje

#### Servidor → Cliente
- `chat_message` - Nuevo mensaje
- `typing_status` - Estado de escritura
- `user_status` - Estado de usuario
- `message_read` - Mensaje leído
- `message_reaction` - Reacción a mensaje
- `message_edited` - Mensaje editado
- `message_deleted` - Mensaje eliminado

---

## 🐛 Solución de Problemas

### Problema: "ModuleNotFoundError: No module named 'channels'"

**Solución:**
```bash
cd backend
instalar_dependencias_websocket.bat
```

### Problema: "Redis connection refused"

**Solución 1 - Instalar Redis:**
```bash
cd backend
install_redis_windows.bat
```

**Solución 2 - Usar InMemoryChannelLayer:**
Ya está configurado como fallback en `settings.py`. El sistema funcionará sin Redis.

### Problema: "WebSocket connection failed"

**Causas posibles:**
1. El backend no está corriendo
   - Solución: Iniciar con `daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application`

2. Token JWT inválido
   - Solución: Cerrar sesión y volver a iniciar sesión

3. Usuario no es participante del chat
   - Solución: Verificar que el usuario tenga acceso al chat

### Problema: "El indicador de 'está escribiendo' no aparece"

**Verificaciones:**
1. ¿El WebSocket está conectado?
   - Busca "● Conectado" en verde en el header del chat

2. ¿Hay otro usuario en el chat?
   - El indicador solo aparece para otros usuarios

3. ¿Estás escribiendo en el input correcto?
   - Debe ser el input principal del chat

### Problema: "Los mensajes no llegan instantáneamente"

**Verificaciones:**
1. ¿El WebSocket está conectado?
2. ¿El backend está corriendo con Daphne?
3. ¿Redis está funcionando? (si lo estás usando)

---

## 📊 Arquitectura

```
Frontend (React)
    ↓
WebSocket (ws://127.0.0.1:8000/ws/chat/{id}/?token={jwt})
    ↓
Backend (Django + Channels)
    ↓
Channel Layer (Redis o InMemory)
    ↓
Database (MySQL)
```

---

## 📚 Documentación Adicional

- **`WEBSOCKET_IMPLEMENTACION_COMPLETA.md`** - Documentación técnica completa
- **`RESUMEN_WEBSOCKET_COMPLETADO.md`** - Resumen de la implementación
- **`BACKEND_WEBSOCKET_GUIA.md`** - Guía del backend
- **`IMPLEMENTACION_CHAT_TIEMPO_REAL.md`** - Guía del frontend

---

## 🎉 ¡Listo para Usar!

Una vez completados los pasos anteriores, tu sistema de chat en tiempo real estará funcionando.

### Comandos Rápidos

**Iniciar todo:**
```bash
iniciar-chat-tiempo-real.bat
```

**Solo backend:**
```bash
cd backend
start_server_websocket.bat
```

**Solo frontend:**
```bash
npm run dev
```

**Verificar Redis:**
```bash
cd backend
python test_redis_connection.py
```

**Probar WebSocket:**
```bash
cd backend
python test_websocket_complete.py
```

---

## 💡 Consejos

1. **Desarrollo:** Usa `InMemoryChannelLayer` (ya configurado)
2. **Producción:** Instala Redis para mejor rendimiento
3. **Debugging:** Revisa la consola del navegador (F12)
4. **Logs:** Revisa la terminal del backend para errores

---

## 🆘 Ayuda

Si encuentras problemas:
1. Revisa la sección "Solución de Problemas" arriba
2. Verifica los logs del backend
3. Revisa la consola del navegador
4. Consulta la documentación completa

---

**¡Disfruta del chat en tiempo real! 🚀**

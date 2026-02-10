# ⚡ Inicio Rápido - WebSocket + Daphne

## 🚀 3 Pasos para Iniciar

### 1️⃣ Verificar (Opcional)
```bash
verificar-daphne.bat
```

### 2️⃣ Iniciar Todo
```bash
npm run soshabilidoso
```

### 3️⃣ Probar WebSocket
Abre en el navegador:
```
http://localhost:4000/test-websocket-notifications.html
```

## ✅ ¿Funciona?

Debes ver:
- 🟢 **Estado: Conectado**
- ✅ Backend corriendo en puerto 8000
- ✅ Daphne (ASGI) iniciado
- ✅ WebSocket endpoint disponible
- ✅ Token JWT válido
- ✅ Conexión WebSocket establecida

## 🎵 Probar Sonidos

Abre:
```
http://localhost:4000/test-notification-sound.html
```

Prueba los 4 botones:
- 🔔 Notificación
- 💬 Mensaje Recibido
- 📤 Mensaje Enviado (TAPM)
- 🚪 Salir de Reunión

## 🔧 Si algo falla

### Error: MySQLdb module
```bash
cd backend
pip install pymysql
```

### Error: WebSocket 404
```bash
# Detener proceso en puerto 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Reiniciar
npm run soshabilidoso
```

### Error: MySQL no disponible
```bash
# Verificar MySQL en puerto 3307
netstat -ano | findstr :3307

# Si no está corriendo, iniciar MariaDB
```

## 📱 Probar en la App

1. Abre: `http://localhost:4000`
2. Login: `admin@test.com` / `admin123`
3. Abre un chat
4. Envía un mensaje
5. Debe sonar "tapm.mp3" ✅

## 🎯 Accesos Rápidos

- **App:** http://localhost:4000
- **Admin:** http://127.0.0.1:8000/admin/
- **API:** http://127.0.0.1:8000/api/
- **Test WebSocket:** http://localhost:4000/test-websocket-notifications.html
- **Test Sonidos:** http://localhost:4000/test-notification-sound.html

## 📚 Más Info

- `DAPHNE_CONFIGURADO.md` - Documentación completa
- `GUIA_SEGURA_DAPHNE.md` - Troubleshooting
- `RESUMEN_FINAL_WEBSOCKET.md` - Resumen técnico

---

**¡Listo en 3 pasos!** 🎉

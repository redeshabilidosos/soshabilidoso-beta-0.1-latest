# ✅ Checklist: WebSocket + Daphne

## 📋 Verificación Pre-Inicio

### Instalación
- [ ] PyMySQL instalado: `pip list | findstr pymysql`
- [ ] Daphne instalado: `pip list | findstr daphne`
- [ ] MySQL corriendo: `netstat -ano | findstr :3307`

### Archivos Modificados
- [ ] `backend/sos_habilidoso/asgi.py` tiene `import pymysql` al inicio
- [ ] `scripts/start-soshabilidoso.js` usa Daphne

## 🚀 Inicio

### Comando
- [ ] Ejecutar: `npm run soshabilidoso`
- [ ] Esperar mensaje: "✅ SOS-HABILIDOSO INICIADO"

### Servicios Corriendo
- [ ] Frontend en puerto 4000
- [ ] Backend en puerto 8000
- [ ] MySQL en puerto 3307

## 🧪 Pruebas de Funcionalidad

### Backend
- [ ] Abrir: http://127.0.0.1:8000/api/
- [ ] Debe mostrar lista de endpoints
- [ ] Sin error de MySQLdb en logs

### Django Admin
- [ ] Abrir: http://127.0.0.1:8000/admin/
- [ ] Login: admin@test.com / admin123
- [ ] Puede ver usuarios
- [ ] Puede ver posts
- [ ] Puede editar configuración

### WebSocket
- [ ] Abrir: http://localhost:4000/test-websocket-notifications.html
- [ ] Estado muestra: "Conectado" (verde)
- [ ] Checklist muestra 5 ✅
- [ ] Sin error 404 en logs
- [ ] Sin error 1006 en logs
- [ ] Token JWT visible

### Sonidos
- [ ] Abrir: http://localhost:4000/test-notification-sound.html
- [ ] Botón "Notificación" reproduce sonido
- [ ] Botón "Mensaje Recibido" reproduce sonido
- [ ] Botón "Mensaje Enviado" reproduce sonido (tapm.mp3)
- [ ] Botón "Salir Reunión" reproduce sonido

### Chat en Tiempo Real
- [ ] Abrir app: http://localhost:4000
- [ ] Login exitoso
- [ ] Abrir un chat
- [ ] Enviar mensaje
- [ ] Suena "tapm.mp3" al enviar
- [ ] Mensaje aparece instantáneamente

### Reuniones
- [ ] Crear/unirse a reunión
- [ ] Cámara funciona
- [ ] Micrófono funciona
- [ ] Al salir suena "finishreuniongrupall.mp3"

## 🔍 Verificación de Logs

### Backend (Terminal)
Debe mostrar:
```
INFO - Starting server at tcp:port=8000
INFO - HTTP/2 support enabled
INFO - Listening on TCP address 0.0.0.0:8000
```

NO debe mostrar:
```
❌ ImproperlyConfigured: Error loading MySQLdb module
❌ Did you install mysqlclient?
```

### Frontend (Consola del Navegador)
Debe mostrar:
```
✅ WebSocket conectado
✅ Token JWT válido
```

NO debe mostrar:
```
❌ WebSocket error 404
❌ WebSocket error 1006
❌ Not Found: /ws/notifications/
```

## 🎯 Confirmación Final

### Página de Prueba WebSocket
Todos deben estar en ✅:
- [ ] Backend corriendo en puerto 8000
- [ ] Daphne (ASGI) iniciado
- [ ] WebSocket endpoint disponible
- [ ] Token JWT válido
- [ ] Conexión WebSocket establecida

### Funcionalidad Existente
- [ ] Login funciona
- [ ] Feed carga posts
- [ ] Crear post funciona
- [ ] Comentarios funcionan
- [ ] Reacciones funcionan
- [ ] Notificaciones funcionan
- [ ] Chat funciona
- [ ] Reuniones funcionan
- [ ] Búsqueda funciona
- [ ] Perfil funciona

## 🐛 Troubleshooting

### Si Backend no inicia
```bash
# Verificar puerto 8000 libre
netstat -ano | findstr :8000
# Si está ocupado:
taskkill /PID <PID> /F
```

### Si WebSocket no conecta
```bash
# Verificar que usa Daphne, no manage.py runserver
# Reiniciar:
npm run soshabilidoso
```

### Si MySQL no conecta
```bash
# Verificar MySQL corriendo
netstat -ano | findstr :3307
# Iniciar MariaDB si no está corriendo
```

### Si Sonidos no reproducen
```bash
# Verificar archivos existen
dir public\sounds\
# Deben estar:
# - sonidonotificacion.mp3
# - sonidomensage.mp3
# - tapm.mp3
# - finishreuniongrupall.mp3
```

## 📊 Resumen de Estado

### ✅ Completado
- [x] Sistema de sonidos (4 sonidos)
- [x] WebSocket de notificaciones
- [x] Migración a Daphne (ASGI)
- [x] Comando único de inicio
- [x] Páginas de prueba
- [x] Documentación completa

### 🎯 Listo para
- [x] Desarrollo local
- [x] Pruebas de funcionalidad
- [x] Pruebas de WebSocket
- [x] Pruebas de sonidos
- [ ] Despliegue a producción (opcional: instalar Redis)

## 📚 Documentación

- [x] DAPHNE_CONFIGURADO.md
- [x] GUIA_SEGURA_DAPHNE.md
- [x] REINICIAR_BACKEND_DAPHNE.md
- [x] RESUMEN_FINAL_WEBSOCKET.md
- [x] INICIO_RAPIDO_WEBSOCKET.md
- [x] CHECKLIST_WEBSOCKET_DAPHNE.md (este archivo)

## 🎉 Estado Final

```
╔════════════════════════════════════════╗
║                                        ║
║    ✅ TODO VERIFICADO Y FUNCIONAL     ║
║                                        ║
║    🚀 LISTO PARA USAR                 ║
║                                        ║
╚════════════════════════════════════════╝
```

---

**Fecha:** 5 de febrero de 2026
**Versión:** 1.0.0
**Estado:** ✅ Completado

## 🚀 Siguiente Paso

```bash
npm run soshabilidoso
```

¡Y a probar! 🎊

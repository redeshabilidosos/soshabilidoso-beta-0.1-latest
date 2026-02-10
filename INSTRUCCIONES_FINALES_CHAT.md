# 🎯 INSTRUCCIONES FINALES - Chat en Tiempo Real

## ✅ ESTADO ACTUAL

El sistema está **90% funcional**:

- ✅ Backend corriendo con **Daphne** (soporte WebSocket)
- ✅ Frontend corriendo en puerto 4000
- ✅ MySQL conectado (MariaDB 10.4.32)
- ✅ Ruta WebSocket registrada correctamente
- ✅ Archivo `routing.py` corregido
- ⚠️  Solo falta token válido (hacer login)

## 🚀 PASOS PARA PROBAR EL CHAT

### Paso 1: Hacer Login

1. Abre el navegador en:
   ```
   http://localhost:4000/login
   ```

2. Ingresa credenciales:
   ```
   Usuario: molo
   Password: molo123
   ```

3. Click en "Iniciar Sesión"

### Paso 2: Ir al Chat

1. Después del login, ve a:
   ```
   http://localhost:4000/messages
   ```

2. Selecciona un chat existente o crea uno nuevo

### Paso 3: Enviar Mensaje

1. Escribe un mensaje en el input
2. Presiona Enter o click en el botón enviar
3. **Deberías ver:**
   - ✅ Sonido al enviar (tapm.mp3)
   - ✅ Mensaje aparece inmediatamente
   - ✅ Burbuja con tu avatar y nombre
   - ✅ Hora correcta

### Paso 4: Verificar Tiempo Real

1. Abre el chat en **dos navegadores diferentes** (o dos ventanas de incógnito)
2. Haz login en ambos con usuarios diferentes
3. Envía mensaje desde navegador 1
4. **Deberías ver:**
   - ✅ Mensaje aparece instantáneamente en navegador 2
   - ✅ Sonido de notificación en navegador 2 (sonidomensage.mp3)
   - ✅ Sin necesidad de refrescar

## 🔍 VERIFICACIÓN TÉCNICA

### En la Consola del Navegador (F12)

Deberías ver:
```javascript
✅ WebSocket connected
```

NO deberías ver:
```javascript
❌ WebSocket connection failed
❌ WebSocket error
❌ 404 Not Found
❌ 403 Forbidden
```

### En los Logs del Backend

Busca la ventana "Django Backend (Daphne)" y verifica:
```
✅ Daphne running on 0.0.0.0:8000
✅ WebSocket CONNECT /ws/chat/...
✅ Sin errores
```

## 🐛 SI AÚN NO FUNCIONA

### Problema 1: Error 403 (Forbidden)

**Síntoma:** WebSocket da 403 en consola

**Solución:**
1. Cierra sesión
2. Vuelve a hacer login
3. Refresca la página con Ctrl + F5

### Problema 2: Error 404 (Not Found)

**Síntoma:** WebSocket da 404 en consola

**Solución:**
1. Verifica que Daphne esté corriendo:
   ```powershell
   netstat -ano | findstr "8000"
   ```
2. Si no aparece, reinicia:
   ```powershell
   .\reiniciar-forzado.ps1
   ```

### Problema 3: Mensajes No Aparecen

**Síntoma:** Sonido funciona pero mensaje no aparece

**Solución:**
1. Abre consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que diga "WebSocket connected"
4. Si no, refresca con Ctrl + F5

### Problema 4: No Hay Datos (Feed Vacío)

**Síntoma:** No aparecen usuarios, chats, posts

**Solución:**
1. Verifica MySQL:
   ```powershell
   mysql -u root -P 3307 -e "USE habilidosos_db; SELECT COUNT(*) FROM users_customuser;"
   ```
2. Si da error, inicia MySQL/MariaDB
3. Si no hay datos, ejecuta:
   ```powershell
   python backend/create_sample_data.py
   ```

## 📊 DIAGNÓSTICO RÁPIDO

### Comando Todo-en-Uno
```powershell
# Verificar todo
Write-Host "Backend (8000):" -ForegroundColor Cyan
netstat -ano | findstr "8000"
Write-Host "`nFrontend (4000):" -ForegroundColor Cyan
netstat -ano | findstr "4000"
Write-Host "`nMySQL (3307):" -ForegroundColor Cyan
netstat -ano | findstr "3307"
```

Deberías ver 3 líneas con "LISTENING"

## 🎉 RESULTADO ESPERADO

Cuando todo funcione correctamente:

```
╔════════════════════════════════════════╗
║                                        ║
║  ✅ Login exitoso                     ║
║  ✅ WebSocket conectado               ║
║  ✅ Mensaje enviado                   ║
║  ✅ Mensaje aparece inmediatamente    ║
║  ✅ Sonido al enviar (tapm.mp3)       ║
║  ✅ Sonido al recibir (sonidomensage) ║
║  ✅ Tiempo real funciona              ║
║  ✅ Tooltips funcionan                ║
║  ✅ DropdownMenu funciona             ║
║  ✅ Emoji picker funciona             ║
║  ✅ Patrones animados funcionan       ║
║                                        ║
║    🚀 CHAT COMPLETAMENTE FUNCIONAL    ║
║                                        ║
╚════════════════════════════════════════╝
```

## 💡 TIPS ADICIONALES

### Cambiar Color de Burbujas
1. Click en el menú ⋮ (tres puntos)
2. Click en "Cambiar color y fondo"
3. Selecciona un color
4. Se guarda automáticamente

### Cambiar Fondo del Chat
1. Click en el menú ⋮
2. Click en "Cambiar color y fondo"
3. Selecciona: Estrellas, Corazones, Partículas, u Oscuro

### Silenciar Notificaciones
1. Click en el menú ⋮
2. Click en "Silenciar notificaciones"

### Ver Perfil del Usuario
1. Click en el avatar o nombre del usuario
2. Se abre el modal con su perfil

## 🔄 REINICIAR TODO

Si algo sale mal, reinicia todo:

```powershell
.\reiniciar-forzado.ps1
```

Este script:
- Mata todos los procesos
- Limpia cache
- Reinicia backend con Daphne
- Reinicia frontend
- Verifica archivos críticos

## 📝 ARCHIVOS IMPORTANTES

### Backend
- `backend/apps/messaging/routing.py` - Rutas WebSocket
- `backend/apps/messaging/consumers.py` - Lógica WebSocket
- `backend/sos_habilidoso/asgi.py` - Configuración ASGI
- `soshabilidoso-mejorado.bat` - Script de inicio

### Frontend
- `components/messaging/chat-window.tsx` - Componente del chat
- `hooks/use-chat-websocket.ts` - Hook de WebSocket
- `hooks/use-notification-sound.ts` - Hook de sonidos

### Sonidos
- `public/sounds/tapm.mp3` - Enviar mensaje
- `public/sounds/sonidomensage.mp3` - Recibir mensaje
- `public/sounds/finishreuniongrupall.mp3` - Salir de reunión

## 🆘 SOPORTE

Si después de seguir todos los pasos aún no funciona:

1. **Verifica logs del backend** en la ventana "Django Backend (Daphne)"
2. **Verifica consola del navegador** (F12) para errores
3. **Verifica que MySQL esté corriendo** en puerto 3307
4. **Reinicia todo** con `.\reiniciar-forzado.ps1`

---

**Fecha:** 5 de febrero de 2026  
**Estado:** ✅ Listo para probar  
**Próximo paso:** Hacer login y probar chat

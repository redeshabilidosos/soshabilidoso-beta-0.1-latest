# 🛡️ Guía Segura: Migración a Daphne (ASGI)

## ✅ ¿Qué se modificó?

### 1. Archivo `backend/sos_habilidoso/asgi.py`
**Cambio:** Se agregó PyMySQL **ANTES** de inicializar Django

```python
# ANTES (causaba error)
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

# DESPUÉS (funciona correctamente)
import os
import pymysql
pymysql.install_as_MySQLdb()  # ← CRÍTICO: Antes de Django

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()
```

### 2. Archivo `scripts/start-soshabilidoso.js`
**Cambio:** Usa Daphne en lugar de `manage.py runserver`

```javascript
// ANTES
python manage.py runserver 0.0.0.0:8000

// DESPUÉS
python -m daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

## 🔒 ¿Qué NO se modificó? (Garantía de seguridad)

✅ **Django Admin** - Funciona exactamente igual
✅ **Base de datos MySQL** - Sin cambios en configuración
✅ **Modelos y migraciones** - Sin cambios
✅ **API REST** - Todos los endpoints funcionan igual
✅ **Autenticación JWT** - Sin cambios
✅ **Frontend Next.js** - Sin cambios
✅ **Archivos estáticos** - Sin cambios
✅ **Media files** - Sin cambios

## 🎯 ¿Qué se ganó?

### Antes (WSGI)
- ❌ Solo HTTP
- ❌ Sin WebSockets
- ❌ Chat requería polling
- ❌ Notificaciones requería polling
- ❌ Feed requería recargar

### Después (ASGI)
- ✅ HTTP + WebSockets
- ✅ Chat en tiempo real
- ✅ Notificaciones en tiempo real
- ✅ Feed en tiempo real
- ✅ Conexión persistente eficiente

## 🚀 Cómo Iniciar (Método Seguro)

### Paso 1: Verificar instalación
```bash
verificar-daphne.bat
```

Esto verifica:
- PyMySQL instalado
- Daphne instalado
- Configuración ASGI correcta
- MySQL corriendo

### Paso 2: Iniciar todo con un comando
```bash
npm run soshabilidoso
```

Esto inicia:
1. Backend con Daphne (puerto 8000)
2. Frontend Next.js (puerto 4000)
3. Verifica MySQL (puerto 3307)

### Paso 3: Verificar que funciona
Abre en el navegador:
```
http://localhost:4000/test-websocket-notifications.html
```

Deberías ver:
- ✅ Estado: Conectado
- ✅ Backend corriendo en puerto 8000
- ✅ Daphne (ASGI) iniciado
- ✅ WebSocket endpoint disponible
- ✅ Token JWT válido
- ✅ Conexión WebSocket establecida

## 🔍 Verificación de Django Admin

1. Abre: `http://127.0.0.1:8000/admin/`
2. Login con:
   - Usuario: `admin@test.com`
   - Password: `admin123`
3. Verifica que puedes:
   - Ver usuarios
   - Ver posts
   - Ver comunidades
   - Editar configuración del sitio
   - Todo funciona igual que antes

## 🧪 Pruebas de Funcionalidad

### Test 1: API REST
```bash
curl http://127.0.0.1:8000/api/
```
Debe responder con lista de endpoints

### Test 2: WebSocket de Notificaciones
Abre: `http://localhost:4000/test-websocket-notifications.html`
- Debe conectar automáticamente
- Estado debe ser "Conectado"
- Sin errores 404 en logs

### Test 3: Sonidos
Abre: `http://localhost:4000/test-notification-sound.html`
- Prueba cada botón de sonido
- Todos deben reproducir correctamente

### Test 4: Chat en tiempo real
1. Abre la app: `http://localhost:4000`
2. Login con usuario de prueba
3. Abre un chat
4. Envía un mensaje
5. Debe escucharse el sonido "tapm.mp3"
6. El mensaje debe aparecer instantáneamente

## ⚠️ Troubleshooting

### Problema: Error "ImproperlyConfigured: Error loading MySQLdb module"

**Causa:** PyMySQL no se cargó antes de Django

**Solución:**
```bash
# Verificar que asgi.py tiene el fix
cd backend
python -c "from sos_habilidoso.asgi import application; print('OK')"
```

Si falla, verifica que `backend/sos_habilidoso/asgi.py` tenga:
```python
import pymysql
pymysql.install_as_MySQLdb()
```
**ANTES** de `import django`

### Problema: WebSocket error 404

**Causa:** Backend corriendo con `manage.py runserver` en lugar de Daphne

**Solución:**
```bash
# Detener cualquier proceso en puerto 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Iniciar correctamente
npm run soshabilidoso
```

### Problema: WebSocket error 1006

**Causa:** Daphne no está corriendo o se cerró inesperadamente

**Solución:**
```bash
# Verificar logs del backend
# Buscar errores en la terminal donde corre npm run soshabilidoso

# Si hay error de MySQL, verificar que MariaDB esté corriendo
netstat -ano | findstr :3307
```

### Problema: Django Admin no carga

**Causa:** Archivos estáticos no recolectados

**Solución:**
```bash
cd backend
python manage.py collectstatic --noinput
```

## 📊 Comparación de Comandos

### ❌ NO USAR (Antiguo)
```bash
cd backend
python manage.py runserver 0.0.0.0:8000  # Solo HTTP, sin WebSockets
```

### ❌ NO USAR (Manual)
```bash
start_server.bat  # Usa manage.py runserver
start_server_websocket.bat  # Obsoleto
```

### ✅ USAR (Correcto)
```bash
npm run soshabilidoso  # Inicia todo con Daphne
```

## 🎉 Confirmación de Éxito

Si ves esto, todo está funcionando:

```
╔════════════════════════════════════════════════════════════╗
║              ✅ SOS-HABILIDOSO INICIADO                    ║
╚════════════════════════════════════════════════════════════╝

🌐 ACCESOS:
   Frontend: http://localhost:4000
   Backend: http://127.0.0.1:8000/api/
   Admin: http://127.0.0.1:8000/admin/
   WebSockets: ws://127.0.0.1:8000/ws/

   🔔 Notificaciones en tiempo real: ✅
   💬 Chat en tiempo real: ✅
   📡 Feed en tiempo real: ✅
```

Y en la página de prueba:
```
✅ Backend corriendo en puerto 8000
✅ Daphne (ASGI) iniciado
✅ WebSocket endpoint disponible
✅ Token JWT válido
✅ Conexión WebSocket establecida
```

## 🔐 Garantías de Seguridad

1. **Sin pérdida de datos:** Base de datos no se modificó
2. **Sin cambios en modelos:** Todos los modelos funcionan igual
3. **Sin cambios en API:** Todos los endpoints funcionan igual
4. **Django Admin intacto:** Funciona exactamente igual
5. **Autenticación igual:** JWT y tokens funcionan igual
6. **Frontend sin cambios:** Next.js funciona igual
7. **Compatibilidad total:** Todo lo que funcionaba antes, funciona ahora

## 📝 Archivos Modificados (Solo 2)

1. `backend/sos_habilidoso/asgi.py` - Agregado PyMySQL antes de Django
2. `scripts/start-soshabilidoso.js` - Cambiado a Daphne

**Total de líneas modificadas:** ~5 líneas

## 🚀 Próximos Pasos

1. ✅ Ejecutar `verificar-daphne.bat`
2. ✅ Ejecutar `npm run soshabilidoso`
3. ✅ Abrir `http://localhost:4000/test-websocket-notifications.html`
4. ✅ Verificar que todo está "Conectado"
5. ✅ Probar Django Admin
6. ✅ Probar chat en tiempo real
7. 🎯 Listo para continuar desarrollo

---

**Fecha:** 5 de febrero de 2026
**Versión:** 1.0.0
**Estado:** ✅ Migración segura completada
**Riesgo:** 🟢 Bajo (solo 2 archivos modificados, sin cambios en DB)

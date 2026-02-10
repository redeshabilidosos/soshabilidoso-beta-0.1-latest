# 🚨 REINICIAR SERVIDOR - URGENTE

## ❌ Problema Actual

El backend está corriendo con código VIEJO. Por eso sigue dando error 404:

```
WARNING Not Found: /ws/chat/...
WebSocket connection failed
```

## ✅ Solución: REINICIAR EL SERVIDOR

### Paso 1: DETENER el Servidor Actual

**Busca la terminal donde está corriendo el servidor y presiona:**

```
Ctrl + C
```

Deberías ver algo como:
```
^C
Servidor detenido
```

### Paso 2: REINICIAR con Código Nuevo

```powershell
npm run soshabilidoso
```

### Paso 3: Esperar a que Inicie

Espera a ver estos mensajes:

```
✅ MySQL conectado
✅ Backend iniciado en puerto 8000
✅ Frontend iniciado en puerto 4000
```

### Paso 4: Refrescar el Navegador

```
Ctrl + F5
```

O cierra y abre de nuevo:
```
http://localhost:4000/messages
```

## 🔍 Cómo Saber si el Servidor se Reinició

### En la Terminal del Backend

Deberías ver:
```
Daphne running on 0.0.0.0:8000
```

### En la Consola del Navegador (F12)

Deberías ver:
```
✅ WebSocket connected
```

En lugar de:
```
❌ WebSocket connection failed
```

## ⚠️ Si No Puedes Encontrar la Terminal

### Opción 1: Matar Procesos Manualmente

```powershell
# Matar proceso en puerto 8000 (backend)
$process = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) { Stop-Process -Id $process -Force }

# Matar proceso en puerto 4000 (frontend)
$process = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) { Stop-Process -Id $process -Force }

# Reiniciar
npm run soshabilidoso
```

### Opción 2: Reiniciar Todo

```powershell
# Matar todos los procesos de Node y Python
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force

# Esperar 2 segundos
Start-Sleep -Seconds 2

# Reiniciar
npm run soshabilidoso
```

## 📊 Verificación Final

Después de reiniciar, verifica:

### 1. Backend Corriendo
```powershell
netstat -ano | findstr "8000"
```

Debe mostrar:
```
TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING
```

### 2. Frontend Corriendo
```powershell
netstat -ano | findstr "4000"
```

Debe mostrar:
```
TCP    0.0.0.0:4000    0.0.0.0:0    LISTENING
```

### 3. WebSocket Funciona

Abre el navegador en `http://localhost:4000/messages` y en la consola (F12) deberías ver:

```javascript
WebSocket connected  // ✅ CORRECTO
```

NO deberías ver:
```javascript
WebSocket connection failed  // ❌ INCORRECTO
```

### 4. Enviar Mensaje

- Escribe un mensaje
- Presiona Enter
- El mensaje debe aparecer INMEDIATAMENTE en el chat
- Debe sonar el sonido

## 🎯 Resumen

```
╔════════════════════════════════════════╗
║                                        ║
║  1. Ctrl + C (detener servidor)       ║
║  2. npm run soshabilidoso (reiniciar) ║
║  3. Ctrl + F5 (refrescar navegador)   ║
║  4. Probar enviar mensaje             ║
║                                        ║
╚════════════════════════════════════════╝
```

## ❓ Por Qué Necesitas Reiniciar

El servidor backend carga las rutas WebSocket **UNA SOLA VEZ** al iniciar. Si cambias el código de routing y no reinicias, el servidor sigue usando las rutas viejas (rotas).

```
Código viejo en memoria → Error 404
         ↓
    Reiniciar servidor
         ↓
Código nuevo en memoria → WebSocket funciona ✅
```

---

**ACCIÓN REQUERIDA: Detén el servidor (Ctrl + C) y reinicia con `npm run soshabilidoso`**

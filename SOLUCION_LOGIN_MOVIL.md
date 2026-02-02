# 🔍 Diagnóstico de Login desde Móvil

**Problema:** Login funciona en PC pero no en móvil  
**Estado:** Investigando

---

## ✅ Lo que Sabemos

1. **Backend funciona correctamente:**
   - ✅ Login desde PC (navegador) funciona
   - ✅ Usuario `molo` existe en la base de datos
   - ✅ Contraseña `password123` es correcta
   - ✅ Backend escucha en `0.0.0.0:8000`
   - ✅ Firewall permite puerto 8000

2. **App móvil:**
   - ✅ Se conecta al frontend (carga la app)
   - ❌ Login falla con "Verifique su correo o contraseña"

---

## 🔍 Posibles Causas

### 1. La app envía datos en formato incorrecto
**Síntoma:** Backend recibe datos pero no puede procesarlos

**Solución:** Ver logs del backend cuando el móvil intenta login

### 2. La app no se conecta al backend correcto
**Síntoma:** La app intenta conectarse a `127.0.0.1` en vez de `10.87.23.237`

**Solución:** Verificar que `.env.local` tenga la IP correcta

### 3. CORS bloquea la petición
**Síntoma:** Backend rechaza peticiones desde el móvil

**Solución:** Verificar configuración CORS en Django

---

## 🧪 Pasos de Diagnóstico

### Paso 1: Ver Logs del Backend

Cuando intentes hacer login desde el móvil, mira la ventana del backend Django.

Deberías ver algo como:
```
DEBUG VIEW: Request data: {'login': 'molo', 'password': '***'}
DEBUG VIEW: Request content type: application/json
DEBUG SERIALIZER: Received data - {'login': 'molo', 'password': '***'}
DEBUG: Login attempt - login_value=molo, password=***********
DEBUG: User found by username: molo
DEBUG: Login successful for user: molo
```

**Si NO ves estos logs:**
- La petición no está llegando al backend
- Problema de red o configuración

**Si ves logs pero con errores:**
- La petición llega pero los datos están mal
- Problema en cómo la app envía los datos

### Paso 2: Verificar .env.local

Abre `.env.local` y verifica:
```env
NEXT_PUBLIC_API_URL=http://10.87.23.237:8000/api
NEXT_PUBLIC_WS_URL=ws://10.87.23.237:8000/ws
```

**NO debe ser:**
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api  ❌
NEXT_PUBLIC_API_URL=http://localhost:8000/api  ❌
```

### Paso 3: Verificar CORS en Django

El backend debe permitir peticiones desde cualquier origen en desarrollo.

Archivo: `backend/sos_habilidoso/settings/development.py`

Debe tener:
```python
CORS_ALLOW_ALL_ORIGINS = True
```

O al menos:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4000',
    'http://10.87.23.237:4000',
    'capacitor://localhost',
    'http://localhost',
]
```

---

## 🔧 Soluciones Rápidas

### Solución 1: Reiniciar Todo

```bash
# 1. Cerrar todos los procesos
taskkill /F /IM node.exe
taskkill /F /IM python.exe

# 2. Limpiar cache
rmdir /s /q .next
rmdir /s /q node_modules\.cache

# 3. Reiniciar servidores
iniciar-todo-android.bat

# 4. Reinstalar app
reinstalar-sin-android-studio.bat
```

### Solución 2: Verificar IP

```bash
# Ver tu IP actual
ipconfig

# Si cambió, actualizar
actualizar-ip-rapido.bat
```

### Solución 3: Probar con Email

En vez de `molo`, prueba con el email completo:
```
Email: camilogomezroman@protonmaill.com
Password: password123
```

---

## 📝 Información para Debug

### Usuario molo:
```
Username: molo
Email: camilogomezroman@protonmaill.com
Display Name: M0L0W0R1D
Password: password123
Activo: ✅
```

### Configuración Actual:
```
Frontend: http://10.87.23.237:4000
Backend API: http://10.87.23.237:8000/api
MySQL: localhost:3307
```

### Endpoints:
```
Login: POST http://10.87.23.237:8000/api/auth/login/
Body: {
  "login": "molo",
  "password": "password123"
}
```

---

## 🎯 Próximo Paso

**Intenta hacer login desde el móvil y mira la ventana del backend Django.**

Dime qué logs ves (o si no ves ningún log).

Eso nos dirá exactamente dónde está el problema.


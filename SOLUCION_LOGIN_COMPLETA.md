# ✅ Solución Completa del Problema de Login

## 🔍 Diagnóstico

El problema de login en `localhost:4000/login` se debe a que:

1. ✅ El backend está configurado correctamente
2. ✅ El frontend está configurado correctamente  
3. ✅ Los usuarios existen en la base de datos
4. ⚠️  **Necesitas usar las credenciales correctas**

## 🔐 Credenciales Verificadas

### Usuario que FUNCIONA:
```
Username: molo
Email: camilogomezroman@protonmaill.com
Password: admin123
```

## 📋 Pasos para Hacer Login

### 1. Asegúrate de que el Backend esté corriendo

```bash
cd backend
python manage.py runserver
```

Deberías ver:
```
Django version 4.2.7, using settings 'sos_habilidoso.settings'
Starting development server at http://127.0.0.1:8000/
```

### 2. Asegúrate de que el Frontend esté corriendo

```bash
npm run dev
```

Deberías ver:
```
ready - started server on 0.0.0.0:4000, url: http://localhost:4000
```

### 3. Accede al Login

Abre tu navegador en: `http://localhost:4000/login`

### 4. Ingresa las Credenciales

En el formulario de login, puedes usar:

**Opción 1 - Con Username:**
- Campo "Email o Username": `molo`
- Campo "Password": `admin123`

**Opción 2 - Con Email:**
- Campo "Email o Username": `camilogomezroman@protonmaill.com`
- Campo "Password": `admin123`

### 5. Click en "Iniciar Sesión"

Si todo está correcto, deberías ser redirigido al feed principal.

## 🧪 Verificar que Todo Funciona

### Prueba 1: Verificar Usuarios en la BD

```bash
python backend/test_login_debug.py
```

Esto te mostrará todos los usuarios disponibles y sus contraseñas.

### Prueba 2: Probar Login desde la API

```bash
python backend/test_molo_login.py
```

Esto probará el login directamente contra la API del backend.

### Prueba 3: Verificar Endpoint de Login

Abre tu navegador y ve a:
```
http://127.0.0.1:8000/api/auth/login/
```

Deberías ver la interfaz de Django REST Framework.

## 🔧 Solucionar Problemas Comunes

### Problema 1: "Credenciales inválidas"

**Causa:** Contraseña incorrecta o usuario no existe

**Solución:**
```bash
# Ver todos los usuarios y sus contraseñas
python backend/test_login_debug.py

# Resetear contraseña del primer usuario a 'password123'
python backend/test_login_debug.py reset
```

### Problema 2: "No se pudo conectar al servidor"

**Causa:** El backend no está corriendo

**Solución:**
```bash
cd backend
python manage.py runserver
```

### Problema 3: Error de CORS

**Causa:** El frontend no está en la lista de orígenes permitidos

**Solución:** Verifica en `backend/sos_habilidoso/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    # ... otros orígenes
]
```

### Problema 4: El login funciona pero no redirige

**Causa:** Problema con el localStorage o tokens

**Solución:**
1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Application" > "Local Storage"
3. Limpia todo el localStorage
4. Intenta hacer login nuevamente

## 📝 Otros Usuarios Disponibles

Si necesitas más usuarios para probar, aquí están algunos:

```
Username: valentina_gym
Password: (necesita reset)

Username: andres_basket  
Password: (necesita reset)

Username: maria_swimmer
Password: (necesita reset)

Username: habilidosos
Password: (necesita reset)
```

Para resetear la contraseña de cualquier usuario:

```bash
cd backend
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Cambiar contraseña
user = User.objects.get(username='valentina_gym')
user.set_password('password123')
user.save()
print(f"Contraseña actualizada para {user.username}")
```

## 🎯 Resumen

**Para hacer login exitosamente:**

1. ✅ Backend corriendo en `http://127.0.0.1:8000`
2. ✅ Frontend corriendo en `http://localhost:4000`
3. ✅ Usar credenciales: `molo` / `admin123`
4. ✅ El sistema acepta tanto username como email

**Endpoint de Login:**
```
POST http://127.0.0.1:8000/api/auth/login/
Content-Type: application/json

{
  "login": "molo",
  "password": "admin123"
}
```

**Respuesta Exitosa:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "...",
    "username": "molo",
    "email": "camilogomezroman@protonmaill.com",
    "display_name": "M0L0W0R1D",
    ...
  }
}
```

## 🚀 Siguiente Paso

Una vez que hagas login exitosamente, serás redirigido al feed principal donde podrás:
- Ver publicaciones
- Crear nuevas publicaciones
- Interactuar con otros usuarios
- Acceder a todas las funcionalidades de la red social

¡Listo! Ahora deberías poder hacer login sin problemas. 🎉

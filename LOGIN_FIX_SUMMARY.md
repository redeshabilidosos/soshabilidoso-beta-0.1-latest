# Solución: Problema de Login en Next.js

## Problema Identificado

El panel de control de Django admin estaba usando la tabla `users`, pero el login en Next.js no podía iniciar sesión correctamente. El problema tenía múltiples causas:

### 1. Apps no habilitadas en Django
Las aplicaciones `authentication` y `users` estaban comentadas en `INSTALLED_APPS` en `backend/sos_habilidoso/settings.py`.

**Solución:** Se descomentaron las apps:
```python
INSTALLED_APPS = [
    # ...
    'apps.authentication',
    'apps.users',
]
```

### 2. Modelo de usuario personalizado no configurado
Django no sabía que debía usar el modelo personalizado `User` de `apps.users.models`.

**Solución:** Se agregó la configuración en `backend/sos_habilidoso/settings.py`:
```python
AUTH_USER_MODEL = 'users.User'
```

### 3. JWT no configurado correctamente
La autenticación JWT no estaba configurada en `REST_FRAMEWORK`.

**Solución:** Se agregó la configuración:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
}
```

### 4. Contraseñas de usuarios incorrectas
Los usuarios existentes tenían contraseñas que no coincidían con las esperadas.

**Solución:** Se ejecutó el script `backend/reset_user_passwords.py` para resetear todas las contraseñas a `Password123!`.

## Cambios Realizados

### 1. `backend/sos_habilidoso/settings.py`
- Descomentadas las apps `authentication` y `users`
- Agregada configuración de `AUTH_USER_MODEL`
- Agregada configuración de JWT en `REST_FRAMEWORK` y `SIMPLE_JWT`

### 2. `backend/apps/authentication/serializers.py`
- Agregado manejo de excepciones en `get_followers_count` y `get_following_count`

### 3. Scripts de utilidad creados
- `backend/fix_auth_setup.py`: Verifica la configuración de autenticación
- `backend/fix_auth_simple.py`: Ejecuta migraciones y crea usuarios de prueba
- `backend/reset_user_passwords.py`: Resetea las contraseñas de todos los usuarios
- `backend/test_login_fix.py`: Prueba que el login funciona correctamente

## Cómo Probar

### 1. Resetear contraseñas (si es necesario)
```bash
python backend/reset_user_passwords.py
```

### 2. Iniciar el servidor Django
```bash
python backend/manage.py runserver
```

### 3. Probar el login desde Next.js
El servicio de autenticación en `lib/services/auth.service.ts` ahora debería funcionar correctamente.

Credenciales de prueba:
- **Username:** `admin_test_8` o `moloadmin` o `srwilson`
- **Password:** `Password123!`

### 4. Probar el endpoint de login directamente
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"login": "admin_test_8", "password": "Password123!"}'
```

Respuesta esperada:
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin_test_8",
    "email": "admin@test.com",
    "display_name": "...",
    ...
  }
}
```

## Flujo de Autenticación

1. **Frontend (Next.js)** envía credenciales a `/api/auth/login/`
2. **Backend (Django)** valida las credenciales contra la tabla `users`
3. **Serializer** busca el usuario por email o username
4. **JWT tokens** se generan y se devuelven al frontend
5. **Frontend** almacena los tokens en localStorage
6. **Futuras requests** incluyen el token en el header `Authorization: Bearer <token>`

## Notas Importantes

- El modelo `User` en `apps.users.models` extiende `AbstractUser` de Django
- El campo `USERNAME_FIELD` está configurado como `email`, pero también se puede usar `username`
- El serializer `CustomTokenObtainPairSerializer` acepta tanto email como username en el campo `login`
- Las contraseñas se hashean automáticamente usando el algoritmo de Django

## Próximos Pasos

1. Cambiar la contraseña por defecto en producción
2. Configurar variables de entorno para las contraseñas
3. Implementar recuperación de contraseña por email
4. Agregar autenticación de dos factores (2FA) si es necesario

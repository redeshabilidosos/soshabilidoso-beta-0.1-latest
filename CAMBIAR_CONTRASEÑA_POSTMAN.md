# Cambiar Contraseña de Usuario con Postman

## Usuario a Modificar
- **Email:** camilogomezdeveloper@gmail.com
- **Username:** camilogomezdeveloper

## Método 1: Cambio de Contraseña (Requiere Autenticación)

### Paso 1: Obtener Token de Acceso

**Endpoint:**
```
POST http://127.0.0.1:8000/api/auth/login/
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "login": "camilogomezdeveloper@gmail.com",
  "password": "TU_CONTRASEÑA_ACTUAL"
}
```

**Respuesta Esperada:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "camilogomezdeveloper",
    "email": "camilogomezdeveloper@gmail.com"
  }
}
```

### Paso 2: Cambiar Contraseña

**Endpoint:**
```
POST http://127.0.0.1:8000/api/auth/change-password/
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ACCESS_TOKEN_DEL_PASO_1}
```

**Body (JSON):**
```json
{
  "current_password": "TU_CONTRASEÑA_ACTUAL",
  "new_password": "TU_NUEVA_CONTRASEÑA",
  "new_password_confirm": "TU_NUEVA_CONTRASEÑA"
}
```

**Respuesta Esperada:**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

---

## Método 2: Cambio Directo desde Django Admin

Si no recuerdas la contraseña actual, puedes cambiarla directamente desde el panel de administración de Django:

### Opción A: Usando el Panel Admin Web

1. Accede a: `http://127.0.0.1:8000/admin/`
2. Inicia sesión con credenciales de superusuario
3. Ve a **Users** (Usuarios)
4. Busca y selecciona el usuario `camilogomezdeveloper`
5. Haz clic en el enlace "change password form" o "cambiar contraseña"
6. Ingresa la nueva contraseña dos veces
7. Guarda los cambios

### Opción B: Usando Django Shell

Ejecuta en la terminal:

```bash
cd backend
python manage.py shell
```

Luego ejecuta estos comandos:

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Buscar el usuario por email
user = User.objects.get(email='camilogomezdeveloper@gmail.com')

# Cambiar la contraseña
user.set_password('TU_NUEVA_CONTRASEÑA')
user.save()

print(f"Contraseña cambiada exitosamente para {user.username}")
exit()
```

---

## Método 3: Reset de Contraseña (Sin Autenticación)

### Paso 1: Solicitar Reset de Contraseña

**Endpoint:**
```
POST http://127.0.0.1:8000/api/auth/reset-password/
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "camilogomezdeveloper@gmail.com"
}
```

**Respuesta Esperada:**
```json
{
  "message": "Se ha enviado un correo con instrucciones para restablecer tu contraseña"
}
```

**Nota:** Este método requiere que el servidor de correo esté configurado. Si no está configurado, usa el Método 2 (Django Shell).

### Paso 2: Confirmar Reset (Requiere Token del Email)

**Endpoint:**
```
POST http://127.0.0.1:8000/api/auth/reset-password/confirm/
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "uid": "UID_DEL_EMAIL",
  "token": "TOKEN_DEL_EMAIL",
  "new_password": "TU_NUEVA_CONTRASEÑA",
  "new_password_confirm": "TU_NUEVA_CONTRASEÑA"
}
```

---

## Requisitos de Contraseña

La nueva contraseña debe cumplir con:
- ✅ Mínimo 8 caracteres
- ✅ No puede ser completamente numérica
- ✅ No puede ser demasiado común
- ✅ No puede ser similar al nombre de usuario o email

---

## Ejemplos de Contraseñas Válidas

```
MiContraseña2024!
Habilidoso@123
SOS_Developer2024
```

---

## Solución de Problemas

### Error: "La contraseña actual es incorrecta"
- Verifica que estés usando la contraseña correcta
- Usa el Método 2 (Django Shell) para cambiarla directamente

### Error: "Las contraseñas no coinciden"
- Asegúrate de que `new_password` y `new_password_confirm` sean idénticos

### Error: "Token inválido o expirado"
- El token de acceso expira después de cierto tiempo
- Vuelve a hacer login para obtener un nuevo token

### Error: "Esta contraseña es demasiado común"
- Usa una contraseña más compleja
- Agrega números, símbolos y mayúsculas

---

## Recomendación

**Para cambiar la contraseña rápidamente sin complicaciones, usa el Método 2 - Opción B (Django Shell):**

```bash
cd backend
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='camilogomezdeveloper@gmail.com')
user.set_password('NuevaContraseña2024!')
user.save()
print("✅ Contraseña cambiada exitosamente")
exit()
```

Este método es el más directo y no requiere conocer la contraseña actual.

---

**Fecha:** 2026-02-10
**Usuario:** camilogomezdeveloper@gmail.com

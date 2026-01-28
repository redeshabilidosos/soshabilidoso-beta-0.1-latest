# 🔐 Credenciales de Administrador Django

**Fecha de actualización:** 28 de enero de 2026

---

## ⚠️ IMPORTANTE: ESTE SISTEMA USA EMAIL PARA LOGIN

El modelo de usuario personalizado usa `USERNAME_FIELD = 'email'`, por lo que **DEBES usar el EMAIL para iniciar sesión**, no el username.

---

## 📋 Acceso al Panel de Administración

### URL
```
http://127.0.0.1:8000/admin/
```

### ✅ Credenciales Verificadas y Probadas

**OPCIÓN 1 - Recomendada:**
```
Email:    admin@soshabilidoso.com
Password: admin123
```

**OPCIÓN 2 - Alternativa:**
```
Email:    superadmin@habilidosos.com
Password: admin123
```

**OPCIÓN 3:**
```
Email:    admin2@habilidosos.com
Password: admin123
```

**OPCIÓN 4:**
```
Email:    admin3@habilidosos.com
Password: admin123
```

### 🚨 RECUERDA:
- ✅ Usa el **EMAIL** en el campo de usuario
- ❌ NO uses el username (admin, superadmin, etc.)
- ✅ La contraseña es: **admin123**

---

## 🔐 Permisos del Usuario

- ✅ **Superusuario** (acceso completo)
- ✅ **Staff** (puede acceder al admin)
- ✅ **Activo** (cuenta habilitada)

---

## 👤 Información del Usuario

- **ID:** 294820a4-1aad-4ff0-abb0-5e9f5886555c
- **Display Name:** Administrador
- **Email:** admin@soshabilidoso.com
- **Bio:** Administrador del sistema SOS Habilidoso

---

## 🛠️ Funcionalidades Disponibles

Desde el panel de administración puedes:

1. **Gestionar Usuarios**
   - Ver, crear, editar y eliminar usuarios
   - Cambiar permisos y roles
   - Resetear contraseñas

2. **Configuración del Sitio**
   - Ajustar configuraciones generales
   - Habilitar/deshabilitar funcionalidades
   - Gestionar menú de navegación

3. **Contenido**
   - Moderar posts, comentarios y reels
   - Gestionar comunidades
   - Revisar clasificados y donaciones

4. **Streaming**
   - Monitorear transmisiones en vivo
   - Gestionar configuraciones de streaming
   - Ver estadísticas

5. **Notificaciones**
   - Enviar notificaciones masivas
   - Configurar tipos de notificaciones

---

## 🔄 Scripts Útiles

### Crear/Actualizar Admin
```bash
cd backend
python create_django_admin.py
```

### Actualizar Información del Admin
```bash
cd backend
python update_admin_info.py
```

### Resetear Contraseña del Admin
```bash
cd backend
python manage.py changepassword admin
```

---

## 🚨 Seguridad

⚠️ **IMPORTANTE:**
- Cambia la contraseña en producción
- No compartas estas credenciales
- Usa contraseñas seguras en entornos de producción

### Cambiar Contraseña (Recomendado)
```bash
cd backend
python manage.py changepassword admin
```

O desde el panel de administración:
1. Accede a http://127.0.0.1:8000/admin/
2. Ve a "Usuarios" > "admin"
3. Haz clic en "Cambiar contraseña"

---

## 📝 Notas

- Este usuario tiene acceso completo a todas las funcionalidades
- Puede crear otros usuarios administradores
- Puede modificar cualquier configuración del sistema
- Tiene acceso a todos los datos de la aplicación

---

## 🔗 Enlaces Rápidos

- **Panel Admin:** http://127.0.0.1:8000/admin/
- **API Root:** http://127.0.0.1:8000/api/
- **Documentación API:** http://127.0.0.1:8000/api/docs/
- **Frontend:** http://localhost:4000/

---

## ✅ Verificación

Para verificar que el usuario admin funciona correctamente:

1. Abre http://127.0.0.1:8000/admin/
2. Ingresa las credenciales:
   - Username: `admin`
   - Password: `admin123`
3. Deberías ver el panel de administración completo

Si tienes problemas, ejecuta:
```bash
cd backend
python update_admin_info.py
```

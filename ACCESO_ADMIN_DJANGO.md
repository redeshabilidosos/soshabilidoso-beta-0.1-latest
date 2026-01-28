# 🔐 ACCESO AL PANEL DE ADMINISTRACIÓN DJANGO

**Última actualización:** 28 de Enero de 2026  
**Estado:** ✅ Verificado y Funcionando

---

## ⚠️ INFORMACIÓN CRÍTICA

### El sistema usa EMAIL para autenticación

Este proyecto tiene un modelo de usuario personalizado que usa `USERNAME_FIELD = 'email'`.

**Esto significa:**
- ✅ En el panel admin, debes usar el **EMAIL** en el campo de usuario
- ❌ NO uses el username (admin, superadmin, etc.)
- ✅ La contraseña es: **admin123**

---

## 🌐 ACCESO AL PANEL

### URL del Panel Admin
```
http://127.0.0.1:8000/admin/
```

---

## 🔑 CREDENCIALES VERIFICADAS

### OPCIÓN 1 - Recomendada ⭐
```
Campo Usuario: admin@soshabilidoso.com
Contraseña:    admin123
```

### OPCIÓN 2 - Alternativa
```
Campo Usuario: superadmin@habilidosos.com
Contraseña:    admin123
```

### OPCIÓN 3
```
Campo Usuario: admin2@habilidosos.com
Contraseña:    admin123
```

### OPCIÓN 4
```
Campo Usuario: admin3@habilidosos.com
Contraseña:    admin123
```

---

## 📝 PASOS PARA ACCEDER

1. **Abre el navegador** y ve a: `http://127.0.0.1:8000/admin/`

2. **En el campo "Email"** (o "Nombre de usuario"), ingresa:
   ```
   admin@soshabilidoso.com
   ```

3. **En el campo "Contraseña"**, ingresa:
   ```
   admin123
   ```

4. **Haz clic en "Iniciar sesión"**

---

## 🧪 HERRAMIENTA DE PRUEBA

Abre este archivo en tu navegador para probar las credenciales:
```
test-admin-login.html
```

Este archivo te permite:
- ✅ Copiar las credenciales con un clic
- ✅ Abrir el panel admin directamente
- ✅ Ver instrucciones paso a paso

---

## 🔧 SCRIPTS DE MANTENIMIENTO

### Verificar usuarios existentes
```bash
cd backend
python check_users.py
```

### Resetear contraseña del admin
```bash
cd backend
python fix_admin_login.py
```

### Resetear todos los superusuarios
```bash
cd backend
python reset_all_superusers.py
```

### Probar autenticación
```bash
cd backend
python test_admin_login.py
```

---

## ❌ ERRORES COMUNES

### Error: "Por favor introduzca el Email y la clave correctos"

**Causa:** Estás usando el username en lugar del email

**Solución:** 
- ❌ NO uses: `admin`
- ✅ USA: `admin@soshabilidoso.com`

### Error: "Este campo es obligatorio"

**Causa:** Campos vacíos

**Solución:** Asegúrate de llenar ambos campos (email y contraseña)

### Error: "Cuenta deshabilitada"

**Causa:** El usuario no está activo o no tiene permisos de staff

**Solución:** Ejecuta el script de reseteo:
```bash
cd backend
python fix_admin_login.py
```

---

## 👥 INFORMACIÓN DE LOS USUARIOS ADMIN

Todos estos usuarios tienen:
- ✅ `is_superuser = True` (acceso completo)
- ✅ `is_staff = True` (puede acceder al admin)
- ✅ `is_active = True` (cuenta activa)
- ✅ Contraseña: `admin123`

| Username   | Email                          | Display Name    |
|------------|--------------------------------|-----------------|
| admin      | admin@soshabilidoso.com        | Administrador   |
| superadmin | superadmin@habilidosos.com     | Super Admin     |
| admin2     | admin2@habilidosos.com         | Admin 2         |
| admin3     | admin3@habilidosos.com         | Admin 3         |

---

## 🎯 RESUMEN RÁPIDO

**Para acceder al panel admin:**

1. URL: `http://127.0.0.1:8000/admin/`
2. Usuario: `admin@soshabilidoso.com` (usa el EMAIL)
3. Contraseña: `admin123`

**¡Eso es todo!** 🚀

---

## 📞 SOPORTE

Si sigues teniendo problemas:

1. Verifica que el servidor Django esté corriendo:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Ejecuta el script de diagnóstico:
   ```bash
   cd backend
   python fix_admin_login.py
   ```

3. Revisa los logs del servidor en la terminal donde corre Django

---

**Última verificación:** 28 de Enero de 2026 - ✅ Funcionando correctamente

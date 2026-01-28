# 🔐 Credenciales de Login - SOS Habilidoso

## ⚠️ IMPORTANTE: SISTEMA DE AUTENTICACIÓN

Este sistema usa **EMAIL** como campo de autenticación principal:
- ✅ Para el **Panel Admin Django**: Usa EMAIL
- ✅ Para el **Frontend (App)**: Puedes usar EMAIL o USERNAME

---

## 🔐 PANEL DE ADMINISTRACIÓN DJANGO

### URL: http://127.0.0.1:8000/admin/

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

⚠️ **RECUERDA:** En el panel admin, debes usar el **EMAIL**, no el username.

---

### Usuarios Principales

1. **molo**
   - Username: `molo`
   - Email: `camilogomezroman@protonmaill.com`
   - Password: `password123`
   - Display Name: M0L0W0R1D

2. **abi**
   - Username: `abi`
   - Email: `notificaciones@fundahabilidosos.com`
   - Password: `password123`
   - Display Name: Habil

3. **moloworld**
   - Username: `moloworld`
   - Email: `camilogomezroman@protonmail.com`
   - Password: `password123`
   - Display Name: M0L0W0RLD

4. **habilidosos**
   - Username: `habilidosos`
   - Email: `redes.habilidosos@gmail.com`
   - Password: `password123`
   - Display Name: Sos Habilidosos

### Usuarios de Prueba

5. **valentina_gym** - Password: `password123`
6. **andres_basket** - Password: `password123`
7. **maria_swimmer** - Password: `password123`
8. **juanperez_athlete** - Password: `password123`

### Usuarios Admin

9. **admin** - Password: `password123`
10. **admin2** - Password: `password123`
11. **admin3** - Password: `password123`
12. **superadmin** - Password: `password123`

## 📝 Cómo Hacer Login

### En el Frontend (localhost:4000/login)

Puedes ingresar de 3 formas:

1. **Con Username (sin @):**
   ```
   Usuario: molo
   Contraseña: password123
   ```

2. **Con Email:**
   ```
   Usuario: camilogomezroman@protonmaill.com
   Contraseña: password123
   ```

3. **Con cualquier otro usuario:**
   ```
   Usuario: valentina_gym
   Contraseña: password123
   ```

## 🔧 Resetear Contraseñas Nuevamente

Si necesitas resetear las contraseñas otra vez:

```bash
python backend/reset_all_passwords.py
```

Esto reseteará TODAS las contraseñas a `password123`.

## 🧪 Probar Login

### Desde la API directamente:
```bash
python backend/test_login_direct.py
```

### Desde el navegador:
Abre `test-login-browser.html` en tu navegador

## 📊 Total de Usuarios

- **19 usuarios** en total
- **Todos** con contraseña `password123`
- Puedes usar **username** o **email** para login

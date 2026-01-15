# 📝 Registro de Usuarios - SOS-HABILIDOSO

## ✅ Sistema de Registro Configurado

El sistema de registro está completamente funcional y guarda los datos en la base de datos MySQL `habilidosos_db`.

## 🔐 Requisitos para Crear una Cuenta

### Campos Obligatorios:
- **Nombre de usuario** (@usuario)
  - Mínimo 3 caracteres
  - Solo letras, números y guiones bajos
  - Debe ser único
  
- **Nombre completo**
  - Mínimo 2 caracteres
  
- **Email**
  - Formato válido de email
  - Debe ser único
  
- **Contraseña**
  - **Mínimo 8 caracteres** ⚠️
  - Debe contener letras y números
  - No puede ser muy común (ej: "12345678")
  
- **Confirmar Contraseña**
  - Debe coincidir con la contraseña

### Campos Opcionales:
- Habilidad (ej: Delantero, Músico, Bailarín)
- Equipo/Grupo (ej: Los Habilidosos FC)
- Intereses (separados por comas)

## 🎯 Proceso de Registro

1. **Llenar el formulario** en http://localhost:4000
2. **Hacer clic en "Crear Cuenta"**
3. **Esperar confirmación**:
   - ✅ Si todo está bien: Verás un mensaje de éxito y serás redirigido al feed
   - ❌ Si hay error: Verás un mensaje específico del problema

## 📊 Dónde se Guardan los Datos

Los datos se guardan en:
- **Base de datos**: `habilidosos_db`
- **Tabla**: `users`
- **Puerto MySQL**: 3307

Puedes verificar los usuarios registrados en:
- **phpMyAdmin**: http://localhost/phpmyadmin
- **Panel Admin Django**: http://127.0.0.1:8000/admin/
  - Usuario: admin@test.com
  - Password: admin123

## 🔄 Flujo Completo

```
Usuario llena formulario
    ↓
Frontend valida datos
    ↓
Envía POST a /api/auth/register/
    ↓
Django valida y guarda en MySQL
    ↓
Genera tokens JWT
    ↓
Devuelve usuario y tokens
    ↓
Frontend muestra éxito
    ↓
Redirige a /feed
```

## ⚠️ Errores Comunes

### "La contraseña debe tener al menos 8 caracteres"
- **Solución**: Usa una contraseña de 8 o más caracteres
- **Ejemplo válido**: `admin123` (8 caracteres)
- **Ejemplo inválido**: `admin12` (7 caracteres)

### "Este email ya está registrado"
- **Solución**: Usa otro email o inicia sesión con el existente

### "Este nombre de usuario ya está en uso"
- **Solución**: Elige otro nombre de usuario

### "Las contraseñas no coinciden"
- **Solución**: Asegúrate de escribir la misma contraseña en ambos campos

### "Error al crear la cuenta"
- **Verificar**: Que el servidor Django esté corriendo
- **Comando**: `npm run soshabilidoso`

## 🧪 Probar el Registro

### Datos de Prueba Válidos:

```
Nombre de usuario: @testuser
Nombre completo: Usuario de Prueba
Email: test@example.com
Contraseña: testpass123
Confirmar Contraseña: testpass123
Habilidad: Desarrollador
Equipo: Team SOS
Intereses: programación, fútbol, música
```

## 🔍 Verificar que el Usuario se Creó

### Opción 1: Panel Admin de Django
1. Ir a: http://127.0.0.1:8000/admin/
2. Login: admin@test.com / admin123
3. Click en "Usuarios"
4. Buscar el usuario recién creado

### Opción 2: MySQL Directo
```bash
mysql -u root -P 3307 -e "USE habilidosos_db; SELECT username, email, display_name, date_joined FROM users ORDER BY date_joined DESC LIMIT 5;"
```

### Opción 3: phpMyAdmin
1. Abrir phpMyAdmin
2. Seleccionar base de datos `habilidosos_db`
3. Abrir tabla `users`
4. Ver los registros

## 🎉 Después del Registro

Una vez registrado exitosamente:

1. **Automáticamente inicias sesión**
2. **Eres redirigido al feed**: http://localhost:4000/feed
3. **Puedes**:
   - Ver tu perfil
   - Crear publicaciones
   - Unirte a comunidades
   - Enviar mensajes
   - Agregar amigos

## 🔐 Iniciar Sesión Después

Para iniciar sesión con tu cuenta creada:

1. Ir a: http://localhost:4000
2. Ingresar email o @usuario
3. Ingresar contraseña
4. Click en "Iniciar Sesión"

## 📝 Notas Importantes

- ✅ Los datos se guardan en MySQL (no en memoria)
- ✅ Las contraseñas se encriptan automáticamente
- ✅ Se generan tokens JWT para autenticación
- ✅ El usuario puede iniciar sesión inmediatamente
- ✅ Los datos persisten entre reinicios del servidor

## 🆘 Solución de Problemas

### El formulario no envía datos

1. Verificar que Django esté corriendo:
   ```bash
   npm run soshabilidoso
   ```

2. Verificar en la consola del navegador (F12) si hay errores

3. Verificar que MySQL esté corriendo:
   ```bash
   net start MariaDB
   ```

### No aparece mensaje de éxito

- Revisar la consola del navegador (F12)
- Verificar que no haya errores de validación
- Asegurarse de que la contraseña tenga mínimo 8 caracteres

### El usuario no aparece en la base de datos

- Verificar que no haya errores en el servidor Django
- Revisar los logs del servidor
- Verificar la conexión a MySQL

## 📞 Endpoints de la API

```
POST /api/auth/register/
Body: {
  "email": "user@example.com",
  "username": "usuario",
  "display_name": "Usuario Ejemplo",
  "password": "password123",
  "password_confirm": "password123",
  "position": "Desarrollador",
  "team": "Team SOS",
  "bio": "programación, fútbol"
}

Response 201: {
  "message": "Usuario registrado exitosamente",
  "user": { ... },
  "tokens": {
    "access": "...",
    "refresh": "..."
  }
}
```

---

**¡El sistema está listo para registrar usuarios!** 🚀

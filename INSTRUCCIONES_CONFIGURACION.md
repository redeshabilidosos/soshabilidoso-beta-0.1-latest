# 🚀 Instrucciones de Configuración - Validación de Login y Registro

Este documento explica cómo configurar la validación mejorada de login y registro, así como el envío de correos de confirmación.

## ✅ Cambios Realizados

### 1. Validación Mejorada en Login

**Cambios en el frontend:**
- Mensajes de error en rojo cuando la contraseña no coincide
- Mensaje específico: "Verifique su correo o contraseña"
- Los errores se muestran en campos específicos con bordes rojos

**Archivo modificado:**
- `components/auth/auth-page.tsx`

### 2. Validación Mejorada en Registro

**Cambios en el frontend:**
- Validación de contraseña con requisitos específicos:
  - Mínimo 8 caracteres
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número
  - Al menos un carácter especial (!@#$%^&*)
- Mensajes de error en rojo para cada campo
- Confirmación visual cuando los datos son válidos (✓ en verde)
- Validación de que las contraseñas coincidan

**Requisitos mostrados en rojo:**
```
Mínimo 8 caracteres, Al menos una mayúscula, Al menos una minúscula, 
Al menos un número, Al menos un carácter especial (!@#$%^&*)
```

**Archivo modificado:**
- `components/auth/auth-page.tsx`

### 3. Envío de Correos de Confirmación

**Cambios en el backend:**
- Nuevo script de Google Apps Script para enviar correos
- Integración con Google Sheets para respaldo de registros
- Correos con diseño profesional y personalizado

**Archivos creados/modificados:**
- `backend/scripts/google_apps_script_registration.js` (nuevo)
- `backend/apps/authentication/views.py` (modificado)
- `backend/.env` (modificado)
- `backend/scripts/GOOGLE_SHEETS_SETUP.md` (actualizado)

## 📋 Pasos de Configuración

### Paso 1: Crear el Google Apps Script

1. Abre Google Sheets con ID: `1-zBfqMIun71LO9xpDDseDGbDz28GRCuSH9HlzvML-04`
2. Ve a **Extensiones > Apps Script**
3. Copia el contenido de `backend/scripts/google_apps_script_registration.js`
4. Pégalo en el editor de Apps Script
5. Guarda el proyecto con nombre "User Registration Backup"

### Paso 2: Implementar como Web App

1. En Apps Script, haz clic en **Implementar > Nueva implementación**
2. Selecciona **Aplicación web**
3. Configura:
   - **Ejecutar como**: Tu cuenta
   - **Quién tiene acceso**: Cualquier persona
4. Haz clic en **Implementar**
5. **Copia la URL** que aparece (será algo como: `https://script.google.com/macros/s/AKfycbw.../exec`)

### Paso 3: Configurar el Backend

1. Abre `backend/.env`
2. Busca la línea: `GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL=`
3. Reemplaza `YOUR_DEPLOYMENT_ID` con tu URL completa:
   ```env
   GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
   ```
4. Guarda el archivo

### Paso 4: Reiniciar el Backend

```bash
# Detener el servidor actual (Ctrl+C)
# Luego iniciar nuevamente
cd backend
python manage.py runserver 0.0.0.0:8000
```

## 🧪 Pruebas

### Probar Login con Error

1. Ve a http://localhost:4000/login
2. Ingresa un email/usuario válido
3. Ingresa una contraseña incorrecta
4. Haz clic en "Iniciar Sesión"
5. Deberías ver el mensaje en rojo: **"Verifique su correo o contraseña"**

### Probar Registro con Validación

1. Ve a http://localhost:4000/login
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Intenta ingresar una contraseña débil (ej: "123456")
4. Deberías ver los requisitos en rojo:
   - ❌ Mínimo 8 caracteres
   - ❌ Al menos una mayúscula
   - ❌ Al menos una minúscula
   - ❌ Al menos un número
   - ❌ Al menos un carácter especial

5. Ingresa una contraseña válida (ej: "Contraseña123!")
6. Deberías ver: **✓ Contraseña válida** en verde

7. Completa el formulario y haz clic en "Crear Cuenta"
8. Deberías recibir un correo de confirmación en el email registrado

### Probar Correo de Confirmación

1. Completa el registro con un email válido
2. Revisa tu bandeja de entrada
3. Deberías recibir un correo con:
   - Asunto: "✅ Bienvenido a SOS-HABILIDOSO - Confirmación de Registro"
   - Información de la cuenta
   - Próximos pasos
   - Enlace para ir al perfil

4. Verifica que los datos también aparezcan en Google Sheets:
   - Abre la hoja de cálculo
   - Ve a la pestaña "Hoja 1"
   - Deberías ver una fila con los datos del nuevo usuario

## 🎨 Estilos de Error

Los errores se muestran con:
- **Borde rojo** en el campo de entrada
- **Texto rojo** debajo del campo
- **Fondo rojo suave** para errores generales

Los éxitos se muestran con:
- **Texto verde** (neon-green)
- **Símbolo ✓** para confirmación

## 📧 Contenido del Correo

El correo de confirmación incluye:

1. **Encabezado**: Logo y bienvenida
2. **Mensaje de éxito**: "✅ ¡Tu cuenta ha sido creada exitosamente!"
3. **Información de la cuenta**:
   - Nombre completo
   - Nombre de usuario
   - Email
   - Habilidad (si se proporcionó)
   - Equipo/Grupo (si se proporcionó)

4. **Próximos pasos**:
   - Completa tu perfil con una foto
   - Agrega tus intereses
   - Comienza a seguir usuarios
   - Comparte tu primer post
   - Únete a comunidades

5. **Pie de página**: Información de contacto

## 🔧 Solución de Problemas

### Los correos no se envían

**Problema**: No recibo correos de confirmación

**Soluciones**:
1. Verifica que la URL en `.env` sea correcta
2. Revisa los logs del backend Django
3. Verifica que Google Apps Script esté autorizado
4. Revisa la carpeta de spam/correo no deseado

### Los datos no aparecen en Google Sheets

**Problema**: El registro se completa pero no aparece en Sheets

**Soluciones**:
1. Verifica que la URL en `.env` sea correcta
2. Asegúrate de que la hoja "Hoja 1" existe
3. Revisa los logs en Google Apps Script (Ver > Registros)
4. Verifica que la implementación esté activa

### Errores de validación no se muestran

**Problema**: Los mensajes de error no aparecen en rojo

**Soluciones**:
1. Limpia el caché del navegador (Ctrl+Shift+Delete)
2. Recarga la página (Ctrl+F5)
3. Verifica que el archivo `auth-page.tsx` esté actualizado

## 📝 Notas Importantes

1. **Contraseña**: Debe cumplir con todos los requisitos para ser válida
2. **Email**: Debe ser único en el sistema
3. **Username**: Debe ser único y tener al menos 3 caracteres
4. **Correos**: Se envían automáticamente desde la cuenta de Google
5. **Respaldo**: Los datos se guardan en Google Sheets además de la BD

## 🚀 Próximos Pasos

Después de configurar todo:

1. Prueba el login y registro
2. Verifica que los correos se envíen correctamente
3. Comprueba que los datos aparezcan en Google Sheets
4. Ajusta los estilos si es necesario
5. Comunica a los usuarios sobre los nuevos requisitos de contraseña

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del backend Django
2. Revisa los logs de Google Apps Script
3. Verifica la consola del navegador (F12)
4. Comprueba que todos los archivos estén actualizados

---

**Última actualización**: 21 de Noviembre de 2025

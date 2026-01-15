# Configuración de Respaldo en Google Sheets

Este documento explica cómo configurar el respaldo automático de datos de registro del Reality Show en Google Sheets.

## 📋 Requisitos

- Cuenta de Google
- Acceso a Google Sheets
- Hoja de cálculo con ID: `1omFWdUv_aWz2HXqI4NTeiHuRYh1fExqDVYclsDYXh10`
- Hoja llamada: `2026`

## 🚀 Pasos de Instalación

### 1. Preparar Google Sheets

1. Abre tu hoja de cálculo en Google Sheets
2. Asegúrate de que existe una hoja llamada `2026`
3. La hoja puede estar vacía, el script creará los encabezados automáticamente

### 2. Configurar Google Apps Script

1. En tu hoja de cálculo, ve a **Extensiones > Apps Script**
2. Borra cualquier código existente
3. Copia todo el contenido del archivo `google_apps_script.js`
4. Pégalo en el editor de Apps Script
5. Haz clic en el icono de **Guardar** (💾)
6. Dale un nombre al proyecto (ej: "Reality Show Backup")

### 3. Implementar como Web App

1. En Apps Script, haz clic en **Implementar > Nueva implementación**
2. Haz clic en el icono de engranaje ⚙️ junto a "Seleccionar tipo"
3. Selecciona **Aplicación web**
4. Configura los siguientes parámetros:
   - **Descripción**: "Reality Show Data Backup"
   - **Ejecutar como**: Selecciona tu cuenta (Yo)
   - **Quién tiene acceso**: Selecciona "Cualquier persona"
5. Haz clic en **Implementar**
6. Autoriza la aplicación cuando se te solicite
7. **IMPORTANTE**: Copia la URL de la aplicación web que aparece

### 4. Configurar el Backend Django

1. Abre el archivo `.env` en la carpeta `backend/`
2. Agrega la siguiente línea con la URL que copiaste:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
```

3. Guarda el archivo

### 5. Reiniciar el Backend

Reinicia el servidor Django para que tome la nueva configuración:

```bash
# Detener el servidor actual (Ctrl+C)
# Luego iniciar nuevamente
cd backend
python -m daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

## 🧪 Probar la Configuración

### Opción 1: Desde Google Apps Script

1. En el editor de Apps Script, selecciona la función `testScript` en el menú desplegable
2. Haz clic en el botón **Ejecutar** (▶️)
3. Revisa los logs (Ver > Registros) para ver el resultado
4. Verifica que aparezca una fila de prueba en tu hoja de cálculo

### Opción 2: Desde la Aplicación

1. Ve a http://localhost:4000/register-habilidosos
2. Completa el formulario de registro
3. Envía el formulario
4. Verifica que:
   - Los datos se guardaron en la base de datos MySQL
   - Los datos también aparecen en Google Sheets

## 📊 Estructura de la Hoja

El script creará automáticamente los siguientes encabezados:

| Columna | Descripción |
|---------|-------------|
| ID | ID del participante en la BD |
| Código | Código único del participante |
| UUID Interno | Identificador UUID |
| Fecha de Registro | Timestamp del registro |
| Nombres | Nombres del participante |
| Apellidos | Apellidos del participante |
| Género | Género del participante |
| Tipo Documento | Tipo de documento |
| Número Documento | Número de documento |
| Fecha Nacimiento | Fecha de nacimiento |
| Edad | Edad calculada |
| Tipo Sangre | Tipo de sangre |
| RH | Factor RH |
| EPS/SISBEN | EPS o SISBEN |
| Subregión | Subregión de Antioquia |
| Municipio | Municipio del participante |
| Municipio Residencia | Municipio de residencia |
| Teléfono Contacto | Teléfono del participante |
| Email | Email del participante |
| Nivel Educación | Nivel educativo |
| Institución Educativa | Nombre de la institución |
| Posición | Posición de juego |
| Nombre Acudiente | Nombre del acudiente |
| Tipo Doc Acudiente | Tipo de documento del acudiente |
| Número Doc Acudiente | Número de documento del acudiente |
| Teléfono Acudiente | Teléfono del acudiente |
| Email Acudiente | Email del acudiente |
| Datos Sensibles | Aceptación de datos sensibles |
| Habeas Data | Aceptación de habeas data |

## 🔧 Solución de Problemas

### El script no se ejecuta

- Verifica que hayas autorizado correctamente la aplicación
- Asegúrate de que la hoja "2026" existe
- Revisa los logs en Apps Script (Ver > Registros)

### Los datos no llegan a Sheets

- Verifica que la URL en `.env` sea correcta
- Asegúrate de que el backend esté reiniciado
- Revisa los logs del backend Django
- Verifica que la implementación esté activa en Apps Script

### Error de permisos

- Asegúrate de haber seleccionado "Cualquier persona" en el acceso
- Vuelve a autorizar la aplicación
- Intenta crear una nueva implementación

## 📝 Notas Importantes

1. **Privacidad**: Los datos se envían a Google Sheets sin el archivo del certificado EPS (solo metadatos)
2. **Respaldo**: El respaldo en Sheets es adicional, no reemplaza la base de datos principal
3. **Fallos**: Si falla el envío a Sheets, el registro en la BD se completa de todas formas
4. **Logs**: Todos los intentos de respaldo se registran en los logs de Django

## 🔄 Actualizar la Implementación

Si necesitas actualizar el script:

1. Edita el código en Apps Script
2. Guarda los cambios
3. Ve a **Implementar > Administrar implementaciones**
4. Haz clic en el icono de lápiz ✏️ de tu implementación
5. Selecciona **Nueva versión**
6. Haz clic en **Implementar**

La URL permanecerá igual, no necesitas actualizar el `.env`.

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
- Los logs de Django en la consola del backend
- Los logs de Apps Script en Google
- La consola del navegador para errores del frontend


---

# Configuración de Respaldo de Registros de Usuarios

Este documento explica cómo configurar el respaldo automático de registros de usuarios en Google Sheets.

## 📋 Requisitos

- Cuenta de Google
- Acceso a Google Sheets
- Hoja de cálculo con ID: `1-zBfqMIun71LO9xpDDseDGbDz28GRCuSH9HlzvML-04`
- Hoja llamada: `Hoja 1`

## 🚀 Pasos de Instalación

### 1. Preparar Google Sheets

1. Abre tu hoja de cálculo en Google Sheets (ID: `1-zBfqMIun71LO9xpDDseDGbDz28GRCuSH9HlzvML-04`)
2. Asegúrate de que existe una hoja llamada `Hoja 1`
3. La hoja puede estar vacía, el script creará los encabezados automáticamente

### 2. Configurar Google Apps Script

1. En tu hoja de cálculo, ve a **Extensiones > Apps Script**
2. Borra cualquier código existente
3. Copia todo el contenido del archivo `google_apps_script_registration.js`
4. Pégalo en el editor de Apps Script
5. Haz clic en el icono de **Guardar** (💾)
6. Dale un nombre al proyecto (ej: "User Registration Backup")

### 3. Implementar como Web App

1. En Apps Script, haz clic en **Implementar > Nueva implementación**
2. Haz clic en el icono de engranaje ⚙️ junto a "Seleccionar tipo"
3. Selecciona **Aplicación web**
4. Configura los siguientes parámetros:
   - **Descripción**: "User Registration Data Backup"
   - **Ejecutar como**: Selecciona tu cuenta (Yo)
   - **Quién tiene acceso**: Selecciona "Cualquier persona"
5. Haz clic en **Implementar**
6. Autoriza la aplicación cuando se te solicite
7. **IMPORTANTE**: Copia la URL de la aplicación web que aparece

### 4. Configurar el Backend Django

1. Abre el archivo `.env` en la carpeta `backend/`
2. Agrega o actualiza la siguiente línea con la URL que copiaste:

```env
GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
```

3. Guarda el archivo

### 5. Reiniciar el Backend

Reinicia el servidor Django para que tome la nueva configuración:

```bash
# Detener el servidor actual (Ctrl+C)
# Luego iniciar nuevamente
cd backend
python -m daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

## 📊 Estructura de la Hoja

El script creará automáticamente los siguientes encabezados:

| Columna | Descripción |
|---------|-------------|
| ID | ID del usuario en la BD |
| Fecha de Registro | Timestamp del registro |
| Email | Email del usuario |
| Nombre de Usuario | Username del usuario |
| Nombre Completo | Nombre completo del usuario |
| Posición/Habilidad | Posición o habilidad del usuario |
| Equipo/Grupo | Equipo o grupo del usuario |
| Intereses | Intereses del usuario (separados por comas) |
| Teléfono | Teléfono de contacto |
| Estado | Estado de la cuenta |

## 📧 Correos de Confirmación

El script también envía automáticamente un correo de confirmación al usuario cuando se registra. El correo incluye:

- Bienvenida personalizada
- Información de la cuenta (nombre, usuario, email)
- Próximos pasos recomendados
- Enlace para ir al perfil

## 🧪 Probar la Configuración

1. Ve a http://localhost:3000/register-habilidosos (o el puerto donde corre el frontend)
2. Completa el formulario de registro
3. Envía el formulario
4. Verifica que:
   - Los datos se guardaron en la base de datos MySQL
   - Los datos también aparecen en Google Sheets
   - Se envió un correo de confirmación al email registrado

## 🔧 Solución de Problemas

### El script no se ejecuta

- Verifica que hayas autorizado correctamente la aplicación
- Asegúrate de que la hoja "Hoja 1" existe
- Revisa los logs en Apps Script (Ver > Registros)

### Los datos no llegan a Sheets

- Verifica que la URL en `.env` sea correcta
- Asegúrate de que el backend esté reiniciado
- Revisa los logs del backend Django
- Verifica que la implementación esté activa en Apps Script

### No se envían correos

- Verifica que la cuenta de Google tenga permisos para enviar correos
- Revisa los logs en Apps Script (Ver > Registros)
- Asegúrate de que el email del usuario sea válido

## 📝 Notas Importantes

1. **Privacidad**: Los datos se envían a Google Sheets de forma segura
2. **Respaldo**: El respaldo en Sheets es adicional, no reemplaza la base de datos principal
3. **Fallos**: Si falla el envío a Sheets, el registro en la BD se completa de todas formas
4. **Correos**: Los correos se envían automáticamente desde la cuenta de Google
5. **Logs**: Todos los intentos de respaldo se registran en los logs de Django


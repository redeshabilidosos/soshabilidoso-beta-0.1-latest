# App Reality - Registro de Participantes

Esta app maneja el registro de participantes para el Reality Show "Un Golazo a tus Sueños".

## 📋 Descripción

Los datos del formulario de registro se guardan en la tabla `participantes` de la base de datos `habilidosos_clean` (Puerto 3307).

## 🔌 Endpoints

### POST /api/reality/register/
Registra un nuevo participante en el Reality Show.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token> (requerido)
```

**Body:**
```json
{
  "names": "Juan",
  "lastnames": "Pérez",
  "gender": "masculino",
  "playingPosition": "Delantero Centro",
  "documentType": "Tarjeta de Identidad",
  "documentNumber": "1234567890",
  "birthDate": "2008-05-15",
  "bloodType": "O",
  "rh": "+",
  "epsSisben": "NUEVA EPS S.A.",
  "epsCertificate": "path/to/certificate.pdf",
  "subregion": "Valle de Aburrá",
  "municipality": "Medellín",
  "contactNumber": "3001234567",
  "email": "juan@example.com",
  "confirmEmail": "juan@example.com",
  "educationLevel": "Secundaria",
  "institutionName": "Colegio XYZ",
  "guardianName": "María Pérez",
  "guardianDocumentType": "Cédula de Ciudadanía",
  "guardianDocumentNumber": "9876543210",
  "guardianContactNumber": "3009876543",
  "guardianEmail": "maria@example.com",
  "residenceMunicipality": "Medellín",
  "acceptSensitiveData": true,
  "acceptHabeasData": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registro exitoso. ¡Bienvenido al Reality Show!",
  "data": {
    "id": 1,
    "codigo": "PART-00001",
    "nombres": "Juan",
    "apellidos": "Pérez"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error en los datos enviados",
  "errors": {
    "fecha_nacimiento": ["Debes tener entre 13 y 19 años para participar"]
  }
}
```

### GET /api/reality/check-status/
Verifica si el usuario actual ya está registrado.

**Headers:**
```
Authorization: Bearer <token> (requerido)
```

**Response:**
```json
{
  "registered": true,
  "data": {
    "codigo": "PART-00001",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "fecha_registro": "2024-11-14T10:30:00Z"
  }
}
```

## 🗄️ Mapeo de Campos

| Campo Formulario | Campo BD | Tipo |
|-----------------|----------|------|
| names | nombres | VARCHAR(100) |
| lastnames | apellidos | VARCHAR(100) |
| gender | genero | VARCHAR(20) |
| playingPosition | position | VARCHAR(100) |
| documentType | tipo_documento_participante | VARCHAR(50) |
| documentNumber | documento_participante | VARCHAR(50) |
| birthDate | fecha_nacimiento | DATE |
| bloodType | tipo_sangre | VARCHAR(5) |
| rh | rh | VARCHAR(5) |
| epsSisben | eps_sisben | VARCHAR(200) |
| epsCertificate | certificado_eps | VARCHAR(500) |
| subregion | subregion | VARCHAR(100) |
| municipality | municipio | VARCHAR(100) |
| contactNumber | telefono_contacto | VARCHAR(20) |
| email | email | VARCHAR(255) |
| confirmEmail | confirm_email | VARCHAR(255) |
| educationLevel | nivel_educacion | VARCHAR(100) |
| institutionName | nombre_ie_educativa | VARCHAR(200) |
| guardianName | nombre_acudiente | VARCHAR(100) |
| guardianDocumentType | tipo_documento_acudiente | VARCHAR(50) |
| guardianDocumentNumber | numero_documento_acudiente | VARCHAR(50) |
| guardianContactNumber | telefono_acudiente | VARCHAR(20) |
| guardianEmail | email_acudiente | VARCHAR(255) |
| residenceMunicipality | municipio_residencia | VARCHAR(100) |
| acceptSensitiveData | sensitive_data | BOOLEAN |
| acceptHabeasData | habeas_data | BOOLEAN |

## 🧪 Pruebas

### Probar conexión y campos:
```bash
cd backend
python test_reality_endpoint.py
```

### Probar endpoint con curl:
```bash
curl -X POST http://localhost:8000/api/reality/register/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @test_data.json
```

## ⚙️ Configuración

### Base de datos
La configuración está en `backend/sos_habilidoso/settings.py`:

```python
DATABASES = {
    'habilidosos_clean': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'habilidosos_clean',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3307',
    }
}
```

### Router
El router `RealityDatabaseRouter` dirige automáticamente todas las operaciones del modelo `Participante` a la base de datos `habilidosos_clean`.

## 📝 Validaciones

- **Edad**: Entre 13 y 19 años
- **Emails**: Deben coincidir
- **Autorizaciones**: Ambas deben ser aceptadas
- **Campos requeridos**: Todos los campos del formulario son obligatorios

## 🚀 Iniciar el servidor

```bash
cd backend
python manage.py runserver 8000
```

El endpoint estará disponible en:
- http://localhost:8000/api/reality/register/
- http://localhost:8000/api/reality/check-status/

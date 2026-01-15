# Mapeo de Campos - Formulario de Inscripción

## Base de Datos: habilidosos_clean
## Tabla: participantes

---

## 📋 Campos Existentes (NO MODIFICAR)

Estos campos ya existen en la tabla y son usados por la otra aplicación:

| Campo en BD | Tipo | Uso en Formulario |
|-------------|------|-------------------|
| `id` | INT AUTO_INCREMENT | ID interno (automático) |
| `uuid_interno` | VARCHAR(36) | UUID único (automático) |
| `codigo` | VARCHAR(50) | Código del participante (automático) |
| `nombres` | VARCHAR(255) | **Nombres del participante** |
| `apellidos` | VARCHAR(255) | **Apellidos del participante** |
| `documento_participante` | VARCHAR(50) | **Número de documento** |
| `tipo_documento_participante` | VARCHAR(10) | **Tipo de documento (CC, TI, CE, etc.)** |
| `fecha_nacimiento` | DATE | **Fecha de nacimiento** |
| `edad` | INT | **Edad (calculada)** |
| `genero` | ENUM | **Género (hombre, mujer, otro)** |
| `tipo_sangre` | VARCHAR(5) | **Tipo de sangre/RH** |
| `email` | VARCHAR(100) | **Email principal** |
| `confirm_email` | VARCHAR(100) | **Confirmación de email** |
| `telefono_contacto` | VARCHAR(20) | **Teléfono de contacto** |
| `municipio` | VARCHAR(255) | **Ciudad/Municipio** |
| `municipio_residencia` | VARCHAR(100) | **Municipio de residencia** |
| `subregion` | VARCHAR(255) | **Subregión** |
| `nombre_acudiente` | VARCHAR(100) | **Nombre del acudiente** |
| `tipo_documento_acudiente` | VARCHAR(10) | **Tipo doc. acudiente** |
| `numero_documento_acudiente` | VARCHAR(20) | **Número doc. acudiente** |
| `telefono_acudiente` | VARCHAR(20) | **Teléfono del acudiente** |
| `nivel_educacion` | VARCHAR(50) | **Nivel educativo** |
| `nombre_ie_educativa` | VARCHAR(200) | **Institución educativa** |
| `position` | VARCHAR(100) | **Posición de juego** |
| `equipo_id` | INT | **ID del equipo (si aplica)** |
| `avatar_url` | TEXT | **URL de la foto de perfil** |
| `clasificado_portugal` | TINYINT(1) | **Clasificado (flag interno)** |
| `observacion_general` | TEXT | **Observaciones generales** |
| `sensitive_data` | TINYINT(1) | **Autorización datos sensibles** |
| `habeas_data` | TINYINT(1) | **Aceptación habeas data** |
| `timestamp` | DATETIME | **Fecha de registro** |
| `created_at` | TIMESTAMP | **Fecha de creación** |

---

## ➕ Campos Nuevos a Agregar

Estos campos se agregarán SIN afectar los existentes:

| Campo Nuevo | Tipo | Descripción |
|-------------|------|-------------|
| `eps` | VARCHAR(200) | Entidad Promotora de Salud |
| `certificado_eps` | VARCHAR(500) | Ruta del archivo del certificado EPS |
| `sisben` | ENUM('A','B','C','D','No aplica') | Nivel de SISBEN |
| `estrato` | INT | Estrato socioeconómico (1-6) |
| `ocupacion` | VARCHAR(200) | Ocupación actual |
| `parentesco_acudiente` | VARCHAR(100) | Parentesco con el acudiente |
| `direccion` | TEXT | Dirección completa de residencia |
| `telefono_emergencia` | VARCHAR(20) | Teléfono de emergencia |
| `departamento` | VARCHAR(100) | Departamento de residencia |
| `posicion_juego` | VARCHAR(50) | Posición en el campo |
| `equipo_actual` | VARCHAR(100) | Equipo actual |
| `anos_experiencia` | INT | Años de experiencia |
| `logros_deportivos` | TEXT | Logros deportivos |
| `video_presentacion` | VARCHAR(500) | URL del video |
| `documento_identidad_archivo` | VARCHAR(500) | Archivo del documento |
| `autorizacion_datos` | BOOLEAN | Autorización datos personales |
| `autorizacion_imagen` | BOOLEAN | Autorización uso de imagen |
| `terminos_condiciones` | BOOLEAN | Aceptación términos |
| `estado_solicitud` | ENUM | Estado de la solicitud |
| `notas_evaluacion` | TEXT | Notas de evaluación |
| `puntaje_evaluacion` | DECIMAL(5,2) | Puntaje de evaluación |
| `fecha_actualizacion` | DATETIME | Fecha de actualización |

---

## 🔄 Mapeo Formulario → Base de Datos

### Datos Personales
```
Formulario                    →  Base de Datos
─────────────────────────────────────────────────
Nombres                       →  nombres
Apellidos                     →  apellidos
Género                        →  genero
Tipo de documento             →  tipo_documento_participante
Número de documento           →  documento_participante
Fecha de nacimiento           →  fecha_nacimiento
Edad (calculada)              →  edad
```

### Información de Contacto
```
Email                         →  email
Confirmar email               →  confirm_email
Teléfono                      →  telefono_contacto
Teléfono emergencia           →  telefono_emergencia (NUEVO)
Ciudad                        →  municipio
Departamento                  →  departamento (NUEVO)
Dirección                     →  direccion (NUEVO)
```

### Información de Salud
```
Tipo de sangre/RH             →  tipo_sangre
EPS                           →  eps (NUEVO)
Certificado EPS               →  certificado_eps (NUEVO)
SISBEN                        →  sisben (NUEVO)
```

### Información Socioeconómica
```
Estrato                       →  estrato (NUEVO)
Nivel educativo               →  nivel_educacion
Institución educativa         →  nombre_ie_educativa
Ocupación                     →  ocupacion (NUEVO)
```

### Información Deportiva
```
Posición de juego             →  position / posicion_juego (NUEVO)
Equipo actual                 →  equipo_actual (NUEVO)
Años de experiencia           →  anos_experiencia (NUEVO)
Logros deportivos             →  logros_deportivos (NUEVO)
```

### Acudiente
```
Nombre acudiente              →  nombre_acudiente
Tipo doc. acudiente           →  tipo_documento_acudiente
Número doc. acudiente         →  numero_documento_acudiente
Teléfono acudiente            →  telefono_acudiente
Parentesco                    →  parentesco_acudiente (NUEVO)
```

### Archivos
```
Foto de perfil                →  avatar_url
Video presentación            →  video_presentacion (NUEVO)
Documento identidad           →  documento_identidad_archivo (NUEVO)
```

### Autorizaciones
```
Autorización datos            →  sensitive_data / autorizacion_datos (NUEVO)
Autorización imagen           →  autorizacion_imagen (NUEVO)
Habeas data                   →  habeas_data
Términos y condiciones        →  terminos_condiciones (NUEVO)
```

---

## 📝 Instrucciones de Uso

### 1. Agregar Campos Faltantes
```bash
# Opción 1: Ejecutar script SQL
mysql -u root -p -P 3307 < backend/scripts/add_missing_participantes_fields.sql

# Opción 2: Ejecutar script Python
cd backend
python scripts/check_and_update_participantes.py --apply
```

### 2. Verificar Cambios
```sql
USE habilidosos_clean;
DESCRIBE participantes;
```

### 3. Implementar en el Backend
El endpoint debe mapear los campos del formulario a los campos de la BD:

```python
# Ejemplo de mapeo en Django/Python
data_to_save = {
    'nombres': form_data['nombres'],
    'apellidos': form_data['apellidos'],
    'documento_participante': form_data['numero_documento'],
    'tipo_documento_participante': form_data['tipo_documento'],
    'fecha_nacimiento': form_data['fecha_nacimiento'],
    'edad': calculate_age(form_data['fecha_nacimiento']),
    'genero': form_data['genero'],
    'tipo_sangre': form_data['rh'],
    'eps': form_data['eps'],  # NUEVO
    'certificado_eps': uploaded_file_path,  # NUEVO
    # ... más campos
}
```

---

## ⚠️ IMPORTANTE

1. **NO MODIFICAR** campos existentes para no romper la aplicación en puerto 3000
2. **SOLO AGREGAR** campos nuevos que falten
3. **MAPEAR CORRECTAMENTE** los campos del formulario a los de la BD
4. **VALIDAR** que los tipos de datos coincidan
5. **PROBAR** en ambiente de desarrollo antes de producción

---

## 🚀 Próximos Pasos

1. ✅ Ejecutar script SQL para agregar campos
2. ⏳ Crear endpoint en Django para recibir datos del formulario
3. ⏳ Implementar lógica de mapeo de campos
4. ⏳ Configurar subida de archivos (EPS, documento, video)
5. ⏳ Probar integración completa

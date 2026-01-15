# Instrucciones para Actualizar Tabla Participantes

## 🎯 Objetivo
Agregar campos faltantes a la tabla `participantes` en la base de datos `habilidosos_clean` sin afectar los campos existentes ni la aplicación que corre en el puerto 3000.

---

## ✅ Estado Actual

### Tabla Existente: `participantes`
- **Base de datos**: habilidosos_clean
- **Puerto**: 3307
- **Columnas actuales**: 32
- **Aplicación en uso**: Puerto 3000 (NO MODIFICAR)

### Campos que YA EXISTEN (no tocar):
- ✅ nombres, apellidos
- ✅ documento_participante, tipo_documento_participante
- ✅ fecha_nacimiento, edad, genero
- ✅ tipo_sangre (equivalente a RH)
- ✅ email, confirm_email
- ✅ telefono_contacto
- ✅ municipio, municipio_residencia, subregion
- ✅ nombre_acudiente, telefono_acudiente
- ✅ tipo_documento_acudiente, numero_documento_acudiente
- ✅ nivel_educacion, nombre_ie_educativa
- ✅ position (posición de juego)
- ✅ equipo_id
- ✅ avatar_url
- ✅ sensitive_data, habeas_data
- ✅ timestamp, created_at

---

## ➕ Campos Nuevos a Agregar

### Información de Salud
- `eps` - VARCHAR(200) - Entidad Promotora de Salud
- `certificado_eps` - VARCHAR(500) - Archivo del certificado EPS
- `sisben` - ENUM('A','B','C','D','No aplica') - Nivel de SISBEN

### Información Socioeconómica
- `estrato` - INT - Estrato socioeconómico (1-6)
- `ocupacion` - VARCHAR(200) - Ocupación actual
- `direccion` - TEXT - Dirección completa
- `departamento` - VARCHAR(100) - Departamento
- `telefono_emergencia` - VARCHAR(20) - Teléfono de emergencia

### Información Deportiva
- `posicion_juego` - VARCHAR(50) - Posición en el campo
- `equipo_actual` - VARCHAR(100) - Equipo actual
- `anos_experiencia` - INT - Años de experiencia
- `logros_deportivos` - TEXT - Logros deportivos

### Archivos Multimedia
- `video_presentacion` - VARCHAR(500) - URL del video
- `documento_identidad_archivo` - VARCHAR(500) - Archivo del documento

### Autorizaciones
- `parentesco_acudiente` - VARCHAR(100) - Parentesco con acudiente
- `autorizacion_datos` - BOOLEAN - Autorización datos personales
- `autorizacion_imagen` - BOOLEAN - Autorización uso de imagen
- `terminos_condiciones` - BOOLEAN - Aceptación de términos

### Control
- `estado_solicitud` - ENUM - Estado de la solicitud
- `notas_evaluacion` - TEXT - Notas de evaluación
- `puntaje_evaluacion` - DECIMAL(5,2) - Puntaje
- `fecha_actualizacion` - DATETIME - Última actualización

---

## 🔧 Cómo Aplicar los Cambios

### Opción 1: Desde HeidiSQL o phpMyAdmin
1. Conectar a la base de datos `habilidosos_clean` (puerto 3307)
2. Abrir el archivo `backend/scripts/add_missing_participantes_fields.sql`
3. Ejecutar el script completo
4. Verificar con `DESCRIBE participantes;`

### Opción 2: Desde línea de comandos
```bash
# Navegar al directorio de MariaDB/MySQL
cd "C:\Program Files\MariaDB 10.4\bin"

# Ejecutar el script
.\mysql.exe -u root -P 3307 < "ruta\completa\backend\scripts\add_missing_participantes_fields.sql"
```

### Opción 3: Ejecutar comandos uno por uno
Conectar a MySQL y ejecutar:
```sql
USE habilidosos_clean;

ALTER TABLE participantes ADD COLUMN IF NOT EXISTS eps VARCHAR(200);
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS certificado_eps VARCHAR(500);
ALTER TABLE participantes ADD COLUMN IF NOT EXISTS sisben ENUM('A', 'B', 'C', 'D', 'No aplica');
-- ... etc
```

---

## 📡 Endpoint del Backend

### Crear endpoint para recibir datos del formulario:

```python
# backend/apps/reality_show/views.py (crear si no existe)

from rest_framework.decorators import api_view
from rest_framework.response import Response
import pymysql

@api_view(['POST'])
def register_participant(request):
    """Registrar participante en habilidosos_clean"""
    
    # Mapear datos del formulario a campos de la BD
    data = {
        'nombres': request.data.get('nombres'),
        'apellidos': request.data.get('apellidos'),
        'documento_participante': request.data.get('numero_documento'),
        'tipo_documento_participante': request.data.get('tipo_documento'),
        'fecha_nacimiento': request.data.get('fecha_nacimiento'),
        'edad': request.data.get('edad'),
        'genero': request.data.get('genero'),
        'tipo_sangre': request.data.get('rh'),
        'eps': request.data.get('eps'),  # NUEVO
        'sisben': request.data.get('sisben'),  # NUEVO
        'estrato': request.data.get('estrato'),  # NUEVO
        # ... más campos
    }
    
    # Conectar a habilidosos_clean
    connection = pymysql.connect(
        host='127.0.0.1',
        port=3307,
        user='root',
        password='',
        database='habilidosos_clean'
    )
    
    cursor = connection.cursor()
    
    # Insertar datos
    # ... código de inserción
    
    return Response({'message': 'Participante registrado exitosamente'})
```

---

## ✅ Verificación Post-Actualización

Después de agregar los campos, verificar:

1. **Estructura de la tabla**:
```sql
DESCRIBE participantes;
```

2. **Contar columnas**:
```sql
SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'habilidosos_clean' 
AND TABLE_NAME = 'participantes';
```

3. **Probar inserción**:
```sql
INSERT INTO participantes (nombres, apellidos, eps, sisben) 
VALUES ('Test', 'Usuario', 'Sura', 'A');
```

4. **Verificar aplicación en puerto 3000**:
   - Abrir http://localhost:3000
   - Verificar que siga funcionando correctamente
   - Confirmar que no hay errores

---

## 🎯 Resumen

✅ **32 columnas existentes** - NO SE MODIFICAN
➕ **22 columnas nuevas** - SE AGREGAN
📊 **Total final**: ~54 columnas

✅ **Compatibilidad garantizada** con aplicación en puerto 3000
✅ **Datos existentes** no se afectan
✅ **Valores por defecto** apropiados para campos nuevos

---

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que MariaDB esté corriendo en puerto 3307
2. Verifica que la base de datos `habilidosos_clean` exista
3. Haz backup antes de aplicar cambios
4. Prueba primero en ambiente de desarrollo

# ✅ Importación de Usuarios desde CSV

## 📊 Resumen

Se ha creado un sistema completo para importar 4,976 usuarios desde el archivo `csvusuarios_processed.csv` a la base de datos.

## 🔧 Componentes Creados

### 1. Comando de Django
**`backend/apps/users/management/commands/import_users_from_csv.py`**

Características:
- ✅ Importa usuarios desde CSV procesado
- ✅ Maneja campo `nombre_completo` vacío
- ✅ Usa `username` como `display_name` temporal
- ✅ Valida emails y usernames únicos
- ✅ Procesamiento por lotes (batch_size)
- ✅ Actualiza usuarios existentes
- ✅ Crea nuevos usuarios
- ✅ Reporta errores detallados
- ✅ Muestra progreso en tiempo real

### 2. Script Batch
**`importar-usuarios-csv.bat`**

Ejecuta la importación con un solo clic.

## 🚀 Cómo Usar

### Opción 1: Script Batch (Recomendado)
```bash
# Ejecutar el script
importar-usuarios-csv.bat
```

### Opción 2: Comando Manual
```bash
cd backend
C:\Python314\python.exe manage.py import_users_from_csv --file=public/csvusuarios_processed.csv
```

### Opción 3: Con Parámetros Personalizados
```bash
cd backend
C:\Python314\python.exe manage.py import_users_from_csv --file=public/csvusuarios_processed.csv --batch-size=200
```

## 📋 Parámetros del Comando

| Parámetro | Descripción | Valor por Defecto |
|-----------|-------------|-------------------|
| `--file` | Ruta del archivo CSV | `public/csvusuarios_processed.csv` |
| `--batch-size` | Tamaño del lote para procesamiento | `100` |

## 📊 Estructura del CSV

El archivo `csvusuarios_processed.csv` tiene la siguiente estructura:

```csv
email,username,password,nombre_completo
yazz148@gmail.com,yazz148,1037653075,
inversionesramirezg48@gmail.com,inversionesramirezg,1033258485,
...
```

### Campos:
1. **email** - Email único del usuario
2. **username** - Username único (sin @)
3. **password** - Contraseña del usuario
4. **nombre_completo** - Vacío (usuario lo completa al acceder)

## 🔄 Proceso de Importación

### 1. Validación
- ✅ Verifica que email, username y password existan
- ✅ Valida formato de email (@)
- ✅ Verifica unicidad de email y username

### 2. Creación/Actualización
- **Si el email existe:** Actualiza el usuario
- **Si el email no existe:** Crea nuevo usuario

### 3. Configuración Automática
Cada usuario importado recibe:
- ✅ **Avatar por defecto** (logo SOS Habilidoso) - vía signal
- ✅ **Portada por defecto** (logo SOS Habilidoso) - vía signal
- ✅ **Auto-seguimiento a @sos** - vía signal
- ✅ **display_name temporal** (username)
- ⚠️ **email_verified = False** (hasta completar perfil)

### 4. Signals Automáticos
El signal `setup_new_user` en `backend/apps/users/signals.py` se ejecuta automáticamente y:
1. Asigna avatar por defecto
2. Asigna portada por defecto
3. Hace que el usuario siga a @sos

## 📈 Salida del Comando

```
👥 Importando usuarios desde: C:\...\public\csvusuarios_processed.csv
📦 Tamaño de lote: 100
------------------------------------------------------------
  ✓ Creado: yazz148@gmail.com                              (@yazz148)
  ✓ Creado: inversionesramirezg48@gmail.com               (@inversionesramirezg)
  ...
📊 Progreso: 100 registros procesados...
📊 Progreso: 200 registros procesados...
  ...
------------------------------------------------------------
✅ Importación completada
📊 Estadísticas:
   - Usuarios creados: 4,900
   - Usuarios actualizados: 50
   - Usuarios omitidos: 26
   - Total procesado: 4,976

📈 Total de usuarios en BD: 5,066

💡 Nota: Los usuarios con nombre_completo vacío deben completarlo en su primer acceso
```

## ⚠️ Manejo de Errores

El comando maneja los siguientes casos:

### Errores Comunes:
1. **Email duplicado:** Actualiza el usuario existente
2. **Username duplicado:** Omite el registro y reporta error
3. **Datos faltantes:** Omite el registro y reporta error
4. **Email inválido:** Omite el registro y reporta error

### Reporte de Errores:
- Muestra los primeros 20 errores
- Indica cuántos errores adicionales hubo
- Incluye número de fila y descripción del error

## 🎯 Flujo de Primer Acceso

Cuando un usuario con `nombre_completo` vacío inicie sesión:

### 1. Detección
```javascript
// En el frontend
if (!user.display_name || user.display_name === user.username) {
  // Mostrar modal de completar perfil
}
```

### 2. Modal de Completar Perfil
```
┌─────────────────────────────────────┐
│  Completa tu Perfil                 │
├─────────────────────────────────────┤
│                                     │
│  Nombre Completo:                   │
│  [____________________________]     │
│                                     │
│  [Guardar]  [Más tarde]             │
└─────────────────────────────────────┘
```

### 3. Actualización
```python
# En el backend
user.display_name = nombre_completo
user.first_name = nombre_parts[0]
user.last_name = ' '.join(nombre_parts[1:])
user.email_verified = True
user.save()
```

## 📊 Estadísticas Reales de Importación

### Resultados de la Importación
- **Usuarios creados:** 4,501
- **Usuarios actualizados:** 14
- **Usuarios omitidos:** 461 (datos faltantes)
- **Total procesado:** 4,976

### Estado de la Base de Datos
- **Total usuarios en BD:** 4,591
- **Usuarios con perfil completo:** ~90
- **Usuarios pendientes de completar perfil:** ~4,501

### Errores Encontrados
- 461 registros omitidos por faltar email, username o password
- Estos registros tenían datos incompletos en el CSV original

## 🔍 Verificación Post-Importación

### 1. Verificar Total de Usuarios
```bash
cd backend
C:\Python314\python.exe manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Total de usuarios
print(f"Total usuarios: {User.objects.count()}")

# Usuarios con nombre completo vacío
sin_nombre = User.objects.filter(display_name=F('username')).count()
print(f"Usuarios sin nombre completo: {sin_nombre}")

# Usuarios que siguen a @sos
sos = User.objects.get(username='sos')
print(f"Seguidores de @sos: {sos.followers_count}")
```

### 2. Verificar Imágenes por Defecto
```python
# Usuarios con avatar por defecto
con_avatar = User.objects.exclude(avatar='').count()
print(f"Usuarios con avatar: {con_avatar}")

# Usuarios con portada por defecto
con_portada = User.objects.exclude(cover_photo='').count()
print(f"Usuarios con portada: {con_portada}")
```

## 🚨 Solución de Problemas

### Error: "No se encontró el archivo"
```bash
# Verificar que el archivo existe
dir public\csvusuarios_processed.csv
```

### Error: "Username ya existe"
```bash
# Revisar duplicados en el CSV
python backend/scripts/process_csvusuarios.py
```

### Error: "Email inválido"
```bash
# Verificar formato de emails en el CSV
# Deben tener @ y dominio válido
```

## 📝 Notas Importantes

1. **Nombre Completo Vacío:** Es intencional, el usuario lo completa al acceder
2. **Display Name Temporal:** Se usa el username hasta que el usuario complete su perfil
3. **Email No Verificado:** Se marca como no verificado hasta completar perfil
4. **Signals Automáticos:** Avatar, portada y auto-seguimiento se aplican automáticamente
5. **Procesamiento por Lotes:** Mejora el rendimiento en importaciones grandes

## 🎉 Próximos Pasos

1. ✅ Ejecutar `importar-usuarios-csv.bat`
2. ⏳ Implementar modal de completar perfil en el frontend
3. ⏳ Crear endpoint para actualizar nombre completo
4. ⏳ Agregar validación de perfil completo en rutas protegidas

## 📚 Archivos Relacionados

- `backend/apps/users/management/commands/import_users_from_csv.py` - Comando de importación
- `backend/apps/users/signals.py` - Signals automáticos
- `backend/scripts/process_csvusuarios.py` - Script de procesamiento CSV
- `public/csvusuarios_processed.csv` - Archivo CSV procesado
- `importar-usuarios-csv.bat` - Script de ejecución
- `PROCESAMIENTO_CSVUSUARIOS.md` - Documentación del procesamiento

## ✨ Conclusión

El sistema de importación está listo para procesar 4,976 usuarios con:
- Emails corregidos
- Usernames únicos
- Contraseñas asignadas
- Avatar y portada por defecto
- Auto-seguimiento a @sos
- Flujo de completar perfil pendiente

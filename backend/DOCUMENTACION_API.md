# Documentación API - SOS-HABILIDOSO

## 🚀 Configuración de la Documentación API

La documentación API utiliza **drf-spectacular** para generar automáticamente documentación interactiva de todos los endpoints de la API REST.

### ✅ Habilitar/Deshabilitar Documentación

La documentación se puede habilitar o deshabilitar usando la variable de entorno `ENABLE_API_DOCS`.

#### Método 1: Scripts Automáticos

**PowerShell (Windows):**
```powershell
# Habilitar documentación
.\scripts\toggle_api_docs.ps1 enable

# Deshabilitar documentación
.\scripts\toggle_api_docs.ps1 disable
```

**Python (Multiplataforma):**
```bash
# Habilitar documentación
python scripts/toggle_api_docs.py enable

# Deshabilitar documentación
python scripts/toggle_api_docs.py disable
```

#### Método 2: Manual

Edita el archivo `.env` y cambia:
```env
# Para habilitar
ENABLE_API_DOCS=true

# Para deshabilitar
ENABLE_API_DOCS=false
```

### 🔄 Aplicar Cambios

Después de cambiar la configuración, **reinicia el servidor Django**:
```bash
python manage.py runserver
```

## 📚 Acceso a la Documentación

Cuando está habilitada, la documentación está disponible en:

### 🎯 Swagger UI (Recomendado)
- **URL:** http://127.0.0.1:8000/api/docs/
- **Características:**
  - Interfaz interactiva
  - Prueba de endpoints en vivo
  - Autenticación JWT integrada
  - Filtros y búsqueda

### 📖 ReDoc
- **URL:** http://127.0.0.1:8000/api/redoc/
- **Características:**
  - Documentación estática elegante
  - Navegación por categorías
  - Ejemplos de código
  - Responsive design

### 🔧 Schema JSON/YAML
- **URL:** http://127.0.0.1:8000/api/schema/
- **Formato:** OpenAPI 3.0
- **Uso:** Integración con herramientas externas

## 🔐 Autenticación en la Documentación

### 1. Obtener Token JWT

**Endpoint:** `POST /api/auth/login/`
```json
{
  "username": "tu_usuario",
  "password": "tu_contraseña"
}
```

**Respuesta:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 2. Usar Token en Swagger UI

1. Clic en el botón **"Authorize"** (🔒)
2. Ingresa: `Bearer tu_access_token`
3. Clic en **"Authorize"**
4. Ahora puedes probar endpoints protegidos

## 📋 Endpoints Principales

### 🔐 Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/register/` - Registrarse
- `POST /api/auth/refresh/` - Renovar token
- `POST /api/auth/logout/` - Cerrar sesión

### 👥 Usuarios
- `GET /api/users/` - Listar usuarios
- `GET /api/users/{id}/` - Detalle de usuario
- `PUT /api/users/{id}/` - Actualizar perfil

### 📱 Publicaciones
- `GET /api/posts/` - Feed de publicaciones
- `POST /api/posts/` - Crear publicación
- `GET /api/posts/{id}/` - Detalle de publicación

### 🎥 Reels
- `GET /api/reels/` - Listar reels
- `POST /api/reels/` - Subir reel
- `GET /api/reels/{id}/` - Ver reel

### 🏛️ Eventos Culturales
- `GET /api/cultural-events/` - Listar eventos
- `POST /api/cultural-events/` - Crear evento
- `GET /api/cultural-events/{id}/` - Detalle de evento

### 📢 Clasificados
- `GET /api/classifieds/` - Listar clasificados
- `POST /api/classifieds/` - Publicar clasificado
- `GET /api/classifieds/{id}/` - Ver clasificado

## ⚠️ Resolución de Problemas

### Error: "drf_spectacular not found"
**Solución:** Verifica que esté instalado:
```bash
pip install drf-spectacular[sidecar]
```

### Error: "SPECTACULAR_SETTINGS not defined"
**Solución:** Asegúrate de que `ENABLE_API_DOCS=true` en `.env`

### Error: "Schema generation failed"
**Solución:** 
1. Deshabilita temporalmente: `ENABLE_API_DOCS=false`
2. Reinicia el servidor
3. Vuelve a habilitar: `ENABLE_API_DOCS=true`

### Servidor no inicia con documentación habilitada
**Solución:**
1. Revisa los logs de Django
2. Verifica que no haya errores en los serializers
3. Usa el modo de depuración:
   ```bash
   python manage.py runserver --verbosity=2
   ```

## 🎨 Personalización

### Cambiar Tema de ReDoc
Edita `SPECTACULAR_SETTINGS['REDOC_UI_SETTINGS']['theme']` en `settings/base.py`

### Agregar Información de Contacto
Modifica `SPECTACULAR_SETTINGS['CONTACT']` en `settings/base.py`

### Personalizar Tags
Actualiza `SPECTACULAR_SETTINGS['TAGS']` en `settings/base.py`

## 🚀 Producción

En producción, considera:

1. **Deshabilitar en producción:**
   ```env
   ENABLE_API_DOCS=false
   ```

2. **O restringir acceso:**
   - Usar autenticación adicional
   - Limitar por IP
   - Usar subdominios separados

3. **Optimizar rendimiento:**
   - Cachear el schema generado
   - Usar CDN para archivos estáticos

## 📞 Soporte

Si tienes problemas con la documentación API:

1. Revisa este documento
2. Verifica los logs de Django
3. Usa el modo de depuración
4. Consulta la documentación oficial de drf-spectacular

---

**Última actualización:** Enero 2025
**Versión API:** 1.0.0
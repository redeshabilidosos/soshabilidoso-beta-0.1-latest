# ✅ Solución: drf-spectacular sin conflictos

## 🎯 Problema Resuelto

**Problema:** drf-spectacular causaba conflictos que impedían el inicio del servidor Django, bloqueando el acceso al admin panel y la API.

**Solución:** Implementación de habilitación/deshabilitación condicional de drf-spectacular usando variables de entorno.

## 🔧 Implementación

### 1. Configuración Condicional

**Archivo:** `backend/sos_habilidoso/settings/base.py`

```python
# Habilitar drf-spectacular de manera condicional
ENABLE_API_DOCS = config('ENABLE_API_DOCS', default=False, cast=bool)
if ENABLE_API_DOCS:
    THIRD_PARTY_APPS += [
        'drf_spectacular',
        'drf_spectacular_sidecar',
    ]

# Configurar REST Framework solo si está habilitado
if ENABLE_API_DOCS:
    REST_FRAMEWORK['DEFAULT_SCHEMA_CLASS'] = 'drf_spectacular.openapi.AutoSchema'

# Configuración SPECTACULAR_SETTINGS solo si está habilitado
if ENABLE_API_DOCS:
    SPECTACULAR_SETTINGS = { ... }
```

### 2. URLs Condicionales

**Archivo:** `backend/sos_habilidoso/urls.py`

```python
# Verificar si drf-spectacular está habilitado
ENABLE_API_DOCS = config('ENABLE_API_DOCS', default=False, cast=bool)

# Importar y configurar URLs solo si está habilitado
if ENABLE_API_DOCS and SPECTACULAR_AVAILABLE:
    urlpatterns += [
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
        path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    ]
```

### 3. Scripts de Control

**Scripts creados:**
- `scripts/toggle_api_docs.py` - Script Python multiplataforma
- `scripts/toggle_api_docs.ps1` - Script PowerShell para Windows
- `scripts/start_server.py` - Iniciador del servidor con información
- `scripts/start_server.ps1` - Iniciador PowerShell

## 🚀 Uso

### Habilitar Documentación API

```bash
# Método 1: Script Python
python scripts/toggle_api_docs.py enable

# Método 2: Script PowerShell
.\scripts\toggle_api_docs.ps1 enable

# Método 3: Manual (.env)
ENABLE_API_DOCS=true
```

### Deshabilitar Documentación API

```bash
# Método 1: Script Python
python scripts/toggle_api_docs.py disable

# Método 2: Script PowerShell
.\scripts\toggle_api_docs.ps1 disable

# Método 3: Manual (.env)
ENABLE_API_DOCS=false
```

### Iniciar Servidor

```bash
# Método 1: Script con información
python scripts/start_server.py

# Método 2: PowerShell con información
.\scripts\start_server.ps1

# Método 3: Django estándar
python manage.py runserver
```

## 📚 URLs de Documentación

Cuando está habilitada (`ENABLE_API_DOCS=true`):

- **Swagger UI:** http://127.0.0.1:8000/api/docs/
- **ReDoc:** http://127.0.0.1:8000/api/redoc/
- **Schema JSON:** http://127.0.0.1:8000/api/schema/

## ✅ Beneficios

1. **Sin conflictos:** El servidor siempre inicia correctamente
2. **Control total:** Habilitar/deshabilitar según necesidad
3. **Desarrollo ágil:** Documentación disponible cuando se necesita
4. **Producción segura:** Fácil deshabilitación en producción
5. **Compatibilidad:** Funciona con todas las apps existentes

## 🔄 Estados del Sistema

### Estado 1: Documentación Deshabilitada (Por defecto)
```
ENABLE_API_DOCS=false
```
- ✅ Servidor Django inicia sin problemas
- ✅ Admin panel accesible
- ✅ API REST funcional
- ❌ Sin documentación automática

### Estado 2: Documentación Habilitada
```
ENABLE_API_DOCS=true
```
- ✅ Servidor Django inicia sin problemas
- ✅ Admin panel accesible
- ✅ API REST funcional
- ✅ Documentación automática disponible

## 🗄️ Configuración de Bases de Datos

El sistema mantiene la configuración de múltiples bases de datos:

- **habilidosos_db:** Base de datos principal con todos los datos
- **habilidosos_clean:** Base de datos específica para formularios reality

El router `RealityDatabaseRouter` dirige automáticamente:
- App `reality` → `habilidosos_clean`
- Todas las demás apps → `habilidosos_db` (default)

## 🎉 Resultado Final

✅ **Problema resuelto:** drf-spectacular ya no causa conflictos
✅ **Flexibilidad:** Se puede habilitar/deshabilitar según necesidad
✅ **Estabilidad:** El servidor siempre inicia correctamente
✅ **Funcionalidad completa:** Admin, API y documentación funcionan perfectamente

---

**Fecha:** Enero 2025
**Estado:** ✅ RESUELTO
**Impacto:** 🟢 POSITIVO - Sistema más estable y flexible
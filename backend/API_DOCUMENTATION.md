# 📖 Documentación API SOS-HABILIDOSO

## 🚀 Acceso Rápido

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva:

### 🎯 Interfaces Disponibles

| Interfaz | URL | Descripción |
|----------|-----|-------------|
| **Swagger UI** | `http://127.0.0.1:8000/api/docs/` | Interfaz interactiva principal - Prueba endpoints directamente |
| **ReDoc** | `http://127.0.0.1:8000/api/redoc/` | Documentación limpia y profesional |
| **Esquema OpenAPI** | `http://127.0.0.1:8000/api/schema/` | Esquema JSON/YAML para herramientas externas |

### 🔧 Configuración Inicial

1. **Instalar dependencias:**
   ```bash
   pip install drf-spectacular==0.27.0
   pip install drf-spectacular[sidecar]==0.27.0
   ```

2. **Ejecutar configuración:**
   ```bash
   python setup_api_docs.py
   ```

3. **Iniciar servidor:**
   ```bash
   python manage.py runserver
   ```

## 🏗️ Estructura de la API

### 🔐 Autenticación
- **Base URL:** `/api/auth/`
- **Método:** JWT (JSON Web Tokens)
- **Endpoints principales:**
  - `POST /api/auth/login/` - Iniciar sesión
  - `POST /api/auth/register/` - Registrar usuario
  - `GET /api/auth/profile/` - Obtener perfil
  - `PUT /api/auth/profile/` - Actualizar perfil
  - `POST /api/auth/logout/` - Cerrar sesión

### 👥 Usuarios
- **Base URL:** `/api/users/`
- **Funcionalidades:**
  - Gestión de perfiles
  - Búsqueda de usuarios
  - Seguimiento/Amistades
  - Configuraciones de privacidad

### 📱 Feed Social
- **Base URL:** `/api/posts/`
- **Funcionalidades:**
  - Crear publicaciones
  - Feed personalizado
  - Likes y comentarios
  - Compartir contenido

### 🎥 Reels
- **Base URL:** `/api/reels/`
- **Funcionalidades:**
  - Videos cortos
  - Efectos y filtros
  - Trending content
  - Interacciones

### 🏛️ Eventos Culturales
- **Base URL:** `/api/cultural-events/`
- **Funcionalidades:**
  - Crear eventos
  - Categorías de eventos
  - Inscripciones
  - Calendario

### 📢 Clasificados
- **Base URL:** `/api/classifieds/`
- **Funcionalidades:**
  - Anuncios de trabajo
  - Servicios
  - Productos
  - Colaboraciones

### 🎓 Sistema de Aprendizaje
- **Base URL:** `/api/learning/`
- **Funcionalidades:**
  - Cursos y lecciones
  - Progreso del usuario
  - Certificaciones
  - Analytics de aprendizaje

### 👥 Comunidades
- **Base URL:** `/api/communities/`
- **Funcionalidades:**
  - Crear grupos
  - Gestión de miembros
  - Publicaciones de grupo
  - Eventos privados

### 💬 Mensajería
- **Base URL:** `/api/messaging/`
- **Funcionalidades:**
  - Chat privado
  - Mensajes grupales
  - Archivos multimedia
  - Estado de lectura

### 🔔 Notificaciones
- **Base URL:** `/api/notifications/`
- **Funcionalidades:**
  - Push notifications
  - Notificaciones en tiempo real
  - Configuraciones de usuario
  - Historial

### 💰 Donaciones
- **Base URL:** `/api/donations/`
- **Funcionalidades:**
  - Campañas de crowdfunding
  - Procesamiento de pagos
  - Seguimiento de metas
  - Reportes

### 🏢 Empresas
- **Base URL:** `/api/enterprises/`
- **Funcionalidades:**
  - Perfiles empresariales
  - Servicios y productos
  - Empleados
  - Estadísticas

### 💳 Pagos
- **Base URL:** `/api/payments/`
- **Funcionalidades:**
  - Procesamiento de pagos
  - Métodos de pago
  - Historial de transacciones
  - Facturación

### 📁 Multimedia
- **Base URL:** `/api/media/`
- **Funcionalidades:**
  - Subida de archivos
  - Álbumes de fotos
  - Gestión de videos
  - Optimización automática

### 📖 Historias
- **Base URL:** `/api/stories/`
- **Funcionalidades:**
  - Historias temporales
  - Visualizaciones
  - Reacciones
  - Archivos

### ⚙️ Configuración
- **Base URL:** `/api/site-settings/`
- **Funcionalidades:**
  - Configuración global
  - Personalización
  - Temas
  - Idiomas

## 🔑 Autenticación JWT

### Obtener Token
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "mi_contraseña"
  }'
```

### Usar Token
```bash
curl -X GET http://127.0.0.1:8000/api/auth/profile/ \
  -H "Authorization: Bearer <tu_access_token>"
```

### Refresh Token
```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "<tu_refresh_token>"
  }'
```

## 📊 Códigos de Respuesta

| Código | Significado | Descripción |
|--------|-------------|-------------|
| `200` | OK | Petición exitosa |
| `201` | Created | Recurso creado exitosamente |
| `400` | Bad Request | Error en los datos enviados |
| `401` | Unauthorized | No autenticado |
| `403` | Forbidden | Sin permisos suficientes |
| `404` | Not Found | Recurso no encontrado |
| `429` | Too Many Requests | Límite de peticiones excedido |
| `500` | Internal Server Error | Error del servidor |

## 🛠️ Herramientas de Desarrollo

### Postman Collection
Puedes importar el esquema OpenAPI en Postman:
1. Abre Postman
2. Import → Link → `http://127.0.0.1:8000/api/schema/`

### Insomnia
Similar proceso para Insomnia:
1. Import/Export → Import Data → From URL
2. `http://127.0.0.1:8000/api/schema/`

### Generación de SDKs
Usa el esquema OpenAPI para generar SDKs en diferentes lenguajes:
```bash
# JavaScript/TypeScript
npx @openapitools/openapi-generator-cli generate \
  -i http://127.0.0.1:8000/api/schema/ \
  -g typescript-axios \
  -o ./sdk/typescript

# Python
pip install openapi-generator-cli
openapi-generator generate \
  -i http://127.0.0.1:8000/api/schema/ \
  -g python \
  -o ./sdk/python
```

## 🔍 Filtros y Búsqueda

La API soporta filtros avanzados en la mayoría de endpoints:

### Parámetros de Query Comunes
- `search` - Búsqueda de texto
- `ordering` - Ordenamiento (`-created_at`, `name`, etc.)
- `limit` - Límite de resultados
- `offset` - Paginación
- `is_active` - Filtrar por estado activo

### Ejemplo
```bash
GET /api/posts/?search=fútbol&ordering=-created_at&limit=10
```

## 🚦 Rate Limiting

La API implementa límites de peticiones:
- **Usuarios autenticados:** 1000 peticiones/hora
- **Usuarios anónimos:** 100 peticiones/hora
- **Endpoints de subida:** 50 peticiones/hora

## 🐛 Debugging

### Logs de Desarrollo
Los logs se guardan en `backend/logs/`:
- `django.log` - Logs generales
- `api.log` - Logs específicos de API
- `errors.log` - Errores del sistema

### Headers de Debug
En modo desarrollo, la API incluye headers adicionales:
- `X-Debug-SQL-Queries` - Número de queries SQL
- `X-Debug-Time` - Tiempo de procesamiento
- `X-Debug-User` - Usuario autenticado

## 📈 Monitoreo

### Health Check
```bash
GET /health/
```

Respuesta:
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "version": "1.0.0",
  "timestamp": "2026-01-20T20:30:00Z"
}
```

### Métricas
- `/api/metrics/` - Métricas de uso
- `/api/stats/` - Estadísticas generales

## 🔒 Seguridad

### CORS
Configurado para desarrollo:
- `localhost:3000` (Next.js)
- `127.0.0.1:3000`

### HTTPS
En producción, todos los endpoints requieren HTTPS.

### Validación
- Validación automática de datos
- Sanitización de inputs
- Protección CSRF
- Rate limiting

## 📞 Soporte

### Contacto
- **Email:** api@soshabilidoso.com
- **Documentación:** https://docs.soshabilidoso.com
- **Issues:** GitHub Issues

### Versioning
La API usa versionado semántico:
- **Actual:** v1.0.0
- **Compatibilidad:** Mantenemos compatibilidad hacia atrás
- **Deprecación:** 6 meses de aviso antes de remover endpoints

---

**¡Explora la documentación interactiva en [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/) para la mejor experiencia!** 🚀
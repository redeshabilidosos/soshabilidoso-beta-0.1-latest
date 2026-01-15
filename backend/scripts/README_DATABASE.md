# Configuración de Base de Datos MySQL - SOS-HABILIDOSO

## 📋 Descripción

Este directorio contiene los scripts necesarios para crear y configurar la base de datos MySQL `habilidosos_db` para la plataforma SOS-HABILIDOSO.

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

1. **usuarios** - Información de usuarios del sistema
2. **participantes** - Participantes del Reality Show 2026
3. **publicaciones** - Posts de usuarios (texto, imagen, video, etc.)
4. **reacciones_publicaciones** - Likes, celebraciones, golazos
5. **comentarios** - Comentarios en publicaciones
6. **comunidades** - Comunidades creadas por usuarios
7. **miembros_comunidad** - Relación usuarios-comunidades
8. **publicaciones_comunidad** - Posts dentro de comunidades
9. **clasificados** - Anuncios clasificados
10. **habil_news** - Noticias y artículos
11. **seguidores** - Relación de seguimiento entre usuarios
12. **solicitudes_amistad** - Solicitudes de amistad
13. **amistades** - Amistades confirmadas
14. **salas_chat** - Salas de chat
15. **participantes_chat** - Participantes en chats
16. **mensajes** - Mensajes en chats
17. **notificaciones** - Notificaciones para usuarios
18. **archivos_multimedia** - Almacenamiento de archivos
19. **guardados** - Publicaciones guardadas
20. **reportes** - Reportes de contenido
21. **streaming_sessions** - Sesiones de streaming en vivo
22. **eventos** - Eventos creados
23. **asistentes_eventos** - Asistentes a eventos

## 🚀 Instalación

### Requisitos Previos

- MySQL 8.0 o superior
- Python 3.8+
- pip

### Paso 1: Instalar dependencias

```bash
cd backend
pip install mysql-connector-python mysqlclient
```

### Paso 2: Configurar credenciales

Edita el archivo `setup_mysql_database.py` y actualiza las credenciales:

```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'tu_usuario',      # Cambiar
    'password': 'tu_password',  # Cambiar
    'database': 'habilidosos_db',
}
```

### Paso 3: Ejecutar el script de configuración

```bash
python scripts/setup_mysql_database.py
```

Este script:
- Crea la base de datos `habilidosos_db`
- Ejecuta todas las sentencias SQL
- Crea todas las tablas, índices, vistas y triggers
- Verifica la instalación

### Paso 4: Configurar Django

Actualiza `sos_habilidoso/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'habilidosos_db',
        'USER': 'tu_usuario',
        'PASSWORD': 'tu_password',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
```

### Paso 5: Ejecutar migraciones de Django

```bash
python manage.py migrate
python manage.py createsuperuser
```

## 📊 Endpoints y Tablas

### Autenticación
- `POST /api/auth/register` → `usuarios`
- `POST /api/auth/login` → `usuarios`

### Publicaciones
- `POST /api/posts/` → `publicaciones`
- `GET /api/posts/` → `publicaciones`
- `POST /api/posts/{id}/react` → `reacciones_publicaciones`
- `POST /api/posts/{id}/comment` → `comentarios`

### Comunidades
- `POST /api/communities/` → `comunidades`
- `POST /api/communities/{id}/join` → `miembros_comunidad`
- `POST /api/communities/{id}/posts` → `publicaciones_comunidad`

### Clasificados
- `POST /api/classifieds/` → `clasificados`
- `GET /api/classifieds/` → `clasificados`

### Noticias
- `POST /api/news/` → `habil_news`
- `GET /api/news/` → `habil_news`

### Reality Show
- `POST /register-habilidosos` → `participantes`

### Perfil
- `PUT /api/users/profile` → `usuarios` (avatar, cover_photo, bio, etc.)

### Mensajería
- `POST /api/messages/` → `mensajes`
- `GET /api/messages/rooms` → `salas_chat`

## 🔧 Mantenimiento

### Backup de la base de datos

```bash
mysqldump -u root -p habilidosos_db > backup_habilidosos_$(date +%Y%m%d).sql
```

### Restaurar backup

```bash
mysql -u root -p habilidosos_db < backup_habilidosos_20241113.sql
```

### Ver estadísticas

```sql
-- Ver total de usuarios
SELECT COUNT(*) FROM usuarios;

-- Ver publicaciones por tipo
SELECT post_type, COUNT(*) FROM publicaciones GROUP BY post_type;

-- Ver comunidades más populares
SELECT name, members_count FROM comunidades ORDER BY members_count DESC LIMIT 10;
```

## 📝 Notas Importantes

1. **Participantes del Reality**: Los datos del formulario en `/register-habilidosos` se guardan en la tabla `participantes`
2. **UUIDs**: La mayoría de las tablas usan UUIDs (CHAR(36)) como clave primaria
3. **JSON Fields**: Campos como `images`, `interests`, `social_links` usan tipo JSON
4. **Índices**: Se incluyen índices para optimizar búsquedas frecuentes
5. **Triggers**: Actualizan automáticamente contadores (reacciones, comentarios, miembros)

## 🐛 Solución de Problemas

### Error: "Access denied for user"
- Verifica las credenciales en `DB_CONFIG`
- Asegúrate de que el usuario tenga permisos

### Error: "Table already exists"
- Normal si ejecutas el script múltiples veces
- El script usa `IF NOT EXISTS` para evitar errores

### Error: "Unknown database"
- El script crea la base de datos automáticamente
- Verifica que MySQL esté corriendo

## 📞 Soporte

Para más información, contacta al equipo de desarrollo de SOS-HABILIDOSO.

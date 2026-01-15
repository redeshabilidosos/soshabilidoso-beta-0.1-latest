# Campos de la Base de Datos - SOS-HABILIDOSO

## Tabla: users (usuarios)

### Campos de Identificación
- `id` - UUID (Primary Key)
- `username` - VARCHAR(30) UNIQUE - Nombre de usuario
- `email` - VARCHAR(255) UNIQUE - Correo electrónico
- `password` - VARCHAR(255) - Contraseña encriptada

### Campos de Perfil
- `display_name` - VARCHAR(100) - Nombre para mostrar
- `first_name` - VARCHAR(150) - Nombre
- `last_name` - VARCHAR(150) - Apellido
- `avatar` - VARCHAR(500) - **URL de foto de perfil**
- `cover_photo` - VARCHAR(500) - **URL de foto de portada** ✅ AGREGADO
- `bio` - TEXT - Biografía del usuario

### Campos de Información Deportiva/Habilidades
- `position` - VARCHAR(100) - Posición/Rol (ej: Delantero, Bailarín)
- `team` - VARCHAR(100) - Equipo/Grupo actual
- `interests` - JSON - Array de intereses
- `social_links` - JSON - Enlaces a redes sociales

### Campos de Contacto
- `contact_number` - VARCHAR(20) - Número de teléfono

### Campos de Privacidad
- `is_private` - BOOLEAN - Perfil privado
- `show_email` - BOOLEAN - Mostrar email públicamente
- `show_phone` - BOOLEAN - Mostrar teléfono públicamente

### Campos de Estado
- `is_active` - BOOLEAN - Usuario activo
- `is_staff` - BOOLEAN - Es staff
- `is_superuser` - BOOLEAN - Es superusuario
- `email_verified` - BOOLEAN - Email verificado

### Campos de Fechas
- `date_joined` - DATETIME - **Fecha de registro** ✅
- `last_login` - DATETIME - **Último inicio de sesión** ✅
- `updated_at` - DATETIME - **Última actualización** ✅

---

## Tabla: posts (publicaciones)

### Campos de Identificación
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key) - Referencia al usuario

### Campos de Contenido
- `content` - TEXT - Contenido de la publicación
- `post_type` - ENUM - Tipo: text, image, video, highlight, podcast, streaming
- `category` - ENUM - Categoría: football, music, dance, etc.

### Campos Multimedia
- `images` - JSON - **Array de URLs de imágenes** ✅ GUARDADO
- `video` - VARCHAR(500) - **URL o ruta del video** ✅ GUARDADO
- `thumbnail` - VARCHAR(500) - **Miniatura del video** ✅
- `podcast_url` - VARCHAR(500) - **URL del podcast** ✅ GUARDADO
- `streaming_url` - VARCHAR(500) - **URL del streaming** ✅ GUARDADO

### Campos de Ubicación
- `location` - VARCHAR(200) - Ubicación textual
- `latitude` - DECIMAL(10,8) - Latitud
- `longitude` - DECIMAL(11,8) - Longitud

### Campos de Configuración
- `is_pinned` - BOOLEAN - Publicación fijada
- `is_archived` - BOOLEAN - Publicación archivada ✅ AGREGADO
- `allow_comments` - BOOLEAN - Permitir comentarios
- `is_public` - BOOLEAN - Publicación pública

### Campos de Estadísticas
- `likes_count` - INT UNSIGNED - **Contador de likes** ✅ AGREGADO
- `celebrations_count` - INT UNSIGNED - **Contador de celebraciones** ✅ AGREGADO
- `golazos_count` - INT UNSIGNED - **Contador de golazos** ✅ AGREGADO
- `comments_count` - INT UNSIGNED - Contador de comentarios
- `shares_count` - INT UNSIGNED - Contador de compartidos
- `views_count` - INT UNSIGNED - Contador de visualizaciones

### Campos de Fechas
- `created_at` - DATETIME - **Fecha de creación** ✅ GUARDADO
- `updated_at` - DATETIME - **Fecha de actualización** ✅ GUARDADO

---

## Tabla: post_reactions (reacciones_publicaciones)

### Campos
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key) - Usuario que reaccionó
- `post_id` - UUID (Foreign Key) - Publicación
- `reaction_type` - ENUM - Tipo: like, celebration, golazo
- `created_at` - DATETIME - **Fecha de la reacción** ✅

---

## Tabla: comments (comentarios)

### Campos
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key) - Usuario que comentó
- `post_id` - UUID (Foreign Key) - Publicación
- `parent_id` - UUID (Foreign Key) - Comentario padre (para respuestas)
- `content` - TEXT - Contenido del comentario
- `likes_count` - INT - Contador de likes
- `created_at` - DATETIME - **Fecha del comentario** ✅
- `updated_at` - DATETIME - **Fecha de actualización** ✅

---

## Resumen de Campos Agregados/Verificados

### ✅ Campos para Fotos
- `users.cover_photo` - Foto de portada del usuario
- `users.avatar` - Foto de perfil del usuario
- `posts.images` - Array JSON de URLs de imágenes de publicaciones
- `posts.thumbnail` - Miniatura de videos

### ✅ Campos para Videos
- `posts.video` - Archivo o URL de video
- `posts.thumbnail` - Miniatura del video

### ✅ Campos para Multimedia
- `posts.podcast_url` - URL del podcast
- `posts.streaming_url` - URL del streaming

### ✅ Campos de Fechas
- `users.date_joined` - Fecha de registro
- `users.last_login` - Último inicio de sesión
- `users.updated_at` - Última actualización del perfil
- `posts.created_at` - Fecha de creación de publicación
- `posts.updated_at` - Fecha de actualización de publicación
- `post_reactions.created_at` - Fecha de reacción
- `comments.created_at` - Fecha de comentario

### ✅ Campos de Estadísticas
- `posts.likes_count` - Contador de likes
- `posts.celebrations_count` - Contador de celebraciones
- `posts.golazos_count` - Contador de golazos
- `posts.comments_count` - Contador de comentarios
- `posts.shares_count` - Contador de compartidos
- `posts.views_count` - Contador de visualizaciones

---

## Instrucciones de Migración

### Opción 1: Usar Django Migrations (Recomendado)
```bash
cd backend
python scripts/sync_database.py
```

### Opción 2: Ejecutar SQL Manualmente
```bash
mysql -u root -p -P 3307 < backend/scripts/add_missing_fields.sql
```

### Opción 3: Usar Django Management Commands
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

---

## Notas Importantes

1. **Datos Existentes**: Todos los scripts están diseñados para NO afectar datos existentes
2. **Valores por Defecto**: Los nuevos campos tienen valores por defecto apropiados
3. **Índices**: Se crean índices automáticamente para mejorar el rendimiento
4. **Compatibilidad**: Compatible con MySQL 5.7+ y MariaDB 10.4+

---

## Verificación Post-Migración

Después de ejecutar las migraciones, verifica que:

1. ✅ Las fotos de perfil y portada se guardan correctamente
2. ✅ Las imágenes de publicaciones se almacenan en `media/posts/`
3. ✅ Los videos se guardan en `media/videos/`
4. ✅ Las fechas se registran automáticamente
5. ✅ Los contadores de reacciones se actualizan correctamente
6. ✅ Los datos existentes permanecen intactos

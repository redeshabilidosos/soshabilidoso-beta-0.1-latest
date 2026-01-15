# Instrucciones para Configurar Base de Datos Remota

## 📋 Requisitos Previos

1. Acceso a un servidor MySQL/MariaDB remoto
2. Acceso a phpMyAdmin o cliente MySQL
3. Credenciales de administrador de la base de datos

## 🚀 Pasos para Configurar

### 1. Crear la Base de Datos (si no existe)

En phpMyAdmin o mediante línea de comandos:

```sql
CREATE DATABASE soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Ejecutar el Script SQL

#### Opción A: Usando phpMyAdmin

1. Accede a phpMyAdmin en tu servidor remoto
2. Selecciona la base de datos `soshabilidoso`
3. Ve a la pestaña "SQL"
4. Abre el archivo `setup_cloud_database.sql` en un editor de texto
5. Copia todo el contenido del archivo
6. Pégalo en el área de texto de phpMyAdmin
7. Haz clic en "Continuar" o "Go"
8. Espera a que se complete la ejecución (puede tomar 1-2 minutos)

#### Opción B: Usando línea de comandos MySQL

```bash
mysql -h TU_HOST -u TU_USUARIO -p soshabilidoso < setup_cloud_database.sql
```

Reemplaza:
- `TU_HOST`: dirección del servidor (ej: db.ejemplo.com)
- `TU_USUARIO`: tu usuario de MySQL

### 3. Verificar la Instalación

Ejecuta esta consulta para verificar que las tablas se crearon:

```sql
SHOW TABLES;
```

Deberías ver aproximadamente 50+ tablas creadas.

### 4. Configurar el Backend de Django

Edita el archivo `backend/.env` con las credenciales de tu base de datos remota:

```env
# Base de datos remota
DB_ENGINE=django.db.backends.mysql
DB_NAME=soshabilidoso
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=tu_host_remoto.com
DB_PORT=3306

# Ejemplo con Railway, PlanetScale, etc:
# DB_HOST=containers-us-west-123.railway.app
# DB_PORT=6543
```

### 5. Sincronizar Django con la Base de Datos

```bash
cd backend

# Marcar las migraciones como aplicadas (sin ejecutarlas)
python manage.py migrate --fake-initial

# Crear un superusuario
python manage.py createsuperuser
```

### 6. Verificar la Conexión

```bash
# Probar la conexión
python manage.py check

# Ver las tablas
python manage.py dbshell
SHOW TABLES;
EXIT;
```

## 📊 Estructura de la Base de Datos

El script crea las siguientes tablas principales:

### Usuarios y Autenticación
- `users` - Usuarios del sistema
- `user_follows` - Seguimientos entre usuarios
- `friend_requests` - Solicitudes de amistad
- `friendships` - Amistades confirmadas

### Contenido Social
- `posts` - Publicaciones
- `post_reactions` - Reacciones (likes, golazos, celebraciones)
- `comments` - Comentarios
- `comment_likes` - Likes en comentarios
- `post_shares` - Compartir posts
- `post_bookmarks` - Posts guardados
- `stories` - Historias temporales
- `reels` - Videos cortos

### Comunidades
- `community_categories` - Categorías de comunidades
- `communities` - Comunidades y subcomunidades
- `community_memberships` - Miembros de comunidades
- `community_posts` - Publicaciones en comunidades
- `community_post_comments` - Comentarios en comunidades

### Mensajería
- `conversations` - Conversaciones
- `messages` - Mensajes
- `notifications` - Notificaciones

### Otros Módulos
- `donations` - Donaciones para atletas
- `classifieds` - Clasificados
- `enterprises` - Empresas
- `advertisements` - Publicidad
- `learning_sections` - Secciones de aprendizaje
- `learning_topics` - Temas educativos
- `media_files` - Archivos multimedia
- `payments` - Pagos

### Sistema Django
- `django_migrations` - Control de migraciones
- `django_session` - Sesiones
- `django_content_type` - Tipos de contenido
- `auth_permission` - Permisos
- `auth_group` - Grupos

## 🔧 Solución de Problemas

### Error: "Table already exists"

Si algunas tablas ya existen, el script las eliminará y recreará. Si quieres conservar datos:

1. Haz un backup primero:
```bash
mysqldump -h TU_HOST -u TU_USUARIO -p soshabilidoso > backup.sql
```

2. Comenta las líneas `DROP TABLE IF EXISTS` en el script para las tablas que quieres conservar

### Error: "Foreign key constraint fails"

Asegúrate de ejecutar el script completo en orden. Las tablas se crean en el orden correcto para respetar las dependencias.

### Error de conexión desde Django

Verifica:
1. El firewall del servidor permite conexiones desde tu IP
2. El usuario tiene permisos remotos: `GRANT ALL ON soshabilidoso.* TO 'usuario'@'%';`
3. El puerto 3306 está abierto
4. Las credenciales en `.env` son correctas

### Rendimiento lento

Para bases de datos remotas:
1. Usa conexiones SSL si están disponibles
2. Considera usar un pool de conexiones
3. Activa el caché de Django
4. Usa índices (ya incluidos en el script)

## 📝 Datos Iniciales

El script incluye datos iniciales para:
- 8 categorías de comunidades predefinidas
- 4 secciones de aprendizaje básicas

Puedes modificar estos datos en la sección "DATOS INICIALES" del script SQL.

## 🔐 Seguridad

Recomendaciones:
1. Usa contraseñas fuertes para la base de datos
2. Limita el acceso por IP si es posible
3. Usa SSL/TLS para conexiones remotas
4. No compartas las credenciales en el código
5. Usa variables de entorno para configuración sensible

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs de MySQL: `/var/log/mysql/error.log`
2. Revisa los logs de Django: `python manage.py runserver` (modo verbose)
3. Verifica la versión de MySQL/MariaDB (requiere 5.7+ o MariaDB 10.2+)

## ✅ Checklist de Verificación

- [ ] Base de datos creada con charset utf8mb4
- [ ] Script SQL ejecutado sin errores
- [ ] Todas las tablas creadas (50+ tablas)
- [ ] Archivo .env configurado con credenciales remotas
- [ ] Migraciones de Django sincronizadas
- [ ] Superusuario creado
- [ ] Conexión verificada con `python manage.py check`
- [ ] Datos iniciales cargados correctamente

¡Listo! Tu base de datos remota está configurada y lista para usar.

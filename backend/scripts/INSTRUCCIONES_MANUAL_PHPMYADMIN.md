# Instrucciones para Crear el Sistema Compartible Manualmente

Como hay problemas con el cliente MySQL desde línea de comandos, puedes ejecutar los scripts manualmente a través de phpMyAdmin.

## 🚀 Pasos para Ejecutar

### 1. Abrir phpMyAdmin
- Ve a: http://localhost/phpmyadmin
- Usuario: `root`
- Contraseña: (vacía por defecto en XAMPP)

### 2. Seleccionar la Base de Datos
- Selecciona la base de datos `habilidosos_db` en el panel izquierdo
- Si no existe, créala primero

### 3. Ejecutar Scripts en Orden

#### Paso 1: Sistema de Contenido Compartible
1. Ve a la pestaña "SQL" en phpMyAdmin
2. Copia y pega el contenido completo del archivo: `create_shareable_content_system.sql`
3. Haz clic en "Continuar" para ejecutar
4. Verifica que no haya errores

#### Paso 2: Eventos Culturales y Learning
1. En la misma pestaña "SQL"
2. Copia y pega el contenido completo del archivo: `create_cultural_events_tables_fixed.sql`
3. Haz clic en "Continuar" para ejecutar
4. Verifica que no haya errores

#### Paso 3: Datos de Prueba
1. En la misma pestaña "SQL"
2. Copia y pega el contenido completo del archivo: `populate_sample_data.sql`
3. Haz clic en "Continuar" para ejecutar
4. Verifica que no haya errores

## 🔍 Verificación

Después de ejecutar todos los scripts, ejecuta esta consulta para verificar:

```sql
SELECT 
    'Verificacion del Sistema Compartible' as status,
    (SELECT COUNT(*) FROM shareable_content) as contenido_compartible,
    (SELECT COUNT(*) FROM cultural_events) as eventos_culturales,
    (SELECT COUNT(*) FROM feed_posts) as publicaciones_feed,
    (SELECT COUNT(*) FROM reels) as reels_videos,
    (SELECT COUNT(*) FROM news_articles) as articulos_noticias,
    (SELECT COUNT(*) FROM live_streams) as transmisiones_vivo,
    (SELECT COUNT(*) FROM classifieds) as clasificados,
    (SELECT COUNT(*) FROM learning_tema) as temas_learning;
```

## 📊 Resultado Esperado

Deberías ver algo como:
- contenido_compartible: 10+ registros
- eventos_culturales: 5 registros
- publicaciones_feed: 3 registros
- reels_videos: 3 registros
- articulos_noticias: 2 registros
- transmisiones_vivo: 2 registros
- clasificados: 3 registros
- temas_learning: 6 registros

## 🎯 Tablas Creadas

### Sistema Compartible (9 tablas):
- `shareable_content` - Tabla central de contenido compartible
- `content_shares` - Registro de shares
- `content_views` - Analytics de visualizaciones
- `feed_posts` - Publicaciones del feed principal
- `community_posts` - Posts de subcomunidades
- `reels` - Videos cortos/clips
- `news_articles` - Artículos de noticias
- `live_streams` - Transmisiones en vivo
- `classifieds` - Clasificados y conexiones

### Eventos Culturales (8 tablas):
- `cultural_event_categories` - Categorías de eventos
- `cultural_events` - Eventos principales
- `cultural_event_tags` - Etiquetas
- `cultural_event_tag_relations` - Relación evento-etiquetas
- `cultural_event_social_links` - Enlaces sociales
- `cultural_event_attendances` - Asistencias
- `cultural_event_likes` - Me gusta
- `cultural_event_views` - Vistas para analytics

### Learning System (6 tablas):
- `learning_seccion` - Secciones de aprendizaje
- `learning_tema` - Temas individuales
- `learning_temacontenido` - Contenido de temas
- `learning_temapuntoclave` - Puntos clave
- `learning_logro_adicional` - Logros adicionales
- `learning_usuariologro_nuevo` - Logros por usuario

### User Analytics (7 tablas):
- `analytics_usersession` - Sesiones de usuario
- `analytics_useractivity` - Actividades
- `analytics_userinteraction` - Interacciones
- `analytics_userpreferences` - Preferencias
- `analytics_userlocation` - Ubicación
- `analytics_usersearchhistory` - Historial de búsquedas
- `analytics_usersocialconnections` - Conexiones sociales

## ✅ Características Implementadas

- **IDs únicos char(32)** para cada publicación
- **URLs automáticas** para compartir (ej: `/eventos/ID`, `/post/ID`)
- **Triggers automáticos** que sincronizan shareable_content
- **Contadores en tiempo real** de shares, views, likes
- **Analytics detallados** por tipo de contenido
- **Soporte multiplataforma** para sharing
- **Integridad referencial** completa

## 🔧 Próximos Pasos

Una vez completada la instalación:

1. **Verificar que todas las tablas se crearon correctamente**
2. **Implementar APIs en Django para cada tipo de contenido**
3. **Crear componentes React para el sistema de sharing**
4. **Configurar Open Graph meta tags**
5. **Implementar deep linking en la aplicación**

## 🆘 Solución de Problemas

Si encuentras errores:

1. **Error de sintaxis**: Verifica que copiaste el script completo
2. **Tabla ya existe**: Usa `DROP TABLE IF EXISTS nombre_tabla;` antes del CREATE
3. **Foreign key error**: Asegúrate de que la tabla `users` existe
4. **Charset error**: Verifica que la BD use `utf8mb4`

## 📞 Soporte

Si necesitas ayuda adicional, revisa:
- Los logs de MySQL en XAMPP
- La pestaña de errores en phpMyAdmin
- Que XAMPP esté ejecutándose correctamente
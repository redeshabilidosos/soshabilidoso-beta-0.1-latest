# Guía Rápida - Sistema de Stories

## Para Usuarios

### Ver Historias
1. Abre la aplicación
2. En el feed principal verás los círculos de historias en la parte superior
3. Haz clic en un círculo para ver las historias de ese usuario
4. Las historias con borde verde neón tienen contenido no visto

### Crear una Historia
1. Haz clic en el botón "+" o en tu propio círculo
2. Selecciona una imagen o video
3. Opcionalmente agrega texto o emojis
4. Haz clic en "Publicar"
5. Tu historia estará visible por 24 horas

### Reaccionar a una Historia
1. Mientras ves una historia, verás 4 emojis en la parte inferior:
   - ❤️ Me gusta
   - 🔥 Fuego
   - 🎉 Celebración
   - 👍 Pulgar arriba
2. Haz clic en uno para reaccionar
3. Verás una animación dramática
4. El creador recibirá una notificación

### Responder a una Historia
1. Mientras ves una historia, escribe en el campo de texto inferior
2. Opcionalmente usa el botón de emoji para agregar emojis
3. Haz clic en "Enviar"
4. Tu mensaje se enviará al chat privado con el creador
5. El creador recibirá una notificación

### Gestos
- **Doble tap**: Like rápido (❤️)
- **Long press**: Pausar historia
- **Swipe down**: Cerrar visor
- **Swipe left/right**: Navegar entre historias

### Ver Quién Vio Tu Historia
1. Abre tu propia historia
2. Verás un ícono de ojo con un número
3. Haz clic para ver la lista de usuarios que vieron tu historia

---

## Para Desarrolladores

### Endpoints de API

#### Obtener Historias de Amigos
```http
GET /api/stories/friends/
Authorization: Bearer {token}
```

**Respuesta**:
```json
{
  "count": 1,
  "results": [
    {
      "user": {
        "id": "uuid",
        "username": "moloworld",
        "display_name": "Molo World",
        "avatar_url": "url"
      },
      "stories": [
        {
          "id": "uuid",
          "media_url": "url",
          "media_type": "image",
          "views_count": 5,
          "created_at": "2026-01-26T...",
          "expires_at": "2026-01-27T..."
        }
      ],
      "has_unviewed": true
    }
  ]
}
```

#### Crear Historia
```http
POST /api/stories/
Authorization: Bearer {token}
Content-Type: multipart/form-data

media: [file]
media_type: "image" | "video"
```

#### Marcar como Vista
```http
POST /api/stories/{id}/view/
Authorization: Bearer {token}
```

**Respuesta**:
```json
{
  "viewed": true,
  "created": true
}
```

#### Reaccionar
```http
POST /api/stories/{id}/react/
Authorization: Bearer {token}
Content-Type: application/json

{
  "reaction_type": "like" | "fire" | "celebrate" | "thumbsup"
}
```

**Respuesta**:
```json
{
  "reaction": {
    "id": "uuid",
    "reaction_type": "fire",
    "created_at": "2026-01-26T..."
  },
  "created": true,
  "notification_created": true
}
```

#### Responder
```http
POST /api/stories/{id}/reply/
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Excelente historia!"
}
```

**Respuesta**:
```json
{
  "id": "uuid",
  "message": "Excelente historia!",
  "created_at": "2026-01-26T...",
  "message_created": true,
  "notification_created": true
}
```

### Servicios Frontend

#### Importar Servicio
```typescript
import { storiesService } from '@/lib/services/stories.service';
```

#### Obtener Historias
```typescript
const stories = await storiesService.getFriendsStories();
```

#### Crear Historia
```typescript
const formData = new FormData();
formData.append('media', file);
formData.append('media_type', 'image');

const story = await storiesService.createStory(formData);
```

#### Reaccionar
```typescript
const result = await storiesService.reactToStory(storyId, 'fire');
if (result.notification_created) {
  console.log('Notificación enviada al creador');
}
```

#### Responder
```typescript
const result = await storiesService.replyToStory(storyId, 'Me encantó!');
if (result.message_created) {
  console.log('Mensaje enviado al chat');
}
if (result.notification_created) {
  console.log('Notificación enviada al creador');
}
```

### Modelos de Base de Datos

#### Story
```python
class Story(models.Model):
    id = UUIDField(primary_key=True)
    user = ForeignKey(User)
    media = FileField(upload_to='stories/%Y/%m/%d/')
    media_type = CharField(choices=['image', 'video'])
    views_count = PositiveIntegerField(default=0)
    created_at = DateTimeField(auto_now_add=True)
    expires_at = DateTimeField(default=get_expiry_time)  # +24h
```

#### StoryReaction
```python
class StoryReaction(models.Model):
    id = UUIDField(primary_key=True)
    user = ForeignKey(User)
    story = ForeignKey(Story)
    reaction_type = CharField(choices=['like', 'fire', 'celebrate', 'thumbsup'])
    created_at = DateTimeField(auto_now_add=True)
    
    # Un usuario solo puede tener una reacción por historia
    unique_together = ('user', 'story')
```

#### StoryReply
```python
class StoryReply(models.Model):
    id = UUIDField(primary_key=True)
    user = ForeignKey(User)
    story = ForeignKey(Story)
    message = TextField(max_length=500)
    is_read = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)
```

#### Notification (Tipos de Stories)
```python
NOTIFICATION_TYPES = [
    # ... otros tipos
    ('story_reaction', 'Reacción a historia'),
    ('story_reply', 'Respuesta a historia'),
]

# Campos adicionales
story_id = UUIDField(null=True, blank=True)
```

### Verificar Sistema

```bash
# Verificar tablas
cd backend
python check_stories_tables.py

# Verificar notificaciones
python check_notifications_stories.py

# Probar API completa
python test_stories_api_visibility.py

# Ver notificaciones creadas
python verify_notifications_created.py
```

---

## Troubleshooting

### Las historias no aparecen
- Verifica que el usuario tenga historias activas (no expiradas)
- Verifica que el usuario esté autenticado
- Revisa la consola del navegador para errores

### Las notificaciones no se crean
- Verifica que el usuario que reacciona NO sea el creador
- Verifica que la migración esté aplicada: `python manage.py migrate notifications`
- Revisa los logs del servidor Django

### Los mensajes no llegan al chat
- Verifica que el endpoint `/api/stories/{id}/reply/` retorne `message_created: true`
- Verifica que exista el chat privado en la base de datos
- Revisa los logs del servidor para errores

### Las animaciones no funcionan
- Verifica que las clases CSS estén en `app/globals.css`
- Verifica que Tailwind esté compilando correctamente
- Limpia el caché del navegador

---

## Características Técnicas

### Expiración Automática
- Las historias expiran automáticamente después de 24 horas
- El campo `expires_at` se calcula al crear la historia
- Los endpoints filtran automáticamente historias expiradas

### Optimizaciones
- Queries optimizados con `select_related()` y `prefetch_related()`
- Índices en campos frecuentemente consultados
- Agrupación eficiente de historias por usuario

### Seguridad
- Solo el creador puede ver quién vio su historia
- Solo el creador puede ver las respuestas a su historia
- Validación de tipos de reacción
- Límite de 500 caracteres en respuestas

### Performance
- Carga lazy de imágenes
- Precarga de siguiente historia
- Animaciones con GPU acceleration
- Debounce en gestures

---

## Soporte

Para reportar bugs o solicitar features:
1. Revisa la documentación completa en `SISTEMA_NOTIFICACIONES_STORIES.md`
2. Ejecuta los scripts de verificación
3. Revisa los logs del servidor y navegador
4. Contacta al equipo de desarrollo

---

**Última actualización**: 26 de Enero, 2026

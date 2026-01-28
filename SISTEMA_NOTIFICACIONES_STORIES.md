# Sistema de Notificaciones para Stories - Implementación Completa

## Resumen

Se ha implementado un sistema completo de notificaciones para las historias (stories) que permite:
1. **Notificar al creador cuando alguien reacciona a su historia**
2. **Enviar mensajes directos cuando alguien responde a una historia**
3. **Crear notificaciones cuando alguien responde a una historia**

---

## Cambios Implementados

### 1. Backend - Modelo de Notificaciones

**Archivo**: `backend/apps/notifications/models.py`

**Cambios**:
- Agregados dos nuevos tipos de notificación:
  - `story_reaction`: Reacción a historia
  - `story_reply`: Respuesta a historia
- Agregado campo `story_id` para referenciar la historia relacionada

**Migración**: `backend/apps/notifications/migrations/0003_notification_story_id_and_more.py`

### 2. Backend - Endpoint de Reacciones

**Archivo**: `backend/apps/stories/views.py`

**Endpoint**: `POST /api/stories/{id}/react/`

**Funcionalidad**:
- Crea o actualiza una reacción a la historia
- Si es una nueva reacción y no es la propia historia, crea una notificación
- Retorna `notification_created: true` cuando se crea la notificación

**Respuesta**:
```json
{
  "reaction": {
    "id": "uuid",
    "user": {...},
    "reaction_type": "fire",
    "created_at": "2026-01-26T..."
  },
  "created": true,
  "notification_created": true
}
```

### 3. Backend - Endpoint de Respuestas

**Archivo**: `backend/apps/stories/views.py`

**Endpoint**: `POST /api/stories/{id}/reply/`

**Funcionalidad**:
- Crea una respuesta en la tabla `story_replies`
- Busca o crea un chat privado entre el usuario y el creador de la historia
- Crea un mensaje en el chat con el texto de la respuesta
- Crea una notificación para el creador de la historia
- Retorna `message_created: true` y `notification_created: true`

**Respuesta**:
```json
{
  "id": "uuid",
  "user": {...},
  "message": "Que buena historia!",
  "created_at": "2026-01-26T...",
  "message_created": true,
  "notification_created": true
}
```

### 4. Frontend - Servicio de Stories

**Archivo**: `lib/services/stories.service.ts`

**Cambios**:
- `reactToStory()` ahora retorna `{ success: boolean, notification_created: boolean }`
- `replyToStory()` ahora retorna `{ success: boolean, message_created: boolean, notification_created: boolean }`

### 5. Frontend - Componente de Stories

**Archivo**: `components/ui/stories-slider.tsx`

**Cambios**:
- `handleReaction()` es ahora async y verifica si se creó una notificación
- `handleSendReply()` centraliza el envío de respuestas y verifica notificaciones/mensajes
- Agregados logs en consola para feedback cuando se crean notificaciones
- Agregada vibración háptica al enviar respuestas exitosamente

---

## Flujo de Notificaciones

### Reacción a Historia

1. Usuario hace clic en emoji de reacción (❤️ 🔥 🎉 👍)
2. Frontend llama a `storiesService.reactToStory(storyId, reactionType)`
3. Backend:
   - Crea/actualiza la reacción en `story_reactions`
   - Si es nueva reacción y no es propia historia:
     - Crea notificación en `notifications` con tipo `story_reaction`
     - Incluye `story_id` para referencia
4. Frontend recibe respuesta con `notification_created: true`
5. Se muestra animación dramática de reacción
6. Console log: "Notificación creada para el creador de la historia"

### Respuesta a Historia

1. Usuario escribe mensaje y hace clic en enviar
2. Frontend llama a `storiesService.replyToStory(storyId, message)`
3. Backend:
   - Crea respuesta en `story_replies`
   - Busca chat privado existente entre usuarios
   - Si no existe, crea nuevo `ChatRoom` con tipo `private`
   - Agrega ambos usuarios como `ChatParticipant`
   - Crea `Message` en el chat con el contenido
   - Crea notificación en `notifications` con tipo `story_reply`
4. Frontend recibe respuesta con `message_created: true` y `notification_created: true`
5. Se limpia el input de texto
6. Vibración háptica de confirmación
7. Console logs:
   - "Mensaje enviado al chat del creador de la historia"
   - "Notificación creada para el creador de la historia"

---

## Verificación del Sistema

### Tablas de Base de Datos

Todas las tablas necesarias existen y están funcionando:

- ✅ `stories` - Historias
- ✅ `story_views` - Visualizaciones
- ✅ `story_reactions` - Reacciones
- ✅ `story_replies` - Respuestas
- ✅ `notifications` - Notificaciones (con campos `story_id` y tipos nuevos)
- ✅ `chat_rooms` - Salas de chat
- ✅ `chat_participants` - Participantes de chat
- ✅ `messages` - Mensajes

### Scripts de Verificación

Se crearon varios scripts para verificar el sistema:

1. **`backend/check_stories_tables.py`**
   - Verifica que todas las tablas de stories existen
   - Muestra contadores de registros

2. **`backend/check_notifications_stories.py`**
   - Verifica tipos de notificación disponibles
   - Confirma que `story_id` existe en la tabla
   - Cuenta notificaciones de stories

3. **`backend/check_existing_stories.py`**
   - Lista historias activas por usuario
   - Muestra detalles de cada historia

4. **`backend/test_stories_notifications.py`**
   - Prueba completa del flujo de notificaciones
   - Crea reacciones y respuestas de prueba
   - Verifica creación de notificaciones

---

## Tipos de Notificación

### story_reaction
- **Trigger**: Usuario reacciona a una historia
- **Destinatario**: Creador de la historia
- **Mensaje**: "{username} reaccionó con {emoji} a tu historia"
- **Referencia**: `story_id`

### story_reply
- **Trigger**: Usuario responde a una historia
- **Destinatario**: Creador de la historia
- **Mensaje**: "{username} respondió a tu historia"
- **Referencia**: `story_id`
- **Acción adicional**: Crea mensaje en chat privado

---

## Emojis de Reacción

Las reacciones disponibles son:

- ❤️ `like` - Me gusta / Corazón
- 🔥 `fire` - Fuego
- 🎉 `celebrate` - Celebración
- 👍 `thumbsup` - Pulgar arriba

---

## Características Adicionales

### Animaciones
- Efecto de explosión al reaccionar
- 8 partículas flotantes con rotación
- Fondos con gradiente en hover
- Animación de bounce-in para contadores

### Feedback Háptico
- Vibración al reaccionar: [30ms, 10ms, 30ms]
- Vibración al enviar respuesta: [50ms]

### Gestures
- Doble tap para like rápido (solo en contenido)
- Long press para pausar
- Swipe down para cerrar
- Swipe left/right para navegar

### Contador de Vistas
- Solo visible para el creador de la historia
- Muestra número de usuarios que vieron la historia

---

## Estado Actual

✅ **Backend**: Completamente implementado y funcional
✅ **Frontend**: Completamente implementado y funcional
✅ **Base de Datos**: Todas las tablas creadas y migraciones aplicadas
✅ **Notificaciones**: Sistema funcionando correctamente
✅ **Mensajería**: Integración con chat privado funcionando
✅ **Testing**: Scripts de verificación creados

---

## Próximos Pasos (Opcional)

1. **Panel de Notificaciones**: Actualizar el componente de notificaciones para mostrar las notificaciones de stories con diseño especial
2. **Badge de Notificaciones**: Agregar contador de notificaciones no leídas en el icono de campana
3. **WebSocket**: Implementar notificaciones en tiempo real usando WebSocket
4. **Sonidos**: Agregar sonidos de notificación cuando llega una nueva
5. **Push Notifications**: Implementar notificaciones push para móvil

---

## Notas Técnicas

- Las notificaciones solo se crean cuando el usuario que reacciona/responde NO es el creador de la historia
- Los chats privados se reutilizan si ya existen entre los dos usuarios
- Las historias expiran automáticamente después de 24 horas
- El sistema maneja correctamente errores y los registra en consola
- Se evitan caracteres emoji en prints de Python por compatibilidad con Windows

---

## Comandos Útiles

```bash
# Verificar tablas de stories
cd backend
python check_stories_tables.py

# Verificar notificaciones
python check_notifications_stories.py

# Ver historias existentes
python check_existing_stories.py

# Probar sistema completo
python test_stories_notifications.py

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate
```

---

**Fecha de Implementación**: 26 de Enero, 2026
**Estado**: ✅ Completado y Funcional

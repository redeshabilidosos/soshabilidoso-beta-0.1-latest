# Sistema de Notificaciones - SOS-HABILIDOSO

## ✅ Estado: IMPLEMENTADO Y FUNCIONANDO

---

## 📡 Endpoints de la API

### Listar Notificaciones
```
GET /api/notifications/
Authorization: Bearer <token>

Respuesta:
[
  {
    "id": "uuid",
    "sender": {
      "id": "uuid",
      "username": "usuario",
      "display_name": "Nombre Usuario",
      "avatar_url": "url",
      "is_verified": false
    },
    "notification_type": "like|comment|share|follow|friend_request",
    "post_id": "uuid",
    "comment_id": "uuid",
    "message": "Usuario te dio me gusta",
    "is_read": false,
    "created_at": "2025-11-14T...",
    "read_at": null,
    "time_ago": "Hace 5 minutos"
  }
]
```

### Contador de No Leídas
```
GET /api/notifications/unread-count/
Authorization: Bearer <token>

Respuesta:
{
  "unread_count": 5
}
```

### Marcar como Leída
```
POST /api/notifications/<uuid>/read/
Authorization: Bearer <token>

Respuesta:
{
  "message": "Notificación marcada como leída",
  "notification": {...}
}
```

### Marcar Todas como Leídas
```
POST /api/notifications/mark-all-read/
Authorization: Bearer <token>

Respuesta:
{
  "message": "5 notificaciones marcadas como leídas",
  "updated_count": 5
}
```

### Eliminar Notificación
```
DELETE /api/notifications/<uuid>/delete/
Authorization: Bearer <token>

Respuesta:
{
  "message": "Notificación eliminada"
}
```

### Limpiar Todas
```
DELETE /api/notifications/clear-all/
Authorization: Bearer <token>

Respuesta:
{
  "message": "Todas las notificaciones eliminadas",
  "deleted_count": 10
}
```

---

## 🔔 Tipos de Notificaciones

### Reacciones
- **like**: Me gusta en publicación
- **celebration**: Celebración en publicación
- **golazo**: Golazo en publicación

### Interacciones
- **comment**: Comentario en publicación
- **reply**: Respuesta a comentario
- **share**: Compartir publicación

### Sociales
- **follow**: Nuevo seguidor
- **friend_request**: Solicitud de amistad
- **friend_accept**: Amistad aceptada

### Menciones
- **mention**: Mención en publicación o comentario

---

## 🤖 Creación Automática

Las notificaciones se crean automáticamente mediante signals cuando:

1. ✅ Alguien reacciona a tu publicación (like, celebration, golazo)
2. ✅ Alguien comenta tu publicación
3. ✅ Alguien responde a tu comentario
4. ✅ Alguien comparte tu publicación
5. ✅ Alguien te sigue
6. ✅ Alguien te envía solicitud de amistad
7. ✅ Alguien acepta tu solicitud de amistad

---

## 💾 Modelo de Datos

```python
class Notification:
    id: UUID
    recipient: User  # Usuario que recibe la notificación
    sender: User     # Usuario que genera la notificación
    notification_type: str  # Tipo de notificación
    post_id: UUID (opcional)
    comment_id: UUID (opcional)
    message: str
    is_read: bool
    created_at: datetime
    read_at: datetime (opcional)
```

---

## 🎯 Uso en Frontend

### 1. Obtener Contador de No Leídas
```typescript
const response = await fetch('/api/notifications/unread-count/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { unread_count } = await response.json();
// Mostrar badge con el número
```

### 2. Listar Notificaciones
```typescript
const response = await fetch('/api/notifications/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const notifications = await response.json();
// Mostrar lista de notificaciones
```

### 3. Marcar como Leída al Hacer Click
```typescript
const markAsRead = async (notificationId) => {
  await fetch(`/api/notifications/${notificationId}/read/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  // Actualizar UI
};
```

---

## 📱 Componentes Frontend Necesarios

### 1. Badge de Notificaciones
- Mostrar contador de no leídas
- Actualizar en tiempo real
- Ubicación: Navbar/Sidebar

### 2. Panel de Notificaciones
- Lista de notificaciones
- Marcar como leída al hacer click
- Botón "Marcar todas como leídas"
- Botón "Limpiar todas"

### 3. Item de Notificación
- Avatar del remitente
- Mensaje descriptivo
- Tiempo transcurrido
- Indicador de leída/no leída
- Click para ir a la publicación/comentario

---

## 🔄 Actualización en Tiempo Real (Opcional)

Para actualizar el contador en tiempo real, puedes:

1. **Polling**: Consultar cada X segundos
```typescript
setInterval(async () => {
  const { unread_count } = await getUnreadCount();
  updateBadge(unread_count);
}, 30000); // Cada 30 segundos
```

2. **WebSocket**: Recibir notificaciones en tiempo real
```typescript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'new_notification') {
    incrementBadge();
    showToast(data.notification.message);
  }
};
```

---

## ✅ Verificación

Para verificar que el sistema funciona:

1. Crea una publicación
2. Haz que otro usuario reaccione/comente
3. Verifica que se creó la notificación:
```bash
python manage.py shell
>>> from apps.notifications.models import Notification
>>> Notification.objects.all()
```

4. Consulta el endpoint:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/notifications/
```

---

## 🎨 Ejemplo de UI

```
┌─────────────────────────────────────┐
│  🔔 Notificaciones (5)              │
├─────────────────────────────────────┤
│  👤 Juan Pérez                      │
│     Te dio me gusta                 │
│     Hace 5 minutos              ●   │
├─────────────────────────────────────┤
│  👤 María García                    │
│     Comentó tu publicación          │
│     Hace 10 minutos             ●   │
├─────────────────────────────────────┤
│  👤 Carlos López                    │
│     Comenzó a seguirte              │
│     Hace 1 hora                     │
├─────────────────────────────────────┤
│  [Marcar todas como leídas]         │
│  [Limpiar todas]                    │
└─────────────────────────────────────┘
```

---

## 🚀 Próximos Pasos

1. ✅ Backend implementado
2. ⏳ Crear componente de badge en Navbar
3. ⏳ Crear panel de notificaciones
4. ⏳ Integrar con WebSocket para tiempo real
5. ⏳ Agregar sonido/vibración para nuevas notificaciones

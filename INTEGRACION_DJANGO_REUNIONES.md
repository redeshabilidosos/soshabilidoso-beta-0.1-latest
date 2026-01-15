# 🔧 Integración Django - Sistema de Reuniones Virtuales

## 📋 Endpoints Necesarios para el Backend

### 🔐 **Autenticación**
Todos los endpoints requieren autenticación JWT:
```
Authorization: Bearer <access_token>
```

### 📡 **Endpoints de Comunidades**

#### **1. Obtener Suscripciones del Usuario**
```http
GET /api/user/subscriptions/
```
**Response:**
```json
{
  "community_ids": ["1", "2", "3"],
  "communities": [
    {
      "id": "1",
      "name": "Desarrollo Web Avanzado",
      "is_premium": true,
      "subscription_date": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### **2. Suscribirse a Comunidad**
```http
POST /api/communities/{id}/subscribe/
```
**Response:**
```json
{
  "success": true,
  "message": "Suscrito exitosamente",
  "subscription_id": "sub_123"
}
```

#### **3. Desuscribirse de Comunidad**
```http
DELETE /api/communities/{id}/unsubscribe/
```

### 🎥 **Endpoints de Reuniones**

#### **1. Obtener Próximas Reuniones del Usuario**
```http
GET /api/meetings/upcoming/
```
**Response:**
```json
{
  "meetings": [
    {
      "id": "1",
      "title": "Introducción a React Hooks",
      "description": "Aprende los conceptos básicos...",
      "community_id": "1",
      "community_name": "Desarrollo Web Avanzado",
      "scheduled_at": "2024-01-25T19:00:00Z",
      "duration": 90,
      "host_name": "Carlos Mendoza",
      "host_avatar": "/media/avatars/carlos.jpg",
      "participants_count": 23,
      "max_participants": 50,
      "status": "scheduled",
      "meeting_url": "https://meet.sos-habilidoso.com/room/abc123",
      "tags": ["React", "Hooks", "Principiantes"]
    }
  ]
}
```

#### **2. Crear Nueva Reunión**
```http
POST /api/meetings/
```
**Request Body:**
```json
{
  "title": "Nueva Reunión",
  "description": "Descripción de la reunión",
  "community_id": "1",
  "scheduled_at": "2024-01-25T19:00:00Z",
  "duration": 90,
  "max_participants": 50,
  "is_recurring": false,
  "recurring_type": "weekly",
  "tags": ["tag1", "tag2"],
  "settings": {
    "requires_approval": false,
    "allow_recording": true,
    "enable_chat": true,
    "enable_screen_share": true
  }
}
```

#### **3. Obtener Reuniones en Vivo**
```http
GET /api/meetings/live/
```
**Response:**
```json
{
  "streams": [
    {
      "id": "1",
      "type": "meeting",
      "title": "Sesión Q&A Backend",
      "description": "Resuelve tus dudas...",
      "host_name": "Ana García",
      "host_avatar": "/media/avatars/ana.jpg",
      "community_name": "Desarrollo Web Avanzado",
      "community_id": "1",
      "viewers": 23,
      "duration": "45:32",
      "thumbnail": "/media/thumbnails/meeting1.jpg",
      "is_live": true,
      "category": "Educación",
      "tags": ["Backend", "Q&A"],
      "started_at": "2024-01-24T19:00:00Z"
    }
  ]
}
```

### 🔔 **Endpoints de Notificaciones**

#### **1. Obtener Notificaciones de Reuniones**
```http
GET /api/notifications/meetings/
```
**Response:**
```json
{
  "notifications": [
    {
      "id": "1",
      "type": "starting_soon",
      "meeting_id": "2",
      "meeting_title": "Sesión de Q&A",
      "community_name": "Desarrollo Web Avanzado",
      "scheduled_at": "2024-01-24T20:30:00Z",
      "time_until_start": 5,
      "participants": 15
    }
  ]
}
```

## 🔄 **Modelos Django Sugeridos**

### **Community Model**
```python
class Community(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
class CommunitySubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
```

### **Meeting Model**
```python
class Meeting(models.Model):
    MEETING_STATUS = [
        ('scheduled', 'Programada'),
        ('live', 'En Vivo'),
        ('ended', 'Finalizada'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    scheduled_at = models.DateTimeField()
    duration = models.IntegerField()  # en minutos
    max_participants = models.IntegerField(default=50)
    status = models.CharField(max_length=20, choices=MEETING_STATUS)
    meeting_url = models.URLField(blank=True)
    is_recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 🔌 **Integración Frontend**

### **1. Actualizar app/feed/page.tsx**
```typescript
// Reemplazar la simulación con:
useEffect(() => {
  const fetchUserSubscriptions = async () => {
    try {
      const response = await fetch('/api/user/subscriptions/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      setUserSubscriptions(data.community_ids || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };
  
  if (user) {
    fetchUserSubscriptions();
  }
}, [user]);
```

### **2. Actualizar UpcomingMeetingsWidget**
```typescript
// En components/communities/upcoming-meetings-widget.tsx
useEffect(() => {
  const fetchUpcomingMeetings = async () => {
    try {
      const response = await fetch('/api/meetings/upcoming/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };
  
  if (userSubscriptions.length > 0) {
    fetchUpcomingMeetings();
  }
}, [userSubscriptions]);
```

### **3. Actualizar LiveStreamsDropdown**
```typescript
// En components/navigation/live-streams-dropdown.tsx
useEffect(() => {
  const fetchLiveStreams = async () => {
    try {
      const response = await fetch('/api/meetings/live/');
      const data = await response.json();
      setStreams(data.streams || []);
    } catch (error) {
      console.error('Error fetching live streams:', error);
    }
  };
  
  fetchLiveStreams();
  
  // Actualizar cada 30 segundos
  const interval = setInterval(fetchLiveStreams, 30000);
  return () => clearInterval(interval);
}, []);
```

## 🚀 **WebSocket para Tiempo Real**

### **Django Channels Setup**
```python
# consumers.py
class MeetingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("meetings", self.channel_name)
        await self.accept()
    
    async def meeting_started(self, event):
        await self.send(text_data=json.dumps({
            'type': 'meeting_started',
            'meeting': event['meeting']
        }))
```

### **Frontend WebSocket**
```typescript
// hooks/use-meetings-websocket.ts
export function useMeetingsWebSocket() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/meetings/');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'meeting_started') {
        // Actualizar lista de transmisiones en vivo
        updateLiveStreams(data.meeting);
      }
    };
    
    return () => ws.close();
  }, []);
}
```

## ✅ **Checklist de Integración**

### **Backend Django:**
- [ ] Crear modelos Community, Meeting, CommunitySubscription
- [ ] Implementar endpoints de API REST
- [ ] Configurar autenticación JWT
- [ ] Configurar Django Channels para WebSocket
- [ ] Implementar sistema de notificaciones

### **Frontend Next.js:**
- [ ] Reemplazar datos mock con llamadas a API
- [ ] Implementar manejo de errores
- [ ] Agregar loading states
- [ ] Configurar WebSocket para actualizaciones en tiempo real
- [ ] Implementar caché y optimización

### **Funcionalidades Adicionales:**
- [ ] Sistema de grabaciones
- [ ] Integración con WebRTC para video real
- [ ] Notificaciones push
- [ ] Analytics de participación
- [ ] Sistema de pagos para comunidades premium

## 🎯 **Estado Actual**

El frontend está **100% listo** para la integración con Django:

✅ **Componentes preparados** con props para datos reales
✅ **Lógica condicional** implementada
✅ **Interfaces TypeScript** definidas
✅ **Estructura modular** y escalable
✅ **Comentarios TODO** para puntos de integración

Solo necesitas implementar los endpoints en Django y reemplazar los datos mock! 🚀
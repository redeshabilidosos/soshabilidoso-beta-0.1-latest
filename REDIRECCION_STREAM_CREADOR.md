# Redirección Automática al Crear Stream

## Fecha: 23 de Enero 2026

## Problema Identificado
Cuando un creador de contenido iniciaba un stream desde el modal, se quedaba en el modal en lugar de ser redirigido a la vista completa de streaming donde puede ver el chat, regalos, y controlar su transmisión.

## Solución Implementada

### 1. **Importación de Router**
```typescript
import { useRouter } from 'next/navigation';
```

Se agregó el hook `useRouter` de Next.js para poder navegar programáticamente.

### 2. **Inicialización del Router**
```typescript
const router = useRouter();
```

Se inicializa el router dentro del componente `StreamingModal`.

### 3. **Selector de Tipo de Stream**

#### Nuevo Estado
```typescript
const [streamType, setStreamType] = useState<'class' | 'stream'>('stream');
```

#### UI Mejorada
Se agregó un selector visual para elegir entre:
- **Clase**: Para contenido educativo (color verde neón)
- **Stream**: Para contenido general (color morado)

```tsx
<div className="grid grid-cols-2 gap-2">
  <button onClick={() => setStreamType('class')}>
    Clase
  </button>
  <button onClick={() => setStreamType('stream')}>
    Stream
  </button>
</div>
```

### 4. **Datos Mejorados del Stream**

#### Información del Usuario
```typescript
const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
```

Se obtiene la información del usuario actual para asociarla al stream.

#### Estructura de Datos Completa
```typescript
const streamData = {
  id: newStreamId,
  type: streamType,              // 'class' o 'stream'
  title: streamTitle,
  description: streamDescription,
  hostName: currentUser.username || 'Usuario',
  hostAvatar: currentUser.avatar || '',
  startedAt: new Date().toISOString(),
  isLive: true,
  isPrivate: false,
  meetingUrl: '',
};
```

### 5. **Redirección Automática**

#### Flujo de Redirección
```typescript
setIsStreaming(true);
toast.success('¡Streaming iniciado! Redirigiendo...');

setTimeout(() => {
  onClose();
  router.push(`/live/stream/${newStreamId}`);
}, 1000);
```

**Pasos:**
1. Marca el stream como activo
2. Muestra notificación de éxito
3. Espera 1 segundo (para que el usuario vea la confirmación)
4. Cierra el modal
5. Redirige a `/live/stream/[id]`

### 6. **Experiencia de Usuario**

#### Antes
```
Usuario → Click "Iniciar Stream" 
       → Modal se queda abierto
       → Usuario debe cerrar manualmente
       → Buscar su stream en la lista
       → Click para entrar
```

#### Después
```
Usuario → Click "Iniciar Stream"
       → Toast: "¡Streaming iniciado! Redirigiendo..."
       → Modal se cierra automáticamente
       → Redirige a vista de streaming
       → Usuario ya está transmitiendo
```

## Beneficios

### 1. **Flujo Más Rápido**
- ✅ Ahorra 3-4 clicks al usuario
- ✅ Redirección automática en 1 segundo
- ✅ No necesita buscar su stream

### 2. **Mejor UX**
- ✅ Feedback visual claro (toast)
- ✅ Transición suave
- ✅ Usuario llega directo a controlar su stream

### 3. **Datos Completos**
- ✅ Tipo de stream guardado (clase/stream)
- ✅ Información del host incluida
- ✅ Timestamp de inicio registrado

### 4. **Consistencia**
- ✅ Mismo flujo para clases y streams
- ✅ Datos estructurados uniformemente
- ✅ Fácil de extender con más campos

## Estructura de la Vista de Streaming

### Para el Creador (`/live/stream/[id]`)
```
┌─────────────────────────────────────┐
│ [LIVE Badge] [Viewers] [Duration]   │
│                                     │
│         Video del Stream            │
│                                     │
│    [Mute] [Fullscreen] [Exit]      │
├─────────────────────────────────────┤
│  Apoya al Streamer ▼               │
│  [💗] [⭐] [⚡] [👑] [✨] [🎁]    │
├─────────────────────────────────────┤
│  Chat en Vivo                       │
│  • Usuario1: ¡Hola!                │
│  • Usuario2: Excelente              │
│  [Emoji] [Input] [Send]            │
└─────────────────────────────────────┘
```

### Funcionalidades Disponibles
1. **Control de Video**: Mute, fullscreen, salir
2. **Regalos**: Recibir donaciones de espectadores
3. **Chat**: Interactuar con la audiencia
4. **Estadísticas**: Ver viewers en tiempo real
5. **Duración**: Tiempo transcurrido del stream

## Código Clave

### Función de Inicio de Stream
```typescript
const startStreaming = async () => {
  if (!streamTitle.trim()) {
    toast.error('Por favor, ingresa un título para el streaming');
    return;
  }

  try {
    const newStreamId = `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    
    const streamData = {
      id: newStreamId,
      type: streamType,
      title: streamTitle,
      description: streamDescription,
      hostName: currentUser.username || 'Usuario',
      hostAvatar: currentUser.avatar || '',
      startedAt: new Date().toISOString(),
      isLive: true,
      isPrivate: false,
      meetingUrl: '',
    };
    
    const existingStreams = JSON.parse(localStorage.getItem('active_streams') || '[]');
    existingStreams.push(streamData);
    localStorage.setItem('active_streams', JSON.stringify(existingStreams));
    
    setIsStreaming(true);
    toast.success('¡Streaming iniciado! Redirigiendo...');
    
    setTimeout(() => {
      onClose();
      router.push(`/live/stream/${newStreamId}`);
    }, 1000);
    
  } catch (error) {
    console.error('Error starting stream:', error);
    toast.error('Error al iniciar el streaming');
    setIsStreaming(false);
  }
};
```

## Flujo Completo

### 1. Usuario en `/live`
- Ve botones "Crear Clase" o "Iniciar Stream"
- Click en cualquiera abre el modal

### 2. Modal de Configuración
- Selecciona tipo (Clase/Stream)
- Ingresa título (requerido)
- Ingresa descripción (opcional)
- Configura cámara/micrófono
- Click "Iniciar"

### 3. Validación
- Verifica que haya título
- Genera ID único
- Obtiene datos del usuario
- Guarda en localStorage

### 4. Redirección
- Muestra toast de confirmación
- Espera 1 segundo
- Cierra modal
- Navega a `/live/stream/[id]`

### 5. Vista de Streaming
- Carga datos del stream
- Muestra video
- Habilita chat
- Muestra panel de regalos
- Actualiza viewers en tiempo real

## Integración con Backend (Futuro)

### Endpoints Necesarios
```typescript
// Crear stream
POST /api/streaming/sessions/
{
  type: 'class' | 'stream',
  title: string,
  description: string,
  is_private: boolean
}

// Actualizar stream
PATCH /api/streaming/sessions/{id}/
{
  is_live: boolean,
  viewer_count: number
}

// Finalizar stream
POST /api/streaming/sessions/{id}/end/
```

### Datos a Sincronizar
- Estado del stream (live/ended)
- Número de viewers
- Mensajes del chat
- Regalos recibidos
- Duración total
- Estadísticas de engagement

## Testing Recomendado

1. ✅ Verificar que el modal se abre correctamente
2. ✅ Verificar selector de tipo de stream
3. ✅ Verificar validación de título requerido
4. ✅ Verificar que se genera ID único
5. ✅ Verificar que se guarda en localStorage
6. ✅ Verificar toast de confirmación
7. ✅ Verificar redirección a `/live/stream/[id]`
8. ✅ Verificar que la vista de streaming carga correctamente
9. ✅ Verificar que los datos del stream son correctos

## Archivos Modificados

- `components/streaming/streaming-modal.tsx` - Modal de configuración de stream
- `app/live/stream/[id]/page.tsx` - Vista de streaming (ya existente)

## Próximos Pasos Sugeridos

1. ⏳ Integrar con backend real (Django)
2. ⏳ Implementar WebRTC para video real
3. ⏳ Agregar WebSocket para chat en tiempo real
4. ⏳ Implementar sistema de notificaciones push
5. ⏳ Agregar analytics de streaming
6. ⏳ Implementar grabación de streams
7. ⏳ Agregar moderación de chat
8. ⏳ Implementar sistema de reportes

## Notas Técnicas

- El ID del stream se genera con timestamp + random string para garantizar unicidad
- Se usa `setTimeout` de 1 segundo para dar feedback visual antes de redirigir
- Los datos se guardan en localStorage temporalmente hasta integrar con backend
- El router de Next.js maneja la navegación sin recargar la página
- El modal se cierra automáticamente antes de la redirección

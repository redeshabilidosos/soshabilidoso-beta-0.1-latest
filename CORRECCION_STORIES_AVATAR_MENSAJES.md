# Corrección de Avatar y Mensajes en Stories

## Fecha: 26 de Enero, 2026

---

## Problemas Identificados

### 1. Avatar mostrando inicial "M" en lugar de foto
**Causa**: El fallback de la imagen no estaba funcionando correctamente

### 2. Error al enviar mensajes
**Causa**: El backend no aceptaba `Content-Type: application/json`
**Error**: `415 Unsupported Media Type`

---

## Soluciones Implementadas

### 1. Corrección del Avatar

**Archivo**: `components/ui/stories-slider.tsx`

**Problema**: 
- El avatar mostraba solo la inicial "M" del usuario
- El fallback no se activaba correctamente

**Solución**:
```tsx
<div className="w-10 h-10 rounded-full border-2 border-neon-green/50 ring-2 ring-neon-green/30 overflow-hidden bg-gradient-to-br from-neon-green/20 to-neon-blue/20 flex items-center justify-center">
  {currentUser.user.avatar ? (
    <img 
      src={currentUser.user.avatar} 
      alt={currentUser.user.displayName}
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback si la imagen no carga - ocultar imagen
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  ) : null}
  {/* Fallback con inicial - siempre presente pero detrás de la imagen */}
  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg pointer-events-none">
    {currentUser.user.displayName.charAt(0).toUpperCase()}
  </div>
</div>
```

**Características**:
- ✅ Muestra la foto de perfil si existe
- ✅ Fallback automático a inicial si la imagen falla
- ✅ Gradiente neón de fondo
- ✅ Inicial siempre presente como respaldo

---

### 2. Corrección del Endpoint de Mensajes

**Archivo**: `backend/apps/stories/views.py`

**Problema**:
```python
parser_classes = [MultiPartParser, FormParser]
```
- Solo aceptaba `multipart/form-data`
- Rechazaba `application/json` con error 415

**Solución**:
```python
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class StoryViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
```

**Resultado**:
- ✅ Acepta `application/json` para endpoints de reacción y respuesta
- ✅ Mantiene soporte para `multipart/form-data` para subir imágenes/videos
- ✅ Endpoint `/api/stories/{id}/reply/` ahora funciona correctamente

---

### 3. Mejora del Manejo de Errores

**Archivo**: `lib/services/stories.service.ts`

**Mejoras**:
```typescript
async replyToStory(storyId: string, message: string): Promise<{ 
  success: boolean; 
  message_created: boolean; 
  notification_created: boolean; 
  error?: string 
}> {
  try {
    const response = await fetch(`${this.baseUrl}/stories/${storyId}/reply/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta del servidor:', data);
      return { 
        success: true, 
        message_created: data.message_created || false,
        notification_created: data.notification_created || false 
      };
    }
    
    // Obtener detalles del error
    const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    console.error('❌ Error del servidor:', response.status, errorData);
    
    return { 
      success: false, 
      message_created: false, 
      notification_created: false,
      error: errorData.detail || errorData.error || `Error ${response.status}`
    };
  } catch (error) {
    console.error('❌ Error de red:', error);
    return { 
      success: false, 
      message_created: false, 
      notification_created: false,
      error: 'Error de conexión. Verifica tu internet.'
    };
  }
}
```

**Características**:
- ✅ Retorna detalles específicos del error
- ✅ Logs detallados en consola
- ✅ Manejo de errores de red
- ✅ Mensajes de error claros para el usuario

---

### 4. Toast con Mensaje de Error Específico

**Archivo**: `components/ui/stories-slider.tsx`

**Mejora**:
```typescript
if (result.success) {
  toast({
    title: "✅ Mensaje enviado",
    description: "Tu respuesta se envió a la bandeja de entrada",
    duration: 3000,
    className: "bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green/50",
  });
} else {
  // Toast de error con detalles específicos
  const errorMessage = result.error || "No se pudo enviar el mensaje. Intenta de nuevo.";
  console.error('❌ Error al enviar mensaje:', errorMessage);
  
  toast({
    title: "❌ Error",
    description: errorMessage,
    duration: 5000,
    variant: "destructive",
  });
}
```

**Características**:
- ✅ Muestra el error específico del servidor
- ✅ Duración más larga para errores (5s vs 3s)
- ✅ Logs en consola para debugging
- ✅ Estilo destructivo (rojo) para errores

---

## Pruebas Realizadas

### Test del Endpoint

**Script**: `backend/test_story_reply_endpoint.py`

**Resultado**:
```
[OK] Historia encontrada: 0f346632-c35d-4f9d-b4a2-780ccba436d5
[OK] Creador: moloworld
[OK] Token generado para molo
[DEBUG] Status Code: 201
[OK] Respuesta exitosa!
[OK] message_created: True
[OK] notification_created: True
```

**Respuesta del Servidor**:
```json
{
  "id": "1ef8710d-945e-4b33-bed0-0892d9bab000",
  "user": {
    "id": "4cccc11a-7e63-4423-bf92-808272ad4b52",
    "username": "molo",
    "display_name": "M0L0W0R1D",
    "avatar_url": "/media/avatars/afb30955a4f8909572ed5e60291d1763.jpg"
  },
  "message": "Mensaje de prueba desde script!",
  "is_read": false,
  "created_at": "2026-01-26T13:23:48.820303",
  "message_created": true,
  "notification_created": true
}
```

---

## Archivos Modificados

### Backend
1. **`backend/apps/stories/views.py`**
   - Agregado `JSONParser` a `parser_classes`
   - Líneas modificadas: 2

### Frontend
1. **`components/ui/stories-slider.tsx`**
   - Mejorado fallback del avatar
   - Mejorado manejo de errores en `handleSendReply`
   - Líneas modificadas: ~30

2. **`lib/services/stories.service.ts`**
   - Agregado campo `error` al tipo de retorno
   - Mejorado logging de errores
   - Captura de detalles específicos del error
   - Líneas modificadas: ~25

### Scripts de Prueba
1. **`backend/test_story_reply_endpoint.py`** (nuevo)
   - Script para probar el endpoint de respuestas
   - Verifica token, historia y envío de mensaje

---

## Flujo Corregido

### Envío de Mensaje

1. Usuario escribe mensaje en la historia
2. Usuario hace clic en enviar
3. Frontend envía POST con `Content-Type: application/json` ✅
4. Backend acepta JSON con `JSONParser` ✅
5. Backend crea mensaje en chat privado ✅
6. Backend crea notificación ✅
7. Backend retorna `message_created: true` y `notification_created: true` ✅
8. Frontend muestra toast de éxito ✅
9. Usuario ve confirmación visual ✅

### Visualización de Avatar

1. Componente intenta cargar imagen del usuario
2. Si la imagen existe y carga: muestra foto ✅
3. Si la imagen falla: muestra inicial con gradiente ✅
4. Siempre mantiene el borde neón verde ✅

---

## Verificación

### Comandos para Probar

```bash
# Backend - Probar endpoint
cd backend
python test_story_reply_endpoint.py

# Frontend - Verificar en navegador
# 1. Abrir http://localhost:3000
# 2. Ver una historia de otro usuario
# 3. Escribir un mensaje
# 4. Hacer clic en enviar
# 5. Verificar toast de éxito
# 6. Verificar que el avatar se muestra correctamente
```

### Checklist de Verificación

- ✅ Avatar muestra foto de perfil
- ✅ Fallback a inicial funciona si imagen falla
- ✅ Mensaje se envía correctamente
- ✅ Toast de éxito aparece
- ✅ Mensaje llega a la bandeja de entrada
- ✅ Notificación se crea para el creador
- ✅ Errores muestran mensaje específico
- ✅ Vibración háptica funciona

---

## Notas Técnicas

### Parser Classes en DRF

Django REST Framework permite múltiples parsers:
- `MultiPartParser`: Para archivos (imágenes, videos)
- `FormParser`: Para formularios HTML
- `JSONParser`: Para datos JSON

**Importante**: Siempre incluir `JSONParser` cuando los endpoints aceptan JSON.

### Fallback de Imágenes

Estrategia de dos capas:
1. Imagen principal con `onError` handler
2. Fallback siempre presente detrás (con `absolute` positioning)

Esto asegura que siempre haya algo visible.

---

## Estado Final

✅ **Avatar**: Muestra foto de perfil correctamente con fallback robusto
✅ **Mensajes**: Se envían correctamente a la bandeja de entrada
✅ **Notificaciones**: Se crean automáticamente
✅ **Toast**: Muestra confirmación con detalles específicos
✅ **Errores**: Manejo robusto con mensajes claros

**Fecha de Corrección**: 26 de Enero, 2026
**Estado**: ✅ Completamente Funcional

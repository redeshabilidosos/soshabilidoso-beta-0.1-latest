# Corrección de Inicialización de Cámara - Reuniones y Clases

## Problema Identificado

La cámara no se estaba inicializando correctamente al entrar a las salas de reunión y clase. El video permanecía en negro y no se activaba automáticamente.

## Causa del Problema

1. **Función duplicada**: Existía una función `initializeCamera` que no se estaba llamando correctamente
2. **Falta de referencia al stream**: No se guardaba la referencia al MediaStream
3. **Toggle incorrecto**: Los botones de mute/video no funcionaban correctamente
4. **Falta de autoplay**: El elemento video no se reproducía automáticamente

## Solución Implementada

### 1. Nuevo Sistema de Referencias

```typescript
const videoRef = useRef<HTMLVideoElement>(null);
const streamRef = useRef<MediaStream | null>(null);
```

**Beneficios:**
- `videoRef`: Referencia al elemento HTML video
- `streamRef`: Referencia al MediaStream para control de tracks

### 2. Inicialización Mejorada

```typescript
useEffect(() => {
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Asegurar que el video se reproduzca
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }
      
      console.log('Cámara inicializada correctamente');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  setupCamera();
  
  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
    }
  };
}, []);
```

**Mejoras:**
- ✅ Configuración de calidad de video (1280x720)
- ✅ Mejoras de audio (cancelación de eco, supresión de ruido)
- ✅ Llamada explícita a `.play()`
- ✅ Manejo de errores mejorado
- ✅ Limpieza correcta de tracks al desmontar
- ✅ Logs para debugging

### 3. Controles Corregidos

#### Toggle Mute
```typescript
const toggleMute = () => {
  setIsMuted(!isMuted);
  if (streamRef.current) {
    streamRef.current.getAudioTracks().forEach(track => {
      track.enabled = isMuted; // Invertido porque el estado cambiará
    });
  }
};
```

#### Toggle Video
```typescript
const toggleVideo = () => {
  setIsVideoOff(!isVideoOff);
  if (streamRef.current) {
    streamRef.current.getVideoTracks().forEach(track => {
      track.enabled = isVideoOff; // Invertido porque el estado cambiará
    });
  }
};
```

**Correcciones:**
- ✅ Usa `streamRef` en lugar de `videoRef.srcObject`
- ✅ Lógica invertida correcta (el estado cambia después)
- ✅ Acceso directo a los tracks

### 4. Limpieza de Recursos

```typescript
return () => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => {
      track.stop();
      console.log('Track stopped:', track.kind);
    });
  }
};
```

**Beneficios:**
- ✅ Detiene todos los tracks (video y audio)
- ✅ Libera recursos de la cámara
- ✅ Logs para verificar limpieza

## Configuración de MediaStream

### Video
```typescript
video: {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: 'user'
}
```

**Características:**
- Resolución HD (720p)
- Cámara frontal por defecto
- Fallback automático si no soporta HD

### Audio
```typescript
audio: {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true
}
```

**Características:**
- Cancelación de eco
- Supresión de ruido de fondo
- Control automático de ganancia

## Archivos Modificados

### 1. `/app/live/meeting/[id]/page.tsx`
- ✅ Agregado `streamRef`
- ✅ Reescrito `useEffect` de inicialización
- ✅ Corregido `toggleMute`
- ✅ Corregido `toggleVideo`
- ✅ Eliminada función `initializeCamera` duplicada

### 2. `/app/live/class/[id]/page.tsx`
- ✅ Agregado `streamRef`
- ✅ Reescrito `useEffect` de inicialización
- ✅ Corregido `toggleMute`
- ✅ Corregido `toggleVideo`
- ✅ Eliminada función `initializeCamera` duplicada

## Flujo de Inicialización

```
1. Usuario entra a la sala
   ↓
2. Componente se monta
   ↓
3. useEffect se ejecuta
   ↓
4. setupCamera() se llama
   ↓
5. getUserMedia() solicita permisos
   ↓
6. Usuario acepta permisos
   ↓
7. Stream se asigna a streamRef
   ↓
8. Stream se asigna a videoRef.srcObject
   ↓
9. video.play() se llama
   ↓
10. Cámara se muestra en pantalla ✅
```

## Manejo de Errores

### Error de Permisos
```typescript
catch (error) {
  console.error('Error accessing camera:', error);
  toast.error('No se pudo acceder a la cámara. Verifica los permisos.');
}
```

### Error de Reproducción
```typescript
videoRef.current.play().catch(err => {
  console.error('Error playing video:', err);
});
```

## Permisos del Navegador

### Chrome/Edge
```
1. Aparece popup: "¿Permitir acceso a cámara y micrófono?"
2. Usuario hace clic en "Permitir"
3. Cámara se activa
```

### Firefox
```
1. Aparece popup: "¿Compartir cámara y micrófono?"
2. Usuario selecciona dispositivos
3. Usuario hace clic en "Permitir"
4. Cámara se activa
```

### Safari
```
1. Aparece popup: "¿Permitir acceso a cámara?"
2. Aparece popup: "¿Permitir acceso a micrófono?"
3. Usuario hace clic en "Permitir" en ambos
4. Cámara se activa
```

## Debugging

### Verificar Stream
```typescript
console.log('Stream:', streamRef.current);
console.log('Video tracks:', streamRef.current?.getVideoTracks());
console.log('Audio tracks:', streamRef.current?.getAudioTracks());
```

### Verificar Video Element
```typescript
console.log('Video element:', videoRef.current);
console.log('Video srcObject:', videoRef.current?.srcObject);
console.log('Video paused:', videoRef.current?.paused);
```

### Verificar Tracks
```typescript
streamRef.current?.getTracks().forEach(track => {
  console.log('Track:', track.kind, 'enabled:', track.enabled);
});
```

## Compatibilidad

### Navegadores Soportados
- ✅ Chrome 53+
- ✅ Firefox 36+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Opera 40+

### Dispositivos
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Android (Chrome, Firefox)
- ✅ iOS (Safari)
- ✅ Tablets

## Próximas Mejoras

### Selección de Dispositivos
```typescript
// Permitir elegir cámara/micrófono
const devices = await navigator.mediaDevices.enumerateDevices();
const videoDevices = devices.filter(d => d.kind === 'videoinput');
```

### Cambio de Cámara
```typescript
// Cambiar entre cámara frontal y trasera
const constraints = {
  video: { facingMode: isFrontCamera ? 'user' : 'environment' }
};
```

### Configuración de Calidad
```typescript
// Permitir ajustar calidad según conexión
const qualities = {
  low: { width: 640, height: 480 },
  medium: { width: 1280, height: 720 },
  high: { width: 1920, height: 1080 }
};
```

## Resultado

✅ **Cámara se inicia automáticamente al entrar**
✅ **Video se muestra correctamente**
✅ **Botones de mute/video funcionan**
✅ **Calidad HD por defecto**
✅ **Audio con mejoras de calidad**
✅ **Limpieza correcta de recursos**
✅ **Manejo de errores robusto**

## Fecha de Corrección
28 de Enero de 2026

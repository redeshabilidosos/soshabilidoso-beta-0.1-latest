# Corrección: Activación de Cámara en Modal de Stream

## Fecha: 23 de Enero 2026

## Problema Identificado
El modal de streaming no mostraba la previsualización de la cámara y no solicitaba permisos al usuario. El área del video aparecía completamente negra.

## Causas del Problema

### 1. **Tamaño del Modal Reducido**
- El modal se había reducido a `max-w-lg` (512px)
- El video tenía `maxHeight: '280px'` que era muy pequeño
- No había suficiente espacio para ver la previsualización

### 2. **Falta de Feedback Visual**
- No había indicador de que la cámara se estaba activando
- El usuario no sabía si debía esperar o si había un error

### 3. **Manejo de Errores Limitado**
- Los errores de permisos no se manejaban específicamente
- No había mensajes claros sobre qué hacer si fallaba

## Soluciones Implementadas

### 1. **Tamaño del Modal Restaurado**

#### Antes
```tsx
<DialogContent className="max-w-lg max-h-[95vh] overflow-y-auto glass-card border-cyan-400/20 p-4 md:p-6">
```

#### Después
```tsx
<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-cyan-400/20 p-6">
```

**Cambios:**
- `max-w-lg` (512px) → `max-w-2xl` (672px)
- Padding uniforme: `p-6` (24px)
- Altura: `max-h-[90vh]` para mejor visualización

### 2. **Área de Video Mejorada**

#### Antes
```tsx
<div style={{ aspectRatio: '16/9', maxHeight: '280px' }}>
  <video ref={videoRef} autoPlay muted playsInline />
</div>
```

#### Después
```tsx
<div style={{ aspectRatio: '16/9', minHeight: '320px' }}>
  <video 
    ref={videoRef} 
    autoPlay 
    muted 
    playsInline 
    style={{ transform: 'scaleX(-1)' }}
  />
  
  {/* Mensaje de carga */}
  {!streamRef.current && (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
      <Users className="w-16 h-16 text-gray-600 mb-4 animate-pulse" />
      <p className="text-gray-400 text-center px-4">
        Activando cámara...<br />
        <span className="text-sm">Por favor, permite el acceso a tu cámara y micrófono</span>
      </p>
    </div>
  )}
</div>
```

**Mejoras:**
- `minHeight: '320px'` en lugar de `maxHeight: '280px'`
- Efecto espejo: `transform: 'scaleX(-1)'` (el usuario se ve como en un espejo)
- Mensaje de carga visible mientras se activa la cámara
- Icono animado con pulse

### 3. **Inicialización de Cámara Mejorada**

#### Configuración de Video Optimizada
```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true
  }
});
```

**Mejoras:**
- Resolución ideal: 1280x720 (HD)
- `facingMode: 'user'` para cámara frontal
- `echoCancellation: true` para mejor audio
- `noiseSuppression: true` para reducir ruido

#### Logs de Depuración
```typescript
console.log('Solicitando acceso a cámara y micrófono...');
const stream = await navigator.mediaDevices.getUserMedia(...);
console.log('Stream obtenido:', stream);

if (videoRef.current) {
  videoRef.current.srcObject = stream;
  console.log('Video asignado al elemento');
}
```

### 4. **Manejo de Errores Específico**

```typescript
catch (error: any) {
  console.error('Error accessing camera:', error);
  
  let errorMessage = 'No se pudo acceder a la cámara.';
  
  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    errorMessage = 'Permiso denegado. Por favor, permite el acceso a la cámara y micrófono en la configuración de tu navegador.';
  } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    errorMessage = 'No se encontró ninguna cámara o micrófono conectado.';
  } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
    errorMessage = 'La cámara está siendo usada por otra aplicación.';
  }
  
  toast.error(errorMessage);
}
```

**Tipos de Errores Manejados:**
1. **NotAllowedError**: Usuario denegó permisos
2. **NotFoundError**: No hay cámara/micrófono
3. **NotReadableError**: Cámara en uso por otra app
4. **Otros**: Error genérico

### 5. **Espaciado Mejorado**

```tsx
<div className="space-y-4">  {/* Antes: space-y-3 */}
```

- Más espacio entre elementos (16px en lugar de 12px)
- Mejor legibilidad y organización visual

## Flujo de Usuario Mejorado

### 1. Usuario Abre el Modal
```
Click "Iniciar Stream" → Modal se abre
```

### 2. Solicitud de Permisos
```
Modal muestra: "Activando cámara..."
Navegador solicita: "¿Permitir acceso a cámara y micrófono?"
```

### 3. Usuario Permite Acceso
```
✅ Permisos concedidos
→ Video se activa
→ Toast: "Cámara activada correctamente"
→ Usuario ve su previsualización (efecto espejo)
```

### 4. Usuario Deniega Acceso
```
❌ Permisos denegados
→ Toast: "Permiso denegado. Por favor, permite el acceso..."
→ Mensaje visible en el área del video
```

## Comparación Visual

### Antes
```
┌─────────────────────────┐
│ Nuevo Stream            │
├─────────────────────────┤
│ [Tipo] [Título]         │
│ [Descripción]           │
├─────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Negro (280px)
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ [📷] [🎤] [🖥️]        │
├─────────────────────────┤
│ [Iniciar] [Cerrar]      │
└─────────────────────────┘
```

### Después
```
┌───────────────────────────────┐
│ 📹 Nuevo Stream               │
├───────────────────────────────┤
│ [Clase] [Stream]              │
│ [Título del streaming]        │
│ [Descripción (opcional)]      │
├───────────────────────────────┤
│ ┌───────────────────────────┐ │
│ │                           │ │
│ │   👤 Activando cámara... │ │ (320px)
│ │   Por favor, permite el   │ │
│ │   acceso a tu cámara      │ │
│ │                           │ │
│ │   [📷] [🎤] [🖥️]        │ │
│ └───────────────────────────┘ │
├───────────────────────────────┤
│         [▶ Iniciar] [Cerrar]  │
└───────────────────────────────┘
```

## Debugging en Consola

### Logs Esperados (Éxito)
```
Solicitando acceso a cámara y micrófono...
Stream obtenido: MediaStream {id: "...", active: true, ...}
Video asignado al elemento
```

### Logs Esperados (Error)
```
Solicitando acceso a cámara y micrófono...
Error accessing camera: NotAllowedError: Permission denied
```

## Solución de Problemas

### Problema: "Permiso denegado"
**Solución:**
1. Click en el icono de candado/cámara en la barra de direcciones
2. Permitir acceso a cámara y micrófono
3. Recargar la página
4. Abrir el modal nuevamente

### Problema: "No se encontró cámara"
**Solución:**
1. Verificar que la cámara esté conectada
2. Verificar que no esté tapada o deshabilitada
3. Revisar configuración del sistema
4. Probar con otra aplicación (ej: Zoom)

### Problema: "Cámara en uso"
**Solución:**
1. Cerrar otras aplicaciones que usen la cámara
2. Cerrar otras pestañas del navegador con video
3. Reiniciar el navegador si es necesario

### Problema: Video negro pero sin error
**Solución:**
1. Verificar que `autoPlay` esté habilitado
2. Verificar que el video tenga `srcObject` asignado
3. Revisar la consola del navegador
4. Probar en modo incógnito

## Testing Recomendado

1. ✅ Abrir modal y verificar solicitud de permisos
2. ✅ Permitir acceso y verificar que se ve la cámara
3. ✅ Denegar acceso y verificar mensaje de error
4. ✅ Verificar efecto espejo (usuario se ve como en espejo)
5. ✅ Probar botones de cámara, micrófono, pantalla
6. ✅ Verificar que el video tiene buen tamaño (320px min)
7. ✅ Probar en diferentes navegadores (Chrome, Firefox, Safari)
8. ✅ Probar en mobile y desktop

## Compatibilidad de Navegadores

### ✅ Soportado
- Chrome 53+
- Firefox 36+
- Safari 11+
- Edge 79+
- Opera 40+

### ⚠️ Limitaciones
- Safari iOS requiere HTTPS
- Algunos navegadores móviles pueden tener restricciones
- Firefox puede pedir permisos cada vez

## Archivos Modificados

- `components/streaming/streaming-modal.tsx` - Modal de configuración de stream

## Próximos Pasos Sugeridos

1. ⏳ Agregar selector de dispositivos (múltiples cámaras)
2. ⏳ Implementar filtros y efectos de video
3. ⏳ Agregar ajustes de calidad de video
4. ⏳ Implementar grabación local
5. ⏳ Agregar contador de tiempo antes de iniciar
6. ⏳ Implementar vista previa de pantalla compartida
7. ⏳ Agregar indicador de nivel de audio

## Notas Técnicas

- El efecto espejo (`scaleX(-1)`) es solo visual, el stream real no se invierte
- Los permisos se solicitan automáticamente al abrir el modal
- El stream se detiene automáticamente al cerrar el modal
- Los logs de consola ayudan a debuggear problemas de permisos
- El mensaje de carga desaparece cuando `streamRef.current` tiene valor

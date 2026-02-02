# 🔊 Instrucciones para Agregar Sonidos

## 📁 Ubicación
```
public/sounds/
```

---

## 🎵 Archivos Necesarios

### 1. sonidomensaje.mp3
- **Cuándo suena:** Cuando el usuario RECIBE un mensaje en el chat
- **Tipo:** Sonido distintivo (ding, notification, bell)
- **Duración:** 0.3 - 0.5 segundos
- **Volumen:** Moderado a alto
- **Ejemplo:** Sonido de mensaje de WhatsApp/Messenger

### 2. sonidoNotificacion.mp3
- **Cuándo suena:** Cuando el usuario RECIBE una notificación nueva (likes, comentarios, menciones)
- **Tipo:** Sonido sutil (pop, bell, chime)
- **Duración:** 0.3 - 0.5 segundos
- **Volumen:** Moderado
- **Ejemplo:** Sonido de notificación de redes sociales

---

## 📂 Estructura Final

```
public/sounds/
├── sonidomensaje.mp3           ← Agregar este archivo
├── sonidoNotificacion.mp3      ← Agregar este archivo
├── INSTRUCCIONES_SONIDOS.md
└── README.md
```

---

## ✅ Cómo Agregar los Archivos

### Paso 1: Conseguir los Sonidos

**Sitios Gratuitos:**
1. **Freesound.org** - https://freesound.org/
   - Busca: "message notification", "notification bell"
   
2. **Zapsplat** - https://www.zapsplat.com/
   - Categoría: UI Sounds > Notifications
   
3. **Mixkit** - https://mixkit.co/free-sound-effects/
   - Categoría: Notification Sounds
   
4. **Notification Sounds** - https://notificationsounds.com/
   - Categoría: Message Tones

### Paso 2: Preparar los Archivos

1. Descarga los archivos MP3
2. Renómbralos exactamente:
   - `sonidomensaje.mp3`
   - `sonidoNotificacion.mp3`

### Paso 3: Copiar a la Carpeta

1. Copia los archivos
2. Pega en: `public/sounds/`
3. Elimina los archivos PLACEHOLDER si existen

---

## 🎯 Características Técnicas

### Formato de Audio
- **Formato:** MP3
- **Bitrate:** 128 kbps o superior
- **Sample Rate:** 44.1 kHz
- **Canales:** Mono o Estéreo
- **Tamaño:** < 100 KB por archivo
- **Duración:** 0.3 - 0.5 segundos

---

## 🧪 Cómo Probar

### 1. Probar Sonido de Mensaje
1. Inicia la app: `npm run dev`
2. Ve a: http://localhost:4000/messages
3. Abre un chat con otro usuario
4. Pide que te envíen un mensaje
5. Deberías escuchar: `sonidomensaje.mp3`

### 2. Probar Sonido de Notificación
1. Ve a: http://localhost:4000/notifications
2. Espera una nueva notificación (like, comentario, etc.)
3. Deberías escuchar: `sonidoNotificacion.mp3`

---

## 🔧 Conversión de Formatos

Si tienes archivos en otro formato (WAV, OGG, etc.):

### Online:
- https://online-audio-converter.com/
- https://cloudconvert.com/

### Software:
- **Audacity** (gratis) - https://www.audacityteam.org/
- **VLC Media Player** (gratis)

### Comando FFmpeg:
```bash
ffmpeg -i input.wav -b:a 128k -ar 44100 output.mp3
```

---

## 🎨 Recomendaciones de Sonidos

### Para sonidomensaje.mp3 (Mensaje Recibido):
- **Características:**
  - Más distintivo y llamativo
  - Tono medio
  - Sensación: "Tienes un mensaje nuevo"
  
- **Ejemplos:**
  - Sonido de mensaje de WhatsApp
  - Sonido de mensaje de Messenger
  - "Ding" clásico
  - "Pop" con eco

### Para sonidoNotificacion.mp3 (Notificación):
- **Características:**
  - Más sutil y discreto
  - Tono medio-alto
  - Sensación: "Algo pasó, pero no urgente"
  
- **Ejemplos:**
  - Sonido de like de Instagram
  - Sonido de notificación de Twitter
  - "Bell" suave
  - "Chime" corto

---

## ⚠️ Importante

### Nombres Exactos:
✅ **CORRECTO:**
- `sonidomensaje.mp3`
- `sonidoNotificacion.mp3`

❌ **INCORRECTO:**
- `sonido_mensaje.mp3` (guión bajo)
- `SonidoMensaje.mp3` (mayúsculas)
- `sonidomensaje.MP3` (extensión en mayúsculas)
- `mensaje.mp3` (nombre incompleto)
- `sonidomensaje.wav` (formato incorrecto)

### Formato:
- ✅ MP3
- ❌ WAV, OGG, M4A, FLAC

### Tamaño:
- ✅ < 100 KB
- ⚠️ Si es más grande, comprímelo o recorta la duración

---

## 🐛 Solución de Problemas

### Los sonidos no se reproducen

**1. Verificar que los archivos existen:**
```
public/sounds/sonidomensaje.mp3
public/sounds/sonidoNotificacion.mp3
```

**2. Verificar los nombres:**
- Deben ser exactamente como se indica
- Respetar mayúsculas/minúsculas
- No usar espacios ni caracteres especiales

**3. Verificar el formato:**
- Debe ser MP3
- No WAV, OGG, u otro formato

**4. Verificar permisos del navegador:**
- Algunos navegadores bloquean sonidos automáticos
- Interactúa con la página primero (click en cualquier lugar)

**5. Verificar la consola del navegador:**
- Presiona F12
- Ve a la pestaña "Console"
- Busca errores relacionados con audio

**6. Limpiar caché:**
- Presiona Ctrl+Shift+R para recargar sin caché
- O cierra y abre el navegador

---

## 📝 Notas Adicionales

### Volumen:
- Si los sonidos son muy fuertes o suaves, edítalos con Audacity
- Efecto > Amplificar > Ajusta el nivel

### Duración:
- Mantén los sonidos cortos (0.3 - 0.5 segundos)
- Sonidos largos pueden ser molestos

### Calidad:
- 128 kbps es suficiente para notificaciones
- No necesitas 320 kbps (solo aumenta el tamaño)

---

## 🎉 ¡Listo!

Una vez agregues los archivos:
1. `sonidomensaje.mp3` → Sonará al recibir mensajes
2. `sonidoNotificacion.mp3` → Sonará al recibir notificaciones

**¡Disfruta de tu chat con sonidos!** 🔊

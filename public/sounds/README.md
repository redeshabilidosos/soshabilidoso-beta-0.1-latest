# 🔊 Sonidos de Notificación

## Archivos de Sonido

Coloca aquí los archivos de sonido en formato MP3:

### Sonidos Requeridos:
1. **message-sent.mp3** - Sonido cuando ENVÍAS un mensaje
2. **message-received.mp3** - Sonido cuando RECIBES un mensaje

### Especificaciones:
- **Formato:** MP3
- **Duración:** ~0.4 segundos
- **Bitrate:** 128 kbps (suficiente para notificaciones)
- **Sample Rate:** 44.1 kHz
- **Tamaño aproximado:** 5-10 KB por archivo

---

## 🎵 Dónde Conseguir Sonidos

### Opciones Gratuitas:
1. **Freesound.org** - https://freesound.org/
2. **Zapsplat** - https://www.zapsplat.com/
3. **Notification Sounds** - https://notificationsounds.com/
4. **Mixkit** - https://mixkit.co/free-sound-effects/notification/

### Buscar por:
- "notification sound"
- "message pop"
- "chat notification"
- "ding sound"
- "pop sound"

---

## 🛠️ Cómo Convertir a MP3

Si tienes sonidos en otro formato, usa:

### Online:
- **CloudConvert** - https://cloudconvert.com/
- **Online Audio Converter** - https://online-audio-converter.com/

### Software:
- **Audacity** (gratis) - https://www.audacityteam.org/
- **FFmpeg** (línea de comandos)

### Comando FFmpeg:
```bash
ffmpeg -i input.wav -b:a 128k -ar 44100 -t 0.4 output.mp3
```

---

## 📝 Notas

- Los archivos deben estar en `public/sounds/`
- Los nombres deben ser exactamente: `message-sent.mp3` y `message-received.mp3`
- Mantén los archivos pequeños (< 100 KB cada uno)
- Prueba el volumen antes de usar (no muy alto)

---

## ✅ Estructura Final

```
public/sounds/
├── AGREGAR_SONIDOS_AQUI.md (instrucciones detalladas)
├── message-sent.mp3        ← Agregar este archivo
├── message-received.mp3    ← Agregar este archivo
└── README.md (este archivo)
```

---

**Ver `AGREGAR_SONIDOS_AQUI.md` para instrucciones más detalladas.**

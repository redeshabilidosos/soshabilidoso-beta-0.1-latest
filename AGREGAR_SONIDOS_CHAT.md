# 🔊 Agregar Sonidos al Chat

## 📁 Ubicación

Agrega tus archivos MP3 en:
```
public/sounds/
```

---

## 🎵 Archivos Necesarios

### 1. message-sent.mp3
- **Cuándo suena:** Cuando TÚ envías un mensaje
- **Tipo:** Sonido sutil (whoosh, pop, swoosh)
- **Duración:** 0.3 - 0.5 segundos

### 2. message-received.mp3
- **Cuándo suena:** Cuando RECIBES un mensaje
- **Tipo:** Sonido distintivo (ding, notification, bell)
- **Duración:** 0.3 - 0.5 segundos

---

## 📂 Estructura Final

```
public/sounds/
├── message-sent.mp3        ← Agregar este archivo
├── message-received.mp3    ← Agregar este archivo
├── AGREGAR_SONIDOS_AQUI.md (instrucciones detalladas)
├── INSTRUCCIONES.txt
└── README.md
```

---

## 🌐 Dónde Conseguir Sonidos Gratis

1. **Freesound.org** - https://freesound.org/
2. **Zapsplat** - https://www.zapsplat.com/
3. **Mixkit** - https://mixkit.co/free-sound-effects/
4. **Notification Sounds** - https://notificationsounds.com/

Busca: "message sent", "notification", "pop", "ding"

---

## ✅ Cómo Agregar

1. Descarga o prepara tus archivos MP3
2. Renómbralos exactamente:
   - `message-sent.mp3`
   - `message-received.mp3`
3. Copia los archivos
4. Pega en: `public/sounds/`

---

## 🧪 Cómo Probar

1. Inicia la app:
   ```bash
   npm run dev
   ```

2. Ve a:
   ```
   http://localhost:4000/messages
   ```

3. Envía un mensaje → Escucharás `message-sent.mp3`
4. Recibe un mensaje → Escucharás `message-received.mp3`

---

## ⚠️ Importante

- **Nombres exactos:** `message-sent.mp3` y `message-received.mp3`
- **Todo en minúsculas**
- **Usar guión (-) no guión bajo (_)**
- **Formato MP3** (no WAV, OGG, etc.)
- **Tamaño:** < 100 KB cada uno

---

## 📝 Instrucciones Detalladas

Ver: `public/sounds/AGREGAR_SONIDOS_AQUI.md`

---

**¡Una vez agregues los archivos, los sonidos funcionarán automáticamente!** 🎉

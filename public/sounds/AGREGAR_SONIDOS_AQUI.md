# 🔊 Sonidos del Chat - Instrucciones

## 📁 Ubicación de los Archivos

Agrega tus archivos de sonido MP3 en esta carpeta:
```
public/sounds/
```

---

## 🎵 Archivos Necesarios

### 1. Sonido de Mensaje Enviado
**Nombre del archivo:** `message-sent.mp3`
**Ruta completa:** `public/sounds/message-sent.mp3`
**Cuándo suena:** Cuando TÚ envías un mensaje

**Características recomendadas:**
- Duración: 0.3 - 0.5 segundos
- Volumen: Moderado
- Tipo: Sonido sutil, como "whoosh" o "pop"
- Ejemplos: Sonido de envío de WhatsApp, Messenger

### 2. Sonido de Mensaje Recibido
**Nombre del archivo:** `message-received.mp3`
**Ruta completa:** `public/sounds/message-received.mp3`
**Cuándo suena:** Cuando RECIBES un mensaje de otro usuario

**Características recomendadas:**
- Duración: 0.3 - 0.5 segundos
- Volumen: Moderado a alto (para notificar)
- Tipo: Sonido distintivo, como "ding" o "notification"
- Ejemplos: Sonido de notificación de WhatsApp, Messenger

---

## 📂 Estructura Final

Después de agregar los archivos, la carpeta debe verse así:

```
public/sounds/
├── AGREGAR_SONIDOS_AQUI.md (este archivo)
├── message-sent.mp3        ← Agregar este archivo
├── message-received.mp3    ← Agregar este archivo
└── README.md
```

---

## 🎯 Cómo Agregar los Archivos

### Opción 1: Copiar y Pegar (Recomendado)
1. Descarga o prepara tus archivos MP3
2. Renómbralos exactamente como se indica:
   - `message-sent.mp3`
   - `message-received.mp3`
3. Copia los archivos
4. Pega en esta carpeta: `public/sounds/`

### Opción 2: Arrastrar y Soltar
1. Abre esta carpeta en el explorador de archivos
2. Arrastra tus archivos MP3 aquí
3. Renómbralos según lo indicado arriba

---

## 🔍 Verificar que Funcionan

### 1. Verificar que los archivos existen
Abre esta carpeta y verifica que tienes:
- ✅ `message-sent.mp3`
- ✅ `message-received.mp3`

### 2. Probar en el navegador
1. Inicia la aplicación: `npm run dev`
2. Ve a http://localhost:4000/messages
3. Envía un mensaje → Deberías escuchar `message-sent.mp3`
4. Recibe un mensaje → Deberías escuchar `message-received.mp3`

### 3. Verificar en la consola del navegador
Si no suenan, abre la consola (F12) y busca errores como:
```
Failed to load resource: net::ERR_FILE_NOT_FOUND
/sounds/message-sent.mp3
```

---

## 🎨 Dónde Conseguir Sonidos

### Sitios Gratuitos:
1. **Freesound.org** - https://freesound.org/
   - Busca: "message sent", "notification", "pop", "ding"
   - Licencia: Creative Commons

2. **Zapsplat.com** - https://www.zapsplat.com/
   - Categoría: UI Sounds > Notifications
   - Licencia: Gratis con atribución

3. **Mixkit.co** - https://mixkit.co/free-sound-effects/
   - Categoría: Notification Sounds
   - Licencia: Gratis sin atribución

4. **Notification Sounds** - https://notificationsounds.com/
   - Categoría: Message Tones
   - Licencia: Gratis

### Crear tus Propios Sonidos:
- **Audacity** (gratis) - https://www.audacityteam.org/
- **GarageBand** (Mac)
- **FL Studio** (Windows)

---

## 🔧 Configuración Técnica

### Formato de Audio
- **Formato:** MP3
- **Bitrate:** 128 kbps o superior
- **Sample Rate:** 44.1 kHz
- **Canales:** Mono o Estéreo
- **Tamaño:** < 100 KB por archivo

### Conversión de Formatos
Si tienes archivos en otro formato (WAV, OGG, etc.), puedes convertirlos:

**Online:**
- https://online-audio-converter.com/
- https://cloudconvert.com/

**Software:**
- Audacity (gratis)
- VLC Media Player (gratis)

---

## 🎛️ Ajustar Volumen

Si los sonidos son muy fuertes o muy suaves:

### Opción 1: Editar el archivo MP3
1. Abre el archivo en Audacity
2. Selecciona todo (Ctrl+A)
3. Efecto > Amplificar
4. Ajusta el nivel
5. Exporta como MP3

### Opción 2: Ajustar en el código (próximamente)
El volumen se puede ajustar en el código del hook de WebSocket.

---

## 📝 Nombres de Archivo Exactos

**IMPORTANTE:** Los nombres deben ser exactamente como se indica:

✅ **CORRECTO:**
- `message-sent.mp3`
- `message-received.mp3`

❌ **INCORRECTO:**
- `message_sent.mp3` (guión bajo en lugar de guión)
- `Message-Sent.mp3` (mayúsculas)
- `message-sent.MP3` (extensión en mayúsculas)
- `sent.mp3` (nombre incompleto)
- `message-sent.wav` (formato incorrecto)

---

## 🐛 Solución de Problemas

### Los sonidos no se reproducen

**1. Verificar que los archivos existen:**
```
public/sounds/message-sent.mp3
public/sounds/message-received.mp3
```

**2. Verificar los nombres:**
- Deben ser exactamente como se indica
- Todo en minúsculas
- Usar guión (-) no guión bajo (_)

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

---

## 🎉 Ejemplo de Sonidos Recomendados

### Para Message Sent (Envío):
- Sonido sutil y rápido
- Tono: Medio-alto
- Sensación: Confirmación, éxito
- Ejemplo: "Pop", "Swoosh", "Click suave"

### Para Message Received (Recibido):
- Sonido más distintivo
- Tono: Medio
- Sensación: Notificación, atención
- Ejemplo: "Ding", "Bell", "Notification tone"

---

## 📞 Ayuda

Si tienes problemas:
1. Verifica que los archivos estén en `public/sounds/`
2. Verifica que los nombres sean exactos
3. Verifica que sean archivos MP3
4. Reinicia el servidor de desarrollo
5. Limpia la caché del navegador (Ctrl+Shift+R)

---

**¡Listo! Una vez agregues los archivos, los sonidos funcionarán automáticamente en el chat.** 🎵

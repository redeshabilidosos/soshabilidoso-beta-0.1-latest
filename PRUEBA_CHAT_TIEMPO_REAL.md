# 🧪 GUÍA DE PRUEBA: CHAT EN TIEMPO REAL

## 📋 Requisitos Previos

- ✅ Daphne instalado (`pip install daphne`)
- ✅ Base de datos MySQL corriendo
- ✅ Frontend Next.js configurado
- ✅ Al menos 2 usuarios registrados

---

## 🚀 Paso 1: Iniciar el Backend con Daphne

### Opción A: Script Automático (Recomendado)

```bash
.\iniciar-daphne.bat
```

Este script:
1. Verifica la configuración WebSocket
2. Inicia Daphne en puerto 8000
3. Muestra las URLs de WebSocket

### Opción B: Manual

```bash
cd backend
daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
```

### ✅ Verificar que Daphne está corriendo

Deberías ver algo como:

```
2026-02-06 10:00:00 [INFO] Starting server at tcp:port=8000:interface=0.0.0.0
2026-02-06 10:00:00 [INFO] HTTP/2 support enabled
2026-02-06 10:00:00 [INFO] Configuring endpoint tcp:port=8000:interface=0.0.0.0
2026-02-06 10:00:00 [INFO] Listening on TCP address 0.0.0.0:8000
```

---

## 🚀 Paso 2: Iniciar el Frontend

En otra terminal:

```bash
npm run dev
```

O si usas el script completo:

```bash
node scripts/start-soshabilidoso.js
```

---

## 🧪 Paso 3: Prueba de Chat en Tiempo Real

### 3.1 Preparación

1. Abre **dos navegadores diferentes** (o dos ventanas de incógnito)
   - Navegador A: Chrome
   - Navegador B: Firefox/Edge

2. En ambos navegadores, ve a: `http://localhost:3000`

### 3.2 Iniciar Sesión

**Navegador A:**
- Usuario: `usuario1` / Contraseña: `password123`

**Navegador B:**
- Usuario: `usuario2` / Contraseña: `password123`

### 3.3 Crear/Abrir Chat

**En Navegador A:**
1. Haz clic en el botón flotante de mensajes (💬)
2. Busca a `usuario2`
3. Inicia una conversación

**En Navegador B:**
1. Haz clic en el botón flotante de mensajes (💬)
2. Deberías ver el chat con `usuario1`
3. Ábrelo

### 3.4 Pruebas de Tiempo Real

#### ✅ Test 1: Mensaje Instantáneo

**Navegador A:**
- Escribe: "Hola, ¿cómo estás?"
- Presiona Enter

**Navegador B:**
- ✅ El mensaje debe aparecer **instantáneamente** (< 1 segundo)
- ✅ Debe sonar `sonidomensage.mp3`
- ✅ El scroll debe bajar automáticamente

**Navegador A:**
- ✅ Debe sonar `tapm.mp3` al enviar
- ✅ El mensaje debe aparecer con checkmark (✓✓)

#### ✅ Test 2: Indicador "Está Escribiendo"

**Navegador A:**
- Empieza a escribir un mensaje (no lo envíes)

**Navegador B:**
- ✅ Debe aparecer "usuario1 está escribiendo..." debajo de los mensajes
- ✅ Debe desaparecer después de 3 segundos sin escribir

#### ✅ Test 3: Estado de Conexión

**Navegador A:**
- Verifica el header del chat
- ✅ Debe mostrar "● Conectado" en verde

**Navegador B:**
- Cierra la pestaña o desconecta internet
- Espera 5 segundos

**Navegador A:**
- ✅ El indicador "● Conectado" debe desaparecer

#### ✅ Test 4: Mensajes Leídos

**Navegador A:**
- Envía un mensaje

**Navegador B:**
- Abre el chat (si no lo tenías abierto)

**Navegador A:**
- ✅ El checkmark debe cambiar de gris (✓✓) a azul (✓✓)
- Esto indica que el mensaje fue leído

#### ✅ Test 5: Múltiples Mensajes Rápidos

**Navegador A:**
- Envía 5 mensajes seguidos rápidamente:
  1. "Mensaje 1"
  2. "Mensaje 2"
  3. "Mensaje 3"
  4. "Mensaje 4"
  5. "Mensaje 5"

**Navegador B:**
- ✅ Todos los mensajes deben aparecer en orden
- ✅ No debe haber duplicados
- ✅ El sonido debe reproducirse solo una vez por mensaje

#### ✅ Test 6: Reconexión Automática

**Navegador A:**
1. Abre DevTools (F12)
2. Ve a Network → WS
3. Encuentra la conexión WebSocket
4. Haz clic derecho → Close connection

**Resultado esperado:**
- ✅ El indicador "● Conectado" desaparece
- ✅ Después de 1-2 segundos, se reconecta automáticamente
- ✅ El indicador "● Conectado" vuelve a aparecer

#### ✅ Test 7: Polling de Respaldo

**Navegador A:**
1. Detén el servidor Daphne (Ctrl+C)
2. Espera 5 segundos
3. Reinicia Daphne

**Navegador B:**
- Envía un mensaje mientras Daphne está detenido

**Resultado esperado:**
- ✅ El mensaje se guarda en la base de datos
- ✅ Cuando Daphne se reinicia, el mensaje aparece en Navegador A
- ✅ El polling de respaldo (cada 3 segundos) carga el mensaje

---

## 🔍 Verificación en DevTools

### Chrome DevTools

1. Presiona F12
2. Ve a la pestaña **Network**
3. Filtra por **WS** (WebSocket)
4. Deberías ver:
   - Conexión a `ws://127.0.0.1:8000/ws/chat/...`
   - Estado: **101 Switching Protocols**
   - Frames: Mensajes JSON entrantes y salientes

### Inspeccionar Mensajes WebSocket

En la pestaña **WS**, haz clic en la conexión y ve a **Messages**:

**Mensajes enviados (↑):**
```json
{
  "type": "chat_message",
  "content": "Hola, ¿cómo estás?"
}
```

**Mensajes recibidos (↓):**
```json
{
  "type": "chat_message",
  "message": {
    "id": "...",
    "content": "Hola, ¿cómo estás?",
    "sender": {...},
    "created_at": "..."
  }
}
```

---

## 🐛 Troubleshooting

### Problema: WebSocket no conecta

**Síntomas:**
- No aparece "● Conectado"
- Mensajes no llegan en tiempo real
- Error en consola: `WebSocket connection failed`

**Solución:**
1. Verifica que Daphne esté corriendo (no `runserver`)
2. Revisa la consola del navegador (F12)
3. Verifica que el token JWT sea válido
4. Confirma que el puerto 8000 no esté bloqueado

### Problema: Mensajes duplicados

**Síntomas:**
- El mismo mensaje aparece 2 o más veces

**Solución:**
1. Verifica que el polling esté deshabilitado cuando WebSocket está conectado
2. Revisa la lógica de prevención de duplicados en `onNewMessage`
3. Confirma que no haya múltiples instancias del hook

### Problema: Sonidos no reproducen

**Síntomas:**
- No se escucha nada al enviar/recibir mensajes

**Solución:**
1. Verifica que los archivos existan:
   - `public/sounds/tapm.mp3`
   - `public/sounds/sonidomensage.mp3`
2. Revisa permisos de audio del navegador
3. Confirma que `notificationsEnabled` esté en `true`
4. Verifica volumen del sistema

### Problema: "Está escribiendo" no aparece

**Síntomas:**
- No se muestra el indicador cuando el otro usuario escribe

**Solución:**
1. Verifica que WebSocket esté conectado
2. Revisa que `sendTypingStart()` se llame al escribir
3. Confirma que `sendTypingStop()` se llame después de 3 segundos
4. Verifica que el `TypingIndicator` esté renderizado

---

## 📊 Métricas Esperadas

### Latencia
- **Mensaje enviado → recibido:** < 100ms (red local)
- **Indicador "escribiendo":** < 50ms
- **Reconexión automática:** 1-2 segundos

### Sonidos
- **Volumen envío:** 60%
- **Volumen recepción:** 50%
- **Duración:** < 1 segundo

### Polling de Respaldo
- **Intervalo:** 3 segundos
- **Solo activo cuando:** WebSocket desconectado

---

## ✅ Checklist de Verificación

Marca cada item después de probarlo:

- [ ] Backend con Daphne iniciado correctamente
- [ ] Frontend Next.js corriendo
- [ ] Dos usuarios pueden iniciar sesión
- [ ] WebSocket conecta automáticamente
- [ ] Mensajes llegan en tiempo real (< 1 segundo)
- [ ] Sonido al enviar mensaje (`tapm.mp3`)
- [ ] Sonido al recibir mensaje (`sonidomensage.mp3`)
- [ ] Indicador "está escribiendo" funciona
- [ ] Estado "● Conectado" se muestra
- [ ] Mensajes leídos cambian checkmark a azul
- [ ] No hay mensajes duplicados
- [ ] Reconexión automática funciona
- [ ] Polling de respaldo funciona cuando WebSocket falla
- [ ] Scroll automático a nuevos mensajes

---

## 🎯 Resultado Esperado

Si todos los tests pasan:

✅ **CHAT EN TIEMPO REAL COMPLETAMENTE FUNCIONAL**

- Mensajes instantáneos sin recargar
- Notificaciones sonoras diferenciadas
- Indicadores de estado en tiempo real
- Reconexión automática robusta
- Polling de respaldo confiable

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de Daphne en la terminal
2. Revisa la consola del navegador (F12)
3. Ejecuta el script de verificación:
   ```bash
   python backend/verificar_websocket_completo.py
   ```
4. Consulta `VERIFICACION_WEBSOCKET_TIEMPO_REAL.md`

---

**Última actualización:** 6 de Febrero de 2026  
**Versión:** 1.0.0

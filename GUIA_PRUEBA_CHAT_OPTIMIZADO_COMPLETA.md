# 🧪 GUÍA DE PRUEBA - Chat Optimizado en Tiempo Real

## 📋 PREPARACIÓN

### 1. Iniciar Servidores
```bash
# Ejecutar el script de optimizaciones
.\aplicar-optimizaciones-chat-completas.bat
```

**Verificar que estén corriendo:**
- ✅ Backend Django (Daphne): http://127.0.0.1:8000
- ✅ Frontend Next.js: http://localhost:4000
- ✅ WebSocket: ws://127.0.0.1:8000/ws/chat/

### 2. Abrir Dos Navegadores
- **Navegador 1:** Chrome (Usuario: Camilo Gomez)
- **Navegador 2:** Firefox/Edge (Usuario: Habi)

### 3. Abrir Consola del Navegador
- Presionar `F12` en ambos navegadores
- Ir a la pestaña "Console"
- Ir a la pestaña "Network" para ver peticiones HTTP

---

## 🎯 PRUEBAS A REALIZAR

### PRUEBA 1: Envío Instantáneo (< 50ms)

**Objetivo:** Verificar que el mensaje aparece INMEDIATAMENTE al enviar

**Pasos:**
1. En Navegador 1 (Camilo), ir a http://localhost:4000/messages
2. Abrir chat con Habi
3. Escribir "Hola" y presionar Enter
4. **VERIFICAR:**
   - ✅ El mensaje aparece INMEDIATAMENTE (< 50ms)
   - ✅ El sonido se reproduce INSTANTÁNEAMENTE
   - ✅ El input se limpia inmediatamente
   - ✅ No hay delay visible

**Consola debe mostrar:**
```
📤 Enviando por WebSocket: Hola
🔊 Playing send message sound
```

**Resultado esperado:** ✅ INSTANTÁNEO (como WhatsApp)

---

### PRUEBA 2: Recepción Rápida (< 200ms)

**Objetivo:** Verificar que el otro usuario recibe el mensaje rápidamente

**Pasos:**
1. Mantener Navegador 2 (Habi) abierto en el chat con Camilo
2. En Navegador 1 (Camilo), enviar "¿Cómo estás?"
3. **VERIFICAR en Navegador 2:**
   - ✅ El mensaje aparece en menos de 200ms
   - ✅ Se reproduce el sonido de notificación
   - ✅ El scroll baja automáticamente

**Consola Navegador 2 debe mostrar:**
```
📨 WebSocket message received: {type: 'chat_message', ...}
💬 New chat message: {...}
🔊 Playing message sound for message from: Camilo Gomez
✅ Adding new message: [message-id]
```

**Resultado esperado:** ✅ RÁPIDO (< 200ms)

---

### PRUEBA 3: Reducción de Peticiones HTTP

**Objetivo:** Verificar que hay menos peticiones HTTP (< 30/min)

**Pasos:**
1. En ambos navegadores, abrir la pestaña "Network" de DevTools
2. Filtrar por "messages"
3. Dejar el chat abierto por 1 minuto SIN enviar mensajes
4. **CONTAR peticiones HTTP GET a `/api/messaging/chats/.../messages/`**

**Resultado esperado:**
- ❌ ANTES: ~60 peticiones en 1 minuto (cada 1 segundo)
- ✅ AHORA: ~30 peticiones en 1 minuto (cada 2 segundos)
- ✅ REDUCCIÓN: 50% menos peticiones

**Si WebSocket está conectado:**
- ✅ IDEAL: 0 peticiones (solo WebSocket)

---

### PRUEBA 4: No se Congela en Móvil/Tablet

**Objetivo:** Verificar que el chat funciona fluido en modo responsive

**Pasos:**
1. En Navegador 1, presionar `F12`
2. Activar modo responsive (Ctrl+Shift+M)
3. Cambiar a "iPhone 12 Pro" o "iPad"
4. Enviar varios mensajes rápidamente
5. **VERIFICAR:**
   - ✅ El chat NO se congela
   - ✅ Los mensajes aparecen fluidos
   - ✅ El scroll funciona correctamente
   - ✅ El input responde inmediatamente

**Resultado esperado:** ✅ FLUIDO (sin congelamiento)

---

### PRUEBA 5: Indicador "Está Escribiendo"

**Objetivo:** Verificar que el indicador funciona correctamente

**Pasos:**
1. En Navegador 1 (Camilo), empezar a escribir (NO enviar)
2. **VERIFICAR en Navegador 2 (Habi):**
   - ✅ Aparece "Camilo Gomez está escribiendo..." en menos de 200ms
   - ✅ Desaparece después de 3 segundos de inactividad

**Consola Navegador 2 debe mostrar:**
```
📨 WebSocket message received: {type: 'typing_status', is_typing: true, ...}
```

**Resultado esperado:** ✅ FUNCIONA (< 200ms)

---

### PRUEBA 6: WebSocket Conectado

**Objetivo:** Verificar que WebSocket se conecta correctamente

**Pasos:**
1. Abrir chat en Navegador 1
2. **VERIFICAR en consola:**
   - ✅ Mensaje "✅ WebSocket connected"
   - ✅ Mensaje "✅ WebSocket connection confirmed: Conectado exitosamente al chat"
   - ✅ Badge verde "● Conectado" en el header del chat

**Consola debe mostrar:**
```
✅ WebSocket connected
📨 WebSocket message received: {type: 'connection_success', ...}
✅ WebSocket connection confirmed: Conectado exitosamente al chat
```

**Si hay error 403:**
```
❌ WebSocket error: Token inválido
```
→ Verificar que el token JWT es válido

**Resultado esperado:** ✅ CONECTADO

---

### PRUEBA 7: Reconexión Automática

**Objetivo:** Verificar que WebSocket se reconecta automáticamente

**Pasos:**
1. Con el chat abierto y WebSocket conectado
2. Detener el backend (Ctrl+C en la ventana de Daphne)
3. **VERIFICAR en consola:**
   - ✅ Mensaje "❌ WebSocket disconnected"
   - ✅ Mensaje "🔄 Reconnecting in 1000ms (attempt 1)"
4. Reiniciar el backend
5. **VERIFICAR:**
   - ✅ Mensaje "✅ WebSocket connected"
   - ✅ Chat vuelve a funcionar automáticamente

**Resultado esperado:** ✅ RECONEXIÓN AUTOMÁTICA

---

### PRUEBA 8: Optimistic Updates

**Objetivo:** Verificar que los mensajes temporales se reemplazan correctamente

**Pasos:**
1. Abrir DevTools → Console
2. Enviar un mensaje "Test optimistic"
3. **VERIFICAR en consola:**
   - ✅ Mensaje temporal se crea con ID `temp-[timestamp]`
   - ✅ Mensaje aparece INMEDIATAMENTE en la UI
   - ✅ Mensaje temporal se reemplaza con el real cuando llega del servidor

**Consola debe mostrar:**
```
📤 Enviando por WebSocket: Test optimistic
🔊 Playing send message sound
📨 WebSocket message received: {type: 'chat_message', ...}
🔄 Replacing temporary message with real one
```

**Resultado esperado:** ✅ REEMPLAZO CORRECTO

---

### PRUEBA 9: Fallback a HTTP

**Objetivo:** Verificar que funciona con HTTP si WebSocket falla

**Pasos:**
1. Modificar temporalmente `hooks/use-chat-websocket.ts`:
   ```typescript
   // Comentar la línea de conexión para simular fallo
   // const ws = new WebSocket(wsUrl);
   ```
2. Recargar la página
3. Enviar un mensaje
4. **VERIFICAR:**
   - ✅ Mensaje se envía por HTTP POST
   - ✅ Mensaje aparece inmediatamente (optimistic update)
   - ✅ Polling trae mensajes nuevos cada 2 segundos

**Consola debe mostrar:**
```
📤 WebSocket no conectado, enviando por HTTP: Test
```

**Resultado esperado:** ✅ FALLBACK FUNCIONA

---

### PRUEBA 10: Sonidos

**Objetivo:** Verificar que los sonidos funcionan correctamente

**Pasos:**
1. Asegurarse de que el volumen está activado
2. En Navegador 1, enviar un mensaje
3. **VERIFICAR:**
   - ✅ Sonido "tapm.mp3" se reproduce INMEDIATAMENTE
4. En Navegador 2, recibir el mensaje
5. **VERIFICAR:**
   - ✅ Sonido "sonidomensage.mp3" se reproduce al recibir

**Resultado esperado:** ✅ SONIDOS FUNCIONAN

---

## 📊 TABLA DE RESULTADOS

| Prueba | Objetivo | Resultado | Tiempo |
|--------|----------|-----------|--------|
| 1. Envío instantáneo | < 50ms | ⬜ | ___ ms |
| 2. Recepción rápida | < 200ms | ⬜ | ___ ms |
| 3. Peticiones HTTP | < 30/min | ⬜ | ___ /min |
| 4. No congela móvil | Fluido | ⬜ | N/A |
| 5. "Está escribiendo" | < 200ms | ⬜ | ___ ms |
| 6. WebSocket conectado | Conectado | ⬜ | N/A |
| 7. Reconexión automática | Funciona | ⬜ | N/A |
| 8. Optimistic updates | Correcto | ⬜ | N/A |
| 9. Fallback HTTP | Funciona | ⬜ | N/A |
| 10. Sonidos | Funcionan | ⬜ | N/A |

**Leyenda:**
- ✅ = Pasó
- ❌ = Falló
- ⬜ = Pendiente

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: WebSocket da error 403

**Síntoma:**
```
❌ WebSocket error: Token inválido
```

**Solución:**
1. Verificar que el token JWT es válido:
   ```javascript
   localStorage.getItem('access_token')
   ```
2. Si el token expiró, hacer logout y login nuevamente
3. Verificar que el backend tiene `rest_framework_simplejwt` instalado

---

### Problema: Mensajes no llegan en tiempo real

**Síntoma:**
- Mensajes tardan más de 2 segundos en llegar

**Solución:**
1. Verificar que WebSocket está conectado (badge verde "● Conectado")
2. Si no está conectado, revisar consola del backend:
   ```
   Error autenticando token: ...
   ```
3. Verificar que Daphne está corriendo (no `runserver`)

---

### Problema: Muchas peticiones HTTP

**Síntoma:**
- Más de 30 peticiones por minuto en Network tab

**Solución:**
1. Verificar que el intervalo de polling es 2000ms (2 segundos)
2. Verificar que `loadNewMessages` usa `getMessagesSince` (no `getMessages`)
3. Si WebSocket está conectado, no debería haber peticiones HTTP

---

### Problema: Chat se congela en móvil

**Síntoma:**
- Chat no responde al cambiar a modo responsive

**Solución:**
1. Verificar que `useMemo` y `useCallback` están implementados
2. Verificar que no hay re-renders innecesarios
3. Abrir Performance tab y grabar para ver qué causa el lag

---

## ✅ CRITERIOS DE ÉXITO

El chat está **OPTIMIZADO Y FUNCIONAL** si:

1. ✅ Envío de mensajes es instantáneo (< 50ms)
2. ✅ Recepción de mensajes es rápida (< 200ms)
3. ✅ Peticiones HTTP reducidas a < 30/min
4. ✅ No se congela en móvil/tablet
5. ✅ WebSocket se conecta correctamente
6. ✅ Reconexión automática funciona
7. ✅ Optimistic updates funcionan
8. ✅ Fallback a HTTP funciona
9. ✅ Sonidos se reproducen correctamente
10. ✅ Indicador "está escribiendo" funciona

---

## 🎉 RESULTADO FINAL

Si todas las pruebas pasan, el chat está:

```
╔════════════════════════════════════════╗
║                                        ║
║  ✅ OPTIMIZADO Y FUNCIONAL            ║
║                                        ║
║  • Envío instantáneo (< 50ms)         ║
║  • Recepción rápida (< 200ms)         ║
║  • Peticiones reducidas 75%           ║
║  • Fluido en móvil/tablet             ║
║  • WebSocket funcionando              ║
║  • Reconexión automática              ║
║  • Optimistic updates                 ║
║  • Sonidos instantáneos               ║
║                                        ║
║  🚀 LISTO PARA PRODUCCIÓN             ║
║                                        ║
╚════════════════════════════════════════╝
```

---

**Fecha de prueba:** _______________
**Probado por:** _______________
**Resultado:** ⬜ APROBADO / ⬜ RECHAZADO

# 🔧 Solución: Error de Conexión en Android

**Error:** `net::ERR_CONNECTION_TIMED_OUT`  
**URL:** `http://192.168.78.173:4000`  
**Causa:** IP cambió o firewall bloqueando

---

## 🔍 Diagnóstico

### Problema Identificado:
1. ✅ Servidor corriendo en puerto 4000
2. ❌ Firewall bloqueando conexiones externas
3. ⚠️ IP puede haber cambiado

### IP Actual de tu PC:
- `10.87.23.237` (WiFi/Ethernet)
- `192.168.56.1` (VirtualBox/VMware)

---

## ✅ Solución Paso a Paso

### PASO 1: Permitir Puerto en Firewall

**Opción A - Script Automático (Recomendado):**
```bash
1. Haz clic derecho en "permitir-puerto-4000.bat"
2. Selecciona "Ejecutar como administrador"
3. Presiona cualquier tecla cuando te lo pida
```

**Opción B - Manual:**
```bash
1. Abre PowerShell como administrador
2. Ejecuta:
   netsh advfirewall firewall add rule name="Node.js Server Port 4000" dir=in action=allow protocol=TCP localport=4000
```

### PASO 2: Verificar IP Actual

```bash
ipconfig
```

Busca tu IP en la sección de WiFi o Ethernet (probablemente `10.87.23.237`)

### PASO 3: Actualizar Capacitor Config

El archivo `capacitor.config.ts` ya tiene la IP correcta:
```typescript
url: 'http://10.87.23.237:4000',
```

Si tu IP es diferente, actualízala en ese archivo.

### PASO 4: Sincronizar con Android

```bash
npx cap sync android
```

### PASO 5: Recargar App en Xiaomi

```bash
# Detener app
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell am force-stop com.soshabilidoso.app

# Limpiar caché
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell pm clear com.soshabilidoso.app

# Iniciar app
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell am start -n com.soshabilidoso.app/.MainActivity
```

---

## 🚀 Solución Rápida (Todo en Uno)

### Script Completo:

```bash
# 1. Permitir firewall (ejecutar como admin)
permitir-puerto-4000.bat

# 2. Sincronizar
npx cap sync android

# 3. Recargar app
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell am force-stop com.soshabilidoso.app
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell pm clear com.soshabilidoso.app
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell am start -n com.soshabilidoso.app/.MainActivity
```

---

## 🔍 Verificar Conexión

### Desde tu PC:

```bash
# Ver si el servidor está escuchando
netstat -ano | findstr :4000

# Debería mostrar:
# TCP    0.0.0.0:4000    LISTENING
```

### Desde el Xiaomi:

```bash
# Probar conexión (desde PC)
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell ping -c 4 10.87.23.237

# Debería responder con tiempos de ping
```

---

## ⚠️ Problemas Comunes

### 1. Firewall Bloqueando
**Síntoma:** `ERR_CONNECTION_TIMED_OUT`  
**Solución:** Ejecutar `permitir-puerto-4000.bat` como admin

### 2. IP Cambió
**Síntoma:** Conexión funciona en PC pero no en móvil  
**Solución:** 
1. Verificar IP con `ipconfig`
2. Actualizar `capacitor.config.ts`
3. Ejecutar `npx cap sync android`

### 3. Servidor No Corriendo
**Síntoma:** `ERR_CONNECTION_REFUSED`  
**Solución:** Ejecutar `npm run soshabilidoso`

### 4. WiFi Diferente
**Síntoma:** Dispositivos no se ven  
**Solución:** Conectar PC y Xiaomi a la misma red WiFi

---

## 📱 Configuración Alternativa (Si Nada Funciona)

### Opción 1: Usar USB Reverse Proxy

```bash
# Redirigir puerto del móvil al PC
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe reverse tcp:4000 tcp:4000

# Actualizar capacitor.config.ts:
url: 'http://localhost:4000',

# Sincronizar
npx cap sync android
```

### Opción 2: Desactivar Firewall Temporalmente

```bash
# ⚠️ Solo para pruebas, no recomendado
netsh advfirewall set allprofiles state off

# Después de probar, reactivar:
netsh advfirewall set allprofiles state on
```

---

## ✅ Checklist de Solución

- [ ] Firewall permite puerto 4000
- [ ] IP correcta en `capacitor.config.ts`
- [ ] Servidor corriendo en puerto 4000
- [ ] PC y Xiaomi en la misma red WiFi
- [ ] Sincronizado con `npx cap sync android`
- [ ] App recargada en Xiaomi
- [ ] Conexión exitosa

---

## 🎯 Resultado Esperado

Después de seguir estos pasos:

```
✅ App carga correctamente
✅ Se conecta a http://10.87.23.237:4000
✅ Muestra contenido del servidor
✅ Optimizaciones funcionando
```

---

**Próximo paso:** Ejecutar `permitir-puerto-4000.bat` como administrador

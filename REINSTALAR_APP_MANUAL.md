# 📱 Reinstalar App Manualmente

**Problema:** La app no conecta después de varios intentos  
**Solución:** Reinstalación completa desde Android Studio

---

## 🎯 Método Más Simple (Recomendado)

### Opción 1: Usar Android Studio

1. **Abre Android Studio**

2. **Abre el proyecto Android:**
   - File → Open
   - Selecciona la carpeta: `android`

3. **Espera a que sincronice** (puede tardar 1-2 minutos)

4. **Conecta tu Xiaomi via USB**

5. **Ejecuta la app:**
   - Click en el botón ▶️ (Run)
   - O presiona `Shift + F10`

6. **Android Studio hará TODO automáticamente:**
   - Desinstalará la app anterior
   - Compilará con la configuración actual
   - Instalará la nueva versión
   - Iniciará la app

---

## 🔧 Opción 2: Compilar APK Manualmente

Si prefieres instalar el APK tú mismo:

### 1. Abre Android Studio

### 2. Abre el proyecto:
   - File → Open → Selecciona carpeta `android`

### 3. Compila el APK:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Espera a que compile (1-2 minutos)

### 4. Localiza el APK:
   - Android Studio te mostrará un mensaje: "APK(s) generated successfully"
   - Click en "locate" o busca en:
     ```
     android\app\build\outputs\apk\debug\app-debug.apk
     ```

### 5. Transfiere el APK a tu Xiaomi:
   - **Opción A:** Copia via USB
   - **Opción B:** Envía por WhatsApp/Telegram
   - **Opción C:** Sube a Google Drive y descarga en el móvil

### 6. En tu Xiaomi:
   - Desinstala la app "SOS Habilidoso" actual
   - Abre el archivo `app-debug.apk`
   - Permite "Instalar desde fuentes desconocidas" si te lo pide
   - Instala la app
   - Abre la app

---

## ⚙️ Configuración Actual

La app está configurada para conectarse a:
```
URL: http://10.87.23.237:4000
```

**Importante:** Tu PC y Xiaomi deben estar en la misma red WiFi.

---

## 🔍 Verificar Conexión

### Antes de instalar, verifica:

1. **Servidores corriendo:**
   ```bash
   soshabilidoso-mejorado.bat
   ```

2. **IP correcta:**
   ```bash
   ipconfig
   ```
   Busca tu IP de WiFi (debe ser `10.87.23.237`)

3. **Firewall permite puerto 4000:**
   - Ya lo configuraste antes, debería estar OK

4. **Xiaomi en la misma red WiFi:**
   - Verifica que ambos dispositivos estén en la misma red

---

## 🎯 Qué Debería Pasar

### Después de instalar:

1. **Abre la app en tu Xiaomi**

2. **Deberías ver:**
   - ✅ Splash screen negro (2 segundos)
   - ✅ Pantalla de login/feed
   - ✅ Partículas verdes animadas (30 partículas)
   - ✅ Contenido carga rápido

3. **Optimizaciones activas:**
   - Carga inicial: ~1.5-2s (antes 4-5s)
   - Navegación: ~0.5-0.8s (antes 1.5-2s)
   - Partículas: 30 (antes 150)
   - Dispositivo no se calienta

---

## ⚠️ Si Aún No Conecta

### Problema: "ERR_CONNECTION_TIMED_OUT"

**Posibles causas:**

1. **IP cambió:**
   - Ejecuta `ipconfig` en tu PC
   - Si la IP cambió, actualiza `capacitor.config.ts`:
     ```typescript
     url: 'http://[NUEVA_IP]:4000',
     ```
   - Ejecuta: `npx cap sync android`
   - Recompila en Android Studio

2. **Diferentes redes WiFi:**
   - Verifica que PC y Xiaomi estén en la MISMA red
   - Ambos deben ver la misma red WiFi

3. **Servidor no está corriendo:**
   - Ejecuta: `soshabilidoso-mejorado.bat`
   - Verifica que veas:
     ```
     ✓ Ready on http://localhost:4000
     Starting development server at http://0.0.0.0:8000/
     ```

4. **Firewall bloqueando:**
   - Ejecuta como admin:
     ```bash
     netsh advfirewall firewall add rule name="Node.js Server Port 4000" dir=in action=allow protocol=TCP localport=4000
     ```

---

## 💡 Alternativa: Modo USB

Si sigues teniendo problemas con WiFi, usa el modo USB:

### 1. Actualiza `capacitor.config.ts`:
```typescript
url: 'http://localhost:4000',
```

### 2. Sincroniza:
```bash
npx cap sync android
```

### 3. Recompila en Android Studio

### 4. Crea túnel USB:
```bash
adb reverse tcp:4000 tcp:4000
adb reverse tcp:8000 tcp:8000
```

### 5. Abre la app

**Ventaja:** Funciona con cualquier red WiFi, solo necesitas el cable USB.

---

## 📊 Resumen de Pasos

```
1. Abre Android Studio
2. Abre carpeta "android"
3. Conecta Xiaomi via USB
4. Click en ▶️ (Run)
5. Espera a que instale
6. Verifica que funcione
```

**¡Es así de simple con Android Studio!** 🚀

---

## ✅ Checklist

- [ ] Android Studio instalado
- [ ] Proyecto android abierto en Android Studio
- [ ] Xiaomi conectado via USB
- [ ] Depuración USB activada en Xiaomi
- [ ] Servidores corriendo (soshabilidoso-mejorado.bat)
- [ ] PC y Xiaomi en la misma red WiFi
- [ ] IP correcta en capacitor.config.ts
- [ ] App ejecutada desde Android Studio
- [ ] App funciona correctamente

---

**Usa Android Studio para reinstalar, es la forma más confiable!** 🎯


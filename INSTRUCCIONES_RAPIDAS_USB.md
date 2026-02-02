# 🚀 Instrucciones Rápidas - Modo USB

**Problema:** IP cambia con cada red WiFi  
**Solución:** Usar cable USB

---

## 📋 Pasos Simples

### 1️⃣ Conecta el USB
Conecta tu Xiaomi a la PC con el cable USB

### 2️⃣ Haz doble clic en el archivo
```
soshabilidoso-usb.bat
```

### 3️⃣ ¡Listo!
La app funcionará sin importar tu WiFi

---

## ⚠️ Si dice "adb no se reconoce"

**Significa:** No tienes Android SDK instalado

**Solución Rápida:**

### Opción A - Usar scrcpy (Ya lo tienes instalado)
```bash
# 1. Inicia los servidores
soshabilidoso-mejorado.bat

# 2. En otra ventana CMD, ejecuta:
cd android\platform-tools
adb reverse tcp:4000 tcp:4000
adb reverse tcp:8000 tcp:8000

# 3. Recarga la app manualmente en tu Xiaomi
```

### Opción B - Instalar Android SDK Platform Tools

1. **Descarga:** https://developer.android.com/tools/releases/platform-tools
2. **Extrae** el ZIP en `C:\platform-tools`
3. **Agrega al PATH:**
   - Busca "Variables de entorno" en Windows
   - Edita "Path"
   - Agrega: `C:\platform-tools`
4. **Reinicia CMD** y ejecuta `soshabilidoso-usb.bat`

---

## 🔧 Comandos Manuales

Si prefieres hacerlo paso a paso:

### 1. Inicia Backend:
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### 2. Inicia Frontend (nueva ventana CMD):
```bash
npm run dev
```

### 3. Crea túneles USB (nueva ventana CMD):
```bash
cd android\platform-tools
adb reverse tcp:4000 tcp:4000
adb reverse tcp:8000 tcp:8000
```

### 4. Recarga app en Xiaomi:
```bash
adb shell am force-stop com.soshabilidoso.app
adb shell pm clear com.soshabilidoso.app
adb shell am start -n com.soshabilidoso.app/.MainActivity
```

---

## 💡 Alternativa: Usar IP Actual

Si no quieres usar USB, puedes seguir usando WiFi:

### 1. Obtén tu IP actual:
```bash
ipconfig
```
Busca la IP de tu WiFi (ejemplo: `192.168.1.100`)

### 2. Actualiza `capacitor.config.ts`:
```typescript
url: 'http://192.168.1.100:4000',
```

### 3. Sincroniza:
```bash
npx cap sync android
```

### 4. Recarga la app en Xiaomi

**Nota:** Tendrás que repetir esto cada vez que cambies de red WiFi.

---

## ✅ Verificar que funciona

### Ver si adb está disponible:
```bash
cd android\platform-tools
adb devices
```

Deberías ver tu Xiaomi listado.

### Ver túneles activos:
```bash
adb reverse --list
```

Deberías ver:
```
tcp:4000 -> tcp:4000
tcp:8000 -> tcp:8000
```

---

## 🎯 Recomendación

**Para desarrollo diario:**

1. **Si tienes scrcpy instalado** (ya lo tienes):
   - Usa `dev-con-scrcpy.bat` que ya incluye todo
   - O sigue los pasos manuales arriba

2. **Si instalas Android SDK Platform Tools**:
   - Usa `soshabilidoso-usb.bat` para todo automático

3. **Si prefieres WiFi**:
   - Usa `soshabilidoso-mejorado.bat`
   - Actualiza IP cuando cambies de red

---

## 📱 Estado Actual

```
✅ Capacitor config: localhost:4000
✅ App sincronizada
✅ Scripts creados
⚠️  Necesitas: Crear túneles USB o actualizar IP
```

---

**Elige tu método y prueba la app!** 🚀


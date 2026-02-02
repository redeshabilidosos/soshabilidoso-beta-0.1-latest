# 🚀 Capacitor Quick Start - Inicio Rápido

**Objetivo:** Convertir SOS Habilidoso en app Android en 30 minutos

---

## ⚡ INSTALACIÓN RÁPIDA

### Opción 1: Script Automático (Recomendado)

```bash
# Ejecutar script de instalación
scripts\setup-capacitor.bat
```

### Opción 2: Manual

```bash
# 1. Instalar dependencias
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen @capacitor/camera @capacitor/geolocation @capacitor/share @capacitor/filesystem @capacitor/network @capacitor/device @capacitor/browser @capacitor/toast

# 2. Inicializar Capacitor
npx cap init "SOS Habilidoso" "com.soshabilidoso.app" --web-dir=out

# 3. Agregar Android
npx cap add android
```

---

## 📝 CONFIGURACIÓN MÍNIMA

### 1. Actualizar next.config.js

Agregar al final del archivo:

```javascript
const nextConfig = {
  // ... configuración existente
  
  // AGREGAR ESTAS LÍNEAS:
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

### 2. Actualizar package.json

Agregar estos scripts:

```json
{
  "scripts": {
    "build:mobile": "next build && npx cap sync",
    "android:dev": "npm run build:mobile && npx cap open android",
    "android:run": "npx cap run android"
  }
}
```

---

## 🏗️ BUILD Y EJECUCIÓN

### Primera vez

```bash
# 1. Build de Next.js
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Abrir Android Studio
npx cap open android
```

### En Android Studio

1. Esperar a que sincronice Gradle (primera vez tarda ~5 min)
2. Conectar dispositivo Android o iniciar emulador
3. Click en "Run" (▶️)

---

## 📱 TESTING RÁPIDO

### En Emulador

1. Abrir Android Studio
2. Tools > Device Manager
3. Create Device > Pixel 5 > Next > Download System Image (API 33)
4. Finish
5. Click en ▶️ para iniciar emulador
6. Run app

### En Dispositivo Real

1. Habilitar "Modo Desarrollador" en tu Android:
   - Configuración > Acerca del teléfono
   - Tocar "Número de compilación" 7 veces
2. Habilitar "Depuración USB"
3. Conectar con cable USB
4. Aceptar depuración en el teléfono
5. Run app desde Android Studio

---

## 🔧 COMANDOS ÚTILES

```bash
# Ver dispositivos conectados
adb devices

# Build y sincronizar
npm run build:mobile

# Abrir Android Studio
npx cap open android

# Ejecutar en dispositivo
npx cap run android

# Ver logs
npx cap run android -l

# Limpiar y rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### Error: "webDir not found"
```bash
npm run build
npx cap sync android
```

### Error: Gradle sync failed
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### App no carga
1. Verificar que el build de Next.js fue exitoso
2. Verificar que existe la carpeta `out/`
3. Ejecutar `npx cap sync android` nuevamente

### Cambios no se reflejan
```bash
npm run build
npx cap sync android
# Luego rebuild en Android Studio
```

---

## 📊 CHECKLIST RÁPIDO

- [ ] Instalar Capacitor y dependencias
- [ ] Configurar next.config.js
- [ ] Actualizar package.json
- [ ] Ejecutar `npm run build`
- [ ] Ejecutar `npx cap add android`
- [ ] Ejecutar `npx cap sync android`
- [ ] Abrir Android Studio
- [ ] Conectar dispositivo/emulador
- [ ] Run app
- [ ] ¡Funciona! 🎉

---

## 🎯 PRÓXIMOS PASOS

Una vez que la app funcione:

1. **Personalizar iconos y splash screen**
   - Ver: INTEGRACION_CAPACITOR_GUIA_COMPLETA.md (Fase 3)

2. **Configurar permisos**
   - Editar `android/app/src/main/AndroidManifest.xml`

3. **Integrar plugins nativos**
   - Usar hooks y utils ya creados en `lib/`

4. **Generar APK firmado**
   - Para distribución en Play Store

---

## 📚 DOCUMENTACIÓN COMPLETA

Para guía detallada paso a paso, ver:
- **INTEGRACION_CAPACITOR_GUIA_COMPLETA.md**

---

## 💡 TIPS

- Desarrolla en web (más rápido), prueba en móvil periódicamente
- Usa live reload configurando `server.url` en capacitor.config.ts
- Mantén Android Studio actualizado
- Usa emulador con Google Play para testing completo

---

**Tiempo estimado:** 30 minutos  
**Dificultad:** Media  
**Requisitos:** Node.js, Android Studio

¡Éxito! 🚀

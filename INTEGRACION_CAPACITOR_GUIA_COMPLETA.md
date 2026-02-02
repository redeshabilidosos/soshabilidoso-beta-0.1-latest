# Integración de Capacitor.js - Guía Completa

**Fecha:** 28 de Enero de 2026  
**Objetivo:** Convertir SOS Habilidoso en app nativa para Android e iOS  
**Prioridad:** Android primero, luego iOS

---

## 📱 ¿QUÉ ES CAPACITOR?

Capacitor es un runtime nativo que permite ejecutar aplicaciones web como apps nativas en iOS, Android y Web, manteniendo una única base de código.

### Ventajas
- ✅ Una sola base de código (Next.js)
- ✅ Acceso a APIs nativas (cámara, geolocalización, etc.)
- ✅ Mantiene funcionalidad PWA
- ✅ Compatible con plugins de Cordova
- ✅ Desarrollo más rápido que nativo puro

---

## 🚀 FASE 1: INSTALACIÓN Y CONFIGURACIÓN

### Paso 1: Instalar Capacitor CLI

```bash
# Instalar Capacitor y sus dependencias
npm install @capacitor/core @capacitor/cli

# Instalar plataformas
npm install @capacitor/android @capacitor/ios

# Instalar plugins esenciales
npm install @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen @capacitor/camera @capacitor/geolocation @capacitor/share @capacitor/filesystem @capacitor/network @capacitor/device @capacitor/browser @capacitor/toast
```

### Paso 2: Inicializar Capacitor

```bash
# Inicializar configuración de Capacitor
npx cap init "SOS Habilidoso" "com.soshabilidoso.app" --web-dir=out
```

**Parámetros:**
- `"SOS Habilidoso"` - Nombre de la app
- `"com.soshabilidoso.app"` - Bundle ID (importante para stores)
- `--web-dir=out` - Directorio de build de Next.js

### Paso 3: Configurar Next.js para Export Estático

Actualizar `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  // IMPORTANTE: Habilitar export estático para Capacitor
  output: 'export',
  
  // Deshabilitar optimización de imágenes para export estático
  images: {
    unoptimized: true,
  },
  
  // Configuración existente...
  reactStrictMode: false,
  swcMinify: true,
  
  // Trailing slash para compatibilidad con Capacitor
  trailingSlash: true,
  
  // Base path si es necesario
  // basePath: '',
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

module.exports = withPWA(nextConfig);
```

### Paso 4: Actualizar package.json

Agregar scripts para Capacitor:

```json
{
  "scripts": {
    "dev": "next dev -p 4000",
    "build": "next build",
    "build:mobile": "next build && npx cap sync",
    "start": "next start",
    "lint": "next lint",
    
    "cap:init": "npx cap init",
    "cap:add:android": "npx cap add android",
    "cap:add:ios": "npx cap add ios",
    "cap:sync": "npx cap sync",
    "cap:sync:android": "npx cap sync android",
    "cap:sync:ios": "npx cap sync ios",
    "cap:open:android": "npx cap open android",
    "cap:open:ios": "npx cap open ios",
    "cap:run:android": "npx cap run android",
    "cap:run:ios": "npx cap run ios",
    "cap:build:android": "npm run build && npx cap sync android && npx cap open android",
    "cap:build:ios": "npm run build && npx cap sync ios && npx cap open ios",
    
    "android:dev": "npm run build:mobile && npm run cap:open:android",
    "ios:dev": "npm run build:mobile && npm run cap:open:ios"
  }
}
```

---

## 📱 FASE 2: CONFIGURACIÓN DE ANDROID

### Paso 1: Agregar Plataforma Android

```bash
# Agregar Android
npx cap add android
```

Esto creará la carpeta `android/` con el proyecto Android Studio.

### Paso 2: Configurar capacitor.config.ts

Crear archivo `capacitor.config.ts` en la raíz:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.soshabilidoso.app',
  appName: 'SOS Habilidoso',
  webDir: 'out',
  server: {
    // Para desarrollo, apuntar al servidor local
    // url: 'http://192.168.1.100:4000', // Tu IP local
    // cleartext: true,
    
    // Para producción, comentar las líneas anteriores
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#00ff88",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
```

### Paso 3: Configurar Android Manifest

Editar `android/app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths"></meta-data>
        </provider>
    </application>

    <!-- Permisos necesarios -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    
    <!-- Features -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.location.gps" android:required="false" />

</manifest>
```

### Paso 4: Configurar build.gradle

Editar `android/app/build.gradle`:

```gradle
android {
    namespace "com.soshabilidoso.app"
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.soshabilidoso.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "0.2.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 🎨 FASE 3: RECURSOS Y ASSETS

### Paso 1: Iconos de la App

Necesitas iconos en diferentes tamaños. Usa una herramienta como [Icon Kitchen](https://icon.kitchen/) o genera manualmente:

**Android:**
```
android/app/src/main/res/
├── mipmap-hdpi/
│   └── ic_launcher.png (72x72)
├── mipmap-mdpi/
│   └── ic_launcher.png (48x48)
├── mipmap-xhdpi/
│   └── ic_launcher.png (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png (144x144)
└── mipmap-xxxhdpi/
    └── ic_launcher.png (192x192)
```

### Paso 2: Splash Screen

Crear `android/app/src/main/res/drawable/splash.png` (2732x2732 px)

O usar generador automático:
```bash
npm install -g cordova-res
cordova-res android --skip-config --copy
```

### Paso 3: Colores y Estilos

Editar `android/app/src/main/res/values/styles.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>

    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme">
        <item name="android:background">@drawable/splash</item>
    </style>
</resources>
```

Editar `android/app/src/main/res/values/colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#000000</color>
    <color name="colorPrimaryDark">#000000</color>
    <color name="colorAccent">#00ff88</color>
</resources>
```

---

## 🔧 FASE 4: INTEGRACIÓN DE PLUGINS NATIVOS

### Crear Hook para Capacitor

Crear `lib/hooks/use-capacitor.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';

export function useCapacitor() {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'web' | 'ios' | 'android'>('web');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const native = Capacitor.isNativePlatform();
    const plat = Capacitor.getPlatform() as 'web' | 'ios' | 'android';
    
    setIsNative(native);
    setPlatform(plat);

    if (native) {
      initializeNativeFeatures();
    }
  }, []);

  const initializeNativeFeatures = async () => {
    try {
      // Configurar StatusBar
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });

      // Ocultar SplashScreen después de cargar
      await SplashScreen.hide();

      // Configurar teclado
      Keyboard.setAccessoryBarVisible({ isVisible: true });

      // Monitorear conexión
      Network.addListener('networkStatusChange', status => {
        setIsOnline(status.connected);
      });

      // Manejar botón back de Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });

      // Manejar cuando la app vuelve al foreground
      App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          console.log('App is active');
          // Refrescar datos si es necesario
        }
      });

    } catch (error) {
      console.error('Error initializing native features:', error);
    }
  };

  return {
    isNative,
    platform,
    isOnline,
  };
}
```

### Integrar en Layout Principal

Actualizar `app/RootLayoutClient.tsx`:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useCapacitor } from '@/lib/hooks/use-capacitor';
// ... otros imports

export const RootLayoutClient = memo(function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { isNative, platform, isOnline } = useCapacitor();
  
  // ... resto del código

  return (
    <Providers>
      {/* Mostrar banner si está offline */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-[10000]">
          Sin conexión a Internet
        </div>
      )}
      
      {/* Resto del contenido */}
      <BackgroundColorProvider />
      {children}
    </Providers>
  );
});
```

### Plugin de Cámara

Crear `lib/utils/camera.ts`:

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export async function takePicture() {
  if (!Capacitor.isNativePlatform()) {
    // Fallback para web
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    return image.dataUrl;
  } catch (error) {
    console.error('Error taking picture:', error);
    return null;
  }
}

export async function pickImage() {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    return image.dataUrl;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}
```

### Plugin de Compartir

Crear `lib/utils/share.ts`:

```typescript
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export async function shareContent(title: string, text: string, url?: string) {
  if (!Capacitor.isNativePlatform()) {
    // Fallback para web
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    }
    return false;
  }

  try {
    await Share.share({
      title,
      text,
      url,
      dialogTitle: 'Compartir',
    });
    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
}
```

---

## 🏗️ FASE 5: BUILD Y TESTING

### Paso 1: Build para Producción

```bash
# 1. Build de Next.js
npm run build

# 2. Sincronizar con Capacitor
npx cap sync android

# 3. Abrir en Android Studio
npx cap open android
```

### Paso 2: Configurar Android Studio

1. Abrir Android Studio
2. Esperar a que sincronice Gradle
3. Conectar dispositivo Android o iniciar emulador
4. Click en "Run" (▶️)

### Paso 3: Testing en Dispositivo Real

**Habilitar Modo Desarrollador en Android:**
1. Ir a Configuración > Acerca del teléfono
2. Tocar "Número de compilación" 7 veces
3. Volver y entrar en "Opciones de desarrollador"
4. Activar "Depuración USB"

**Conectar y ejecutar:**
```bash
# Ver dispositivos conectados
adb devices

# Ejecutar en dispositivo
npm run cap:run:android
```

### Paso 4: Generar APK de Prueba

En Android Studio:
1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. Esperar a que compile
3. APK estará en `android/app/build/outputs/apk/debug/app-debug.apk`

### Paso 5: Generar APK Firmado (Release)

```bash
# Generar keystore
keytool -genkey -v -keystore sos-habilidoso.keystore -alias soshabilidoso -keyalg RSA -keysize 2048 -validity 10000

# Configurar en android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('../../sos-habilidoso.keystore')
            storePassword 'tu_password'
            keyAlias 'soshabilidoso'
            keyPassword 'tu_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}

# Build release
cd android
./gradlew assembleRelease
```

---

## 🍎 FASE 6: CONFIGURACIÓN DE iOS (FUTURO)

### Requisitos
- Mac con macOS
- Xcode instalado
- Cuenta de Apple Developer

### Pasos Básicos

```bash
# Agregar plataforma iOS
npx cap add ios

# Sincronizar
npx cap sync ios

# Abrir en Xcode
npx cap open ios
```

---

## 🔄 FASE 7: DESARROLLO CONTINUO

### Workflow de Desarrollo

```bash
# 1. Desarrollar en web (más rápido)
npm run dev

# 2. Cuando necesites probar en móvil
npm run build:mobile
npm run cap:open:android

# 3. Para desarrollo con live reload en móvil
# Editar capacitor.config.ts y descomentar:
# server: {
#   url: 'http://TU_IP:4000',
#   cleartext: true,
# }
```

### Hot Reload en Dispositivo

1. Obtener tu IP local:
```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

2. Actualizar `capacitor.config.ts`:
```typescript
server: {
  url: 'http://192.168.1.100:4000', // Tu IP
  cleartext: true,
},
```

3. Rebuild y ejecutar:
```bash
npx cap sync android
npx cap run android
```

4. Ahora los cambios en Next.js se reflejarán automáticamente en el dispositivo

---

## 📊 CHECKLIST DE INTEGRACIÓN

### Preparación
- [ ] Instalar Capacitor CLI y dependencias
- [ ] Configurar Next.js para export estático
- [ ] Crear capacitor.config.ts
- [ ] Actualizar package.json con scripts

### Android
- [ ] Agregar plataforma Android
- [ ] Configurar AndroidManifest.xml
- [ ] Configurar build.gradle
- [ ] Agregar iconos y splash screen
- [ ] Configurar permisos necesarios

### Plugins Nativos
- [ ] Implementar hook useCapacitor
- [ ] Integrar plugin de cámara
- [ ] Integrar plugin de compartir
- [ ] Configurar StatusBar
- [ ] Configurar SplashScreen
- [ ] Configurar Keyboard

### Testing
- [ ] Build de producción exitoso
- [ ] Sincronización con Capacitor
- [ ] Prueba en emulador Android
- [ ] Prueba en dispositivo real
- [ ] Generar APK de prueba
- [ ] Verificar todas las funcionalidades

### Optimización
- [ ] Optimizar tamaño del APK
- [ ] Configurar ProGuard
- [ ] Optimizar imágenes
- [ ] Configurar cache
- [ ] Testing de performance

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### 1. Error: "webDir not found"
**Solución:** Ejecutar `npm run build` antes de `npx cap sync`

### 2. Error de permisos en Android
**Solución:** Verificar AndroidManifest.xml y solicitar permisos en runtime

### 3. Imágenes no cargan
**Solución:** Usar rutas absolutas o configurar `basePath` en next.config.js

### 4. API calls fallan
**Solución:** Configurar CORS en el backend Django para permitir el dominio de Capacitor

### 5. Splash screen no desaparece
**Solución:** Llamar a `SplashScreen.hide()` después de cargar la app

---

## 📚 RECURSOS ADICIONALES

### Documentación
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor + Next.js](https://capacitorjs.com/docs/guides/nextjs)
- [Android Developer](https://developer.android.com/)

### Herramientas
- [Icon Kitchen](https://icon.kitchen/) - Generador de iconos
- [Cordova Res](https://github.com/ionic-team/cordova-res) - Generador de recursos
- [Android Studio](https://developer.android.com/studio)

---

## 🎯 PRÓXIMOS PASOS

1. **Instalar dependencias de Capacitor**
2. **Configurar Next.js para export**
3. **Inicializar Capacitor**
4. **Agregar plataforma Android**
5. **Configurar permisos y recursos**
6. **Implementar plugins nativos**
7. **Build y testing**
8. **Generar APK**

---

**Creado por:** Kiro AI Assistant  
**Fecha:** 28 de Enero de 2026  
**Versión:** 1.0  
**Estado:** Listo para implementar

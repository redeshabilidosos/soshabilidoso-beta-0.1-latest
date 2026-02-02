# 🎨 Cambiar Icono de Android

**Fecha:** 28 de Enero de 2026  
**Estado:** ✅ Icono actualizado a logososbetav1.png

---

## ✅ ICONO ACTUAL

**Archivo**: `app/assets/logososbetav1.png`
**Aplicado a**: Todas las densidades de Android
**Ubicaciones**:
- Icono de app (ic_launcher)
- Icono redondo (ic_launcher_round)
- Splash screen

---

## 🎯 CÓMO CAMBIAR EL ICONO

### Método Rápido (Recomendado)

**Paso 1: Preparar imagen**
- Formato: PNG con fondo transparente
- Tamaño recomendado: 1024x1024 px
- Ubicación: `app/assets/tu-nuevo-logo.png`

**Paso 2: Copiar a carpetas de Android**
```bash
# Copiar a todas las densidades
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" -Force
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png" -Force
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-xhdpi\ic_launcher.png" -Force
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-hdpi\ic_launcher.png" -Force
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-mdpi\ic_launcher.png" -Force

# Copiar iconos redondos
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_round.png" -Force
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher_round.png" -Force
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-xhdpi\ic_launcher_round.png" -Force
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-hdpi\ic_launcher_round.png" -Force
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\mipmap-mdpi\ic_launcher_round.png" -Force

# Copiar splash screen
Copy-Item "app\assets\tu-nuevo-logo.png" "android\app\src\main\res\drawable\splash.png" -Force
```

**Paso 3: Rebuild y reinstalar**
```bash
actualizar-app-rapido.bat
```

---

## 📐 TAMAÑOS RECOMENDADOS

### Para Mejor Calidad
Crea imágenes específicas para cada densidad:

| Densidad | Tamaño | Carpeta |
|----------|--------|---------|
| mdpi | 48x48 px | mipmap-mdpi |
| hdpi | 72x72 px | mipmap-hdpi |
| xhdpi | 96x96 px | mipmap-xhdpi |
| xxhdpi | 144x144 px | mipmap-xxhdpi |
| xxxhdpi | 192x192 px | mipmap-xxxhdpi |

### Splash Screen
- **Tamaño**: 1024x1024 px o mayor
- **Formato**: PNG con fondo transparente
- **Ubicación**: `android/app/src/main/res/drawable/splash.png`

---

## 🛠️ HERRAMIENTAS ÚTILES

### Generadores de Iconos Online
1. **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/
2. **App Icon Generator**: https://appicon.co/
3. **Icon Kitchen**: https://icon.kitchen/

### Proceso con Herramienta:
1. Sube tu logo (1024x1024 px)
2. Descarga el paquete de iconos
3. Extrae y copia a carpetas correspondientes
4. Rebuild APK

---

## 📋 UBICACIONES DE ARCHIVOS

### Iconos de App
```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png
    └── ic_launcher_round.png
```

### Splash Screen
```
android/app/src/main/res/drawable/
└── splash.png
```

---

## 🎨 TIPOS DE ICONOS

### 1. Icono Cuadrado (ic_launcher)
- Usado en la mayoría de launchers
- Puede tener esquinas redondeadas
- Fondo puede ser transparente

### 2. Icono Redondo (ic_launcher_round)
- Usado en launchers que soportan iconos redondos
- Debe ser circular
- Fondo transparente recomendado

### 3. Splash Screen
- Mostrado al abrir la app
- Puede ser más grande
- Configurado en `capacitor.config.ts`

---

## ⚙️ CONFIGURACIÓN DE SPLASH SCREEN

### En capacitor.config.ts
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    launchAutoHide: true,
    backgroundColor: "#000000", // Color de fondo
    androidSplashResourceName: "splash",
    androidScaleType: "CENTER_CROP",
    showSpinner: false,
    spinnerColor: "#00ff88",
    splashFullScreen: true,
    splashImmersive: true,
  },
}
```

---

## 🔄 SCRIPT AUTOMATIZADO

Crea un script para cambiar iconos rápidamente:

**cambiar-icono.bat:**
```batch
@echo off
set LOGO=%1

if "%LOGO%"=="" (
    echo Uso: cambiar-icono.bat ruta/al/logo.png
    exit /b 1
)

echo Copiando icono a todas las densidades...

REM Iconos normales
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png"
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png"
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-xhdpi\ic_launcher.png"
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-hdpi\ic_launcher.png"
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-mdpi\ic_launcher.png"

REM Iconos redondos
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_round.png"
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher_round.png"
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-xhdpi\ic_launcher_round.png"
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-hdpi\ic_launcher_round.png"
copy /Y "%LOGO%" "android\app\src\main\res\mipmap-mdpi\ic_launcher_round.png"

REM Splash screen
copy /Y "%LOGO%" "android\app\src\main\res\drawable\splash.png"

echo Icono actualizado!
echo Ejecuta: actualizar-app-rapido.bat
pause
```

**Uso:**
```bash
cambiar-icono.bat app\assets\nuevo-logo.png
```

---

## 💡 TIPS

### Tip 1: Fondo Transparente
- Usa PNG con transparencia
- Evita fondos blancos o de color
- El launcher aplicará su propio fondo

### Tip 2: Área Segura
- Deja margen de 10-15% alrededor
- Evita elementos importantes en bordes
- Algunos launchers recortan los iconos

### Tip 3: Simplicidad
- Iconos simples se ven mejor
- Evita texto pequeño
- Usa colores contrastantes

### Tip 4: Testing
- Prueba en diferentes launchers
- Verifica en diferentes tamaños
- Comprueba en modo oscuro/claro

---

## 🧪 VERIFICAR CAMBIOS

### Después de Instalar APK

1. **Ver en launcher**:
   - Busca el icono en el drawer de apps
   - Verifica que se vea bien

2. **Ver splash screen**:
   - Abre la app
   - Observa la pantalla de carga
   - Verifica que el logo se vea centrado

3. **Ver en ajustes**:
   - Ajustes → Apps → SOS Habilidoso
   - Verifica el icono en la lista

---

## 🎯 CHECKLIST

- [ ] Imagen preparada (PNG, 1024x1024)
- [ ] Copiada a todas las carpetas mipmap
- [ ] Copiada a drawable (splash)
- [ ] Ejecutado `npx cap sync android`
- [ ] Ejecutado `actualizar-app-rapido.bat`
- [ ] APK instalado en dispositivo
- [ ] Icono visible en launcher
- [ ] Splash screen se ve bien
- [ ] Icono se ve bien en ajustes

---

## 📚 RECURSOS

### Guías Oficiales
- [Android Icon Design](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher)
- [Capacitor Icons](https://capacitorjs.com/docs/guides/splash-screens-and-icons)

### Herramientas
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- [Figma](https://www.figma.com/) - Para diseñar iconos
- [GIMP](https://www.gimp.org/) - Editor de imágenes gratuito

---

## 🆘 TROUBLESHOOTING

### Icono no cambia después de instalar

**Causa**: Cache del launcher

**Solución**:
```bash
# Limpiar cache del launcher
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell pm clear com.android.launcher3

# O reiniciar dispositivo
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe reboot
```

### Icono se ve pixelado

**Causa**: Imagen muy pequeña

**Solución**:
- Usa imagen de al menos 1024x1024 px
- O crea imágenes específicas para cada densidad

### Splash screen no se ve

**Causa**: Configuración incorrecta

**Solución**:
1. Verifica que `splash.png` existe en `drawable/`
2. Verifica configuración en `capacitor.config.ts`
3. Rebuild APK

---

**Creado por:** Kiro AI Assistant  
**Estado:** ✅ Icono actualizado  
**Icono actual:** logososbetav1.png


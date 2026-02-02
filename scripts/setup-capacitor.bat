@echo off
echo ========================================
echo  INSTALACION DE CAPACITOR PARA ANDROID
echo ========================================
echo.

echo [1/6] Instalando Capacitor Core y CLI...
call npm install @capacitor/core @capacitor/cli

echo.
echo [2/6] Instalando plataformas Android e iOS...
call npm install @capacitor/android @capacitor/ios

echo.
echo [3/6] Instalando plugins esenciales...
call npm install @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen

echo.
echo [4/6] Instalando plugins de funcionalidad...
call npm install @capacitor/camera @capacitor/geolocation @capacitor/share @capacitor/filesystem @capacitor/network @capacitor/device @capacitor/browser @capacitor/toast

echo.
echo [5/6] Inicializando Capacitor...
call npx cap init "SOS Habilidoso" "com.soshabilidoso.app" --web-dir=out

echo.
echo [6/6] Agregando plataforma Android...
call npx cap add android

echo.
echo ========================================
echo  INSTALACION COMPLETADA!
echo ========================================
echo.
echo Proximos pasos:
echo 1. Ejecutar: npm run build
echo 2. Ejecutar: npx cap sync android
echo 3. Ejecutar: npx cap open android
echo.
echo Para mas informacion, ver: INTEGRACION_CAPACITOR_GUIA_COMPLETA.md
echo.
pause

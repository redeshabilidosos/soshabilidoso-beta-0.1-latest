@echo off
title Reinstalar App - Sin ADB
color 0A

echo ========================================
echo   REINSTALACION SIN ADB
echo ========================================
echo.

REM Limpiar build anterior
echo [1/4] Limpiando build anterior...
if exist "android\app\build" (
    rmdir /s /q "android\app\build"
    echo       ✓ Build limpiado
) else (
    echo       ✓ No hay build anterior
)

REM Sincronizar configuracion
echo.
echo [2/4] Sincronizando configuracion...
call npx cap sync android
echo       ✓ Configuracion sincronizada

REM Compilar APK
echo.
echo [3/4] Compilando APK (esto puede tardar 1-2 minutos)...
cd android
call gradlew assembleDebug
cd ..
echo       ✓ APK compilado

REM Copiar APK al escritorio
echo.
echo [4/4] Copiando APK al escritorio...
copy "android\app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\SOS-Habilidoso.apk"
echo       ✓ APK copiado

echo.
echo ========================================
echo   ✅ APK LISTO EN TU ESCRITORIO
echo ========================================
echo.
echo Archivo: SOS-Habilidoso.apk
echo.
echo PASOS MANUALES:
echo.
echo 1. En tu Xiaomi:
echo    - Desinstala la app "SOS Habilidoso" actual
echo.
echo 2. Transfiere el APK a tu Xiaomi:
echo    - Conecta USB y copia SOS-Habilidoso.apk
echo    - O envialo por WhatsApp/Bluetooth
echo.
echo 3. En tu Xiaomi:
echo    - Abre el archivo SOS-Habilidoso.apk
echo    - Permite "Instalar desde fuentes desconocidas"
echo    - Instala la app
echo.
echo 4. Abre la app y verifica que funcione
echo.
echo Configuracion actual:
echo   URL: http://10.87.23.237:4000
echo.
pause

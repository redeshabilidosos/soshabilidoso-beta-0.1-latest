@echo off
title Reinstalar App Completa en Xiaomi
color 0A

echo ========================================
echo   REINSTALACION COMPLETA DE LA APP
echo ========================================
echo.

REM Verificar que el dispositivo este conectado
echo [1/6] Verificando conexion con Xiaomi...
cd /d "%~dp0android\platform-tools"
adb devices
if %errorlevel% neq 0 (
    echo ❌ Error: No se detecta el Xiaomi
    echo.
    echo Conecta el cable USB y activa Depuracion USB
    pause
    exit /b 1
)
echo       ✓ Xiaomi conectado

REM Desinstalar app completamente
echo.
echo [2/6] Desinstalando app anterior...
adb uninstall com.soshabilidoso.app
echo       ✓ App desinstalada

REM Volver al directorio raiz
cd /d "%~dp0"

REM Limpiar build anterior
echo.
echo [3/6] Limpiando build anterior...
if exist "android\app\build" (
    rmdir /s /q "android\app\build"
    echo       ✓ Build limpiado
) else (
    echo       ✓ No hay build anterior
)

REM Sincronizar con configuracion actual
echo.
echo [4/6] Sincronizando configuracion...
call npx cap sync android
echo       ✓ Configuracion sincronizada

REM Compilar APK debug
echo.
echo [5/6] Compilando APK (esto puede tardar 1-2 minutos)...
cd android
call gradlew assembleDebug
cd ..
echo       ✓ APK compilado

REM Instalar APK en Xiaomi
echo.
echo [6/6] Instalando app en Xiaomi...
cd /d "%~dp0android\platform-tools"
adb install -r "%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
if %errorlevel% equ 0 (
    echo       ✓ App instalada exitosamente
) else (
    echo       ❌ Error al instalar
    pause
    exit /b 1
)

REM Iniciar app
echo.
echo Iniciando app...
adb shell am start -n com.soshabilidoso.app/.MainActivity
cd /d "%~dp0"

echo.
echo ========================================
echo   ✅ REINSTALACION COMPLETA
echo ========================================
echo.
echo La app ha sido:
echo   ✓ Desinstalada completamente
echo   ✓ Recompilada desde cero
echo   ✓ Reinstalada en tu Xiaomi
echo   ✓ Iniciada automaticamente
echo.
echo Configuracion actual:
echo   URL: http://10.87.23.237:4000
echo.
echo Verifica que la app funcione correctamente
echo.
pause

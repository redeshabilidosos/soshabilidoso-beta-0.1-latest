@echo off
title Reinstalar App Rapido
color 0A

echo ========================================
echo   REINSTALACION RAPIDA
echo ========================================
echo.
echo Este script usa el APK ya compilado
echo.

cd /d "%~dp0android\platform-tools"

REM Verificar dispositivo
echo [1/3] Verificando Xiaomi...
adb devices
echo.

REM Desinstalar
echo [2/3] Desinstalando app...
adb uninstall com.soshabilidoso.app
echo       ✓ Desinstalada
echo.

REM Instalar APK existente
echo [3/3] Instalando APK...
if exist "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" (
    adb install "%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
    echo       ✓ Instalada
    echo.
    echo Iniciando app...
    adb shell am start -n com.soshabilidoso.app/.MainActivity
) else (
    echo ❌ No se encuentra el APK
    echo.
    echo Ejecuta primero: reinstalar-app-completa.bat
    echo.
)

cd /d "%~dp0"

echo.
echo ========================================
echo   ✅ LISTO
echo ========================================
echo.
pause

t@echo off
title Reinstalar App - Sin Android Studio
color 0A

echo ========================================
echo   REINSTALACION SIN ANDROID STUDIO
echo ========================================
echo.

set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB=%SCRCPY_PATH%\adb.exe
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%

REM Verificar Xiaomi conectado
echo [1/6] Verificando Xiaomi...
"%ADB%" devices
echo.
timeout /t 2 /nobreak >nul

REM Desinstalar app anterior
echo [2/6] Desinstalando app anterior...
"%ADB%" uninstall com.soshabilidoso.app
echo       ✓ App desinstalada
echo.

REM Sincronizar configuracion
echo [3/6] Sincronizando configuracion...
call npx cap sync android
echo       ✓ Configuracion sincronizada
echo.

REM Compilar APK
echo [4/6] Compilando APK (1-2 minutos)...
cd android
call gradlew.bat assembleDebug
cd ..
if %errorlevel% equ 0 (
    echo       ✓ APK compilado
) else (
    echo       ❌ Error al compilar
    pause
    exit /b 1
)
echo.

REM Instalar APK
echo [5/6] Instalando APK en Xiaomi...
"%ADB%" install "android\app\build\outputs\apk\debug\app-debug.apk"
if %errorlevel% equ 0 (
    echo       ✓ App instalada
) else (
    echo       ❌ Error al instalar
    pause
    exit /b 1
)
echo.

REM Iniciar app
echo [6/6] Iniciando app...
"%ADB%" shell am start -n com.soshabilidoso.app/.MainActivity
echo       ✓ App iniciada
echo.

echo ========================================
echo   ✅ REINSTALACION COMPLETA
echo ========================================
echo.
echo La app ha sido reinstalada con:
echo   URL: http://10.87.23.237:4000
echo.
echo Verifica en scrcpy que funcione correctamente
echo.
pause

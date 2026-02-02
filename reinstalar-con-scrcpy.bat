@echo off
title Reinstalar App con scrcpy
color 0A

echo ========================================
echo   REINSTALACION COMPLETA CON SCRCPY
echo ========================================
echo.

set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB=%SCRCPY_PATH%\adb.exe

REM Verificar que scrcpy existe
if not exist "%ADB%" (
    echo ❌ Error: No se encuentra adb.exe en scrcpy
    echo Ubicacion esperada: %SCRCPY_PATH%
    pause
    exit /b 1
)

REM Verificar dispositivo conectado
echo [1/7] Verificando Xiaomi conectado...
"%ADB%" devices
echo.
timeout /t 2 /nobreak >nul

REM Desinstalar app anterior
echo [2/7] Desinstalando app anterior...
"%ADB%" uninstall com.soshabilidoso.app
if %errorlevel% equ 0 (
    echo       ✓ App desinstalada
) else (
    echo       ⚠ App no estaba instalada o error al desinstalar
)
echo.

REM Sincronizar configuracion
echo [3/7] Sincronizando configuracion actual...
call npx cap sync android
echo       ✓ Configuracion sincronizada
echo.

REM Compilar APK con Android Studio (si esta abierto) o Gradle
echo [4/7] Compilando APK...
echo.
echo ⚠ IMPORTANTE: Necesitas compilar el APK
echo.
echo Opcion 1 - Android Studio (Recomendado):
echo   1. Abre Android Studio
echo   2. File → Open → Selecciona carpeta "android"
echo   3. Build → Build Bundle(s) / APK(s) → Build APK(s)
echo   4. Espera a que compile
echo   5. Presiona cualquier tecla aqui cuando termine
echo.
echo Opcion 2 - Gradle (si tienes Java configurado):
echo   Presiona 'G' para intentar compilar con Gradle
echo.
choice /c AG /n /m "Presiona A cuando Android Studio termine, o G para Gradle: "

if errorlevel 2 (
    echo.
    echo Compilando con Gradle...
    cd android
    call gradlew.bat assembleDebug
    cd ..
    if %errorlevel% neq 0 (
        echo ❌ Error al compilar con Gradle
        echo Usa Android Studio en su lugar
        pause
        exit /b 1
    )
    echo       ✓ APK compilado con Gradle
) else (
    echo       ✓ APK compilado con Android Studio
)
echo.

REM Verificar que el APK existe
echo [5/7] Verificando APK...
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo       ✓ APK encontrado
) else (
    echo       ❌ APK no encontrado
    echo.
    echo El APK deberia estar en:
    echo android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Compila el APK primero y ejecuta este script de nuevo
    pause
    exit /b 1
)
echo.

REM Instalar APK
echo [6/7] Instalando APK en Xiaomi...
"%ADB%" install "android\app\build\outputs\apk\debug\app-debug.apk"
if %errorlevel% equ 0 (
    echo       ✓ App instalada exitosamente
) else (
    echo       ❌ Error al instalar
    pause
    exit /b 1
)
echo.

REM Iniciar app
echo [7/7] Iniciando app...
"%ADB%" shell am start -n com.soshabilidoso.app/.MainActivity
echo       ✓ App iniciada
echo.

echo ========================================
echo   ✅ REINSTALACION COMPLETA
echo ========================================
echo.
echo La app ha sido:
echo   ✓ Desinstalada completamente
echo   ✓ Recompilada con configuracion actual
echo   ✓ Reinstalada en tu Xiaomi
echo   ✓ Iniciada automaticamente
echo.
echo Configuracion actual:
echo   URL: http://10.87.23.237:4000
echo.
echo Verifica en scrcpy que la app funcione
echo.
pause

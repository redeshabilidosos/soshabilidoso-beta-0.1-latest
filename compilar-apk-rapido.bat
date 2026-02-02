@echo off
title Compilar APK Rapido
color 0A

echo ========================================
echo   COMPILAR APK SIN ANDROID STUDIO
echo ========================================
echo.

REM Configurar Java de Android Studio
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%

echo [1/2] Configurando Java...
echo       Java: %JAVA_HOME%
echo.

REM Compilar APK
echo [2/2] Compilando APK (esto puede tardar 1-2 minutos)...
echo       Por favor espera...
echo.
cd android
call gradlew.bat assembleDebug
cd ..

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ APK COMPILADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Ubicacion: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ ERROR AL COMPILAR
    echo ========================================
    echo.
)

pause

@echo off
title Instalar APK con ADB (Scrcpy)
color 0A

echo ========================================
echo   Instalar APK en Xiaomi
echo   Usando ADB de Scrcpy
echo ========================================
echo.

set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB_PATH=%SCRCPY_PATH%\adb.exe
set APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk

echo [1/3] Verificando dispositivo conectado...
"%ADB_PATH%" devices
echo.

if not exist "%APK_PATH%" (
    echo ERROR: APK no encontrado en:
    echo %APK_PATH%
    echo.
    echo Ejecuta primero: build-apk.bat
    echo.
    pause
    exit /b 1
)

echo [2/3] Desinstalando version anterior (si existe)...
"%ADB_PATH%" uninstall com.soshabilidoso.app 2>nul
echo.

echo [3/3] Instalando APK en Xiaomi...
echo Esto puede tardar 30-60 segundos...
echo.
"%ADB_PATH%" install -r "%APK_PATH%"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   APK INSTALADO EXITOSAMENTE
    echo ========================================
    echo.
    echo La app esta instalada en tu Xiaomi
    echo Puedes abrirla desde el menu de apps
    echo.
    echo O ejecutar: scrcpy-solo.bat para verla
    echo.
) else (
    echo.
    echo ERROR: No se pudo instalar el APK
    echo Verifica que el dispositivo este conectado
    echo.
)

pause

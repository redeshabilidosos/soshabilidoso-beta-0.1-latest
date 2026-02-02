@echo off
echo ========================================
echo   Copiar APK al Escritorio
echo ========================================
echo.

set APK_SOURCE=android\app\build\outputs\apk\debug\app-debug.apk
set APK_DEST=%USERPROFILE%\Desktop\SOS-Habilidoso.apk

if not exist "%APK_SOURCE%" (
    echo ERROR: APK no encontrado en:
    echo %APK_SOURCE%
    echo.
    echo Ejecuta primero: build-apk.bat
    echo.
    pause
    exit /b 1
)

echo Copiando APK al escritorio...
copy "%APK_SOURCE%" "%APK_DEST%"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   APK COPIADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Ubicacion: %USERPROFILE%\Desktop\SOS-Habilidoso.apk
    echo Tamano: 128 MB
    echo.
    echo Ahora puedes:
    echo 1. Transferirlo a tu Xiaomi por USB
    echo 2. Enviarlo por WhatsApp
    echo 3. Subirlo a Google Drive
    echo 4. Usar ShareIt o Send Anywhere
    echo.
    echo Abriendo carpeta del escritorio...
    explorer "%USERPROFILE%\Desktop"
) else (
    echo.
    echo ERROR: No se pudo copiar el APK
    echo.
)

pause

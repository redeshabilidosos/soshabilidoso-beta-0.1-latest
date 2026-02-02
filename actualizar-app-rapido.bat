@echo off
title Actualizar App Rapido
color 0A

echo ========================================
echo   Actualizar App en Xiaomi (RAPIDO)
echo ========================================
echo.
echo Este script:
echo 1. Sincroniza cambios
echo 2. Compila APK
echo 3. Instala en Xiaomi
echo.
echo (Los servidores deben estar corriendo)
echo.
pause

echo [1/3] Sincronizando...
call npx cap sync android
echo.

echo [2/3] Compilando APK...
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
cd android
call gradlew.bat assembleDebug
cd ..
echo.

echo [3/3] Instalando en Xiaomi...
set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB_PATH=%SCRCPY_PATH%\adb.exe
set APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk

"%ADB_PATH%" install -r "%APK_PATH%"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ACTUALIZADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Abre la app en tu Xiaomi para ver cambios
    echo.
) else (
    echo.
    echo ERROR: No se pudo instalar
    echo.
)

pause

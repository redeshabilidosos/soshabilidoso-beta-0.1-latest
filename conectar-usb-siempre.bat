@echo off
echo ========================================
echo   Conexion USB - Funciona con Cualquier WiFi
echo ========================================
echo.
echo Este metodo funciona sin importar la red WiFi
echo.

REM Crear tunel USB para puerto 4000 (Frontend)
echo Creando tunel para puerto 4000...
if exist "%~dp0android\platform-tools\adb.exe" (
    "%~dp0android\platform-tools\adb.exe" reverse tcp:4000 tcp:4000
) else (
    echo ❌ Error: No se encuentra adb.exe
    echo Ubicacion esperada: android\platform-tools\adb.exe
    pause
    exit /b 1
)

REM Crear tunel USB para puerto 8000 (Backend)
echo Creando tunel para puerto 8000...
"%~dp0android\platform-tools\adb.exe" reverse tcp:8000 tcp:8000

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ Tuneles USB creados exitosamente
    echo ========================================
    echo.
    echo Ahora la app usara:
    echo   - http://localhost:4000 (Frontend)
    echo   - http://localhost:8000 (Backend)
    echo.
    echo ✅ Funciona con CUALQUIER red WiFi
    echo ✅ No necesitas actualizar la IP
    echo ✅ Conexion estable via USB
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ Error: Conecta tu Xiaomi via USB
    echo ========================================
    echo.
    echo 1. Conecta el cable USB
    echo 2. Activa "Depuracion USB" en el Xiaomi
    echo 3. Ejecuta este script de nuevo
    echo.
)

pause

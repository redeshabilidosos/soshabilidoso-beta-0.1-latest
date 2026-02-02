@echo off
echo ========================================
echo   Permitir Puerto 4000 en Firewall
echo ========================================
echo.
echo Este script requiere permisos de administrador
echo.
pause

REM Agregar regla para puerto 4000
netsh advfirewall firewall add rule name="Node.js Server Port 4000" dir=in action=allow protocol=TCP localport=4000

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ Puerto 4000 permitido en firewall
    echo ========================================
    echo.
    echo Ahora tu Xiaomi podra conectarse al servidor
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ Error: Ejecuta como administrador
    echo ========================================
    echo.
    echo Haz clic derecho en este archivo y selecciona
    echo "Ejecutar como administrador"
    echo.
)

pause

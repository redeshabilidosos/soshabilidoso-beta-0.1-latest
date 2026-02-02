@echo off
echo ========================================
echo   Permitir Puerto 8000 en Firewall
echo ========================================
echo.
echo Este script requiere permisos de administrador
echo.
pause

REM Agregar regla para puerto 8000 (Django Backend)
netsh advfirewall firewall add rule name="Django Backend Port 8000" dir=in action=allow protocol=TCP localport=8000

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ Puerto 8000 permitido en firewall
    echo ========================================
    echo.
    echo Ahora tu Xiaomi podra conectarse al backend Django
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

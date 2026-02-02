@echo off
echo ========================================
echo   Configurar Firewall para WiFi
echo ========================================
echo.
echo Este script permite conexiones desde tu Xiaomi
echo al servidor Next.js (puerto 4000)
echo.
echo NOTA: Requiere permisos de Administrador
echo.
pause

echo Creando regla de firewall para puerto 4000...
netsh advfirewall firewall add rule name="SOS Habilidoso - Next.js" dir=in action=allow protocol=TCP localport=4000

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   FIREWALL CONFIGURADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Tu Xiaomi ahora puede conectarse a:
    echo http://192.168.78.173:4000
    echo.
) else (
    echo.
    echo ERROR: No se pudo configurar el firewall
    echo Ejecuta este script como Administrador
    echo.
)

pause

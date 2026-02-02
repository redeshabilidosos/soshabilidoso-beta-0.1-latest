@echo off
title Configurar MySQL para WiFi
color 0A

echo ========================================
echo   Configurar MySQL XAMPP para WiFi
echo ========================================
echo.
echo Este script configura el firewall para
echo permitir conexiones a MySQL desde tu Xiaomi
echo.
echo Puerto: 3307
echo.
echo NOTA: Requiere permisos de Administrador
echo.
pause

echo Creando regla de firewall para MySQL (puerto 3307)...
netsh advfirewall firewall add rule name="MySQL XAMPP - Puerto 3307" dir=in action=allow protocol=TCP localport=3307

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   FIREWALL CONFIGURADO EXITOSAMENTE
    echo ========================================
    echo.
    echo MySQL ahora acepta conexiones desde:
    echo - Tu Xiaomi
    echo - Otros dispositivos en tu red WiFi
    echo.
    echo Siguiente paso:
    echo 1. Configura my.ini en XAMPP
    echo 2. Reinicia MySQL
    echo 3. Crea usuario remoto
    echo.
    echo Ver guia completa: CONFIGURAR_MYSQL_WIFI.md
    echo.
) else (
    echo.
    echo ERROR: No se pudo configurar el firewall
    echo.
    echo Ejecuta este script como Administrador:
    echo 1. Click derecho en el archivo
    echo 2. "Ejecutar como administrador"
    echo.
)

pause

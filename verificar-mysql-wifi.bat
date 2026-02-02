@echo off
title Verificar MySQL WiFi
color 0A

echo ========================================
echo   Verificar Configuracion MySQL WiFi
echo ========================================
echo.

set IP=192.168.78.173

echo [1/4] Verificando puerto MySQL abierto...
netstat -ano | findstr ":3307"
echo.

echo [2/4] Verificando regla de firewall...
netsh advfirewall firewall show rule name="MySQL XAMPP - Puerto 3307" >nul 2>&1
if %errorlevel% equ 0 (
    echo OK: Regla de firewall existe
) else (
    echo ADVERTENCIA: Regla de firewall no encontrada
    echo Ejecuta: permitir-mysql-wifi.bat
)
echo.

echo [3/4] Verificando configuracion .env...
if exist backend\.env (
    echo OK: Archivo .env existe
    findstr "DATABASE_HOST" backend\.env
) else (
    echo ERROR: Archivo .env no encontrado
)
echo.

echo [4/4] Informacion de red...
echo Tu IP: %IP%
echo Puerto MySQL: 3307
echo Base de datos: habilidosos_db
echo.

echo ========================================
echo   RESUMEN
echo ========================================
echo.
echo Para que tu Xiaomi acceda a MySQL:
echo.
echo 1. Firewall: Ejecuta permitir-mysql-wifi.bat
echo 2. my.ini: Cambia bind-address a 0.0.0.0
echo 3. Usuario: Ejecuta crear-usuario-mysql-remoto.sql
echo 4. .env: Ejecuta configurar-env-para-wifi.bat
echo 5. Reinicia MySQL en XAMPP
echo 6. Reinicia backend Django
echo.
echo Guia completa: CONFIGURAR_MYSQL_WIFI.md
echo.
pause

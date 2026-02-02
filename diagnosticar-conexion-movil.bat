@echo off
title Diagnostico de Conexion Movil
color 0A

set IP=192.168.78.173
set ADB_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe

echo ========================================
echo   Diagnostico de Conexion Movil
echo ========================================
echo.

echo [1/6] Verificando IP de la PC...
echo Tu IP: %IP%
ipconfig | findstr "IPv4"
echo.

echo [2/6] Verificando puertos abiertos...
echo Puerto 4000 (Frontend):
netstat -ano | findstr ":4000"
echo.
echo Puerto 8000 (Backend):
netstat -ano | findstr ":8000"
echo.

echo [3/6] Verificando firewall...
netsh advfirewall firewall show rule name="SOS Habilidoso - Next.js" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Regla de firewall existe para puerto 4000
) else (
    echo ⚠️  Regla de firewall NO existe
    echo    Ejecuta: permitir-conexion-wifi.bat
)
echo.

echo [4/6] Probando conexion desde PC...
echo Probando Frontend:
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:4000
echo.
echo Probando Backend:
curl -s -o nul -w "Status: %%{http_code}\n" http://127.0.0.1:8000/api/
echo.

echo [5/6] Probando desde dispositivo Android...
if exist "%ADB_PATH%" (
    echo Probando acceso a Frontend desde Android:
    "%ADB_PATH%" shell "curl -s -o /dev/null -w 'Status: %%{http_code}\n' http://%IP%:4000" 2>nul
    echo.
    echo Probando acceso a Backend desde Android:
    "%ADB_PATH%" shell "curl -s -o /dev/null -w 'Status: %%{http_code}\n' http://%IP%:8000/api/" 2>nul
) else (
    echo ⚠️  ADB no encontrado
)
echo.

echo [6/6] Verificando configuracion Django...
echo ALLOWED_HOSTS debe incluir: %IP%
findstr "ALLOWED_HOSTS" backend\sos_habilidoso\settings.py
echo.
echo CORS_ALLOW_ALL_ORIGINS debe ser: True
findstr "CORS_ALLOW_ALL_ORIGINS" backend\sos_habilidoso\settings.py
echo.

echo ========================================
echo   RESUMEN
echo ========================================
echo.
echo Si ves errores arriba:
echo 1. Firewall: Ejecuta permitir-conexion-wifi.bat (como admin)
echo 2. ALLOWED_HOSTS: Debe incluir %IP%
echo 3. Puertos: Deben estar LISTENING
echo.
echo Para probar login desde Android:
echo 1. Abre navegador en Xiaomi
echo 2. Ve a: http://%IP%:4000
echo 3. Intenta login: molo / molo123
echo.
pause

@echo off
title Actualizar IP Automatica
color 0A

echo ========================================
echo   Detectar IP y Actualizar Config
echo ========================================
echo.

REM Detectar IP de WiFi
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "127.0.0.1"') do (
    set IP=%%a
    goto :found
)

:found
REM Limpiar espacios
set IP=%IP: =%

echo IP detectada: %IP%
echo.

REM Actualizar capacitor.config.ts
echo Actualizando capacitor.config.ts...
powershell -Command "(Get-Content capacitor.config.ts) -replace 'url: ''http://[0-9.]+:4000''', 'url: ''http://%IP%:4000''' | Set-Content capacitor.config.ts"

REM Actualizar .env
echo Actualizando backend/.env...
powershell -Command "(Get-Content backend\.env) -replace 'BACKEND_URL=http://[0-9.]+:8000', 'BACKEND_URL=http://%IP%:8000' | Set-Content backend\.env"
powershell -Command "(Get-Content backend\.env) -replace 'ALLOWED_HOSTS=.*', 'ALLOWED_HOSTS=127.0.0.1,localhost,%IP%' | Set-Content backend\.env"

echo.
echo ========================================
echo   CONFIGURACION ACTUALIZADA
echo ========================================
echo.
echo IP: %IP%
echo Frontend: http://%IP%:4000
echo Backend: http://%IP%:8000
echo.
echo Siguiente paso:
echo 1. Ejecuta: actualizar-app-rapido.bat
echo 2. Reinicia backend
echo.
pause

@echo off
title Configurar .env para WiFi
color 0A

echo ========================================
echo   Configurar .env para Acceso WiFi
echo ========================================
echo.

set IP=192.168.78.173

echo Tu IP actual: %IP%
echo.
echo Este script actualizara backend/.env para
echo permitir acceso desde tu Xiaomi
echo.
pause

echo Creando backup de .env...
copy backend\.env backend\.env.backup >nul

echo Actualizando configuracion...

REM Crear archivo temporal con nueva configuración
(
echo DJANGO_SETTINGS_MODULE=sos_habilidoso.settings.development
echo SECRET_KEY=dev-secret-key-change-me
echo DEBUG=true
echo ALLOWED_HOSTS=127.0.0.1,localhost,%IP%
echo.
echo # Backend URL ^(para construir URLs absolutas de media^)
echo BACKEND_URL=http://%IP%:8000
echo.
echo # MySQL 8 local config - Puerto 3307
echo DATABASE_NAME=habilidosos_db
echo DATABASE_USER=root
echo DATABASE_PASSWORD=
echo DATABASE_HOST=%IP%
echo DATABASE_PORT=3307
echo.
echo # Optional CORS/JWT ^(keep if needed^)
echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:4000,http://127.0.0.1:4000,http://%IP%:4000
echo JWT_ACCESS_TOKEN_LIFETIME=3600
echo JWT_REFRESH_TOKEN_LIFETIME=86400
echo.
echo # Google Sheets Webhook URL para respaldo de datos del Reality Show
echo GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbwhHJLUPsz5za7_JQrRGRdzeB5BfnhL9XFa0A9lSmmLl9Iz6Qe2UnuHeAvyP5PXxDQo/exec
echo.
echo # Google Sheets Webhook URL para registros de usuarios
echo GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbwuODUlDGzWVQfAA6vWX5F44HHNlteKuMfuRfzb6dgxsoNA1n_rsoJmnVW-2lp9xzvTVw/exec
echo.
echo # API Documentation
echo ENABLE_API_DOCS=true
) > backend\.env.temp

REM Reemplazar archivo original
move /y backend\.env.temp backend\.env >nul

echo.
echo ========================================
echo   CONFIGURACION ACTUALIZADA
echo ========================================
echo.
echo Cambios realizados:
echo - ALLOWED_HOSTS: Incluye %IP%
echo - DATABASE_HOST: %IP%
echo - BACKEND_URL: http://%IP%:8000
echo - CORS: Incluye http://%IP%:4000
echo.
echo Backup guardado en: backend\.env.backup
echo.
echo Siguiente paso:
echo 1. Reinicia el backend Django
echo 2. Prueba la app en tu Xiaomi
echo.
pause

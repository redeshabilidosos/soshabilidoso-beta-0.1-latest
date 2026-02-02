@echo off
title SOS Habilidoso - Modo Android
color 0A

echo ========================================
echo   SOS HABILIDOSO - MODO ANDROID
echo ========================================
echo.
echo Iniciando servidores para desarrollo Android...
echo.

REM Cerrar procesos en puertos 4000 y 8000
echo [1/4] Cerrando puertos ocupados...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo       ✓ Puertos liberados
echo.

REM Limpiar cache de Next.js
echo [2/4] Limpiando cache...
if exist ".next" (
    rmdir /s /q ".next" >nul 2>&1
    echo       ✓ Cache .next limpiado
) else (
    echo       ✓ No hay cache .next
)
echo.

REM Iniciar Backend Django
echo [3/4] Iniciando Backend Django...
cd backend
start "Backend Django" cmd /k "python manage.py runserver 0.0.0.0:8000"
timeout /t 3 /nobreak >nul
cd ..
echo       ✓ Backend corriendo en http://0.0.0.0:8000
echo       ✓ API disponible en http://10.87.23.237:8000/api
echo.

REM Iniciar Frontend Next.js
echo [4/4] Iniciando Frontend Next.js...
start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
echo       ✓ Frontend corriendo en http://localhost:4000
echo       ✓ App accesible en http://10.87.23.237:4000
echo.

echo ========================================
echo   ✅ SERVIDORES INICIADOS
echo ========================================
echo.
echo Configuracion para Android:
echo   Frontend: http://10.87.23.237:4000
echo   Backend:  http://10.87.23.237:8000/api
echo   MySQL:    localhost:3307
echo.
echo Firewall:
echo   ✓ Puerto 4000 permitido
echo   ✓ Puerto 8000 permitido
echo.
echo Credenciales de prueba:
echo   Usuario: molo
echo   Password: password123
echo.
echo La app en tu Xiaomi deberia funcionar ahora
echo.
pause

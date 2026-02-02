@echo off
title SOS Habilidoso - Modo USB (Funciona con Cualquier WiFi)
color 0A

echo ========================================
echo   SOS HABILIDOSO - MODO USB
echo ========================================
echo.
echo Este modo funciona con CUALQUIER red WiFi
echo Solo necesitas el cable USB conectado
echo.

REM Cerrar procesos en puertos 4000 y 8000
echo [1/5] Cerrando puertos ocupados...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo       ✓ Puertos liberados

REM Crear tuneles USB
echo.
echo [2/5] Creando tuneles USB...
if exist "%~dp0android\platform-tools\adb.exe" (
    "%~dp0android\platform-tools\adb.exe" reverse tcp:4000 tcp:4000
    "%~dp0android\platform-tools\adb.exe" reverse tcp:8000 tcp:8000
    echo       ✓ Tuneles creados (localhost:4000 y localhost:8000)
) else (
    echo       ❌ Error: No se encuentra adb.exe
    echo       Ubicacion esperada: android\platform-tools\adb.exe
    pause
    exit /b 1
)

REM Iniciar Backend
echo.
echo [3/5] Iniciando Backend Django...
cd backend
start "Backend Django" cmd /k "python manage.py runserver 0.0.0.0:8000"
timeout /t 3 /nobreak >nul
cd ..
echo       ✓ Backend corriendo en http://0.0.0.0:8000

REM Iniciar Frontend
echo.
echo [4/5] Iniciando Frontend Next.js...
start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
echo       ✓ Frontend corriendo en http://localhost:4000

REM Recargar app en Xiaomi
echo.
echo [5/5] Recargando app en Xiaomi...
if exist "%~dp0android\platform-tools\adb.exe" (
    "%~dp0android\platform-tools\adb.exe" shell am force-stop com.soshabilidoso.app
    timeout /t 1 /nobreak >nul
    "%~dp0android\platform-tools\adb.exe" shell pm clear com.soshabilidoso.app
    timeout /t 1 /nobreak >nul
    "%~dp0android\platform-tools\adb.exe" shell am start -n com.soshabilidoso.app/.MainActivity
    echo       ✓ App recargada
) else (
    echo       ⚠ No se pudo recargar la app automaticamente
    echo       Abre la app manualmente en tu Xiaomi
)

echo.
echo ========================================
echo   ✅ TODO LISTO - MODO USB ACTIVO
echo ========================================
echo.
echo La app ahora usa:
echo   Frontend: http://localhost:4000 (via USB)
echo   Backend:  http://localhost:8000 (via USB)
echo.
echo ✅ Funciona con CUALQUIER red WiFi
echo ✅ No necesitas actualizar la IP
echo ✅ Conexion estable via USB
echo.
echo Presiona cualquier tecla para abrir los logs...
pause >nul

REM Mostrar logs
if exist "%~dp0android\platform-tools\adb.exe" (
    "%~dp0android\platform-tools\adb.exe" logcat | findstr "chromium"
) else (
    echo No se pueden mostrar logs (adb.exe no encontrado)
    pause
)

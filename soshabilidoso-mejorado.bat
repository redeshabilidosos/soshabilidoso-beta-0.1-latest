@echo off
setlocal enabledelayedexpansion
title SOS Habilidoso - Desarrollo Completo
color 0A

REM Configurar rutas
set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB_PATH=%SCRCPY_PATH%\adb.exe
set APP_PACKAGE=com.soshabilidoso.app
set APP_ACTIVITY=.MainActivity

echo ========================================
echo   SOS Habilidoso - Desarrollo Completo
echo ========================================
echo.

REM NUEVO: Cerrar procesos existentes en puertos 4000 y 8000
echo [1/7] Liberando puertos...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do (
    if not "%%a"=="0" (
        taskkill /F /PID %%a >nul 2>&1
        echo    - Puerto 4000 liberado
    )
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    if not "%%a"=="0" (
        taskkill /F /PID %%a >nul 2>&1
        echo    - Puerto 8000 liberado
    )
)
echo ✅ Puertos listos
echo.

REM Verificar si Xiaomi esta conectado
echo [2/7] Verificando dispositivo Android...
"%ADB_PATH%" devices | findstr "device$" >nul
if %errorlevel% neq 0 (
    echo ⚠️  ADVERTENCIA: No se detecta dispositivo Android
    echo    Conecta tu Xiaomi por USB para usar scrcpy
    echo.
    set DEVICE_CONNECTED=0
) else (
    echo ✅ Dispositivo Android conectado
    set DEVICE_CONNECTED=1
)
echo.

REM Verificar si scrcpy ya esta corriendo
echo [3/7] Verificando scrcpy...
tasklist /FI "IMAGENAME eq scrcpy.exe" 2>NUL | find /I /N "scrcpy.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Scrcpy ya esta corriendo
    set SCRCPY_RUNNING=1
) else (
    echo ℹ️  Scrcpy no esta corriendo
    set SCRCPY_RUNNING=0
)
echo.

REM Iniciar Backend Django en todas las interfaces
echo [4/7] Iniciando Backend Django (puerto 8000)...
start "Django Backend" cmd /k "cd backend && venv312\Scripts\activate && python manage.py runserver 0.0.0.0:8000"
timeout /t 3 /nobreak >nul
echo ✅ Backend iniciado en 0.0.0.0:8000 (accesible desde red)
echo.

REM Iniciar Frontend Next.js
echo [5/7] Iniciando Frontend Next.js (puerto 4000)...
start "Next.js Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
echo ✅ Frontend iniciado
echo.

REM Esperar a que servidores esten listos
echo [6/7] Esperando que servidores inicien...
timeout /t 10 /nobreak >nul
echo ✅ Servidores listos
echo.

REM Abrir scrcpy y app si dispositivo esta conectado
if !DEVICE_CONNECTED!==1 (
    echo [7/7] Configurando Android...
    
    REM Abrir scrcpy solo si no esta corriendo
    if !SCRCPY_RUNNING!==0 (
        echo    - Abriendo scrcpy...
        start "Scrcpy" cmd /c "cd /d %SCRCPY_PATH% && scrcpy.exe --window-title "SOS Habilidoso" --window-width 400 --window-height 800 --stay-awake"
        timeout /t 3 /nobreak >nul
    )
    
    REM Abrir app en dispositivo
    echo    - Abriendo app en dispositivo...
    "%ADB_PATH%" shell am start -n %APP_PACKAGE%/%APP_ACTIVITY% >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ App abierta en dispositivo
    ) else (
        echo ⚠️  No se pudo abrir la app automaticamente
        echo    Abrela manualmente desde el dispositivo
    )
) else (
    echo [7/7] Saltando configuracion de Android (no hay dispositivo)
)
echo.

echo ========================================
echo   ✅ TODO LISTO - OPTIMIZADO
echo ========================================
echo.
echo 🌐 URLs:
echo    - Web: http://localhost:4000
echo    - Backend: http://127.0.0.1:8000
echo    - Android: http://192.168.78.173:4000
echo.
echo 📱 Credenciales:
echo    - Usuario: molo
echo    - Password: molo123
echo.
echo ⚡ OPTIMIZACIONES APLICADAS:
echo    - Particulas adaptativas (30/50/80)
echo    - Carga paralela del feed
echo    - Precarga inmediata
echo    - Navegacion optimizada
echo.
echo 🔥 Hot Reload:
echo    - Edita codigo y guarda (Ctrl+S)
echo    - Navegador: Actualiza automaticamente
echo    - Android: Cierra y abre la app
echo.
echo 💡 Comandos utiles:
echo    - Ver logs Android: adb logcat
echo    - Reiniciar app: adb shell am force-stop %APP_PACKAGE%
echo    - Abrir app: adb shell am start -n %APP_PACKAGE%/%APP_ACTIVITY%
echo.
echo ⚠️  Para detener: Cierra las ventanas de Backend y Frontend
echo.
pause

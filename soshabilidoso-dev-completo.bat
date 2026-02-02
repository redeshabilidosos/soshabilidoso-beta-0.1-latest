@echo off
title SOS Habilidoso - Desarrollo Completo con Hot Reload
color 0A

echo ========================================
echo   SOS Habilidoso - Desarrollo Completo
echo   Con Hot Reload Automatico
echo ========================================
echo.
echo Este script inicia:
echo 1. Backend Django (puerto 8000)
echo 2. Frontend Next.js (puerto 4000)
echo 3. Scrcpy (espejo de Xiaomi)
echo 4. Watcher para hot reload en Android
echo.
echo Presiona cualquier tecla para continuar...
pause >nul
cls

REM Configurar rutas
set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB_PATH=%SCRCPY_PATH%\adb.exe

echo ========================================
echo   PASO 1/4: Verificar Xiaomi conectado
echo ========================================
echo.
"%ADB_PATH%" devices
echo.
timeout /t 2 /nobreak >nul

echo ========================================
echo   PASO 2/4: Iniciar Servidores
echo ========================================
echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://192.168.78.173:4000
echo.

REM Iniciar Backend Django
start "Backend Django" cmd /k "cd backend && venv312\Scripts\activate && python manage.py runserver 127.0.0.1:8000"
timeout /t 3 /nobreak >nul

REM Iniciar Frontend Next.js
start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo Esperando que servidores inicien...
timeout /t 10 /nobreak >nul
echo.

echo ========================================
echo   PASO 3/4: Abrir Scrcpy
echo ========================================
echo.
echo Abriendo espejo de Xiaomi...
echo.

REM Iniciar Scrcpy en segundo plano
start "Scrcpy - SOS Habilidoso" cmd /c "cd /d %SCRCPY_PATH% && scrcpy.exe --window-title "SOS Habilidoso - Xiaomi" --window-width 400 --window-height 800 --stay-awake"
timeout /t 3 /nobreak >nul

echo ========================================
echo   PASO 4/4: Activar Hot Reload
echo ========================================
echo.
echo HOT RELOAD ACTIVO:
echo - Cambios en codigo se detectan automaticamente
echo - Next.js tiene hot reload nativo
echo - Para ver cambios en Android:
echo   * Cierra y abre la app (swipe up + tap)
echo   * O espera 2-3 segundos y refresca
echo.
echo CONTROLES SCRCPY:
echo - Ctrl+F: Pantalla completa
echo - Ctrl+O: Apagar pantalla del telefono
echo - Ctrl+R: Rotar pantalla
echo - Click derecho: Boton Atras
echo.
echo ========================================
echo   TODO LISTO - DESARROLLO ACTIVO
echo ========================================
echo.
echo Servidores corriendo:
echo - Backend: http://127.0.0.1:8000
echo - Frontend: http://192.168.78.173:4000
echo - Scrcpy: Ventana abierta
echo.
echo Para detener:
echo - Cierra esta ventana
echo - O presiona Ctrl+C
echo.
echo Presiona cualquier tecla para mantener ventanas abiertas...
pause >nul

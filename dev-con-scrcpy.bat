@echo off
title SOS Habilidoso - Desarrollo con Scrcpy
color 0A

echo ========================================
echo   SOS Habilidoso - Modo Desarrollo
echo   Con Scrcpy (Espejo de Xiaomi)
echo ========================================
echo.

REM Configurar rutas
set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB_PATH=%SCRCPY_PATH%\adb.exe

echo [1/4] Verificando dispositivo conectado...
"%ADB_PATH%" devices
echo.

echo [2/4] Iniciando servidores (Backend + Frontend)...
echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:4000
echo Xiaomi: http://192.168.78.173:4000
echo.

start "Backend Django" cmd /k "cd backend && venv312\Scripts\activate && python manage.py runserver 127.0.0.1:8000"
timeout /t 3 /nobreak >nul

start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo [3/4] Esperando que servidores inicien...
timeout /t 10 /nobreak >nul

echo [4/4] Iniciando Scrcpy (Espejo de Xiaomi)...
echo.
echo CONTROLES SCRCPY:
echo - Click: Interactuar con la app
echo - Ctrl+C: Copiar
echo - Ctrl+V: Pegar
echo - Ctrl+Shift+V: Pegar como texto
echo - Ctrl+O: Apagar pantalla
echo - Ctrl+P: Encender pantalla
echo - Ctrl+R: Rotar pantalla
echo - Ctrl+F: Pantalla completa
echo - Ctrl+G: Redimensionar ventana
echo.

cd /d "%SCRCPY_PATH%"
scrcpy.exe --window-title "SOS Habilidoso - Xiaomi" --window-width 400 --window-height 800 --stay-awake --turn-screen-off

echo.
echo Scrcpy cerrado.
pause

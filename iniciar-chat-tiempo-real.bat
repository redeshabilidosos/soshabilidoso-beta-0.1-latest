@echo off
title SOS-HABILIDOSO - Chat en Tiempo Real
color 0A

echo.
echo  ███████╗ ██████╗ ███████╗    ██╗  ██╗ █████╗ ██████╗ ██╗██╗     ██╗██████╗  ██████╗ ███████╗ ██████╗ 
echo  ██╔════╝██╔═══██╗██╔════╝    ██║  ██║██╔══██╗██╔══██╗██║██║     ██║██╔══██╗██╔═══██╗██╔════╝██╔═══██╗
echo  ███████╗██║   ██║███████╗    ███████║███████║██████╔╝██║██║     ██║██║  ██║██║   ██║███████╗██║   ██║
echo  ╚════██║██║   ██║╚════██║    ██╔══██║██╔══██║██╔══██╗██║██║     ██║██║  ██║██║   ██║╚════██║██║   ██║
echo  ███████║╚██████╔╝███████║    ██║  ██║██║  ██║██████╔╝██║███████╗██║██████╔╝╚██████╔╝███████║╚██████╔╝
echo  ╚══════╝ ╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚══════╝╚═╝╚═════╝  ╚═════╝ ╚══════╝ ╚═════╝ 
echo.
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo                              CHAT EN TIEMPO REAL - INICIO RAPIDO
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo.

REM Verificar que estamos en el directorio correcto
if not exist "backend" (
    echo ERROR: No se encuentra el directorio backend
    echo Asegurate de ejecutar este script desde la raiz del proyecto
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ERROR: No se encuentra package.json
    echo Asegurate de ejecutar este script desde la raiz del proyecto
    pause
    exit /b 1
)

echo [1/5] Verificando Redis...
echo.
cd backend
python test_redis_connection.py
if errorlevel 1 (
    echo.
    echo ========================================
    echo  NOTA: Redis no esta disponible
    echo ========================================
    echo.
    echo El sistema funcionara con InMemoryChannelLayer
    echo Esto es PERFECTO para desarrollo local.
    echo.
    echo Si quieres instalar Redis para produccion:
    echo   cd backend
    echo   install_redis_windows.bat
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
)

echo.
echo [2/5] Iniciando Backend con WebSocket...
echo.
start "Backend - Django + WebSocket" cmd /k "cd /d %CD% && daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application"

REM Esperar a que el backend inicie
echo Esperando a que el backend inicie...
timeout /t 5 >nul

cd ..

echo.
echo [3/5] Verificando dependencias del Frontend...
echo.
if not exist "node_modules" (
    echo Instalando dependencias de Node.js...
    call npm install
)

echo.
echo [4/5] Iniciando Frontend...
echo.
start "Frontend - Next.js" cmd /k "npm run dev"

REM Esperar a que el frontend inicie
echo Esperando a que el frontend inicie...
timeout /t 5 >nul

echo.
echo [5/5] Abriendo navegador...
echo.
timeout /t 3 >nul
start http://localhost:4000/messages

echo.
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo                                    SISTEMA INICIADO CORRECTAMENTE
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo.
echo  Backend (WebSocket):  http://127.0.0.1:8000
echo  Frontend:             http://localhost:4000
echo  Chat:                 http://localhost:4000/messages
echo.
echo  WebSocket URL:        ws://127.0.0.1:8000/ws/chat/{chat_id}/?token={jwt}
echo.
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo.
echo  INSTRUCCIONES:
echo.
echo  1. Inicia sesion en la aplicacion
echo  2. Ve a la seccion de Mensajes (/messages)
echo  3. Selecciona un chat
echo  4. Empieza a escribir - veras el indicador "esta escribiendo"
echo  5. Envia mensajes - llegaran instantaneamente
echo.
echo  Para detener los servidores:
echo  - Cierra las ventanas de Backend y Frontend
echo  - O presiona Ctrl+C en cada ventana
echo.
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo.
echo  Presiona cualquier tecla para abrir la documentacion completa...
pause >nul

start WEBSOCKET_IMPLEMENTACION_COMPLETA.md

echo.
echo  Gracias por usar SOS-HABILIDOSO!
echo.
timeout /t 3 >nul

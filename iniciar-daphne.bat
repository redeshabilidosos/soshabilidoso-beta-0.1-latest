@echo off
echo ========================================
echo   INICIANDO SERVIDOR CON DAPHNE
echo   (Soporte WebSocket en Tiempo Real)
echo ========================================
echo.

cd backend

echo [1/2] Verificando configuracion WebSocket...
python verificar_websocket_completo.py
if errorlevel 1 (
    echo.
    echo ERROR: Configuracion WebSocket incompleta
    pause
    exit /b 1
)

echo.
echo [2/2] Iniciando Daphne en puerto 8000...
echo.
echo WebSocket Chat: ws://127.0.0.1:8000/ws/chat/^<chat_id^>/?token=^<token^>
echo WebSocket Notifications: ws://127.0.0.1:8000/ws/notifications/?token=^<token^>
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application

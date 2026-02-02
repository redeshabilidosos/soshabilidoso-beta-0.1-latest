@echo off
echo ========================================
echo  INICIANDO SERVIDOR CON WEBSOCKETS
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando Redis...
python test_redis_connection.py
if errorlevel 1 (
    echo.
    echo ========================================
    echo  NOTA: Redis no esta disponible
    echo ========================================
    echo.
    echo El servidor usara InMemoryChannelLayer
    echo Esto funciona perfectamente para desarrollo.
    echo.
    echo Para instalar Redis (opcional):
    echo   install_redis_windows.bat
    echo.
    timeout /t 3 >nul
)

echo.
echo Iniciando servidor con Daphne...
echo URL: http://127.0.0.1:8000
echo WebSocket: ws://127.0.0.1:8000/ws/
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application

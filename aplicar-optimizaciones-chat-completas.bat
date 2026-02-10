@echo off
echo ========================================
echo  APLICANDO OPTIMIZACIONES DE CHAT
echo  Tiempo Real Instantaneo
echo ========================================
echo.

echo [1/3] Deteniendo procesos...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Iniciando backend con Daphne...
cd backend
start "Backend Django (Daphne)" cmd /k "venv312\Scripts\python.exe -m daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application"
cd ..
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Iniciando frontend Next.js...
start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  OPTIMIZACIONES APLICADAS
echo ========================================
echo.
echo  Backend: http://127.0.0.1:8000
echo  Frontend: http://localhost:4000
echo  WebSocket: ws://127.0.0.1:8000/ws/chat/
echo.
echo  MEJORAS IMPLEMENTADAS:
echo  - Optimistic updates (envio instantaneo)
echo  - Polling inteligente (2s en lugar de 500ms)
echo  - WebSocket con autenticacion simplificada
echo  - Reconexion automatica
echo  - Reduccion de peticiones HTTP 75%%
echo.
echo  METRICAS OBJETIVO:
echo  - Envio: ^< 50ms
echo  - Recepcion: ^< 200ms
echo  - Peticiones: ~30/min
echo.
echo ========================================
echo  Presiona cualquier tecla para salir
echo ========================================
pause >nul

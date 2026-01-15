@echo off
echo Iniciando servidores de desarrollo...

REM Crear ventanas separadas para cada servidor
echo Iniciando Django backend...
start "Django Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver 8000"

echo Esperando 3 segundos...
timeout /t 3 /nobreak > nul

echo Iniciando Next.js frontend...
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo Servidores iniciados:
echo - Django: http://localhost:8000
echo - Next.js: http://localhost:4000
echo.
echo Presiona cualquier tecla para salir...
pause > nul
@echo off
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    SOS-HABILIDOSO                            ║
echo ║                 Sistema de Mensajería                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🚀 INICIANDO APLICACIÓN...
echo.
echo 📋 CONFIGURACIÓN DE SERVICIOS:
echo    🔧 Backend Django:  http://127.0.0.1:8000
echo    🌐 Frontend Next.js: http://localhost:4000
echo    🗄️  Base de Datos:   PostgreSQL
echo.
echo 📖 ENDPOINTS DISPONIBLES:
echo    🔗 API:             http://127.0.0.1:8000/api/
echo    👤 Usuarios:        http://127.0.0.1:8000/api/users/
echo    💬 Mensajería:      http://127.0.0.1:8000/api/messaging/
echo    📝 Posts:           http://127.0.0.1:8000/api/posts/
echo    🔐 Admin:           http://127.0.0.1:8000/admin/
echo.
echo ⚡ INICIANDO SERVICIOS...
echo.

REM Crear ventanas separadas para cada servicio
start "🔧 Django Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && python manage.py runserver 8000"

REM Esperar un momento para que el backend inicie
timeout /t 3 /nobreak >nul

start "🌐 Next.js Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo ✅ Servicios iniciados en ventanas separadas
echo.
echo 📖 URLs disponibles:
echo - Frontend: http://localhost:4000
echo - Backend API: http://127.0.0.1:8000/api/
echo - Admin Django: http://127.0.0.1:8000/admin/
echo.
echo 💡 Para detener los servicios, cierra las ventanas correspondientes
pause
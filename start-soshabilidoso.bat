@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              🚀 SOS-HABILIDOSO 🚀                      ║
echo ║         La Red Social de las Habilidades               ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/3] 🗄️  Verificando MySQL en puerto 3307...
netstat -ano | findstr :3307 >nul
if %errorlevel% == 0 (
    echo    ✓ MySQL está corriendo en puerto 3307
) else (
    echo    ⚠️  MySQL no detectado en puerto 3307
    echo    💡 Asegúrate de que MariaDB/XAMPP esté corriendo
)
echo.

echo [2/3] 🐍 Iniciando Backend Django...
echo    Puerto: 8000
echo    Base de datos: habilidosos_clean (MySQL)
echo.

echo [3/3] ⚛️  Iniciando Frontend Next.js...
echo    Puerto: 4000
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ INICIANDO SERVICIOS...                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Usar concurrently para ejecutar ambos servicios
npx concurrently --kill-others-on-fail --names "🐍Django,⚛️Next.js" --prefix-colors "blue,green" "cd backend && venv312\Scripts\python.exe manage.py runserver 127.0.0.1:8000" "next dev -p 4000"

pause
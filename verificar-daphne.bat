@echo off
echo.
echo ========================================
echo   VERIFICACION DAPHNE + WEBSOCKETS
echo ========================================
echo.

echo [1/4] Verificando PyMySQL instalado...
cd backend
call venv312\Scripts\activate.bat
python -c "import pymysql; print('✓ PyMySQL instalado:', pymysql.__version__)" 2>nul
if errorlevel 1 (
    echo ❌ PyMySQL no encontrado
    echo Instalando PyMySQL...
    pip install pymysql
) else (
    echo ✓ PyMySQL OK
)
echo.

echo [2/4] Verificando Daphne instalado...
python -c "import daphne; print('✓ Daphne instalado:', daphne.__version__)" 2>nul
if errorlevel 1 (
    echo ❌ Daphne no encontrado
    echo Instalando Daphne...
    pip install daphne
) else (
    echo ✓ Daphne OK
)
echo.

echo [3/4] Verificando configuracion ASGI...
python -c "from sos_habilidoso.asgi import application; print('✓ ASGI configurado correctamente')" 2>nul
if errorlevel 1 (
    echo ❌ Error en configuracion ASGI
    echo Revisa backend/sos_habilidoso/asgi.py
    pause
    exit /b 1
) else (
    echo ✓ ASGI OK
)
echo.

echo [4/4] Verificando MySQL en puerto 3307...
netstat -ano | findstr :3307 >nul
if errorlevel 1 (
    echo ⚠️  MySQL no detectado en puerto 3307
    echo    Asegurate de iniciar MariaDB
) else (
    echo ✓ MySQL corriendo en puerto 3307
)
echo.

echo ========================================
echo   VERIFICACION COMPLETADA
echo ========================================
echo.
echo Todo listo para iniciar con:
echo   npm run soshabilidoso
echo.
echo O manualmente:
echo   cd backend
echo   python -m daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application
echo.
pause

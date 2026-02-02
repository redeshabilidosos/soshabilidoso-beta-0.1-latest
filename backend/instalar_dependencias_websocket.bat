@echo off
echo ========================================
echo  INSTALACION DE DEPENDENCIAS WEBSOCKET
echo ========================================
echo.

cd /d "%~dp0"

echo Activando entorno virtual...
if exist "venv312\Scripts\activate.bat" (
    call venv312\Scripts\activate.bat
    echo Entorno virtual activado: venv312
) else if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo Entorno virtual activado: venv
) else (
    echo ADVERTENCIA: No se encontro entorno virtual
    echo Instalando en el Python global...
)

echo.
echo Instalando dependencias de WebSocket...
echo.

pip install channels==4.0.0
pip install channels-redis==4.1.0
pip install daphne==4.0.0
pip install redis==5.0.1
pip install websockets

echo.
echo ========================================
echo  INSTALACION COMPLETADA
echo ========================================
echo.

echo Verificando instalacion...
python test_redis_connection.py

echo.
pause

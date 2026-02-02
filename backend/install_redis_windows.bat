@echo off
echo ========================================
echo  INSTALACION DE REDIS PARA WINDOWS
echo ========================================
echo.

echo Este script te ayudara a instalar Redis en Windows
echo.
echo OPCIONES:
echo.
echo 1. Descargar Redis para Windows (GitHub)
echo 2. Usar Redis en WSL (Windows Subsystem for Linux)
echo 3. Usar Docker para Redis
echo 4. Salir
echo.

set /p option="Selecciona una opcion (1-4): "

if "%option%"=="1" goto download_redis
if "%option%"=="2" goto wsl_redis
if "%option%"=="3" goto docker_redis
if "%option%"=="4" goto end

:download_redis
echo.
echo ========================================
echo  OPCION 1: Descargar Redis para Windows
echo ========================================
echo.
echo Abriendo navegador para descargar Redis...
echo.
echo URL: https://github.com/microsoftarchive/redis/releases
echo.
echo Pasos:
echo 1. Descarga Redis-x64-3.0.504.msi
echo 2. Ejecuta el instalador
echo 3. Acepta las opciones por defecto
echo 4. Redis se instalara como servicio de Windows
echo 5. Vuelve a ejecutar este script para verificar
echo.
start https://github.com/microsoftarchive/redis/releases
pause
goto end

:wsl_redis
echo.
echo ========================================
echo  OPCION 2: Redis en WSL
echo ========================================
echo.
echo Verificando si WSL esta instalado...
wsl --list >nul 2>&1
if errorlevel 1 (
    echo.
    echo WSL no esta instalado.
    echo.
    echo Para instalar WSL:
    echo 1. Abre PowerShell como Administrador
    echo 2. Ejecuta: wsl --install
    echo 3. Reinicia tu computadora
    echo 4. Vuelve a ejecutar este script
    echo.
    pause
    goto end
)

echo.
echo WSL esta instalado. Instalando Redis...
echo.
wsl sudo apt-get update
wsl sudo apt-get install -y redis-server
echo.
echo Redis instalado en WSL!
echo.
echo Para iniciar Redis:
echo   wsl sudo service redis-server start
echo.
echo Para verificar:
echo   wsl redis-cli ping
echo.
pause
goto end

:docker_redis
echo.
echo ========================================
echo  OPCION 3: Redis con Docker
echo ========================================
echo.
echo Verificando si Docker esta instalado...
docker --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo Docker no esta instalado.
    echo.
    echo Para instalar Docker Desktop:
    echo 1. Visita: https://www.docker.com/products/docker-desktop
    echo 2. Descarga e instala Docker Desktop
    echo 3. Reinicia tu computadora
    echo 4. Vuelve a ejecutar este script
    echo.
    start https://www.docker.com/products/docker-desktop
    pause
    goto end
)

echo.
echo Docker esta instalado. Iniciando Redis...
echo.
docker run -d -p 6379:6379 --name redis-soshabilidoso redis:latest
echo.
echo Redis iniciado en Docker!
echo.
echo Para detener Redis:
echo   docker stop redis-soshabilidoso
echo.
echo Para iniciar Redis:
echo   docker start redis-soshabilidoso
echo.
pause
goto end

:end
echo.
echo ========================================
echo  VERIFICACION DE REDIS
echo ========================================
echo.
echo Verificando conexion a Redis...
python test_redis_connection.py
echo.
pause

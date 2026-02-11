@echo off
echo ========================================
echo   OPTIMIZACION AGRESIVA DE COMPILACION
echo ========================================
echo.

echo [1/5] Deteniendo servidor si esta corriendo...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✓ Servidor detenido

echo.
echo [2/5] Eliminando carpeta .next...
if exist .next (
    rmdir /s /q .next
    echo ✓ Carpeta .next eliminada
) else (
    echo ✓ Carpeta .next no existe
)

echo.
echo [3/5] Eliminando cache de node_modules...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ Cache eliminada
) else (
    echo ✓ Cache no existe
)

echo.
echo [4/5] Limpiando cache de npm...
call npm cache clean --force
echo ✓ Cache de npm limpiada

echo.
echo [5/5] Configurando variables de entorno...
set NODE_OPTIONS=--max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
echo ✓ Variables configuradas

echo.
echo ========================================
echo   OPTIMIZACION COMPLETADA
echo ========================================
echo.
echo Iniciando servidor optimizado...
echo.

npm run dev

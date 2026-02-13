@echo off
echo ========================================
echo BUILD PARA PRODUCCION
echo ========================================
echo.
echo Este script construye la aplicacion para produccion
echo.

REM Limpiar cache anterior
echo Limpiando cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Hacer el build
echo.
echo Construyendo aplicacion...
call npm run build

REM Verificar que el build se completo
if exist .next\BUILD_ID (
    echo.
    echo ========================================
    echo BUILD COMPLETADO EXITOSAMENTE
    echo ========================================
    echo.
    echo El archivo .next\BUILD_ID existe
    dir .next\BUILD_ID
    echo.
    echo Ahora puedes:
    echo 1. Subir los cambios al VPS: git push origin main
    echo 2. En el VPS ejecutar: git pull ^&^& npm run build
    echo 3. Reiniciar el frontend: pm2 restart soshabilidoso-frontend
) else (
    echo.
    echo ========================================
    echo BUILD FALLO
    echo ========================================
    echo.
    echo El archivo .next\BUILD_ID NO existe
    echo Revisa los errores arriba
)

echo.
pause

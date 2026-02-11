@echo off
echo ========================================
echo   LIMPIANDO CACHE DE NEXT.JS
echo ========================================
echo.

echo [1/3] Eliminando carpeta .next...
if exist .next (
    rmdir /s /q .next
    echo ✓ Carpeta .next eliminada
) else (
    echo ✓ Carpeta .next no existe
)

echo.
echo [2/3] Eliminando node_modules/.cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ Cache de node_modules eliminada
) else (
    echo ✓ Cache de node_modules no existe
)

echo.
echo [3/3] Limpiando cache de npm...
call npm cache clean --force
echo ✓ Cache de npm limpiada

echo.
echo ========================================
echo   CACHE LIMPIADA EXITOSAMENTE
echo ========================================
echo.
echo Ahora ejecuta: npm run dev
echo.
pause

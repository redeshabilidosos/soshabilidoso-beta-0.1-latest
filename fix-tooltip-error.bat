@echo off
echo.
echo ========================================
echo   SOLUCION: Error de Tooltip
echo ========================================
echo.

echo [1/3] Eliminando node_modules y cache...
if exist node_modules (
    echo Eliminando node_modules...
    rmdir /s /q node_modules
)

if exist .next (
    echo Eliminando cache de Next.js...
    rmdir /s /q .next
)

echo.
echo [2/3] Instalando dependencias...
call npm install

echo.
echo [3/3] Verificando instalacion...
echo.

if exist node_modules\@radix-ui\react-tooltip (
    echo ✓ @radix-ui/react-tooltip instalado correctamente
) else (
    echo ❌ Error: @radix-ui/react-tooltip no se instalo
    echo.
    echo Intentando instalacion manual...
    call npm install @radix-ui/react-tooltip@^1.1.2
)

echo.
echo ========================================
echo   SOLUCION COMPLETADA
echo ========================================
echo.
echo Ahora ejecuta:
echo   npm run soshabilidoso
echo.
pause

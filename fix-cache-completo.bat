@echo off
echo ========================================
echo   LIMPIEZA COMPLETA DE CACHE
echo   Soluciona errores en /feed, /profile, etc.
echo ========================================
echo.

echo [1/5] Deteniendo todos los procesos de Node.js...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✓ Procesos detenidos

echo.
echo [2/5] Limpiando cache de Next.js (.next)...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ Cache .next eliminado
) else (
    echo ✓ No hay cache .next
)

echo.
echo [3/5] Limpiando cache de node_modules...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✓ Cache node_modules eliminado
) else (
    echo ✓ No hay cache node_modules
)

echo.
echo [4/5] Limpiando archivos temporales...
if exist ".swc" (
    rmdir /s /q ".swc"
    echo ✓ Cache .swc eliminado
) else (
    echo ✓ No hay cache .swc
)

echo.
echo [5/5] Iniciando servidor limpio...
echo.
echo ========================================
echo   CACHE LIMPIADO EXITOSAMENTE
echo ========================================
echo.
echo El servidor se iniciara en una nueva ventana
echo Espera 15-20 segundos para que compile...
echo.
echo Luego podras acceder a:
echo   - http://localhost:4000/feed
echo   - http://localhost:4000/profile
echo   - http://localhost:4000/messages
echo   - Cualquier otra pagina
echo.
start cmd /k "npm run dev"

echo.
echo Servidor iniciando...
echo.
pause

@echo off
echo ========================================
echo   SOLUCIONANDO ERROR DE PERFIL
echo   - Reinstalando dependencias de Radix UI
echo   - Limpiando cache de Next.js
echo ========================================
echo.

echo [1/4] Deteniendo procesos de Node.js...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/4] Limpiando cache de Next.js...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ Cache eliminado
) else (
    echo ✓ No hay cache para eliminar
)

echo.
echo [3/4] Reinstalando dependencias de Radix UI...
call npm install @radix-ui/react-tabs@^1.1.13 --force
echo ✓ Dependencias reinstaladas

echo.
echo [4/4] Iniciando servidor...
echo.
echo ========================================
echo   SOLUCION APLICADA
echo ========================================
echo.
echo El servidor se iniciara en una nueva ventana
echo Espera 10-15 segundos para que compile...
echo.
start cmd /k "npm run dev"

echo.
echo Luego abre: http://localhost:4000/profile
echo.
pause

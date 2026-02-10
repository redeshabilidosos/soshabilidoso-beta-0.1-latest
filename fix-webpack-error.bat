@echo off
echo ========================================
echo Solucionando error de webpack en /feed
echo ========================================
echo.

echo [1/4] Deteniendo procesos de Next.js...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Limpiando cache de Next.js...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [3/4] Limpiando cache de npm...
call npm cache clean --force

echo [4/4] Reconstruyendo la aplicacion...
call npm run build

echo.
echo ========================================
echo Limpieza completada!
echo Ahora ejecuta: npm run dev
echo ========================================
pause

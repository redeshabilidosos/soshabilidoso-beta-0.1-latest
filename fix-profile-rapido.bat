@echo off
echo ========================================
echo   FIX RAPIDO - ERROR DE PERFIL
echo ========================================
echo.

echo [1/3] Deteniendo servidor...
taskkill /F /IM node.exe 2>nul
timeout /t 1 /nobreak >nul

echo.
echo [2/3] Limpiando cache...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
echo ✓ Cache limpiado

echo.
echo [3/3] Reiniciando servidor...
start cmd /k "npm run dev"

echo.
echo ========================================
echo   LISTO
echo ========================================
echo.
echo Espera 15 segundos y abre:
echo http://localhost:4000/profile
echo.
pause

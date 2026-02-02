@echo off
title Reparar Radix UI Completo
color 0A

echo ========================================
echo   REPARACION COMPLETA RADIX UI
echo ========================================
echo.
echo Este proceso puede tardar 2-3 minutos
echo.
pause

REM Cerrar Node
echo [1/6] Cerrando procesos Node...
taskkill /F /IM node.exe >nul 2>&1
echo       ✓ Node cerrado

REM Eliminar cache y node_modules
echo.
echo [2/6] Eliminando cache y node_modules...
if exist ".next" rmdir /s /q ".next"
if exist ".swc" rmdir /s /q ".swc"
if exist "node_modules" rmdir /s /q "node_modules"
echo       ✓ Cache eliminado

REM Limpiar npm cache
echo.
echo [3/6] Limpiando npm cache...
call npm cache clean --force
echo       ✓ NPM cache limpio

REM Reinstalar dependencias
echo.
echo [4/6] Reinstalando dependencias (esto tarda)...
call npm install
echo       ✓ Dependencias instaladas

REM Limpiar cache de nuevo
echo.
echo [5/6] Limpiando cache final...
if exist ".next" rmdir /s /q ".next"
if exist ".swc" rmdir /s /q ".swc"
echo       ✓ Cache limpio

REM Iniciar servidor
echo.
echo [6/6] Iniciando servidor...
start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
echo       ✓ Servidor iniciado

echo.
echo ========================================
echo   ✅ REPARACION COMPLETA
echo ========================================
echo.
echo El servidor deberia estar corriendo sin errores
echo Prueba abrir: http://localhost:4000
echo.
pause

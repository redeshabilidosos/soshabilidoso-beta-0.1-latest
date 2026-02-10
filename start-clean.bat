@echo off
echo ========================================
echo   INICIO LIMPIO - SOS HABILIDOSO
echo ========================================
echo.

echo Limpiando cache...
if exist ".next" rmdir /s /q ".next" 2>nul
echo ✓ Cache limpiado

echo.
echo Iniciando servidor...
npm run dev

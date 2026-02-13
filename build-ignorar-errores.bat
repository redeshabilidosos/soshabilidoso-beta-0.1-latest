@echo off
echo ========================================
echo BUILD RAPIDO - IGNORANDO ERRORES TS
echo ========================================
echo.
echo ADVERTENCIA: Este build ignora errores de TypeScript
echo Solo usar para despliegue de emergencia
echo.

REM Hacer backup del config original
copy /Y next.config.js next.config.js.backup

REM Usar el config que ignora errores
copy /Y next.config.build-rapido.js next.config.js

REM Hacer el build
echo Construyendo aplicacion...
call npm run build

REM Restaurar el config original
copy /Y next.config.js.backup next.config.js
del next.config.js.backup

echo.
echo ========================================
echo BUILD COMPLETADO
echo ========================================
echo.
echo Verifica que existe .next\BUILD_ID:
dir .next\BUILD_ID

pause

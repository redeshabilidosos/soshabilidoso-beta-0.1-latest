@echo off
echo ========================================
echo   Actualizar IP Rapido
echo ========================================
echo.

REM Mostrar IP actual
echo Tu IP actual es:
ipconfig | findstr "IPv4"
echo.

REM Pedir nueva IP
set /p NUEVA_IP="Ingresa la IP de tu WiFi (ejemplo: 192.168.1.100): "

echo.
echo Actualizando capacitor.config.ts...

REM Crear archivo temporal con la nueva configuracion
powershell -Command "(Get-Content capacitor.config.ts) -replace 'url: ''http://.*:4000''', 'url: ''http://%NUEVA_IP%:4000''' | Set-Content capacitor.config.ts"

echo ✓ IP actualizada a: %NUEVA_IP%
echo.

echo Sincronizando con Android...
call npx cap sync android

echo.
echo ========================================
echo   ✅ Listo!
echo ========================================
echo.
echo Ahora recarga la app en tu Xiaomi
echo.
pause

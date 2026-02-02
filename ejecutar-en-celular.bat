@echo off
echo ========================================
echo   EJECUTAR SOS HABILIDOSO EN CELULAR
echo ========================================
echo.
echo Tu IP: 192.168.78.173
echo Puerto: 4000
echo.
echo PASO 1: Asegurate que tu celular este conectado por USB
echo PASO 2: Asegurate que "Depuracion USB" este habilitada
echo PASO 3: Asegurate que backend y frontend esten corriendo
echo.
echo Presiona cualquier tecla para continuar...
pause > nul

echo.
echo [1/2] Sincronizando con Android...
call npx cap sync android

echo.
echo [2/2] Ejecutando en tu celular...
echo.
echo NOTA: Si es la primera vez, puede tardar unos minutos
echo       mientras se instala la app en tu dispositivo.
echo.
call npx cap run android

echo.
echo ========================================
echo   LISTO!
echo ========================================
echo.
echo La app deberia estar corriendo en tu celular.
echo Si ves errores, verifica que:
echo   1. Backend este corriendo (puerto 8000)
echo   2. Frontend este corriendo (puerto 4000)
echo   3. Tu celular este en la misma red WiFi
echo.
pause

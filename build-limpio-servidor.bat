@echo off
echo ========================================
echo BUILD LIMPIO EN SERVIDOR LINUX
echo ========================================
echo.

set SERVER_IP=76.13.122.81
set SERVER_USER=root
set SERVER_PATH=/var/www/soshabilidoso

echo [1/5] Subiendo archivo .env.local al servidor...
scp .env.local %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/.env.local
if errorlevel 1 (
    echo ERROR: No se pudo subir .env.local
    pause
    exit /b 1
)
echo OK - .env.local subido

echo.
echo [2/5] Conectando al servidor para hacer build limpio...
echo.

plink -batch -pw "9C3BbsJp+90(Zz)g4o'u" %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH% && echo '=== LIMPIANDO ARCHIVOS ANTIGUOS ===' && rm -rf .next node_modules package-lock.json && echo '=== INSTALANDO DEPENDENCIAS (puede tardar 2-3 minutos) ===' && npm install --force && echo '=== CONSTRUYENDO APLICACION (puede tardar 3-5 minutos) ===' && npm run build && echo '=== REINICIANDO PM2 ===' && pm2 restart all --update-env && echo '=== VERIFICANDO ESTADO ===' && pm2 status && sleep 3 && curl -I http://localhost:3000"

echo.
echo ========================================
echo PROCESO COMPLETADO
echo ========================================
echo.
echo Verifica que el curl muestre HTTP/1.1 200 OK
echo Si muestra 500, revisa los logs con:
echo plink -batch -pw "9C3BbsJp+90(Zz)g4o'u" %SERVER_USER%@%SERVER_IP% "pm2 logs soshabilidoso-frontend --lines 30"
echo.
pause

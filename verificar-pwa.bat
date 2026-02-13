@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    VERIFICACION PWA - SOS HABILIDOSO
echo ========================================
echo.

echo [1/5] Verificando manifest.json...
if exist "public\manifest.json" (
    echo    ✓ manifest.json existe
    findstr /C:"start_url" public\manifest.json
) else (
    echo    ✗ manifest.json NO encontrado
)
echo.

echo [2/5] Verificando index.html...
if exist "public\index.html" (
    echo    ✓ index.html existe
    findstr /C:"manifest.json" public\index.html >nul && echo    ✓ Referencia a manifest.json encontrada || echo    ✗ NO tiene referencia a manifest.json
    findstr /C:"landing-script.js" public\index.html >nul && echo    ✓ Script landing-script.js cargado || echo    ✗ Script NO cargado
) else (
    echo    ✗ index.html NO encontrado
)
echo.

echo [3/5] Verificando landing-script.js...
if exist "public\landing-script.js" (
    echo    ✓ landing-script.js existe
    findstr /C:"beforeinstallprompt" public\landing-script.js >nul && echo    ✓ Funcionalidad PWA implementada || echo    ✗ Funcionalidad PWA NO encontrada
) else (
    echo    ✗ landing-script.js NO encontrado
)
echo.

echo [4/5] Verificando iconos PWA...
if exist "public\icon512_rounded.png" (echo    ✓ icon512_rounded.png) else (echo    ✗ icon512_rounded.png NO encontrado)
if exist "public\icon512_maskable.png" (echo    ✓ icon512_maskable.png) else (echo    ✗ icon512_maskable.png NO encontrado)
if exist "public\logo-favicon.png" (echo    ✓ logo-favicon.png) else (echo    ✗ logo-favicon.png NO encontrado)
if exist "public\apple-touch-icon.png" (echo    ✓ apple-touch-icon.png) else (echo    ✗ apple-touch-icon.png NO encontrado)
echo.

echo [5/5] Verificando service worker...
if exist "public\sw.js" (echo    ✓ sw.js existe) else (echo    ✗ sw.js NO encontrado)
echo.

echo ========================================
echo              RESUMEN
echo ========================================
echo.
echo Landing Page: http://localhost:4000/index.html
echo PWA Start URL: /login
echo Manifest: /manifest.json
echo.
echo IMPORTANTE:
echo - Dominio muestra: index.html (landing page)
echo - App instalada inicia: /login (autenticación)
echo.
echo ========================================
echo         INSTRUCCIONES DE PRUEBA
echo ========================================
echo.
echo 1. Abre Chrome o Edge
echo 2. Ve a: http://localhost:4000/index.html
echo 3. Haz clic en cualquier botón "Descargar App"
echo 4. Acepta el prompt de instalación
echo 5. La app se instalará en tu dispositivo
echo 6. Abre la app instalada
echo 7. La app iniciará desde /login (NO desde index.html)
echo.
echo IMPORTANTE:
echo - index.html es SOLO la landing page del dominio
echo - La app instalada SIEMPRE inicia en /login
echo - La landing page NO se muestra en la app instalada
echo.
echo NOTA: Para que funcione, el servidor debe estar corriendo
echo       Ejecuta: npm run dev
echo.
pause

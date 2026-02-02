@echo off
title Push Version 0.3 - SOS-HABILIDOSO
color 0A

echo.
echo  ███████╗ ██████╗ ███████╗    ██╗  ██╗ █████╗ ██████╗ ██╗██╗     ██╗██████╗  ██████╗ ███████╗ ██████╗ 
echo  ██╔════╝██╔═══██╗██╔════╝    ██║  ██║██╔══██╗██╔══██╗██║██║     ██║██╔══██╗██╔═══██╗██╔════╝██╔═══██╗
echo  ███████╗██║   ██║███████╗    ███████║███████║██████╔╝██║██║     ██║██║  ██║██║   ██║███████╗██║   ██║
echo  ╚════██║██║   ██║╚════██║    ██╔══██║██╔══██║██╔══██╗██║██║     ██║██║  ██║██║   ██║╚════██║██║   ██║
echo  ███████║╚██████╔╝███████║    ██║  ██║██║  ██║██████╔╝██║███████╗██║██████╔╝╚██████╔╝███████║╚██████╔╝
echo  ╚══════╝ ╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚══════╝╚═╝╚═════╝  ╚═════╝ ╚══════╝ ╚═════╝ 
echo.
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo                                    PUSH VERSION 0.3 AL REPOSITORIO
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo.

REM Verificar que estamos en el directorio correcto
if not exist ".git" (
    echo ERROR: No se encuentra el directorio .git
    echo Asegurate de ejecutar este script desde la raiz del proyecto
    pause
    exit /b 1
)

echo [1/6] Verificando estado del repositorio...
echo.
git status
echo.

echo [2/6] Agregando archivos al staging area...
echo.
git add .
echo.

echo [3/6] Creando commit con mensaje descriptivo...
echo.
git commit -m "feat: Version 0.3 - Chat en Tiempo Real, Sonidos y Optimizaciones

✨ Nuevas Funcionalidades:
- Chat en tiempo real con WebSocket (tipo Messenger)
- Indicador 'está escribiendo...' en tiempo real
- Sistema de sonidos de notificación
- Optimizaciones de UI/UX en comunidades y configuración

🔧 Mejoras Técnicas:
- Django Channels configurado
- WebSocket con reconexión automática
- Hook personalizado de sonidos
- Componentes memoizados para mejor rendimiento

📚 Documentación:
- 25 nuevos documentos de guías y tutoriales
- Presentación de negocios completa
- Guías de inicio rápido
- Documentación técnica detallada

🐛 Correcciones:
- Variables duplicadas en ChatWindow
- Nombres de archivos de sonido actualizados
- Mejoras en manejo de errores

Ver CHANGELOG_v0.3.md para detalles completos."
echo.

echo [4/6] Verificando remote del repositorio...
echo.
git remote -v
echo.

echo [5/6] Haciendo push al repositorio...
echo.
echo Repositorio: https://github.com/redeshabilidosos/soshabilidoso-beta-0.1-latest
echo Branch: main
echo.

REM Intentar push
git push origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo  ERROR AL HACER PUSH
    echo ========================================
    echo.
    echo Posibles causas:
    echo 1. No tienes permisos en el repositorio
    echo 2. Necesitas autenticarte con GitHub
    echo 3. Hay conflictos con el repositorio remoto
    echo 4. No estas en la rama correcta
    echo.
    echo Soluciones:
    echo 1. Verifica tus credenciales de GitHub
    echo 2. Ejecuta: git pull origin main
    echo 3. Resuelve conflictos si los hay
    echo 4. Intenta de nuevo
    echo.
    pause
    exit /b 1
)

echo.
echo [6/6] Creando tag para la version...
echo.
git tag -a v0.3 -m "Version 0.3 - Chat en Tiempo Real y Optimizaciones"
git push origin v0.3

echo.
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo                                    PUSH COMPLETADO EXITOSAMENTE
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo.
echo  ✅ Commit creado exitosamente
echo  ✅ Push realizado a: https://github.com/redeshabilidosos/soshabilidoso-beta-0.1-latest
echo  ✅ Tag v0.3 creado y pusheado
echo.
echo  📊 Resumen de cambios:
echo     - Chat en tiempo real con WebSocket
echo     - Sistema de sonidos de notificación
echo     - Optimizaciones de UI/UX
echo     - 25 documentos nuevos
echo     - Presentación de negocios
echo.
echo  🌐 Ver cambios en:
echo     https://github.com/redeshabilidosos/soshabilidoso-beta-0.1-latest/releases/tag/v0.3
echo.
echo  📝 Changelog completo:
echo     CHANGELOG_v0.3.md
echo.
echo  ═══════════════════════════════════════════════════════════════════════════════════════════════════════
echo.

REM Abrir el repositorio en el navegador
echo Abriendo repositorio en el navegador...
timeout /t 2 >nul
start https://github.com/redeshabilidosos/soshabilidoso-beta-0.1-latest

echo.
echo Presiona cualquier tecla para salir...
pause >nul

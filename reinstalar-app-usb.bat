@echo off
title Reinstalar App - Modo USB con Base de Datos
color 0A

echo ========================================
echo   REINSTALACION - MODO USB + BD
echo ========================================
echo.

set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB=%SCRCPY_PATH%\adb.exe
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%

REM Verificar dispositivo conectado
echo [1/8] Verificando dispositivo...
"%ADB%" devices
echo.
timeout /t 2 /nobreak >nul

REM Configurar adb reverse para localhost
echo [2/8] Configurando adb reverse...
"%ADB%" reverse tcp:8000 tcp:8000
"%ADB%" reverse tcp:4000 tcp:4000
echo       ✓ Puerto 8000 (Django) redirigido
echo       ✓ Puerto 4000 (Next.js) redirigido
echo.

REM Desinstalar app anterior
echo [3/8] Desinstalando app anterior...
"%ADB%" uninstall com.soshabilidoso.app
echo       ✓ App desinstalada
echo.

REM Sincronizar con Capacitor
echo [4/8] Sincronizando con Capacitor...
call npm run build
if %errorlevel% neq 0 (
    echo       ✗ Error en build
    pause
    exit /b 1
)
call npx cap sync android
echo       ✓ Sincronizado
echo.

REM Compilar APK
echo [5/8] Compilando APK (1-2 minutos)...
cd android
call gradlew.bat assembleDebug
cd ..
if %errorlevel% equ 0 (
    echo       ✓ APK compilado
) else (
    echo       ✗ Error al compilar
    pause
    exit /b 1
)
echo.

REM Instalar APK
echo [6/8] Instalando APK...
"%ADB%" install "android\app\build\outputs\apk\debug\app-debug.apk"
if %errorlevel% equ 0 (
    echo       ✓ App instalada
) else (
    echo       ✗ Error al instalar
    pause
    exit /b 1
)
echo.

REM Verificar adb reverse
echo [7/8] Verificando redirecciones...
"%ADB%" reverse --list
echo.

REM Iniciar app
echo [8/8] Iniciando app...
"%ADB%" shell am start -n com.soshabilidoso.app/.MainActivity
echo       ✓ App iniciada
echo.

echo ========================================
echo   ✅ INSTALACION COMPLETA
echo ========================================
echo.
echo Configuracion:
echo   - Modo: USB con adb reverse
echo   - Backend: http://localhost:8000
echo   - Frontend: http://localhost:4000
echo   - Base de datos: MySQL local
echo.
echo La app puede acceder a:
echo   ✓ Django API (puerto 8000)
echo   ✓ Next.js (puerto 4000)
echo   ✓ Base de datos MySQL
echo.
echo IMPORTANTE: Mantén el cable USB conectado
echo.
pause

@echo off
title SOS Habilidoso - Modo USB (Cualquier WiFi)
color 0A

echo ========================================
echo   MODO USB - FUNCIONA CON CUALQUIER WIFI
echo ========================================
echo.
echo Este modo usa tuneles USB (adb reverse)
echo No importa que red WiFi uses
echo.

REM Verificar que Xiaomi este conectado
echo [1/7] Verificando Xiaomi conectado via USB...
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe devices | findstr "device$" >nul
if %errorlevel% neq 0 (
    echo       ❌ Xiaomi no detectado
    echo.
    echo Conecta tu Xiaomi via USB y activa Depuracion USB
    pause
    exit /b 1
)
echo       ✓ Xiaomi conectado
echo.

REM Crear tuneles USB
echo [2/7] Creando tuneles USB...
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe reverse tcp:4000 tcp:4000
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe reverse tcp:8000 tcp:8000
echo       ✓ Tuneles creados
echo       - localhost:4000 (Frontend)
echo       - localhost:8000 (Backend)
echo.

REM Cerrar procesos
echo [3/7] Cerrando procesos anteriores...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo       ✓ Procesos cerrados
echo.

REM Limpiar cache
echo [4/7] Limpiando cache...
if exist ".next" (
    rmdir /s /q ".next" >nul 2>&1
)
echo       ✓ Cache limpiado
echo.

REM Iniciar Backend
echo [5/7] Iniciando Backend Django...
cd backend
start "Backend Django" cmd /k "python manage.py runserver 0.0.0.0:8000"
timeout /t 3 /nobreak >nul
cd ..
echo       ✓ Backend corriendo
echo.

REM Iniciar Frontend
echo [6/7] Iniciando Frontend Next.js...
start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 8 /nobreak >nul
echo       ✓ Frontend corriendo
echo.

REM Sincronizar y reinstalar app
echo [7/7] Reinstalando app en Xiaomi...
call npx cap sync android >nul 2>&1
echo       ✓ Configuracion sincronizada

cd android
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%
call gradlew.bat assembleDebug >nul 2>&1
cd ..
echo       ✓ APK compilado

C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe uninstall com.soshabilidoso.app >nul 2>&1
C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe install android\app\build\outputs\apk\debug\app-debug.apk >nul 2>&1
echo       ✓ App instalada

C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe shell am start -n com.soshabilidoso.app/.MainActivity >nul 2>&1
echo       ✓ App iniciada
echo.

echo ========================================
echo   ✅ MODO USB ACTIVO
echo ========================================
echo.
echo La app ahora usa:
echo   Frontend: http://localhost:4000 (via USB)
echo   Backend:  http://localhost:8000 (via USB)
echo.
echo ✅ Funciona con CUALQUIER red WiFi
echo ✅ No necesitas actualizar IP
echo ✅ Conexion estable via USB
echo.
echo Credenciales de prueba:
echo   Usuario: molo
echo   Password: password123
echo.
echo ¡La app deberia funcionar ahora!
echo.
pause

@echo off
title SOS Habilidoso - Workflow Completo
color 0A

echo ========================================
echo   SOS Habilidoso - Workflow Desarrollo
echo ========================================
echo.
echo Este script hace TODO automaticamente:
echo 1. Sincroniza Capacitor
echo 2. Compila APK
echo 3. Instala en Xiaomi
echo 4. Inicia servidores
echo 5. Abre Scrcpy
echo.
echo Presiona cualquier tecla para continuar...
pause >nul
cls

echo ========================================
echo   PASO 1/5: Sincronizar Capacitor
echo ========================================
echo.
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Fallo al sincronizar
    pause
    exit /b 1
)
echo.

echo ========================================
echo   PASO 2/5: Compilar APK
echo ========================================
echo.
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: Fallo al compilar
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo ========================================
echo   PASO 3/5: Instalar en Xiaomi
echo ========================================
echo.
set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB_PATH=%SCRCPY_PATH%\adb.exe
set APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk

echo Verificando dispositivo...
"%ADB_PATH%" devices
echo.

echo Desinstalando version anterior...
"%ADB_PATH%" uninstall com.soshabilidoso.app 2>nul
echo.

echo Instalando APK...
"%ADB_PATH%" install -r "%APK_PATH%"
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar
    pause
    exit /b 1
)
echo.

echo ========================================
echo   PASO 4/5: Iniciar Servidores
echo ========================================
echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:4000
echo Xiaomi: http://192.168.78.173:4000
echo.

start "Backend Django" cmd /k "cd backend && venv312\Scripts\activate && python manage.py runserver 127.0.0.1:8000"
timeout /t 3 /nobreak >nul

start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo Esperando que servidores inicien...
timeout /t 10 /nobreak >nul
echo.

echo ========================================
echo   PASO 5/5: Iniciar Scrcpy
echo ========================================
echo.
echo Abriendo espejo de Xiaomi...
echo.

cd /d "%SCRCPY_PATH%"
scrcpy.exe --window-title "SOS Habilidoso - Xiaomi" --window-width 400 --window-height 800 --stay-awake

echo.
echo Workflow completado.
pause

@echo off
echo ========================================
echo   SOS Habilidoso - Build APK Debug
echo ========================================
echo.

echo [1/3] Sincronizando Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Fallo al sincronizar Capacitor
    pause
    exit /b 1
)
echo.

echo [2/3] Configurando JAVA_HOME...
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
echo JAVA_HOME=%JAVA_HOME%
echo.

echo [3/3] Compilando APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: Fallo al compilar APK
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo ========================================
echo   BUILD EXITOSO!
echo ========================================
echo.
echo APK generado en:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Tamaño aproximado: 128 MB
echo.
pause

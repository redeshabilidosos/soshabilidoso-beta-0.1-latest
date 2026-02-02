@echo off
title Actualizar Icono - Forzado
color 0A

set ADB_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4\adb.exe
set APP_PACKAGE=com.soshabilidoso.app

echo ========================================
echo   Actualizar Icono - Forzado
echo ========================================
echo.

echo [1/5] Desinstalando app anterior...
"%ADB_PATH%" uninstall %APP_PACKAGE%
echo.

echo [2/5] Limpiando cache del launcher...
"%ADB_PATH%" shell pm clear com.android.launcher3
"%ADB_PATH%" shell pm clear com.miui.home
echo.

echo [3/5] Sincronizando Capacitor...
call npx cap sync android
echo.

echo [4/5] Compilando APK con nuevo icono...
cd android
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
call gradlew.bat clean assembleDebug
cd ..
echo.

echo [5/5] Instalando APK...
"%ADB_PATH%" install android\app\build\outputs\apk\debug\app-debug.apk
echo.

echo ========================================
echo   ✅ ICONO ACTUALIZADO
echo ========================================
echo.
echo El icono deberia verse actualizado ahora
echo Si no, reinicia el dispositivo
echo.
pause

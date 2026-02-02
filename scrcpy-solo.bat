@echo off
title Scrcpy - Espejo Xiaomi
color 0A

echo ========================================
echo   Scrcpy - Espejo de Xiaomi
echo ========================================
echo.

set SCRCPY_PATH=C:\Users\PC\Downloads\scrcpy-win64-v3.3.4
set ADB_PATH=%SCRCPY_PATH%\adb.exe

echo Verificando dispositivo...
"%ADB_PATH%" devices
echo.

echo Iniciando espejo de pantalla...
echo.
echo CONTROLES:
echo - Ctrl+F: Pantalla completa
echo - Ctrl+G: Redimensionar
echo - Ctrl+R: Rotar
echo - Ctrl+O: Apagar pantalla del telefono
echo - Ctrl+P: Encender pantalla
echo - Ctrl+C/V: Copiar/Pegar
echo.

cd /d "%SCRCPY_PATH%"
scrcpy.exe --window-title "SOS Habilidoso - Xiaomi" --window-width 400 --window-height 800 --stay-awake

pause

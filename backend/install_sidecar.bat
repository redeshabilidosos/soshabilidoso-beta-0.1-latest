@echo off
echo Instalando drf-spectacular-sidecar...
cd /d "%~dp0"
call venv312\Scripts\activate.bat
pip install drf-spectacular-sidecar
echo.
echo Instalacion completada!
pause

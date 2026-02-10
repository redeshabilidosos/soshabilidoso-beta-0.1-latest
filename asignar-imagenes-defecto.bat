@echo off
echo ========================================
echo Asignando imagenes por defecto
echo ========================================
echo.

cd backend
C:\Python314\python.exe manage.py set_default_images

echo.
echo ========================================
echo Proceso completado
echo ========================================
pause

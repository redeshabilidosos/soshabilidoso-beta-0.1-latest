@echo off
echo ========================================
echo Creando cuenta oficial @sos
echo ========================================
echo.

cd backend
C:\Python314\python.exe manage.py create_sos_account

echo.
echo ========================================
echo Proceso completado
echo ========================================
pause

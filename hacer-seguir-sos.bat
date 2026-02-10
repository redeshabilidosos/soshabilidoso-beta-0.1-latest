@echo off
echo ========================================
echo Haciendo que todos sigan a @sos
echo ========================================
echo.

cd backend
C:\Python314\python.exe manage.py make_all_follow_sos

echo.
echo ========================================
echo Proceso completado
echo ========================================
pause

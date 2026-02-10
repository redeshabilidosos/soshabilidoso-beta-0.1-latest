@echo off
echo ========================================
echo Importando usuarios desde CSV con Django
echo ========================================
echo.

cd backend
C:\Python314\python.exe manage.py import_users_csv --file="..\public\csvemailequipo_with_usernames.csv"

echo.
echo ========================================
echo Proceso completado
echo ========================================
pause

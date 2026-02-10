@echo off
echo ========================================
echo IMPORTAR USUARIOS DESDE CSV
echo ========================================
echo.
echo Este script importara 4,976 usuarios desde csvusuarios_processed.csv
echo.
echo Presiona cualquier tecla para continuar...
pause > nul

cd backend
echo.
echo Ejecutando importacion...
echo.
C:\Python314\python.exe manage.py import_users_from_csv --file=public/csvusuarios_processed.csv

echo.
echo ========================================
echo IMPORTACION COMPLETADA
echo ========================================
echo.
pause

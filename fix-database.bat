@echo off
echo ============================================================
echo REPARANDO BASE DE DATOS MySQL
echo ============================================================
echo.

echo [1/4] Deteniendo MySQL...
C:\xampp\mysql\bin\mysqladmin -u root -P 3307 shutdown 2>nul
timeout /t 3 /nobreak >nul

echo [2/4] Eliminando carpeta corrupta...
rmdir /s /q "C:\xampp\mysql\data\habilidosos_db" 2>nul
if exist "C:\xampp\mysql\data\habilidosos_db" (
    echo ERROR: No se pudo eliminar la carpeta. Cierra phpMyAdmin y cualquier conexion MySQL.
    pause
    exit /b 1
)
echo Carpeta eliminada.

echo [3/4] Iniciando MySQL...
start "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini"
timeout /t 5 /nobreak >nul

echo [4/4] Recreando base de datos...
python recreate-database.py

echo.
echo ============================================================
echo COMPLETADO!
echo ============================================================
pause

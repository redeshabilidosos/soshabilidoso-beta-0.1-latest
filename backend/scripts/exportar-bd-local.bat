@echo off
echo ========================================
echo EXPORTAR BASE DE DATOS LOCAL
echo ========================================
echo.

REM Configuración
set DB_NAME=habilidosos_db
set DB_USER=root
set DB_PASSWORD=
set DB_PORT=3307
set BACKUP_FILE=backup_habilidosos_%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set BACKUP_FILE=%BACKUP_FILE: =0%

echo Exportando base de datos: %DB_NAME%
echo Puerto: %DB_PORT%
echo Archivo: %BACKUP_FILE%
echo.

REM Ruta de mysqldump (ajusta según tu instalación)
REM Para XAMPP:
set MYSQL_PATH=C:\xampp\mysql\bin

REM Para WAMP (descomenta y ajusta la versión si usas WAMP):
REM set MYSQL_PATH=C:\wamp64\bin\mysql\mysql8.0.31\bin

echo Ejecutando mysqldump...
"%MYSQL_PATH%\mysqldump.exe" -u%DB_USER% -P%DB_PORT% --single-transaction --routines --triggers %DB_NAME% > %BACKUP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo EXPORTACION EXITOSA
    echo ========================================
    echo Archivo creado: %BACKUP_FILE%
    echo.
    echo SIGUIENTE PASO:
    echo 1. Copia este archivo a tu VPS usando SCP:
    echo    scp %BACKUP_FILE% root@76.13.122.81:/var/www/soshabilidoso/backend/
    echo.
    echo 2. O usa WinSCP/FileZilla para transferir el archivo
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR EN LA EXPORTACION
    echo ========================================
    echo Verifica:
    echo 1. Que MySQL este corriendo
    echo 2. Que la ruta de mysqldump sea correcta
    echo 3. Que el puerto sea 3307
    echo.
)

pause

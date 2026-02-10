@echo off
echo ========================================
echo CAMBIANDO A PYMYSQL (Compatible con Django 5.0)
echo ========================================
echo.

echo [1/2] Instalando pymysql...
pip install pymysql cryptography

echo.
echo [2/2] Verificando instalacion...
python -c "import pymysql; print(f'pymysql: {pymysql.__version__}')"

echo.
echo ========================================
echo INSTALACION COMPLETADA
echo ========================================
echo.
echo IMPORTANTE: Agrega esto al inicio de manage.py y wsgi.py:
echo.
echo import pymysql
echo pymysql.install_as_MySQLdb()
echo.
pause

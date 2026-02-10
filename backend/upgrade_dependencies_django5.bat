@echo off
echo ========================================
echo ACTUALIZANDO DEPENDENCIAS PARA DJANGO 5.0
echo ========================================
echo.

echo [1/4] Actualizando mysqlclient...
pip install --upgrade "mysqlclient>=2.2.1"

echo.
echo [2/4] Actualizando Django REST Framework...
pip install --upgrade "djangorestframework>=3.14.0"

echo.
echo [3/4] Actualizando otras dependencias...
pip install --upgrade django-cors-headers django-filter Pillow

echo.
echo [4/4] Verificando instalacion...
python -c "import django; print(f'Django: {django.get_version()}')"
python -c "import MySQLdb; print(f'mysqlclient: {MySQLdb.__version__}')"

echo.
echo ========================================
echo ACTUALIZACION COMPLETADA
echo ========================================
echo.
echo Ahora ejecuta: python verify_django5_upgrade.py
echo.
pause

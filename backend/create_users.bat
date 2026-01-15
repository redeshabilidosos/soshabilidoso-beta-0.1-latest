@echo off
echo 👥 Creando usuarios de prueba...
call venv\Scripts\activate.bat
python create_test_user.py
pause
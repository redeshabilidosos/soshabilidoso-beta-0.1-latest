@echo off
echo 🚀 Iniciando servidor Django...
cd backend
call venv\Scripts\activate.bat
python manage.py runserver 8000
@echo off
cd /d "%~dp0"
call venv312\Scripts\activate.bat
python manage.py runserver 127.0.0.1:8000

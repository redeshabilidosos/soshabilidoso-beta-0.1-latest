#!/usr/bin/env python3
"""
Script de instalación automatizada para el backend de SOS-HABILIDOSO
Ejecutar: python setup_backend.py
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, cwd=None):
    """Ejecutar comando y manejar errores"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ {command}")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ Error ejecutando: {command}")
        print(f"Error: {e.stderr}")
        return None

def create_directory_structure():
    """Crear estructura de directorios"""
    directories = [
        "backend",
        "backend/sos_habilidoso",
        "backend/sos_habilidoso/settings",
        "backend/apps",
        "backend/apps/authentication",
        "backend/apps/users", 
        "backend/apps/posts",
        "backend/apps/communities",
        "backend/apps/messaging",
        "backend/apps/notifications",
        "backend/apps/classifieds",
        "backend/apps/media_storage",
        "backend/apps/common",
        "backend/requirements",
        "backend/static",
        "backend/media",
        "backend/docs",
        "backend/scripts",
        "backend/tests",
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Creado: {directory}")

def create_requirements_files():
    """Crear archivos de requirements"""
    
    # requirements/base.txt
    base_requirements = """# Django y DRF
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1

# Base de datos
psycopg2-binary==2.9.7
dj-database-url==2.1.0

# Autenticación JWT
djangorestframework-simplejwt==5.3.0
PyJWT==2.8.0

# Validación y serialización
django-filter==23.3
Pillow==10.0.1

# Utilidades
python-decouple==3.8
python-dotenv==1.0.0

# Almacenamiento de archivos
cloudinary==1.36.0
django-cloudinary-storage==0.3.0

# Cache y tareas asíncronas
redis==5.0.1
celery==5.3.4
django-redis==5.4.0

# WebSockets para chat en tiempo real
channels==4.0.0
channels-redis==4.1.0

# Documentación API
drf-spectacular==0.26.5

# Validaciones adicionales
django-phonenumber-field==7.2.0
phonenumbers==8.13.25

# Seguridad
django-ratelimit==4.1.0
django-extensions==3.2.3

# Monitoreo y logs
sentry-sdk==1.38.0"""

    # requirements/development.txt
    dev_requirements = """-r base.txt

# Desarrollo
django-debug-toolbar==4.2.0
django-extensions==3.2.3

# Testing
pytest==7.4.3
pytest-django==4.7.0
pytest-cov==4.1.0
factory-boy==3.3.0

# Linting y formateo
black==23.10.1
flake8==6.1.0
isort==5.12.0

# Documentación
Sphinx==7.2.6"""

    # requirements/production.txt
    prod_requirements = """-r base.txt

# Producción
gunicorn==21.2.0
whitenoise==6.6.0
dj-static==0.0.6

# Monitoreo
sentry-sdk==1.38.0"""

    with open("backend/requirements/base.txt", "w") as f:
        f.write(base_requirements)
    
    with open("backend/requirements/development.txt", "w") as f:
        f.write(dev_requirements)
    
    with open("backend/requirements/production.txt", "w") as f:
        f.write(prod_requirements)
    
    print("📄 Archivos de requirements creados")

def create_env_file():
    """Crear archivo .env de ejemplo"""
    env_content = """# Base de datos
DATABASE_NAME=sos_habilidoso_db
DATABASE_USER=sos_admin
DATABASE_PASSWORD=tu_password_seguro
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Django
SECRET_KEY=tu_secret_key_muy_seguro_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS (para Next.js)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# JWT
JWT_SECRET_KEY=tu_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=7

# Almacenamiento de archivos
MEDIA_URL=/media/
MEDIA_ROOT=media/
STATIC_URL=/static/
STATIC_ROOT=static/

# Email (opcional para desarrollo)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# Redis (para cache y Celery)
REDIS_URL=redis://localhost:6379/0

# Cloudinary (para producción)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret"""

    with open("backend/.env.example", "w") as f:
        f.write(env_content)
    
    print("📄 Archivo .env.example creado")

def setup_virtual_environment():
    """Configurar entorno virtual"""
    os.chdir("backend")
    
    # Crear entorno virtual
    if not run_command("python -m venv venv"):
        print("❌ Error creando entorno virtual")
        return False
    
    # Activar entorno virtual y instalar dependencias
    if sys.platform == "win32":
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
    else:
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    # Instalar dependencias
    if not run_command(f"{pip_cmd} install --upgrade pip"):
        print("❌ Error actualizando pip")
        return False
    
    if not run_command(f"{pip_cmd} install -r requirements/development.txt"):
        print("❌ Error instalando dependencias")
        return False
    
    return True

def create_django_project():
    """Crear proyecto Django"""
    
    # Crear proyecto Django
    if sys.platform == "win32":
        django_admin = "venv\\Scripts\\django-admin"
        python_cmd = "venv\\Scripts\\python"
    else:
        django_admin = "venv/bin/django-admin"
        python_cmd = "venv/bin/python"
    
    if not run_command(f"{django_admin} startproject sos_habilidoso ."):
        print("❌ Error creando proyecto Django")
        return False
    
    # Crear aplicaciones
    apps = [
        "authentication",
        "users", 
        "posts",
        "communities",
        "messaging",
        "notifications",
        "classifieds",
        "media_storage",
        "common"
    ]
    
    for app in apps:
        if not run_command(f"{python_cmd} manage.py startapp {app} apps/{app}"):
            print(f"❌ Error creando app {app}")
            return False
    
    return True

def main():
    """Función principal"""
    print("🚀 Iniciando instalación del backend SOS-HABILIDOSO")
    print("=" * 50)
    
    # Verificar Python
    try:
        python_version = subprocess.check_output([sys.executable, "--version"], text=True)
        print(f"🐍 {python_version.strip()}")
    except:
        print("❌ Python no encontrado")
        return
    
    # Crear estructura de directorios
    print("\n📁 Creando estructura de directorios...")
    create_directory_structure()
    
    # Crear archivos de requirements
    print("\n📄 Creando archivos de configuración...")
    create_requirements_files()
    create_env_file()
    
    # Configurar entorno virtual
    print("\n🔧 Configurando entorno virtual...")
    if not setup_virtual_environment():
        print("❌ Error en configuración del entorno virtual")
        return
    
    # Crear proyecto Django
    print("\n🎯 Creando proyecto Django...")
    if not create_django_project():
        print("❌ Error creando proyecto Django")
        return
    
    print("\n✅ ¡Instalación completada!")
    print("\n📋 Próximos pasos:")
    print("1. cd backend")
    print("2. Copiar .env.example a .env y configurar variables")
    print("3. Configurar PostgreSQL")
    print("4. Activar entorno virtual:")
    if sys.platform == "win32":
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("5. python manage.py migrate")
    print("6. python manage.py createsuperuser")
    print("7. python manage.py runserver")

if __name__ == "__main__":
    main()
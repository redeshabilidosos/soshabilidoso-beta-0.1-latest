# Guía de Instalación del Backend - SOS-HABILIDOSO

## 1. Instalación de Dependencias del Sistema

### Windows:
```bash
# Instalar Python 3.11+
# Descargar desde: https://www.python.org/downloads/

# Instalar PostgreSQL
# Descargar desde: https://www.postgresql.org/download/windows/

# Verificar instalaciones
python --version
psql --version
```

### macOS:
```bash
# Instalar Homebrew si no lo tienes
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Python y PostgreSQL
brew install python@3.11 postgresql@15

# Iniciar PostgreSQL
brew services start postgresql@15
```

### Linux (Ubuntu/Debian):
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python y PostgreSQL
sudo apt install python3.11 python3.11-venv python3-pip postgresql postgresql-contrib

# Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Configuración de PostgreSQL

```bash
# Conectar a PostgreSQL como superusuario
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE sos_habilidoso_db;
CREATE USER sos_admin WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE sos_habilidoso_db TO sos_admin;
ALTER USER sos_admin CREATEDB;
\q
```

## 3. Estructura del Proyecto Backend

```
backend/
├── sos_habilidoso/          # Proyecto Django principal
│   ├── __init__.py
│   ├── settings/            # Configuraciones por ambiente
│   │   ├── __init__.py
│   │   ├── base.py         # Configuración base
│   │   ├── development.py  # Desarrollo
│   │   ├── production.py   # Producción
│   │   └── testing.py      # Testing
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py             # Para WebSockets
├── apps/                   # Aplicaciones Django
│   ├── authentication/     # Sistema de autenticación
│   ├── users/             # Gestión de usuarios
│   ├── posts/             # Publicaciones
│   ├── communities/       # Comunidades
│   ├── messaging/         # Sistema de mensajería
│   ├── notifications/     # Notificaciones
│   ├── classifieds/       # Clasificados
│   ├── media_storage/     # Gestión de archivos
│   └── common/            # Utilidades comunes
├── requirements/          # Dependencias por ambiente
│   ├── base.txt
│   ├── development.txt
│   ├── production.txt
│   └── testing.txt
├── static/               # Archivos estáticos
├── media/               # Archivos subidos
├── docs/                # Documentación API
├── scripts/             # Scripts de utilidad
├── tests/               # Tests
├── .env.example         # Variables de entorno ejemplo
├── .gitignore
├── manage.py
└── README.md
```

## 4. Comandos de Instalación

```bash
# 1. Crear directorio del proyecto
mkdir sos-habilidoso-backend
cd sos-habilidoso-backend

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Crear requirements/base.txt (ver contenido abajo)

# 5. Instalar dependencias
pip install -r requirements/development.txt

# 6. Crear proyecto Django
django-admin startproject sos_habilidoso .

# 7. Crear aplicaciones
python manage.py startapp apps.authentication
python manage.py startapp apps.users
python manage.py startapp apps.posts
python manage.py startapp apps.communities
python manage.py startapp apps.messaging
python manage.py startapp apps.notifications
python manage.py startapp apps.classifieds
python manage.py startapp apps.media_storage
python manage.py startapp apps.common
```

## 5. Variables de Entorno (.env)

```env
# Base de datos
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
JWT_ACCESS_TOKEN_LIFETIME=60  # minutos
JWT_REFRESH_TOKEN_LIFETIME=7  # días

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
CLOUDINARY_API_SECRET=tu_api_secret
```

## 6. Próximos Pasos

1. Configurar settings de Django
2. Crear modelos de base de datos
3. Configurar autenticación JWT
4. Crear serializers y viewsets
5. Configurar URLs y API endpoints
6. Implementar permisos y validaciones
7. Configurar almacenamiento de archivos
8. Implementar WebSockets para chat en tiempo real
9. Configurar tests
10. Documentar API con Swagger
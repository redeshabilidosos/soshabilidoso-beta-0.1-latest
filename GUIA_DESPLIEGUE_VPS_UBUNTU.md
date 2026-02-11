# 🚀 Guía Completa de Despliegue en VPS Ubuntu

## 📋 Requisitos Previos

- VPS con Ubuntu 20.04 LTS o superior
- Acceso root o sudo
- Dominio configurado (opcional pero recomendado)
- Mínimo 2GB RAM, 2 CPU cores, 20GB disco

---

## 🔧 PASO 1: Actualizar Sistema

```bash
# Conectarse al VPS
ssh root@tu-ip-vps

# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar herramientas básicas
sudo apt install -y curl wget git build-essential software-properties-common
```

---

## 🐍 PASO 2: Instalar Python 3.11

```bash
# Agregar repositorio deadsnakes
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

# Instalar Python 3.11
sudo apt install -y python3.11 python3.11-venv python3.11-dev

# Verificar instalación
python3.11 --version

# Instalar pip para Python 3.11 (SOLUCIÓN AL ERROR)
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3.11

# Verificar pip
python3.11 -m pip --version
```

### ⚠️ Solución al Error de pip

Si encuentras el error `Cannot uninstall pip 24.0, RECORD file not found`:

```bash
# Opción 1: Usar pip con --ignore-installed
python3.11 -m pip install --upgrade pip --ignore-installed

# Opción 2: Usar get-pip.py (recomendado)
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3.11

# Opción 3: Instalar en entorno virtual (más seguro)
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
```

---

## 📦 PASO 3: Instalar Node.js 20.x

```bash
# Instalar Node.js 20.x usando NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debe mostrar v20.x.x
npm --version   # Debe mostrar 10.x.x

# Instalar yarn (opcional)
sudo npm install -g yarn
```

---

## 🗄️ PASO 4: Instalar MySQL 8.0

```bash
# Instalar MySQL Server
sudo apt install -y mysql-server

# Iniciar servicio
sudo systemctl start mysql
sudo systemctl enable mysql

# Configurar seguridad
sudo mysql_secure_installation
# Responder:
# - Set root password: YES (elige una contraseña segura)
# - Remove anonymous users: YES
# - Disallow root login remotely: NO (si necesitas acceso remoto)
# - Remove test database: YES
# - Reload privilege tables: YES

# Crear base de datos y usuario
sudo mysql -u root -p
```

```sql
-- Dentro de MySQL
CREATE DATABASE soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'soshabilidoso'@'localhost' IDENTIFIED BY 'tu_password_segura';
GRANT ALL PRIVILEGES ON soshabilidoso.* TO 'soshabilidoso'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🌐 PASO 5: Instalar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar y habilitar
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar estado
sudo systemctl status nginx

# Permitir en firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 📁 PASO 6: Clonar Repositorio

```bash
# Crear directorio para la aplicación
sudo mkdir -p /var/www
cd /var/www

# Clonar repositorio
sudo git clone https://github.com/redeshabilidosos/soshabilidoso-beta-0.1-latest.git soshabilidoso
cd soshabilidoso

# Dar permisos
sudo chown -R $USER:$USER /var/www/soshabilidoso
```

---

## 🔧 PASO 7: Configurar Backend (Django)

```bash
cd /var/www/soshabilidoso/backend

# Instalar dependencias del sistema para mysqlclient
sudo apt install -y python3.11-dev default-libmysqlclient-dev build-essential pkg-config

# Crear entorno virtual con Python 3.11
python3.11 -m venv venv

# Activar entorno virtual
source venv/bin/activate

# Verificar que estamos en el entorno virtual
which python  # Debe mostrar: /var/www/soshabilidoso/backend/venv/bin/python

# Actualizar pip en el entorno virtual
pip install --upgrade pip setuptools wheel

# OPCIÓN 1: Instalar desde requirements.txt (recomendado)
pip install -r requirements.txt

# OPCIÓN 2: Instalar manualmente (si no existe requirements.txt)
# pip install django==5.0.1
# pip install djangorestframework==3.14.0
# pip install django-cors-headers==4.3.1
# pip install djangorestframework-simplejwt==5.3.1
# pip install mysqlclient==2.2.1
# pip install channels==4.0.0
# pip install daphne==4.0.0
# pip install channels-redis==4.1.0
# pip install redis==5.0.1
# pip install pillow==10.1.0
# pip install python-dotenv==1.0.0
# pip install django-filter==23.5
# pip install gunicorn==21.2.0

# Verificar instalación
pip list
```

### Verificar Instalación de Django

```bash
# Verificar versión de Django
python -m django --version  # Debe mostrar: 5.0.1

# Verificar que todas las dependencias están instaladas
python -c "import django; print('Django OK')"
python -c "import rest_framework; print('DRF OK')"
python -c "import channels; print('Channels OK')"
python -c "import MySQLdb; print('MySQL OK')"
python -c "import redis; print('Redis OK')"
python -c "import gunicorn; print('Gunicorn OK')"

# Ver todas las dependencias instaladas
pip freeze
```

### Configurar .env del Backend

```bash
# Crear archivo .env
nano /var/www/soshabilidoso/backend/.env
```

```env
# Configuración de Base de Datos
DB_NAME=soshabilidoso
DB_USER=soshabilidoso
DB_PASSWORD=tu_password_segura
DB_HOST=localhost
DB_PORT=3306

# Configuración de Django
SECRET_KEY=tu-secret-key-super-segura-aqui-cambiar
DEBUG=False
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com,tu-ip-vps

# CORS
CORS_ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com

# Redis (para WebSockets)
REDIS_HOST=localhost
REDIS_PORT=6379

# Media y Static
MEDIA_ROOT=/var/www/soshabilidoso/backend/media
STATIC_ROOT=/var/www/soshabilidoso/backend/staticfiles
```

### Migrar Base de Datos

```bash
# Activar entorno virtual si no está activo
source venv/bin/activate

# Hacer migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Recolectar archivos estáticos
python manage.py collectstatic --noinput

# Crear directorios necesarios
mkdir -p media/avatars media/posts media/stories media/covers
chmod -R 755 media
```

---

## 🎨 PASO 8: Configurar Frontend (Next.js)

```bash
cd /var/www/soshabilidoso

# Instalar dependencias
npm install

# Crear archivo .env.local
nano .env.local
```

```env
# API Backend
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
NEXT_PUBLIC_WS_URL=api.tu-dominio.com

# Base URL
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com

# Otros
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

### Build de Producción

```bash
# Limpiar cache
rm -rf .next node_modules/.cache

# Build
npm run build

# Verificar que el build fue exitoso
ls -la .next
```

---

## 🔴 PASO 9: Instalar Redis (para WebSockets)

```bash
# Instalar Redis
sudo apt install -y redis-server

# Configurar Redis
sudo nano /etc/redis/redis.conf
# Cambiar: supervised no -> supervised systemd

# Reiniciar Redis
sudo systemctl restart redis
sudo systemctl enable redis

# Verificar
redis-cli ping  # Debe responder: PONG
```

---

## 🔧 PASO 10: Configurar Gunicorn (Backend HTTP)

```bash
# Instalar Gunicorn en el entorno virtual
cd /var/www/soshabilidoso/backend
source venv/bin/activate
pip install gunicorn

# Crear archivo de configuración
nano /var/www/soshabilidoso/backend/gunicorn_config.py
```

```python
# gunicorn_config.py
bind = "127.0.0.1:8000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 120
keepalive = 5
errorlog = "/var/log/gunicorn/error.log"
accesslog = "/var/log/gunicorn/access.log"
loglevel = "info"
```

```bash
# Crear directorio de logs
sudo mkdir -p /var/log/gunicorn
sudo chown -R $USER:$USER /var/log/gunicorn
```

### Crear Servicio Systemd para Gunicorn

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

```ini
[Unit]
Description=Gunicorn daemon for SOS Habilidoso
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/soshabilidoso/backend
Environment="PATH=/var/www/soshabilidoso/backend/venv/bin"
ExecStart=/var/www/soshabilidoso/backend/venv/bin/gunicorn \
    --config /var/www/soshabilidoso/backend/gunicorn_config.py \
    sos_habilidoso.wsgi:application

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Dar permisos a www-data
sudo chown -R www-data:www-data /var/www/soshabilidoso

# Iniciar servicio
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Verificar estado
sudo systemctl status gunicorn
```

---

## 🔌 PASO 11: Configurar Daphne (WebSockets)

### Crear Servicio Systemd para Daphne

```bash
sudo nano /etc/systemd/system/daphne.service
```

```ini
[Unit]
Description=Daphne daemon for SOS Habilidoso WebSockets
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/soshabilidoso/backend
Environment="PATH=/var/www/soshabilidoso/backend/venv/bin"
ExecStart=/var/www/soshabilidoso/backend/venv/bin/daphne \
    -b 127.0.0.1 -p 8001 \
    sos_habilidoso.asgi:application

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Iniciar servicio
sudo systemctl daemon-reload
sudo systemctl start daphne
sudo systemctl enable daphne

# Verificar estado
sudo systemctl status daphne
```

---

## 🌐 PASO 12: Configurar Nginx como Reverse Proxy

### Configuración para Backend (API)

```bash
sudo nano /etc/nginx/sites-available/api.soshabilidoso
```

```nginx
# Upstream para Gunicorn (HTTP)
upstream gunicorn_backend {
    server 127.0.0.1:8000;
}

# Upstream para Daphne (WebSockets)
upstream daphne_backend {
    server 127.0.0.1:8001;
}

server {
    listen 80;
    server_name api.tu-dominio.com;

    client_max_body_size 100M;

    # Logs
    access_log /var/log/nginx/api_access.log;
    error_log /var/log/nginx/api_error.log;

    # Static files
    location /static/ {
        alias /var/www/soshabilidoso/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /var/www/soshabilidoso/backend/media/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # WebSocket connections
    location /ws/ {
        proxy_pass http://daphne_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # API requests
    location / {
        proxy_pass http://gunicorn_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

### Configuración para Frontend (Next.js)

```bash
sudo nano /etc/nginx/sites-available/soshabilidoso
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Logs
    access_log /var/log/nginx/frontend_access.log;
    error_log /var/log/nginx/frontend_error.log;

    # Proxy a Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js static files
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Public files
    location /public/ {
        alias /var/www/soshabilidoso/public/;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

### Activar Configuraciones

```bash
# Crear enlaces simbólicos
sudo ln -s /etc/nginx/sites-available/api.soshabilidoso /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/soshabilidoso /etc/nginx/sites-enabled/

# Eliminar configuración default
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 🔒 PASO 13: Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificados
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com -d api.tu-dominio.com

# Responder preguntas:
# - Email: tu-email@ejemplo.com
# - Términos: Agree
# - Compartir email: No
# - Redirect HTTP to HTTPS: Yes

# Verificar renovación automática
sudo certbot renew --dry-run

# Configurar renovación automática
sudo systemctl status certbot.timer
```

---

## 🚀 PASO 14: Configurar PM2 para Next.js

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Crear archivo de configuración
nano /var/www/soshabilidoso/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'soshabilidoso-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/soshabilidoso',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/frontend-error.log',
    out_file: '/var/log/pm2/frontend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

```bash
# Crear directorio de logs
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Iniciar aplicación
cd /var/www/soshabilidoso
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup systemd
# Ejecutar el comando que PM2 te muestre

# Verificar estado
pm2 status
pm2 logs
```

---

## 📊 PASO 15: Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Logs de Gunicorn
sudo tail -f /var/log/gunicorn/error.log
sudo tail -f /var/log/gunicorn/access.log

# Logs de Nginx
sudo tail -f /var/log/nginx/api_error.log
sudo tail -f /var/log/nginx/frontend_error.log

# Logs de PM2
pm2 logs

# Logs de Systemd
sudo journalctl -u gunicorn -f
sudo journalctl -u daphne -f
```

### Comandos Útiles

```bash
# Reiniciar servicios
sudo systemctl restart gunicorn
sudo systemctl restart daphne
sudo systemctl restart nginx
pm2 restart all

# Ver estado
sudo systemctl status gunicorn
sudo systemctl status daphne
sudo systemctl status nginx
pm2 status

# Ver uso de recursos
htop
df -h
free -h
```

---

## 🔄 PASO 16: Script de Actualización

```bash
# Crear script de actualización
nano /var/www/soshabilidoso/update.sh
```

```bash
#!/bin/bash

echo "🔄 Actualizando SOS Habilidoso..."

# Ir al directorio
cd /var/www/soshabilidoso

# Pull cambios
echo "📥 Descargando cambios..."
git pull origin main

# Backend
echo "🐍 Actualizando backend..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
deactivate

# Frontend
echo "🎨 Actualizando frontend..."
cd ..
npm install
npm run build

# Reiniciar servicios
echo "🔄 Reiniciando servicios..."
sudo systemctl restart gunicorn
sudo systemctl restart daphne
pm2 restart all

echo "✅ Actualización completada!"
```

```bash
# Dar permisos de ejecución
chmod +x /var/www/soshabilidoso/update.sh

# Ejecutar actualización
./update.sh
```

---

## ✅ PASO 17: Verificación Final

### Checklist de Verificación

```bash
# 1. Verificar servicios
sudo systemctl status gunicorn  # ✓ Active (running)
sudo systemctl status daphne    # ✓ Active (running)
sudo systemctl status nginx     # ✓ Active (running)
sudo systemctl status redis     # ✓ Active (running)
pm2 status                      # ✓ online

# 2. Verificar puertos
sudo netstat -tulpn | grep :80    # Nginx
sudo netstat -tulpn | grep :443   # Nginx SSL
sudo netstat -tulpn | grep :3000  # Next.js
sudo netstat -tulpn | grep :8000  # Gunicorn
sudo netstat -tulpn | grep :8001  # Daphne
sudo netstat -tulpn | grep :6379  # Redis

# 3. Verificar logs
sudo tail -n 50 /var/log/gunicorn/error.log
sudo tail -n 50 /var/log/nginx/api_error.log
pm2 logs --lines 50

# 4. Probar endpoints
curl http://localhost:8000/api/  # Backend
curl http://localhost:3000       # Frontend
curl https://tu-dominio.com      # Frontend SSL
curl https://api.tu-dominio.com/api/  # Backend SSL
```

### URLs de Acceso

- **Frontend**: https://tu-dominio.com
- **Backend API**: https://api.tu-dominio.com/api/
- **Admin Django**: https://api.tu-dominio.com/admin/
- **WebSockets**: wss://api.tu-dominio.com/ws/

---

## 🐛 Solución de Problemas Comunes

### Error: pip cannot uninstall

```bash
# Solución
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11
python3.11 -m pip install --upgrade pip --ignore-installed
```

### Error: mysqlclient installation failed

```bash
# Instalar dependencias del sistema
sudo apt install -y python3.11-dev default-libmysqlclient-dev build-essential pkg-config

# Luego reinstalar
source venv/bin/activate
pip install mysqlclient
```

### Error: No module named 'django'

```bash
# Verificar que el entorno virtual está activado
which python  # Debe mostrar la ruta del venv

# Si no está activado
source /var/www/soshabilidoso/backend/venv/bin/activate

# Reinstalar Django
pip install django==5.0.1
```

### Error: ImportError: No module named 'MySQLdb'

```bash
# Instalar mysqlclient
sudo apt install -y default-libmysqlclient-dev
source venv/bin/activate
pip install mysqlclient
```

### Error: Permission denied

```bash
# Dar permisos correctos
sudo chown -R www-data:www-data /var/www/soshabilidoso
sudo chmod -R 755 /var/www/soshabilidoso
```

### Error: Port already in use

```bash
# Ver qué está usando el puerto
sudo lsof -i :8000
sudo lsof -i :3000

# Matar proceso
sudo kill -9 PID
```

### Error: Database connection refused

```bash
# Verificar MySQL
sudo systemctl status mysql
sudo mysql -u soshabilidoso -p

# Verificar credenciales en .env
nano /var/www/soshabilidoso/backend/.env
```

### Error: WebSocket connection failed

```bash
# Verificar Daphne
sudo systemctl status daphne
sudo journalctl -u daphne -n 50

# Verificar Redis
redis-cli ping

# Verificar configuración Nginx
sudo nginx -t
```

---

## 📚 Recursos Adicionales

- [Documentación Django](https://docs.djangoproject.com/)
- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Nginx](https://nginx.org/en/docs/)
- [Documentación PM2](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Fecha**: 2026-02-11  
**Versión**: 1.0  
**Estado**: ✅ Guía completa y probada

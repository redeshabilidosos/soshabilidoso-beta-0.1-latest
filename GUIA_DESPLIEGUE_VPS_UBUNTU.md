# 🚀 Guía Completa de Despliegue en VPS Ubuntu

## 📋 Requisitos Previos

- VPS con Ubuntu 20.04 LTS o superior
- Acceso root o sudo
- Dominio configurado (opcional pero recomendado)
- Mínimo 2GB RAM, 2 CPU cores, 20GB disco

---

## ⚡ INSTALACIÓN RÁPIDA (Script Automático)

> 💡 **Opción rápida**: Copia y pega este script completo en tu VPS para instalar todo automáticamente.

### Script de Instalación Completa

```bash
#!/bin/bash
# Script de instalación automática de SOS Habilidoso
# Copia y pega TODO este bloque en tu terminal VPS

echo "🚀 Iniciando instalación de SOS Habilidoso..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential software-properties-common

# Instalar Python 3.11
echo "🐍 Instalando Python 3.11..."
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3.11

# Instalar Node.js 20.x
echo "📗 Instalando Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MySQL
echo "🗄️ Instalando MySQL..."
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Instalar Nginx
echo "🌐 Instalando Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Instalar Redis
echo "🔴 Instalando Redis..."
sudo apt install -y redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Instalar PM2
echo "⚙️ Instalando PM2..."
sudo npm install -g pm2

# Configurar firewall
echo "🔒 Configurando firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Clonar repositorio
echo "📥 Clonando repositorio..."
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/redeshabilidosos/soshabilidoso-beta-0.1-latest.git soshabilidoso
sudo chown -R $USER:$USER /var/www/soshabilidoso

echo "✅ Instalación base completada!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Configurar MySQL (ver PASO 4 de la guía)"
echo "2. Configurar Backend Django (ver PASO 7)"
echo "3. Configurar Frontend Next.js (ver PASO 8)"
echo "4. Configurar servicios (ver PASOS 10-14)"
```

### Cómo usar el script:

1. **Conectarse al VPS:**
```bash
ssh root@tu-ip-vps
```

2. **Copiar y pegar el script completo** en la terminal

3. **Esperar** a que termine (5-10 minutos aproximadamente)

4. **Continuar con la configuración manual** desde el PASO 4

---

## 📝 INSTALACIÓN MANUAL PASO A PASO

> 💡 Si prefieres instalar manualmente o el script automático falló, sigue estos pasos:

---

## 🔧 PASO 1: Actualizar Sistema

### Copiar y Pegar - Bloque Completo

```bash
# Actualizar paquetes del sistema
sudo apt update && sudo apt upgrade -y

# Instalar herramientas básicas
sudo apt install -y curl wget git build-essential software-properties-common

# Verificar instalación
git --version
curl --version
```

---

## 🐍 PASO 2: Instalar Python 3.11

### Copiar y Pegar - Bloque Completo

```bash
# Agregar repositorio deadsnakes
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

# Instalar Python 3.11
sudo apt install -y python3.11 python3.11-venv python3.11-dev

# Instalar pip para Python 3.11
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3.11

# Verificar instalación
python3.11 --version
python3.11 -m pip --version
```

**Resultado esperado:**
```
Python 3.11.x
pip 24.x.x from ...
```

---

## 📦 PASO 3: Instalar Node.js 20.x

### Copiar y Pegar - Bloque Completo

```bash
# Instalar Node.js 20.x usando NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar yarn (opcional)
sudo npm install -g yarn

# Verificar instalación
node --version
npm --version
```

**Resultado esperado:**
```
v20.x.x
10.x.x
```

---

## 🗄️ PASO 4: Instalar MySQL 8.0

### 4.1 - Instalar MySQL Server (Copiar y Pegar)

```bash
# Instalar MySQL Server
sudo apt install -y mysql-server

# Iniciar y habilitar servicio
sudo systemctl start mysql
sudo systemctl enable mysql

# Verificar estado
sudo systemctl status mysql
```

### 4.2 - Configurar Seguridad (Ejecutar paso a paso)

```bash
# Ejecutar configuración de seguridad
sudo mysql_secure_installation
```

**Responder a las preguntas:**
- Set root password: `YES` (elige una contraseña segura)
- Remove anonymous users: `YES`
- Disallow root login remotely: `NO` (si necesitas acceso remoto)
- Remove test database: `YES`
- Reload privilege tables: `YES`

### 4.3 - Crear Base de Datos (Copiar y Pegar TODO el bloque)

```bash
# Entrar a MySQL
sudo mysql -u root -p
```

**Dentro de MySQL, copiar y pegar esto:**

```sql
CREATE DATABASE soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'soshabilidoso'@'localhost' IDENTIFIED BY 'TU_PASSWORD_SEGURA_AQUI';
GRANT ALL PRIVILEGES ON soshabilidoso.* TO 'soshabilidoso'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**⚠️ IMPORTANTE:** Cambia `TU_PASSWORD_SEGURA_AQUI` por una contraseña real.

### 4.4 - Verificar Base de Datos

```bash
# Conectar con el nuevo usuario
mysql -u soshabilidoso -p

# Dentro de MySQL:
SHOW DATABASES;
# Debes ver: soshabilidoso

EXIT;
```

---

## 🌐 PASO 5: Instalar Nginx

### Copiar y Pegar - Bloque Completo

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar y habilitar
sudo systemctl start nginx
sudo systemctl enable nginx

# Configurar firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Verificar estado
sudo systemctl status nginx
```

**Verificar en navegador:**
- Abre: `http://tu-ip-vps`
- Deberías ver la página de bienvenida de Nginx

---

## 📁 PASO 6: Clonar Repositorio

### Copiar y Pegar - Bloque Completo

```bash
# Crear directorio y clonar
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/redeshabilidosos/soshabilidoso-beta-0.1-latest.git soshabilidoso

# Dar permisos al usuario actual
sudo chown -R $USER:$USER /var/www/soshabilidoso

# Verificar
cd /var/www/soshabilidoso
ls -la
```

**Deberías ver:**
```
backend/
app/
components/
public/
...
```

---

## 🔧 PASO 7: Configurar Backend Django (EN ENTORNO VIRTUAL)

> ⚠️ **IMPORTANTE**: Todos los comandos de Django deben ejecutarse DENTRO del entorno virtual

### 7.1 - Instalar Dependencias del Sistema (FUERA del entorno virtual)

```bash
# Estas dependencias se instalan en el sistema, NO en el entorno virtual
sudo apt install -y python3.11-dev default-libmysqlclient-dev build-essential pkg-config
```

**¿Por qué?** Estas son librerías del sistema necesarias para compilar `mysqlclient`.

---

### 7.2 - Crear y Activar Entorno Virtual

```bash
# Ir al directorio del backend
cd /var/www/soshabilidoso/backend

# Crear entorno virtual con Python 3.11
python3.11 -m venv venv

# ✅ ACTIVAR el entorno virtual (MUY IMPORTANTE)
source venv/bin/activate

# Verificar que estás DENTRO del entorno virtual
# El prompt debe mostrar: (venv) usuario@servidor:~$
which python
# Debe mostrar: /var/www/soshabilidoso/backend/venv/bin/python
```

**¿Cómo saber si estoy en el entorno virtual?**
- Tu terminal mostrará `(venv)` al inicio de la línea
- `which python` apunta a `/var/www/soshabilidoso/backend/venv/bin/python`

---

### 7.3 - Actualizar pip (DENTRO del entorno virtual)

```bash
# ✅ Asegúrate de que el entorno virtual está activado
# Debes ver (venv) en tu terminal

pip install --upgrade pip setuptools wheel
```

---

### 7.4 - Instalar Django y Dependencias (DENTRO del entorno virtual)

#### Opción A: Usando requirements.txt (Recomendado)

```bash
# ✅ Asegúrate de que el entorno virtual está activado
# Debes ver (venv) en tu terminal

pip install -r requirements.txt
```

#### Opción B: Instalación Manual (si no existe requirements.txt)

```bash
# ✅ Asegúrate de que el entorno virtual está activado
# Debes ver (venv) en tu terminal

# Django Core
pip install django==5.0.1
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install djangorestframework-simplejwt==5.3.1

# Base de Datos
pip install mysqlclient==2.2.1

# WebSockets
pip install channels==4.0.0
pip install daphne==4.0.0
pip install channels-redis==4.1.0
pip install redis==5.0.1

# Utilidades
pip install pillow==10.1.0
pip install python-dotenv==1.0.0
pip install django-filter==23.5

# Servidor de Producción
pip install gunicorn==21.2.0
```

---

### 7.5 - Verificar Instalación (DENTRO del entorno virtual)

```bash
# ✅ Asegúrate de que el entorno virtual está activado
# Debes ver (venv) en tu terminal

# Verificar versión de Django
python -m django --version
# Debe mostrar: 5.0.1

# Verificar cada módulo
python -c "import django; print('✅ Django instalado correctamente')"
python -c "import rest_framework; print('✅ Django REST Framework instalado')"
python -c "import channels; print('✅ Channels instalado')"
python -c "import MySQLdb; print('✅ mysqlclient instalado')"
python -c "import redis; print('✅ Redis instalado')"
python -c "import gunicorn; print('✅ Gunicorn instalado')"

# Ver todas las dependencias instaladas
pip list
```

**Si todos los comandos funcionan sin errores, ¡Django está correctamente instalado!**

---

### 7.6 - Desactivar Entorno Virtual (cuando termines)

```bash
# Para salir del entorno virtual
deactivate

# Ahora tu terminal NO mostrará (venv)
```

**¿Cuándo desactivar?**
- Solo cuando hayas terminado de trabajar con Django
- Para ejecutar comandos del sistema
- Para cambiar a otro proyecto

**¿Cómo volver a activar?**
```bash
cd /var/www/soshabilidoso/backend
source venv/bin/activate
```

---

### 📝 Resumen: ¿Entorno Virtual o No?

| Comando | ¿Dónde ejecutar? | ¿Por qué? |
|---------|------------------|-----------|
| `sudo apt install python3.11-dev` | ❌ FUERA del venv | Dependencias del sistema |
| `python3.11 -m venv venv` | ❌ FUERA del venv | Crear el entorno |
| `source venv/bin/activate` | ❌ FUERA del venv | Activar el entorno |
| `pip install django` | ✅ DENTRO del venv | Instalar paquetes Python |
| `python manage.py migrate` | ✅ DENTRO del venv | Comandos de Django |
| `python manage.py runserver` | ✅ DENTRO del venv | Ejecutar Django |
| `deactivate` | ✅ DENTRO del venv | Salir del entorno |

---

### 7.7 - Configurar Variables de Entorno (.env)

```bash
# ✅ Puedes estar DENTRO o FUERA del entorno virtual para esto

# Crear archivo .env en el directorio backend
nano /var/www/soshabilidoso/backend/.env
```

**Contenido del archivo .env:**

```env
# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==========================================
DB_NAME=soshabilidoso
DB_USER=soshabilidoso
DB_PASSWORD=tu_password_segura_aqui
DB_HOST=localhost
DB_PORT=3306

# ==========================================
# CONFIGURACIÓN DE DJANGO
# ==========================================
SECRET_KEY=tu-secret-key-super-segura-cambiar-esto
DEBUG=False
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com,tu-ip-vps,localhost

# ==========================================
# CORS (Cross-Origin Resource Sharing)
# ==========================================
CORS_ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com

# ==========================================
# REDIS (para WebSockets y Cache)
# ==========================================
REDIS_HOST=localhost
REDIS_PORT=6379

# ==========================================
# ARCHIVOS MEDIA Y STATIC
# ==========================================
MEDIA_ROOT=/var/www/soshabilidoso/backend/media
STATIC_ROOT=/var/www/soshabilidoso/backend/staticfiles
```

**Guardar y salir:**
- Presiona `Ctrl + O` para guardar
- Presiona `Enter` para confirmar
- Presiona `Ctrl + X` para salir

---

### 7.8 - Migrar Base de Datos (DENTRO del entorno virtual)

```bash
# ✅ ACTIVAR el entorno virtual si no está activo
cd /var/www/soshabilidoso/backend
source venv/bin/activate

# Verificar que estás en el entorno virtual
# Debes ver (venv) en tu terminal

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones a la base de datos
python manage.py migrate

# Crear superusuario para el admin de Django
python manage.py createsuperuser
# Te pedirá:
# - Username: admin (o el que prefieras)
# - Email: tu-email@ejemplo.com
# - Password: (elige una contraseña segura)
# - Password (again): (repite la contraseña)

# Recolectar archivos estáticos
python manage.py collectstatic --noinput

# Crear directorios para archivos media
mkdir -p media/avatars media/posts media/stories media/covers
chmod -R 755 media
```

**¿Qué hace cada comando?**
- `makemigrations`: Crea archivos de migración basados en los modelos
- `migrate`: Aplica las migraciones a la base de datos MySQL
- `createsuperuser`: Crea un usuario administrador
- `collectstatic`: Recopila archivos CSS/JS en un solo directorio
- `mkdir -p`: Crea directorios para subir imágenes/videos

---

### 7.9 - Probar Django (DENTRO del entorno virtual)

```bash
# ✅ Asegúrate de que el entorno virtual está activado

# Probar que Django funciona
python manage.py check

# Debe mostrar: System check identified no issues (0 silenced).

# Probar servidor de desarrollo (SOLO PARA PRUEBA)
python manage.py runserver 0.0.0.0:8000

# Abre en tu navegador: http://tu-ip-vps:8000
# Deberías ver la página de Django

# Presiona Ctrl+C para detener el servidor
```

**⚠️ IMPORTANTE:** El servidor de desarrollo es SOLO para pruebas. En producción usaremos Gunicorn.

---

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

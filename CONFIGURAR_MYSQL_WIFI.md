# Configurar MySQL XAMPP para Acceso desde Xiaomi

**Fecha:** 28 de Enero de 2026  
**Estado:** Guía de configuración

---

## 🎯 OBJETIVO

Permitir que tu Xiaomi acceda a la base de datos MySQL de XAMPP a través de WiFi.

---

## 📋 CONFIGURACIÓN ACTUAL

### Base de Datos
- **Host**: `127.0.0.1` (solo local)
- **Puerto**: `3307`
- **Base de datos**: `habilidosos_db`
- **Usuario**: `root`
- **Contraseña**: (vacía)

### Red
- **IP PC**: `192.168.78.173`
- **IP Xiaomi**: En la misma red WiFi

---

## 🔧 PASOS DE CONFIGURACIÓN

### Paso 1: Configurar MySQL para Escuchar en Todas las Interfaces

#### 1.1 Abrir XAMPP Control Panel
- Abre XAMPP Control Panel
- Click en "Config" junto a MySQL
- Selecciona "my.ini"

#### 1.2 Editar my.ini
Busca la línea:
```ini
bind-address = 127.0.0.1
```

Cámbiala a:
```ini
bind-address = 0.0.0.0
```

O comenta la línea:
```ini
# bind-address = 127.0.0.1
```

#### 1.3 Guardar y Reiniciar MySQL
- Guarda el archivo
- En XAMPP Control Panel: Stop MySQL
- Luego: Start MySQL

---

### Paso 2: Crear Usuario MySQL para Acceso Remoto

#### 2.1 Abrir phpMyAdmin
- Abre navegador: `http://localhost/phpmyadmin`
- O desde XAMPP: Click en "Admin" junto a MySQL

#### 2.2 Ir a Usuarios
- Click en pestaña "Cuentas de usuario"
- Click en "Agregar cuenta de usuario"

#### 2.3 Crear Usuario Remoto
```sql
-- Opción A: Usuario específico para tu red
CREATE USER 'root'@'192.168.78.%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.78.%';
FLUSH PRIVILEGES;

-- Opción B: Usuario para cualquier IP (menos seguro)
CREATE USER 'root'@'%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

**Recomendación**: Usa Opción A (más seguro)

---

### Paso 3: Configurar Firewall de Windows

#### 3.1 Crear Regla para MySQL
Ejecuta como Administrador:

```powershell
netsh advfirewall firewall add rule name="MySQL XAMPP" dir=in action=allow protocol=TCP localport=3307
```

O usa el script que voy a crear: `permitir-mysql-wifi.bat`

---

### Paso 4: Actualizar Configuración de Django

#### 4.1 Editar backend/.env

Cambia:
```env
DATABASE_HOST=127.0.0.1
```

A:
```env
DATABASE_HOST=0.0.0.0
```

O mejor aún, usa variable de entorno:
```env
# Para desarrollo local
DATABASE_HOST=127.0.0.1

# Para acceso desde Xiaomi (descomentar cuando uses móvil)
# DATABASE_HOST=192.168.78.173
```

---

### Paso 5: Verificar Conexión desde Xiaomi

#### 5.1 Probar Conexión
Desde tu PC, prueba que MySQL acepta conexiones remotas:

```bash
# Usando MySQL client
mysql -h 192.168.78.173 -P 3307 -u root -p habilidosos_db
```

Si funciona, tu Xiaomi también podrá conectarse.

---

## 🔒 SEGURIDAD

### Recomendaciones

#### 1. Usar Contraseña
En lugar de contraseña vacía:

```sql
-- Cambiar contraseña de root
ALTER USER 'root'@'192.168.78.%' IDENTIFIED BY 'tu_contraseña_segura';
FLUSH PRIVILEGES;
```

Luego actualiza `.env`:
```env
DATABASE_PASSWORD=tu_contraseña_segura
```

#### 2. Limitar Acceso por IP
Solo permite tu red local:
```sql
-- Solo tu red 192.168.78.x
CREATE USER 'root'@'192.168.78.%' IDENTIFIED BY 'password';
```

#### 3. Permisos Específicos
No des todos los permisos:
```sql
-- Solo permisos necesarios
GRANT SELECT, INSERT, UPDATE, DELETE ON habilidosos_db.* TO 'root'@'192.168.78.%';
```

---

## 🧪 TESTING

### Test 1: Verificar Puerto Abierto
```bash
netstat -ano | findstr ":3307"
```

Deberías ver:
```
TCP    0.0.0.0:3307           0.0.0.0:0              LISTENING
```

### Test 2: Verificar Firewall
```bash
netsh advfirewall firewall show rule name="MySQL XAMPP"
```

### Test 3: Probar Conexión desde PC
```bash
mysql -h 192.168.78.173 -P 3307 -u root -p
```

### Test 4: Probar desde Django
```bash
cd backend
python manage.py dbshell
```

---

## 🔄 CONFIGURACIÓN DINÁMICA

### Opción 1: Dos Archivos .env

**backend/.env.local** (desarrollo en PC):
```env
DATABASE_HOST=127.0.0.1
```

**backend/.env.mobile** (desarrollo en móvil):
```env
DATABASE_HOST=192.168.78.173
```

Usa según necesites:
```bash
# Para PC
copy backend\.env.local backend\.env

# Para móvil
copy backend\.env.mobile backend\.env
```

---

### Opción 2: Variable de Entorno

**backend/sos_habilidoso/settings.py**:
```python
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DATABASE_NAME', 'habilidosos_db'),
        'USER': os.getenv('DATABASE_USER', 'root'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD', ''),
        'HOST': os.getenv('DATABASE_HOST', '127.0.0.1'),
        'PORT': os.getenv('DATABASE_PORT', '3307'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}
```

Luego en `.env`:
```env
# Automático: usa IP local si está disponible
DATABASE_HOST=${PC_IP:-127.0.0.1}
```

---

## 📱 CONFIGURACIÓN FINAL PARA XIAOMI

### backend/.env
```env
# Permitir acceso desde cualquier host en red local
ALLOWED_HOSTS=127.0.0.1,localhost,192.168.78.173

# MySQL accesible desde red
DATABASE_HOST=192.168.78.173
DATABASE_PORT=3307
DATABASE_NAME=habilidosos_db
DATABASE_USER=root
DATABASE_PASSWORD=

# Backend URL para Xiaomi
BACKEND_URL=http://192.168.78.173:8000

# CORS para Xiaomi
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:4000,http://127.0.0.1:4000,http://192.168.78.173:4000
```

---

## 🆘 TROUBLESHOOTING

### Error: "Can't connect to MySQL server"

**Causa**: MySQL no acepta conexiones remotas

**Solución**:
1. Verifica `bind-address` en `my.ini`
2. Reinicia MySQL en XAMPP
3. Verifica firewall

---

### Error: "Access denied for user 'root'@'192.168.78.x'"

**Causa**: Usuario no tiene permisos desde esa IP

**Solución**:
```sql
-- En phpMyAdmin
GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'root'@'192.168.78.%';
FLUSH PRIVILEGES;
```

---

### Error: "Connection timed out"

**Causa**: Firewall bloqueando puerto 3307

**Solución**:
```bash
# Ejecutar como Administrador
netsh advfirewall firewall add rule name="MySQL XAMPP" dir=in action=allow protocol=TCP localport=3307
```

---

### MySQL no inicia después de cambiar my.ini

**Causa**: Error de sintaxis en my.ini

**Solución**:
1. Revisa logs: `xampp/mysql/data/mysql_error.log`
2. Revierte cambios en my.ini
3. Reinicia MySQL

---

## 📊 VERIFICACIÓN COMPLETA

### Checklist
- [ ] `my.ini` configurado con `bind-address = 0.0.0.0`
- [ ] MySQL reiniciado
- [ ] Usuario remoto creado
- [ ] Firewall configurado
- [ ] `.env` actualizado con IP correcta
- [ ] Conexión probada desde PC
- [ ] App en Xiaomi puede acceder a datos

---

## 💡 TIPS

### Tip 1: Usar IP Dinámica
Si tu IP cambia frecuentemente:
```bash
# Script para obtener IP automáticamente
$IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*"}).IPAddress
echo "DATABASE_HOST=$IP" >> backend\.env
```

### Tip 2: Logs de MySQL
Para ver errores de conexión:
```
xampp/mysql/data/mysql_error.log
```

### Tip 3: Monitorear Conexiones
```sql
-- Ver conexiones activas
SHOW PROCESSLIST;

-- Ver usuarios conectados
SELECT user, host FROM mysql.user;
```

---

## 🚀 PRÓXIMOS PASOS

Después de configurar:

1. **Reinicia todo**:
   - MySQL en XAMPP
   - Backend Django
   - App en Xiaomi

2. **Verifica**:
   - Login funciona
   - Posts se cargan
   - Datos se guardan

3. **Optimiza**:
   - Agrega contraseña a MySQL
   - Limita permisos
   - Configura SSL (opcional)

---

**Creado por:** Kiro AI Assistant  
**Estado:** Guía completa de configuración  
**Siguiente:** Ejecutar scripts de configuración


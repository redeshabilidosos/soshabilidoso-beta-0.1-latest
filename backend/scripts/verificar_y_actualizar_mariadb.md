# 🔄 Guía para Actualizar MariaDB y Configurar phpMyAdmin

## 📋 Paso 1: Verificar Versión Actual

```bash
# Verificar versión actual
mysql --version
```

**Versión actual detectada**: MariaDB 10.4.32  
**Versión requerida**: MariaDB 10.5 o superior

## 🚀 Paso 2: Descargar MariaDB Actualizado

### Opción A: MariaDB 11.x (Recomendado)

1. **Descargar MariaDB 11.5 (última versión estable)**
   - URL: https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.5.2&os=windows&cpu=x86_64&pkg=msi
   - O visita: https://mariadb.org/download/

2. **Seleccionar**:
   - Version: 11.5.2 (o la más reciente)
   - OS: Windows
   - Package: MSI Package

### Opción B: MariaDB 10.11 LTS

1. **Descargar MariaDB 10.11 LTS**
   - URL: https://mariadb.org/download/?t=mariadb&p=mariadb&r=10.11&os=windows&cpu=x86_64&pkg=msi

## 📦 Paso 3: Instalar MariaDB

### Antes de Instalar - IMPORTANTE ⚠️

**Hacer backup de tus bases de datos actuales:**

```bash
# Backup de habilidosos_clean
"C:\Program Files\MariaDB 12.0\bin\mysqldump.exe" -u root -P 3307 habilidosos_clean > backup_habilidosos_clean.sql

# Backup de cualquier otra base de datos importante
"C:\Program Files\MariaDB 12.0\bin\mysqldump.exe" -u root -P 3307 --all-databases > backup_all_databases.sql
```

### Durante la Instalación:

1. **Ejecutar el instalador MSI**
2. **Configuración importante**:
   - ✅ Puerto: **3307** (mantener el mismo)
   - ✅ Root password: (dejar vacío o establecer uno)
   - ✅ Instalar como servicio de Windows
   - ✅ Habilitar acceso de red
   - ✅ Usar UTF8 como charset por defecto

3. **Opciones recomendadas**:
   - ✅ Enable networking
   - ✅ TCP/IP Port: 3307
   - ✅ Create database: (opcional)
   - ✅ Use UTF8 as default server's character set

## 🔄 Paso 4: Restaurar Bases de Datos

Después de instalar la nueva versión:

```bash
# Restaurar habilidosos_clean
mysql -u root -P 3307 < backup_habilidosos_clean.sql

# O restaurar todas las bases de datos
mysql -u root -P 3307 < backup_all_databases.sql
```

## 🗄️ Paso 5: Crear Base de Datos habilidosos_db

```bash
# Crear la base de datos
mysql -u root -P 3307 -e "CREATE DATABASE IF NOT EXISTS habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 🐍 Paso 6: Ejecutar Migraciones de Django

```bash
cd backend

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (si es necesario)
python create_test_admin.py
```

## 🌐 Paso 7: Configurar phpMyAdmin

### Si ya tienes phpMyAdmin instalado:

1. **Editar config.inc.php**
   - Ubicación típica: `C:\xampp\phpMyAdmin\config.inc.php`
   - O: `C:\wamp64\apps\phpmyadmin\config.inc.php`

2. **Agregar servidor MariaDB**:

```php
/* Server: MariaDB 3307 */
$i++;
$cfg['Servers'][$i]['verbose'] = 'MariaDB 3307 - SOS-HABILIDOSO';
$cfg['Servers'][$i]['host'] = '127.0.0.1';
$cfg['Servers'][$i]['port'] = '3307';
$cfg['Servers'][$i]['socket'] = '';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['user'] = '';
$cfg['Servers'][$i]['password'] = '';
$cfg['Servers'][$i]['AllowNoPassword'] = true;
```

3. **Reiniciar Apache** (si usas XAMPP/WAMP)

### Si NO tienes phpMyAdmin:

#### Opción 1: Instalar con XAMPP

1. **Descargar XAMPP**
   - URL: https://www.apachefriends.org/download.html
   - Instalar solo Apache y phpMyAdmin

2. **Configurar como se indicó arriba**

#### Opción 2: Instalar phpMyAdmin standalone

1. **Descargar phpMyAdmin**
   - URL: https://www.phpmyadmin.net/downloads/
   
2. **Extraer en una carpeta**
   - Ejemplo: `C:\phpmyadmin`

3. **Crear config.inc.php**:

```php
<?php
$cfg['blowfish_secret'] = 'tu-clave-secreta-aqui-32-caracteres';

$i = 0;
$i++;
$cfg['Servers'][$i]['verbose'] = 'MariaDB 3307';
$cfg['Servers'][$i]['host'] = '127.0.0.1';
$cfg['Servers'][$i]['port'] = '3307';
$cfg['Servers'][$i]['socket'] = '';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['user'] = '';
$cfg['Servers'][$i]['password'] = '';
$cfg['Servers'][$i]['AllowNoPassword'] = true;

$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';
?>
```

4. **Ejecutar con PHP**:

```bash
cd C:\phpmyadmin
php -S localhost:8080
```

5. **Acceder**: http://localhost:8080

## ✅ Paso 8: Verificar Todo Funciona

### Verificar MariaDB:

```bash
# Verificar versión
mysql -u root -P 3307 -e "SELECT VERSION();"

# Verificar bases de datos
mysql -u root -P 3307 -e "SHOW DATABASES;"

# Verificar tablas en habilidosos_db
mysql -u root -P 3307 -e "USE habilidosos_db; SHOW TABLES;"
```

### Verificar Django:

```bash
cd backend
python manage.py runserver
```

Acceder a: http://127.0.0.1:8000/admin/

### Verificar phpMyAdmin:

1. Abrir phpMyAdmin en tu navegador
2. Seleccionar servidor "MariaDB 3307"
3. Login con usuario: root, password: (vacío o tu password)
4. Verificar que aparezcan las bases de datos:
   - ✅ habilidosos_clean
   - ✅ habilidosos_db

## 🎯 Resultado Final

Después de completar todos los pasos, tendrás:

- ✅ MariaDB 10.5+ o 11.x funcionando en puerto 3307
- ✅ Base de datos `habilidosos_clean` intacta
- ✅ Base de datos `habilidosos_db` con todas las tablas de Django
- ✅ phpMyAdmin configurado para acceder a ambas bases de datos
- ✅ Django funcionando con MySQL
- ✅ Panel de administración con todas las funcionalidades

## 🆘 Solución de Problemas

### Error: "Can't connect to MySQL server"

```bash
# Verificar que el servicio esté corriendo
net start MariaDB

# O reiniciar el servicio
net stop MariaDB
net start MariaDB
```

### Error: "Access denied for user 'root'"

```bash
# Resetear password de root
mysql -u root -P 3307 --skip-password
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '';
mysql> FLUSH PRIVILEGES;
```

### Error en phpMyAdmin: "Cannot connect to server"

- Verificar que el puerto en config.inc.php sea 3307
- Verificar que MariaDB esté corriendo
- Reiniciar Apache

## 📞 Comandos Útiles

```bash
# Ver servicios de MariaDB
sc query MariaDB

# Iniciar servicio
net start MariaDB

# Detener servicio
net stop MariaDB

# Ver procesos en puerto 3307
netstat -ano | findstr :3307

# Conectar a MySQL
mysql -u root -P 3307

# Ver bases de datos
mysql -u root -P 3307 -e "SHOW DATABASES;"
```

## 🎉 ¡Listo!

Una vez completados todos los pasos, podrás:
- Ver y gestionar todas las tablas en phpMyAdmin
- Usar el panel de administración de Django
- Tener ambas bases de datos funcionando sin conflictos

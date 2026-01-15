# 🚀 Guía Rápida: Actualizar MariaDB y Ver en phpMyAdmin

## ⚡ Proceso Rápido (3 Pasos)

### 📦 PASO 1: Preparar (5 minutos)

```powershell
# Ejecutar como Administrador
cd backend\scripts
.\preparar_actualizacion_mariadb.ps1
```

Este script:
- ✅ Hace backup de todas tus bases de datos
- ✅ Guarda habilidosos_clean de forma segura
- ✅ Crea carpeta con backups con fecha

### 🔄 PASO 2: Actualizar MariaDB (10 minutos)

1. **Descargar MariaDB 11.5**
   - Link directo: https://dlm.mariadb.com/3883863/MariaDB/mariadb-11.5.2/winx64-packages/mariadb-11.5.2-winx64.msi
   - O desde: https://mariadb.org/download/

2. **Instalar**
   - ✅ Puerto: **3307**
   - ✅ Root password: **(dejar vacío)**
   - ✅ Charset: **UTF8**
   - ✅ Instalar como servicio

3. **Durante instalación**:
   - Si pregunta por datos existentes: **Mantener**
   - Si pregunta por actualizar: **Sí**

### ✅ PASO 3: Configurar (5 minutos)

```powershell
# Ejecutar como Administrador
cd backend\scripts
.\despues_actualizar_mariadb.ps1
```

Este script:
- ✅ Verifica la nueva versión
- ✅ Crea base de datos habilidosos_db
- ✅ Ejecuta migraciones de Django
- ✅ Verifica que todo funcione

## 🌐 Configurar phpMyAdmin

### Si tienes XAMPP/WAMP:

1. **Abrir**: `C:\xampp\phpMyAdmin\config.inc.php`
   (o `C:\wamp64\apps\phpmyadmin\config.inc.php`)

2. **Agregar al final**:

```php
/* MariaDB 3307 - SOS-HABILIDOSO */
$i++;
$cfg['Servers'][$i]['verbose'] = 'MariaDB 3307 - SOS-HABILIDOSO';
$cfg['Servers'][$i]['host'] = '127.0.0.1';
$cfg['Servers'][$i]['port'] = '3307';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['AllowNoPassword'] = true;
```

3. **Reiniciar Apache**

4. **Acceder**: http://localhost/phpmyadmin
   - Seleccionar servidor: "MariaDB 3307 - SOS-HABILIDOSO"
   - Usuario: root
   - Password: (vacío)

### Si NO tienes phpMyAdmin:

**Opción Rápida - Instalar XAMPP:**

1. Descargar: https://www.apachefriends.org/download.html
2. Instalar solo Apache y phpMyAdmin
3. Configurar como arriba

## ✅ Verificar que Todo Funciona

### 1. Verificar MariaDB:

```bash
mysql -u root -P 3307 -e "SELECT VERSION();"
mysql -u root -P 3307 -e "SHOW DATABASES;"
```

Deberías ver:
- ✅ habilidosos_clean
- ✅ habilidosos_db

### 2. Verificar Django:

```bash
cd backend
python manage.py runserver
```

Acceder: http://127.0.0.1:8000/admin/
- Usuario: admin@test.com
- Password: admin123

### 3. Verificar phpMyAdmin:

1. Abrir phpMyAdmin
2. Seleccionar servidor "MariaDB 3307"
3. Ver bases de datos:
   - ✅ habilidosos_clean (intacta)
   - ✅ habilidosos_db (con tablas de Django)

## 🎯 Resultado Final

Después de completar estos pasos tendrás:

- ✅ MariaDB 11.5 funcionando en puerto 3307
- ✅ habilidosos_clean intacta y funcionando
- ✅ habilidosos_db con todas las tablas de Django
- ✅ phpMyAdmin configurado para ambas bases de datos
- ✅ Panel de administración Django funcionando
- ✅ Todas las funcionalidades operativas:
  - Banear usuarios
  - Gestionar publicidad
  - Ver finanzas
  - Dashboard con estadísticas

## 🆘 Problemas Comunes

### "No se puede conectar a MariaDB"

```bash
# Iniciar servicio
net start MariaDB

# O reiniciar
net stop MariaDB
net start MariaDB
```

### "Access denied for user 'root'"

```bash
mysql -u root -P 3307 --skip-password
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '';
mysql> FLUSH PRIVILEGES;
```

### "Django no puede conectar"

Verificar archivo `backend/.env`:
```
DATABASE_PORT=3307
DATABASE_NAME=habilidosos_db
DATABASE_USER=root
DATABASE_PASSWORD=
```

## 📞 Comandos Útiles

```bash
# Ver versión
mysql -u root -P 3307 -e "SELECT VERSION();"

# Ver bases de datos
mysql -u root -P 3307 -e "SHOW DATABASES;"

# Ver tablas en habilidosos_db
mysql -u root -P 3307 -e "USE habilidosos_db; SHOW TABLES;"

# Conectar a MySQL
mysql -u root -P 3307

# Ver servicios
sc query MariaDB

# Iniciar/Detener servicio
net start MariaDB
net stop MariaDB
```

## 📁 Archivos de Ayuda

- `verificar_y_actualizar_mariadb.md` - Guía detallada completa
- `preparar_actualizacion_mariadb.ps1` - Script de preparación
- `despues_actualizar_mariadb.ps1` - Script post-instalación
- `create_habilidosos_db.sql` - Script SQL completo

## 🎉 ¡Listo!

Una vez completado, podrás:
- Ver todas las tablas en phpMyAdmin
- Gestionar usuarios, publicidad y finanzas desde Django Admin
- Tener ambas bases de datos funcionando sin conflictos
- Desarrollar con MySQL en lugar de SQLite

---

**Tiempo total estimado**: 20-30 minutos  
**Dificultad**: Fácil  
**Riesgo**: Bajo (con backups automáticos)

# ⚡ COMANDOS RÁPIDOS: Migración de Base de Datos

## 🖥️ EN TU PC (Windows)

### 1. Exportar Base de Datos Local

```bash
cd backend\scripts
exportar-bd-local.bat
```

### 2. Transferir al VPS (Opción SCP)

```bash
scp backup_habilidosos_*.sql root@76.13.122.81:/var/www/soshabilidoso/backend/
```

---

## 🌐 EN EL VPS (Ubuntu)

### 3. Conectar al VPS

```bash
ssh root@76.13.122.81
```

### 4. Navegar al Directorio

```bash
cd /var/www/soshabilidoso/backend
```

### 5. Importar Base de Datos

**Opción A - Script Automático:**
```bash
bash scripts/importar-bd-produccion.sh backup_habilidosos_20260211_143022.sql
```

**Opción B - Manual:**
```bash
mysql -usoshabilidoso -pSosHabilidoso2024!Secure soshabilidoso < backup_habilidosos_20260211_143022.sql
```

### 6. Activar Entorno Virtual

```bash
source venv/bin/activate
```

### 7. Sincronizar Migraciones Django

```bash
python manage.py showmigrations
python manage.py migrate
```

### 8. Verificar Datos

```bash
python manage.py dbshell
```

En MySQL:
```sql
SHOW TABLES;
SELECT COUNT(*) FROM users_customuser;
SELECT COUNT(*) FROM posts_post;
EXIT;
```

### 9. Crear Superusuario (si es necesario)

```bash
python manage.py createsuperuser
```

### 10. Recolectar Archivos Estáticos

```bash
python manage.py collectstatic --noinput
```

### 11. Crear Directorios Media

```bash
mkdir -p media/profiles media/posts media/stories media/videos
chmod -R 755 media
```

---

## ✅ Verificación Final

```bash
# Verificar Django
python -m django --version

# Verificar conexión a BD
python manage.py dbshell

# Ver migraciones aplicadas
python manage.py showmigrations

# Probar servidor de desarrollo (opcional)
python manage.py runserver 0.0.0.0:8000
```

---

## 🔄 Si Necesitas Reimportar

```bash
# Eliminar base de datos
mysql -uroot -p
DROP DATABASE soshabilidoso;
CREATE DATABASE soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Importar de nuevo
mysql -usoshabilidoso -pSosHabilidoso2024!Secure soshabilidoso < backup_habilidosos_*.sql

# Sincronizar migraciones
source venv/bin/activate
python manage.py migrate
```

---

## 📝 Notas Importantes

- **Puerto Local**: 3307 (XAMPP/WAMP)
- **Puerto Producción**: 3306 (MySQL estándar)
- **Esto NO afecta la migración** - son entornos independientes
- Cada entorno usa su propio archivo `.env`
- Los datos se transfieren sin problemas entre puertos diferentes

---

## 🆘 Comandos de Emergencia

### MySQL no responde:
```bash
sudo systemctl restart mysql
sudo systemctl status mysql
```

### Verificar usuario y permisos:
```bash
mysql -uroot -p
SELECT User, Host FROM mysql.user WHERE User='soshabilidoso';
SHOW GRANTS FOR 'soshabilidoso'@'localhost';
EXIT;
```

### Ver logs de MySQL:
```bash
sudo tail -f /var/log/mysql/error.log
```

### Verificar espacio en disco:
```bash
df -h
```

---

**Archivo generado**: 11 de febrero de 2026
**VPS**: 76.13.122.81
**Dominio**: www.soshabilidoso.com

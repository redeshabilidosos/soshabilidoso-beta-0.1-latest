# 🗄️ GUÍA: MIGRAR BASE DE DATOS DE LOCAL A PRODUCCIÓN

## 📋 Resumen
Esta guía te ayudará a exportar tu base de datos local (puerto 3307) e importarla en el servidor de producción (puerto 3306).

---

## 🔧 OPCIÓN 1: Usando Scripts Automatizados (RECOMENDADO)

### Paso 1: Exportar Base de Datos Local

En tu PC Windows, ejecuta:

```bash
cd backend/scripts
exportar-bd-local.bat
```

Esto creará un archivo como: `backup_habilidosos_20260211_143022.sql`

### Paso 2: Transferir el Archivo al VPS

**Opción A - Usando SCP (desde PowerShell o CMD):**
```bash
scp backup_habilidosos_*.sql root@76.13.122.81:/var/www/soshabilidoso/backend/
```

**Opción B - Usando WinSCP o FileZilla:**
1. Conecta a: `76.13.122.81`
2. Usuario: `root`
3. Sube el archivo a: `/var/www/soshabilidoso/backend/`

### Paso 3: Importar en el VPS

Conéctate al VPS:
```bash
ssh root@76.13.122.81
```

Navega al directorio:
```bash
cd /var/www/soshabilidoso/backend
```

Ejecuta el script de importación:
```bash
bash scripts/importar-bd-produccion.sh backup_habilidosos_20260211_143022.sql
```

---

## 🔧 OPCIÓN 2: Comandos Manuales

### Paso 1: Exportar desde Local (Windows)

Abre CMD o PowerShell y ejecuta:

```bash
# Para XAMPP
C:\xampp\mysql\bin\mysqldump.exe -uroot -P3307 --single-transaction --routines --triggers habilidosos_db > backup.sql

# Para WAMP
C:\wamp64\bin\mysql\mysql8.0.x\bin\mysqldump.exe -uroot -P3307 --single-transaction --routines --triggers habilidosos_db > backup.sql
```

### Paso 2: Transferir al VPS

```bash
scp backup.sql root@76.13.122.81:/var/www/soshabilidoso/backend/
```

### Paso 3: Importar en VPS

```bash
# Conectar al VPS
ssh root@76.13.122.81

# Navegar al directorio
cd /var/www/soshabilidoso/backend

# Importar la base de datos
mysql -usoshabilidoso -pSosHabilidoso2024!Secure soshabilidoso < backup.sql
```

---

## 🔧 OPCIÓN 3: Usando phpMyAdmin (Más Visual)

### Exportar desde Local:

1. Abre phpMyAdmin local: `http://localhost/phpmyadmin`
2. Selecciona la base de datos `habilidosos_db`
3. Click en la pestaña "Exportar"
4. Selecciona:
   - Método: Rápido
   - Formato: SQL
5. Click en "Continuar"
6. Guarda el archivo `habilidosos_db.sql`

### Importar en Producción:

**Si tienes phpMyAdmin en el VPS:**
1. Abre phpMyAdmin: `http://76.13.122.81/phpmyadmin`
2. Selecciona la base de datos `soshabilidoso`
3. Click en "Importar"
4. Selecciona el archivo exportado
5. Click en "Continuar"

**Si NO tienes phpMyAdmin, usa la línea de comandos:**
```bash
# Transferir archivo
scp habilidosos_db.sql root@76.13.122.81:/tmp/

# Conectar al VPS
ssh root@76.13.122.81

# Importar
mysql -usoshabilidoso -pSosHabilidoso2024!Secure soshabilidoso < /tmp/habilidosos_db.sql
```

---

## ✅ Verificar la Importación

Después de importar, verifica que todo esté correcto:

```bash
# Conectar al VPS
ssh root@76.13.122.81

# Activar entorno virtual
cd /var/www/soshabilidoso/backend
source venv/bin/activate

# Verificar tablas
python manage.py dbshell
```

En el shell de MySQL:
```sql
SHOW TABLES;
SELECT COUNT(*) FROM users_customuser;
SELECT COUNT(*) FROM posts_post;
EXIT;
```

---

## 🔄 Sincronizar Migraciones de Django

Después de importar, ejecuta las migraciones para asegurar que todo esté sincronizado:

```bash
cd /var/www/soshabilidoso/backend
source venv/bin/activate

# Ver estado de migraciones
python manage.py showmigrations

# Aplicar migraciones pendientes
python manage.py migrate

# Crear superusuario si es necesario
python manage.py createsuperuser
```

---

## 📊 Comparar Estructuras (Opcional)

Si quieres verificar que ambas bases de datos tengan la misma estructura:

**En Local:**
```bash
C:\xampp\mysql\bin\mysqldump.exe -uroot -P3307 --no-data habilidosos_db > estructura_local.sql
```

**En Producción:**
```bash
mysqldump -usoshabilidoso -pSosHabilidoso2024!Secure --no-data soshabilidoso > estructura_produccion.sql
```

Luego compara ambos archivos con un editor de texto.

---

## ⚠️ IMPORTANTE: Diferencias de Puerto

- **Local**: Puerto 3307 (XAMPP/WAMP)
- **Producción**: Puerto 3306 (MySQL estándar)

Esto NO afecta la migración porque:
1. Cada entorno usa su propio archivo `.env`
2. El puerto solo importa para la conexión, no para los datos
3. Los archivos SQL son independientes del puerto

---

## 🚨 Solución de Problemas

### Error: "Access denied for user"
```bash
# Verificar que el usuario tenga permisos
mysql -uroot -p
GRANT ALL PRIVILEGES ON soshabilidoso.* TO 'soshabilidoso'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Error: "Unknown database"
```bash
# Crear la base de datos primero
mysql -uroot -p
CREATE DATABASE soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Error: "Table already exists"
```bash
# Eliminar la base de datos y volver a crearla
mysql -uroot -p
DROP DATABASE soshabilidoso;
CREATE DATABASE soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Luego importar de nuevo
mysql -usoshabilidoso -pSosHabilidoso2024!Secure soshabilidoso < backup.sql
```

### Archivo SQL muy grande
```bash
# Comprimir antes de transferir
gzip backup.sql

# Transferir comprimido
scp backup.sql.gz root@76.13.122.81:/var/www/soshabilidoso/backend/

# Descomprimir e importar en el VPS
ssh root@76.13.122.81
cd /var/www/soshabilidoso/backend
gunzip backup.sql.gz
mysql -usoshabilidoso -pSosHabilidoso2024!Secure soshabilidoso < backup.sql
```

---

## 📝 Checklist Final

- [ ] Base de datos exportada desde local
- [ ] Archivo transferido al VPS
- [ ] Base de datos importada en producción
- [ ] Migraciones de Django ejecutadas
- [ ] Tablas verificadas
- [ ] Superusuario creado
- [ ] Datos de prueba verificados

---

## 🎯 Próximos Pasos

Después de migrar la base de datos, continúa con:
1. Recolectar archivos estáticos: `python manage.py collectstatic`
2. Configurar Nginx
3. Configurar Gunicorn/Daphne
4. Configurar SSL con Let's Encrypt

Ver: `GUIA_DESPLIEGUE_VPS_UBUNTU.md` - Paso 9 en adelante

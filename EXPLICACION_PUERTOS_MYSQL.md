# 🔌 EXPLICACIÓN: Puertos MySQL 3307 vs 3306

## ❓ ¿Por qué son diferentes los puertos?

### Puerto 3307 (Local - XAMPP/WAMP)
- **Razón**: XAMPP y WAMP usan puerto no estándar para evitar conflictos
- **Conflictos comunes**: 
  - Otras instalaciones de MySQL
  - MariaDB
  - Servicios de Windows
- **Configuración**: Se define en `my.ini` o `my.cnf` de XAMPP/WAMP

### Puerto 3306 (Producción - VPS Ubuntu)
- **Razón**: Puerto estándar de MySQL en Linux
- **Ventaja**: Configuración por defecto, sin conflictos
- **Estándar**: Usado en el 99% de servidores de producción

---

## ✅ ¿Afecta la Migración de Datos?

### Respuesta Corta: NO

### Respuesta Larga:

El puerto es solo el "canal de comunicación" entre tu aplicación y MySQL. Los datos en sí son independientes del puerto.

**Analogía**: Es como cambiar de número de teléfono. Tus contactos (datos) siguen siendo los mismos, solo cambia el número para llamarte (puerto).

---

## 🔄 Cómo Funciona la Migración

```
┌─────────────────────────────────────────────────────────┐
│  PC LOCAL (Windows)                                      │
│  ┌─────────────────────────────────────────────┐        │
│  │  MySQL en puerto 3307                        │        │
│  │  Base de datos: habilidosos_db               │        │
│  │  Datos: usuarios, posts, etc.                │        │
│  └─────────────────────────────────────────────┘        │
│                      ↓                                   │
│  ┌─────────────────────────────────────────────┐        │
│  │  mysqldump exporta a archivo SQL             │        │
│  │  backup_habilidosos_20260211.sql             │        │
│  │  (Archivo de texto con comandos SQL)         │        │
│  └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
                        ↓
              [Transferencia SCP/FTP]
                        ↓
┌─────────────────────────────────────────────────────────┐
│  VPS UBUNTU (Producción)                                 │
│  ┌─────────────────────────────────────────────┐        │
│  │  Archivo SQL recibido                        │        │
│  │  backup_habilidosos_20260211.sql             │        │
│  └─────────────────────────────────────────────┘        │
│                      ↓                                   │
│  ┌─────────────────────────────────────────────┐        │
│  │  mysql importa desde archivo SQL             │        │
│  │  MySQL en puerto 3306                        │        │
│  │  Base de datos: soshabilidoso                │        │
│  │  Datos: usuarios, posts, etc. (IDÉNTICOS)   │        │
│  └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Configuración en Cada Entorno

### Local - `backend/.env`

```env
# Desarrollo local con XAMPP/WAMP
DATABASE_NAME=habilidosos_db
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3307  ← Puerto no estándar
```

### Producción - `backend/.env` (en VPS)

```env
# Producción en VPS Ubuntu
DB_NAME=soshabilidoso
DB_USER=soshabilidoso
DB_PASSWORD=SosHabilidoso2024!Secure
DB_HOST=localhost
DB_PORT=3306  ← Puerto estándar
```

---

## 🔍 Verificación de Puertos

### En Windows (Local):

```bash
# Ver qué está usando el puerto 3307
netstat -ano | findstr :3307

# Conectar a MySQL local
mysql -uroot -P3307 -h127.0.0.1
```

### En Ubuntu (VPS):

```bash
# Ver qué está usando el puerto 3306
sudo netstat -tlnp | grep :3306

# Conectar a MySQL producción
mysql -usoshabilidoso -p -P3306 -hlocalhost
```

---

## 🛠️ Comandos de Conexión

### Exportar (Local - Puerto 3307):

```bash
# XAMPP
C:\xampp\mysql\bin\mysqldump.exe -uroot -P3307 habilidosos_db > backup.sql

# WAMP
C:\wamp64\bin\mysql\mysql8.0.x\bin\mysqldump.exe -uroot -P3307 habilidosos_db > backup.sql
```

### Importar (Producción - Puerto 3306):

```bash
# En VPS Ubuntu
mysql -usoshabilidoso -pSosHabilidoso2024!Secure -P3306 soshabilidoso < backup.sql

# O sin especificar puerto (usa 3306 por defecto)
mysql -usoshabilidoso -pSosHabilidoso2024!Secure soshabilidoso < backup.sql
```

---

## 🎯 Puntos Clave

1. **Los puertos son diferentes, pero los datos son los mismos**
2. **El archivo SQL es independiente del puerto**
3. **Cada entorno tiene su propio `.env` con su puerto**
4. **La migración funciona sin problemas entre puertos diferentes**
5. **Django se conecta al puerto correcto según el `.env` activo**

---

## 🔐 Seguridad de Puertos

### Local (3307):
- ✅ Accesible solo desde tu PC
- ✅ Sin contraseña (desarrollo)
- ✅ No expuesto a internet

### Producción (3306):
- ✅ Accesible solo desde localhost
- ✅ Con contraseña fuerte
- ✅ Firewall configurado
- ✅ Solo Django puede conectarse

---

## 📊 Comparación Visual

| Aspecto | Local (3307) | Producción (3306) |
|---------|--------------|-------------------|
| **Sistema Operativo** | Windows | Ubuntu Linux |
| **Software MySQL** | XAMPP/WAMP | MySQL Server |
| **Puerto** | 3307 | 3306 |
| **Razón del puerto** | Evitar conflictos | Puerto estándar |
| **Usuario** | root | soshabilidoso |
| **Password** | (vacío) | SosHabilidoso2024!Secure |
| **Base de datos** | habilidosos_db | soshabilidoso |
| **Host** | 127.0.0.1 | localhost |
| **Acceso externo** | No | No (solo localhost) |

---

## 🚀 Flujo de Trabajo Completo

```bash
# 1. DESARROLLO LOCAL (Puerto 3307)
# Trabajas en tu PC con XAMPP/WAMP
# Django se conecta a: 127.0.0.1:3307

# 2. EXPORTAR DATOS
# mysqldump lee de puerto 3307
# Genera archivo SQL (independiente del puerto)

# 3. TRANSFERIR
# Copias el archivo SQL al VPS
# El archivo no contiene información del puerto

# 4. IMPORTAR EN PRODUCCIÓN (Puerto 3306)
# mysql lee el archivo SQL
# Inserta datos en puerto 3306
# Django se conecta a: localhost:3306

# 5. RESULTADO
# Mismos datos en ambos entornos
# Diferentes puertos, pero funcionan igual
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo cambiar el puerto en producción?
Sí, pero no es recomendado. El puerto 3306 es el estándar.

### ¿Puedo usar puerto 3306 en local?
Sí, si no tienes conflictos. Pero XAMPP/WAMP usan 3307 por defecto.

### ¿Los datos se corrompen al cambiar de puerto?
No, el puerto no afecta los datos en absoluto.

### ¿Necesito modificar el archivo SQL?
No, el archivo SQL es independiente del puerto.

### ¿Django detecta automáticamente el puerto?
Sí, lee el puerto del archivo `.env` correspondiente.

---

## 🎓 Conclusión

**El puerto es solo la "puerta" para acceder a MySQL. Los datos (la "casa") son los mismos sin importar qué puerta uses.**

- Puerto 3307 en local: Puerta de tu casa
- Puerto 3306 en producción: Puerta de la oficina
- Los muebles (datos) son los mismos, solo cambia la ubicación

**La migración funciona perfectamente entre puertos diferentes.**

---

**Última actualización**: 11 de febrero de 2026

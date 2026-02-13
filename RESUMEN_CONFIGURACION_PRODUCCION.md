# 📋 RESUMEN: Configuración de Producción Completa

## ✅ Archivos Creados

### 1. `.env.production` - Configuración de Producción
**Ubicación**: `backend/.env.production`

**Contenido clave**:
- Dominio: `www.soshabilidoso.com`
- IP VPS: `76.13.122.81`
- Base de datos: `soshabilidoso` (puerto 3306)
- Usuario DB: `soshabilidoso`
- Password DB: `SosHabilidoso2024!Secure`
- Google Sheets webhooks incluidos
- Redis configurado para WebSockets
- Seguridad SSL habilitada

### 2. `exportar-bd-local.bat` - Script de Exportación
**Ubicación**: `backend/scripts/exportar-bd-local.bat`

**Función**: Exporta tu base de datos local (puerto 3307) a un archivo SQL

**Uso**:
```bash
cd backend/scripts
exportar-bd-local.bat
```

### 3. `importar-bd-produccion.sh` - Script de Importación
**Ubicación**: `backend/scripts/importar-bd-produccion.sh`

**Función**: Importa el archivo SQL en el servidor de producción

**Uso en VPS**:
```bash
bash scripts/importar-bd-produccion.sh backup_habilidosos_YYYYMMDD_HHMMSS.sql
```

### 4. `GUIA_MIGRACION_BASE_DATOS.md` - Guía Detallada
**Ubicación**: `GUIA_MIGRACION_BASE_DATOS.md`

**Contenido**:
- 3 opciones de migración (scripts, manual, phpMyAdmin)
- Solución de problemas comunes
- Verificación de importación
- Sincronización de migraciones Django

### 5. `GUIA_DESPLIEGUE_VPS_UBUNTU.md` - Actualizada
**Ubicación**: `GUIA_DESPLIEGUE_VPS_UBUNTU.md`

**Nuevas secciones**:
- Nota sobre diferencia de puertos (3307 vs 3306)
- Paso 7.8 - OPCIÓN A: Importar base de datos existente
- Paso 7.8 - OPCIÓN B: Crear base de datos nueva
- Referencias a la guía de migración

---

## 🔧 Diferencias: Local vs Producción

| Aspecto | Local (Desarrollo) | Producción (VPS) |
|---------|-------------------|------------------|
| **Puerto MySQL** | 3307 (XAMPP/WAMP) | 3306 (estándar) |
| **Base de datos** | `habilidosos_db` | `soshabilidoso` |
| **Usuario DB** | `root` (sin password) | `soshabilidoso` |
| **Dominio** | `localhost:3000` | `www.soshabilidoso.com` |
| **Backend URL** | `http://192.168.78.173:8000` | `https://www.soshabilidoso.com` |
| **DEBUG** | `True` | `False` |
| **SSL** | No | Sí (Let's Encrypt) |
| **Archivo .env** | `backend/.env` | `backend/.env` (diferente contenido) |

---

## 📝 Proceso de Migración de Base de Datos

### Flujo Completo:

```
┌─────────────────────────────────────────────────────────────┐
│  1. EXPORTAR (PC Local - Windows)                           │
│     cd backend/scripts                                       │
│     exportar-bd-local.bat                                    │
│     → Genera: backup_habilidosos_YYYYMMDD_HHMMSS.sql       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. TRANSFERIR (PC → VPS)                                    │
│     scp backup_*.sql root@76.13.122.81:/var/www/...        │
│     O usar WinSCP/FileZilla                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. IMPORTAR (VPS Ubuntu)                                    │
│     bash scripts/importar-bd-produccion.sh backup_*.sql     │
│     O manualmente con mysql                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. SINCRONIZAR (VPS - Django)                               │
│     source venv/bin/activate                                 │
│     python manage.py migrate                                 │
│     python manage.py collectstatic                           │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ IMPORTANTE: Puerto 3307 vs 3306

### ¿Por qué son diferentes?

- **Local (3307)**: XAMPP/WAMP usa puerto no estándar para evitar conflictos
- **Producción (3306)**: Puerto estándar de MySQL en servidores Linux

### ¿Afecta la migración?

**NO**, porque:
1. El puerto es solo para la conexión, no para los datos
2. Los archivos SQL son independientes del puerto
3. Cada entorno usa su propio `.env` con su puerto correspondiente

### Configuración en cada entorno:

**Local** (`backend/.env`):
```env
DATABASE_PORT=3307
DATABASE_HOST=127.0.0.1
```

**Producción** (`backend/.env` en VPS):
```env
DB_PORT=3306
DB_HOST=localhost
```

---

## 🚀 Próximos Pasos en el Despliegue

Después de migrar la base de datos:

1. ✅ **Recolectar archivos estáticos**
   ```bash
   python manage.py collectstatic --noinput
   ```

2. ✅ **Crear directorios media**
   ```bash
   mkdir -p /var/www/soshabilidoso/backend/media/{profiles,posts,stories,videos}
   ```

3. ✅ **Configurar Nginx** (Paso 10 de la guía)
   - Reverse proxy para Django
   - Servir archivos estáticos
   - Configurar dominio

4. ✅ **Configurar Gunicorn** (Paso 11)
   - Servir aplicación Django
   - Configurar workers

5. ✅ **Configurar Daphne** (Paso 12)
   - WebSockets para chat en tiempo real
   - Channels/Redis

6. ✅ **Configurar Frontend Next.js** (Paso 13)
   - Build de producción
   - PM2 para gestión de procesos

7. ✅ **Configurar SSL** (Paso 14)
   - Let's Encrypt
   - Certificados automáticos

---

## 📊 Checklist de Verificación

### Base de Datos:
- [ ] MySQL instalado y corriendo
- [ ] Base de datos `soshabilidoso` creada
- [ ] Usuario `soshabilidoso` con permisos
- [ ] Datos importados desde local
- [ ] Migraciones de Django aplicadas
- [ ] Superusuario creado

### Archivos de Configuración:
- [ ] `.env` configurado en VPS
- [ ] Dominio correcto: `www.soshabilidoso.com`
- [ ] Google Sheets webhooks incluidos
- [ ] Redis configurado
- [ ] Rutas de media/static correctas

### Scripts:
- [ ] `exportar-bd-local.bat` probado
- [ ] Archivo SQL generado
- [ ] Archivo transferido al VPS
- [ ] `importar-bd-produccion.sh` ejecutado
- [ ] Datos verificados en producción

---

## 🆘 Solución de Problemas Comunes

### Error: "Access denied for user"
```bash
# Verificar permisos en MySQL
mysql -uroot -p
GRANT ALL PRIVILEGES ON soshabilidoso.* TO 'soshabilidoso'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Can't connect to MySQL server"
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql
sudo systemctl start mysql
```

### Error: "Unknown database"
```bash
# Crear la base de datos
mysql -uroot -p
CREATE DATABASE soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error: "Table already exists"
```bash
# Eliminar y recrear la base de datos
mysql -uroot -p
DROP DATABASE soshabilidoso;
CREATE DATABASE soshabilidoso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# Luego importar de nuevo
```

---

## 📚 Documentación de Referencia

- **Guía principal**: `GUIA_DESPLIEGUE_VPS_UBUNTU.md`
- **Migración de BD**: `GUIA_MIGRACION_BASE_DATOS.md`
- **Configuración producción**: `backend/.env.production`
- **Scripts**: `backend/scripts/`

---

## 🎯 Estado Actual del Despliegue

### ✅ Completado:
- Instalación de Python 3.11
- Instalación de Django 5.0.1
- Creación de entorno virtual
- Configuración de archivo `.env`
- Repositorio clonado en `/var/www/soshabilidoso`

### 🔄 En Progreso:
- Migración de base de datos
- Configuración de servicios

### ⏳ Pendiente:
- Configuración de Nginx
- Configuración de Gunicorn/Daphne
- Instalación de Node.js y Next.js
- Configuración de PM2
- Configuración de SSL

---

## 💡 Consejos Finales

1. **Backup regular**: Exporta tu base de datos local frecuentemente
2. **Prueba local primero**: Verifica que todo funcione antes de desplegar
3. **Usa variables de entorno**: Nunca hardcodees credenciales
4. **Monitorea logs**: Revisa logs de Nginx, Gunicorn y Django
5. **SSL obligatorio**: Siempre usa HTTPS en producción

---

**Última actualización**: 11 de febrero de 2026
**VPS**: 76.13.122.81 (srv1341844.hstgr.cloud)
**Dominio**: www.soshabilidoso.com

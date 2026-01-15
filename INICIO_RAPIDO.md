# 🚀 Inicio Rápido - SOS-HABILIDOSO

## ⚡ Comando Principal

```bash
npm run soshabilidoso
```

Este comando inicia **TODO** automáticamente:
- ✅ Frontend (Next.js) en puerto 4000
- ✅ Backend (Django) en puerto 8000
- ✅ Verifica MySQL en puerto 3307

## 🌐 Accesos Después de Iniciar

### Frontend (Next.js)
- **Aplicación**: http://localhost:4000
- **Landing Page**: http://localhost:4000/landing.html
- **Registro Reality**: http://localhost:4000/register-habilidosos

### Backend (Django)
- **API**: http://127.0.0.1:8000/api/
- **Panel Admin**: http://127.0.0.1:8000/admin/
  - Usuario: `admin@test.com`
  - Password: `admin123`

### Base de Datos (MySQL)
- **Puerto**: 3307
- **Bases de datos**:
  - `habilidosos_clean` (Reality Show)
  - `habilidosos_db` (Django)

## 📋 Requisitos Previos

Antes de ejecutar `npm run soshabilidoso`, asegúrate de tener:

1. **Node.js** instalado
2. **Python 3.8+** instalado
3. **MySQL/MariaDB** corriendo en puerto 3307
4. **Dependencias instaladas**:
   ```bash
   npm install
   cd backend
   pip install -r requirements.txt
   ```

## 🔧 Comandos Alternativos

### Opción 1: Comando Simple (Recomendado)
```bash
npm run soshabilidoso
```

### Opción 2: Comando con Concurrently
```bash
npm run soshabilidoso:simple
```

### Opción 3: Iniciar por Separado

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# o
cd backend
python manage.py runserver 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# o
npm run dev
```

## 🛑 Detener los Servicios

Presiona `Ctrl+C` en la terminal donde ejecutaste el comando.

## 🆘 Solución de Problemas

### Error: "MySQL no detectado"

```bash
# Verificar que MySQL esté corriendo
net start MariaDB

# O verificar el puerto
netstat -ano | findstr :3307
```

### Error: "Puerto 4000 ya está en uso"

```bash
# Cambiar el puerto en package.json
"dev": "next dev -p 4001"
```

### Error: "Puerto 8000 ya está en uso"

```bash
# Matar el proceso en Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# O cambiar el puerto
python manage.py runserver 8001
```

### Error: "No se puede conectar a la base de datos"

1. Verificar que MySQL esté corriendo en puerto 3307
2. Verificar credenciales en `backend/.env`:
   ```
   DATABASE_PORT=3307
   DATABASE_NAME=habilidosos_db
   DATABASE_USER=root
   DATABASE_PASSWORD=
   ```

## 📊 Verificar que Todo Funciona

### 1. Verificar Frontend
Abre: http://localhost:4000

### 2. Verificar Backend
Abre: http://127.0.0.1:8000/api/

### 3. Verificar Admin
Abre: http://127.0.0.1:8000/admin/
Login con: admin@test.com / admin123

### 4. Verificar MySQL
```bash
mysql -u root -P 3307 -e "SHOW DATABASES;"
```

Deberías ver:
- habilidosos_clean
- habilidosos_db

## 🎯 Flujo de Trabajo Típico

1. **Iniciar todo**:
   ```bash
   npm run soshabilidoso
   ```

2. **Desarrollar**:
   - Edita archivos en `app/`, `components/`, etc. (Frontend)
   - Edita archivos en `backend/apps/` (Backend)
   - Los cambios se recargan automáticamente

3. **Ver cambios**:
   - Frontend: http://localhost:4000
   - Admin: http://127.0.0.1:8000/admin/

4. **Detener**:
   - Presiona `Ctrl+C`

## 📝 Scripts Disponibles

```bash
# Iniciar todo
npm run soshabilidoso

# Solo frontend
npm run dev
npm run dev:frontend

# Solo backend
npm run dev:backend

# Ambos con concurrently
npm run dev:both

# Build para producción
npm run build

# Configurar backend
npm run setup:backend
```

## 🔄 Actualizar Dependencias

```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

## 📚 Documentación Adicional

- `backend/CONFIGURACION_COMPLETADA.md` - Configuración de base de datos
- `backend/GUIA_RAPIDA_ACTUALIZACION.md` - Actualización de MariaDB
- `backend/scripts/config_phpmyadmin.php` - Configuración de phpMyAdmin

## 🎉 ¡Listo!

Ahora puedes iniciar toda la aplicación con un solo comando:

```bash
npm run soshabilidoso
```

Y acceder a:
- **Frontend**: http://localhost:4000
- **Admin**: http://127.0.0.1:8000/admin/
- **API**: http://127.0.0.1:8000/api/

---

**Versión**: 1.0.0  
**Fecha**: Noviembre 2025  
**Stack**: Next.js + Django + MySQL

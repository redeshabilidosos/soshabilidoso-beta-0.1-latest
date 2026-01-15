# Instrucciones para Reparar la Base de Datos

La base de datos tiene archivos corruptos (tablespaces huérfanos). Sigue estos pasos:

## Paso 1: Detener MySQL

**Opción A - Desde XAMPP Control Panel:**
1. Abre XAMPP Control Panel
2. Click en "Stop" en la fila de MySQL
3. Espera a que diga "Stopped"

**Opción B - Desde CMD como Administrador:**
```cmd
net stop mysql
```

## Paso 2: Eliminar la carpeta corrupta

1. Abre el Explorador de Windows
2. Ve a: `C:\xampp\mysql\data\`
3. Elimina la carpeta `habilidosos_db` completamente

## Paso 3: Iniciar MySQL

**Opción A - Desde XAMPP Control Panel:**
1. Click en "Start" en la fila de MySQL

**Opción B - Desde CMD como Administrador:**
```cmd
net start mysql
```

## Paso 4: Recrear la base de datos

Ejecuta en la terminal del proyecto:
```cmd
python recreate-database.py
```

## Usuarios creados

Después de ejecutar el script tendrás:
- **admin** / admin123 (administrador)
- **usuario1** / test123 (usuario normal)

## Iniciar el proyecto

```cmd
# Terminal 1 - Backend
cd backend
python manage.py runserver 8000

# Terminal 2 - Frontend  
npm run dev
```

#!/bin/bash
# Script final para configurar la base de datos en producción

set -e  # Detener en caso de error

echo "🚀 Configuración final de base de datos en producción"
echo "=================================================="
echo ""

# Paso 1: Crear nueva base de datos con nombre correcto
echo "📦 Paso 1: Creando base de datos habilidosos_db..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON habilidosos_db.* TO 'soshabilidoso'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
echo "✅ Base de datos creada"
echo ""

# Paso 2: Eliminar base de datos antigua
echo "🗑️  Paso 2: Eliminando base de datos antigua (soshabilidoso)..."
mysql -u root -p -e "DROP DATABASE IF EXISTS soshabilidoso;"
echo "✅ Base de datos antigua eliminada"
echo ""

# Paso 3: Actualizar archivo .env
echo "📝 Paso 3: Actualizando archivo .env..."
cd /var/www/soshabilidoso/backend
sed -i 's/DB_NAME=soshabilidoso/DB_NAME=habilidosos_db/' .env
echo "✅ Archivo .env actualizado"
echo ""

# Paso 4: Aplicar migraciones
echo "🔄 Paso 4: Aplicando migraciones..."
source venv/bin/activate
python manage.py migrate
echo "✅ Migraciones aplicadas"
echo ""

# Paso 5: Crear directorios necesarios
echo "📁 Paso 5: Creando directorios..."
mkdir -p media/profiles media/posts media/stories media/videos static_dev logs
chmod -R 755 media
echo "✅ Directorios creados"
echo ""

# Paso 6: Recolectar archivos estáticos
echo "📦 Paso 6: Recolectando archivos estáticos..."
python manage.py collectstatic --noinput
echo "✅ Archivos estáticos recolectados"
echo ""

echo "🎉 ¡Configuración completada!"
echo ""
echo "📝 Próximo paso:"
echo "   Crear superusuario: python manage.py createsuperuser"
echo ""

#!/bin/bash
# Script para resetear la base de datos en producción y aplicar migraciones desde cero

echo "🔄 Reseteando base de datos de producción..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
DB_NAME="soshabilidoso"
DB_USER="soshabilidoso"
DB_PASS="habilidosos'2024--"
DB_HOST="localhost"

echo -e "${YELLOW}⚠️  ADVERTENCIA: Este script eliminará TODAS las tablas de la base de datos${NC}"
echo -e "${YELLOW}⚠️  Base de datos: $DB_NAME${NC}"
echo ""
read -p "¿Estás seguro de continuar? (escribe 'SI' para confirmar): " confirmacion

if [ "$confirmacion" != "SI" ]; then
    echo -e "${RED}❌ Operación cancelada${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Confirmado. Procediendo...${NC}"
echo ""

# Paso 1: Eliminar todas las tablas
echo "📋 Paso 1: Obteniendo lista de tablas..."
TABLES=$(mysql -u "$DB_USER" -p"$DB_PASS" -h "$DB_HOST" "$DB_NAME" -Nse "SHOW TABLES;")

if [ -z "$TABLES" ]; then
    echo -e "${YELLOW}⚠️  No se encontraron tablas para eliminar${NC}"
else
    echo "🗑️  Paso 2: Eliminando tablas..."
    mysql -u "$DB_USER" -p"$DB_PASS" -h "$DB_HOST" "$DB_NAME" <<EOF
SET FOREIGN_KEY_CHECKS = 0;
$(echo "$TABLES" | awk '{print "DROP TABLE IF EXISTS \`" $1 "\`;"}')
SET FOREIGN_KEY_CHECKS = 1;
EOF
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Tablas eliminadas exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al eliminar tablas${NC}"
        exit 1
    fi
fi

echo ""
echo "🔄 Paso 3: Aplicando migraciones desde cero..."
cd /var/www/soshabilidoso/backend

# Activar entorno virtual
source venv/bin/activate

# Aplicar migraciones
python manage.py migrate

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migraciones aplicadas exitosamente${NC}"
else
    echo ""
    echo -e "${RED}❌ Error al aplicar migraciones${NC}"
    exit 1
fi

echo ""
echo "📁 Paso 4: Creando directorios necesarios..."
mkdir -p media/profiles media/posts media/stories media/videos static_dev logs
chmod -R 755 media

echo ""
echo "📦 Paso 5: Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo ""
echo -e "${GREEN}🎉 ¡Base de datos reseteada y configurada exitosamente!${NC}"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Crear superusuario: python manage.py createsuperuser"
echo "   2. Importar datos si es necesario"
echo ""

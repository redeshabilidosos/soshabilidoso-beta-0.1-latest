#!/bin/bash

# ========================================
# IMPORTAR BASE DE DATOS EN PRODUCCIÓN
# ========================================
# Ejecutar este script en el VPS Ubuntu
# ========================================

echo "========================================"
echo "IMPORTAR BASE DE DATOS A PRODUCCIÓN"
echo "========================================"
echo ""

# Configuración
DB_NAME="soshabilidoso"
DB_USER="soshabilidoso"
DB_PASSWORD="SosHabilidoso2024!Secure"
BACKUP_FILE="$1"

# Verificar que se proporcionó el archivo
if [ -z "$BACKUP_FILE" ]; then
    echo "ERROR: Debes proporcionar el archivo SQL"
    echo ""
    echo "Uso:"
    echo "  bash importar-bd-produccion.sh backup_habilidosos_YYYYMMDD_HHMMSS.sql"
    echo ""
    exit 1
fi

# Verificar que el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: El archivo $BACKUP_FILE no existe"
    echo ""
    echo "Archivos SQL disponibles:"
    ls -lh *.sql 2>/dev/null || echo "No hay archivos SQL en este directorio"
    echo ""
    exit 1
fi

echo "Base de datos: $DB_NAME"
echo "Usuario: $DB_USER"
echo "Archivo: $BACKUP_FILE"
echo ""

# Confirmar antes de importar
read -p "¿Deseas continuar con la importación? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Importación cancelada"
    exit 0
fi

echo ""
echo "Importando base de datos..."
echo ""

# Importar la base de datos
mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "IMPORTACIÓN EXITOSA"
    echo "========================================"
    echo "La base de datos ha sido importada correctamente"
    echo ""
    echo "SIGUIENTE PASO:"
    echo "Ejecuta las migraciones de Django para sincronizar:"
    echo "  cd /var/www/soshabilidoso/backend"
    echo "  source venv/bin/activate"
    echo "  python manage.py migrate"
    echo ""
else
    echo ""
    echo "========================================"
    echo "ERROR EN LA IMPORTACIÓN"
    echo "========================================"
    echo "Verifica:"
    echo "1. Que MySQL esté corriendo: systemctl status mysql"
    echo "2. Que las credenciales sean correctas"
    echo "3. Que la base de datos exista"
    echo ""
fi

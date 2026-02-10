"""
Script para registrar manualmente la migración sin usar RETURNING
"""
import os
import sys
import pymysql

# Configurar pymysql
pymysql.install_as_MySQLdb()

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')

# Patch para pymysql version
import MySQLdb
if hasattr(MySQLdb, '__version__'):
    MySQLdb._original_version = MySQLdb.__version__
    MySQLdb.__version__ = '2.2.1'
    MySQLdb.version_info = (2, 2, 1, 'final', 0)

# Patch para deshabilitar verificación de versión de MariaDB
from django.db.backends.mysql import base as mysql_base
def patched_check(self):
    pass
mysql_base.DatabaseWrapper.check_database_version_supported = patched_check

import django
django.setup()

from django.db import connection

def fix_migration_record():
    """Registrar manualmente la migración sin usar RETURNING"""
    print("=" * 60)
    print("REGISTRANDO MIGRACIÓN MANUALMENTE")
    print("=" * 60)
    
    with connection.cursor() as cursor:
        # Verificar si la migración ya está registrada
        cursor.execute(
            "SELECT COUNT(*) FROM django_migrations WHERE app = %s AND name = %s",
            ['site_settings', '0005_sitesettings_sidebar_show_classifieds_and_more']
        )
        count = cursor.fetchone()[0]
        
        if count > 0:
            print("✅ La migración ya está registrada")
            return True
        
        # Insertar el registro de migración SIN RETURNING
        try:
            cursor.execute(
                "INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, NOW())",
                ['site_settings', '0005_sitesettings_sidebar_show_classifieds_and_more']
            )
            print("✅ Migración registrada exitosamente")
            return True
        except Exception as e:
            print(f"❌ Error al registrar migración: {e}")
            return False

if __name__ == '__main__':
    try:
        success = fix_migration_record()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

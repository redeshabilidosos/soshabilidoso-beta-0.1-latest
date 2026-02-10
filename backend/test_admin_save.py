"""
Script para probar que el admin puede guardar sin errores de RETURNING
"""
import os
import sys
import pymysql

# Configurar pymysql
pymysql.install_as_MySQLdb()

# Patch para pymysql version
import MySQLdb
if hasattr(MySQLdb, '__version__'):
    MySQLdb._original_version = MySQLdb.__version__
    MySQLdb.__version__ = '2.2.1'
    MySQLdb.version_info = (2, 2, 1, 'final', 0)

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')

# Patch para deshabilitar verificación de versión de MariaDB
from django.db.backends.mysql import base as mysql_base
def patched_check(self):
    pass
mysql_base.DatabaseWrapper.check_database_version_supported = patched_check

import django
django.setup()

from apps.site_settings.models import SiteSettings
from django.contrib.admin.models import LogEntry

def test_site_settings_save():
    """Probar que SiteSettings se puede guardar sin errores"""
    print("=" * 60)
    print("PROBANDO GUARDADO DE SITE SETTINGS")
    print("=" * 60)
    
    try:
        # Obtener configuración
        settings = SiteSettings.get_settings()
        print(f"\n✅ Configuración obtenida: {settings.site_name}")
        
        # Modificar un campo
        original_value = settings.sidebar_show_clips
        settings.sidebar_show_clips = not original_value
        
        print(f"\n🔄 Cambiando sidebar_show_clips de {original_value} a {settings.sidebar_show_clips}")
        
        # Guardar
        settings.save()
        print("✅ Guardado exitoso!")
        
        # Restaurar valor original
        settings.sidebar_show_clips = original_value
        settings.save()
        print(f"✅ Valor restaurado a {original_value}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error al guardar: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_admin_log():
    """Probar que el admin log funciona sin RETURNING"""
    print("\n" + "=" * 60)
    print("PROBANDO ADMIN LOG (django_admin_log)")
    print("=" * 60)
    
    try:
        # Contar logs existentes
        count = LogEntry.objects.count()
        print(f"\n✅ Logs existentes: {count}")
        
        # Verificar que no se use RETURNING
        from django.db import connection
        features = connection.features
        
        print(f"\n📋 Features de la conexión:")
        print(f"   - can_return_columns_from_insert: {features.can_return_columns_from_insert}")
        print(f"   - can_return_rows_from_bulk_insert: {features.can_return_rows_from_bulk_insert}")
        print(f"   - supports_returning: {getattr(features, 'supports_returning', 'N/A')}")
        
        if features.can_return_columns_from_insert:
            print("\n⚠️  ADVERTENCIA: RETURNING está habilitado!")
            return False
        else:
            print("\n✅ RETURNING está correctamente deshabilitado")
            return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Función principal"""
    print("\n" + "🚀" * 30)
    print("PRUEBA DE GUARDADO EN ADMIN - MariaDB 10.4")
    print("🚀" * 30 + "\n")
    
    results = {
        'site_settings': test_site_settings_save(),
        'admin_log': test_admin_log()
    }
    
    print("\n" + "=" * 60)
    print("RESUMEN DE PRUEBAS")
    print("=" * 60)
    
    all_passed = all(results.values())
    
    for test, passed in results.items():
        status = "✅" if passed else "❌"
        print(f"{status} {test.replace('_', ' ').title()}")
    
    print("\n" + "=" * 60)
    
    if all_passed:
        print("✅ TODAS LAS PRUEBAS PASARON")
        print("\n🎉 El admin debería funcionar correctamente!")
        print("\n📝 Puedes guardar cambios en:")
        print("   http://127.0.0.1:8000/admin/site_settings/sitesettings/1/change/")
    else:
        print("⚠️  ALGUNAS PRUEBAS FALLARON")
        print("\n🔧 Revisa los errores arriba")
    
    print("=" * 60 + "\n")
    
    return all_passed

if __name__ == '__main__':
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

"""
Script para crear tablas usando Django ORM
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

# Configurar Django para usar MySQL
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

# Configurar para usar MySQL en puerto 3307
os.environ['DATABASE_PORT'] = '3307'
os.environ['DATABASE_NAME'] = 'habilidosos_db'

django.setup()

from django.core.management import call_command

def crear_tablas():
    """Crear tablas usando migraciones de Django"""
    print("=" * 60)
    print("🚀 CREANDO TABLAS EN MYSQL CON DJANGO")
    print("=" * 60)
    print("Base de datos: habilidosos_db")
    print("Puerto: 3307")
    print("=" * 60)
    
    try:
        # Crear migraciones
        print("\n📝 Creando migraciones...")
        call_command('makemigrations')
        
        # Aplicar migraciones
        print("\n📊 Aplicando migraciones...")
        call_command('migrate', '--run-syncdb')
        
        print("\n✅ ¡Tablas creadas exitosamente!")
        
        # Mostrar tablas creadas
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print(f"\n📊 Tablas creadas ({len(tables)}):")
        for table in tables:
            print(f"   - {table[0]}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    if crear_tablas():
        print("\n🎉 ¡Proceso completado exitosamente!")
    else:
        print("\n❌ Error al crear las tablas")

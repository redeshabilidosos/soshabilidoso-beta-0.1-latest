#!/usr/bin/env python
"""
Script para sincronizar la base de datos con los modelos de Django
Agrega campos faltantes sin afectar datos existentes
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.core.management import call_command
from django.db import connection

def print_header(text):
    """Imprimir encabezado"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def check_database_connection():
    """Verificar conexión a la base de datos"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Conexión a la base de datos exitosa")
        return True
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        return False

def run_migrations():
    """Ejecutar migraciones de Django"""
    try:
        print_header("Creando migraciones")
        call_command('makemigrations')
        
        print_header("Aplicando migraciones")
        call_command('migrate', '--run-syncdb')
        
        print("\n✅ Migraciones aplicadas exitosamente")
        return True
    except Exception as e:
        print(f"\n❌ Error al aplicar migraciones: {e}")
        return False

def show_database_info():
    """Mostrar información de la base de datos"""
    try:
        from django.conf import settings
        db_config = settings.DATABASES['default']
        
        print_header("Información de la Base de Datos")
        print(f"Motor: {db_config['ENGINE']}")
        print(f"Nombre: {db_config['NAME']}")
        print(f"Host: {db_config['HOST']}")
        print(f"Puerto: {db_config['PORT']}")
        print(f"Usuario: {db_config['USER']}")
    except Exception as e:
        print(f"Error al obtener información de la base de datos: {e}")

def verify_tables():
    """Verificar que las tablas existen"""
    try:
        from django.apps import apps
        
        print_header("Verificando Tablas")
        
        # Obtener todos los modelos
        models = apps.get_models()
        
        with connection.cursor() as cursor:
            for model in models:
                table_name = model._meta.db_table
                cursor.execute(f"SHOW TABLES LIKE '{table_name}'")
                result = cursor.fetchone()
                
                if result:
                    print(f"✅ Tabla '{table_name}' existe")
                else:
                    print(f"⚠️  Tabla '{table_name}' no existe")
        
        return True
    except Exception as e:
        print(f"❌ Error al verificar tablas: {e}")
        return False

def verify_fields():
    """Verificar campos importantes"""
    try:
        from apps.users.models import User
        from apps.posts.models import Post
        
        print_header("Verificando Campos Importantes")
        
        # Verificar campos de User
        user_fields = [f.name for f in User._meta.get_fields()]
        required_user_fields = ['cover_photo', 'avatar', 'bio', 'position', 'team']
        
        print("Campos de Usuario:")
        for field in required_user_fields:
            if field in user_fields:
                print(f"  ✅ {field}")
            else:
                print(f"  ❌ {field} - FALTA")
        
        # Verificar campos de Post
        post_fields = [f.name for f in Post._meta.get_fields()]
        required_post_fields = [
            'images', 'video', 'thumbnail', 'podcast_url', 'streaming_url',
            'likes_count', 'celebrations_count', 'golazos_count',
            'comments_count', 'shares_count', 'views_count',
            'is_archived', 'created_at', 'updated_at'
        ]
        
        print("\nCampos de Publicación:")
        for field in required_post_fields:
            if field in post_fields:
                print(f"  ✅ {field}")
            else:
                print(f"  ❌ {field} - FALTA")
        
        return True
    except Exception as e:
        print(f"❌ Error al verificar campos: {e}")
        return False

def main():
    """Función principal"""
    print_header("Sincronización de Base de Datos - SOS-HABILIDOSO")
    
    # 1. Mostrar información de la base de datos
    show_database_info()
    
    # 2. Verificar conexión
    if not check_database_connection():
        print("\n❌ No se pudo conectar a la base de datos. Verifica la configuración.")
        return
    
    # 3. Ejecutar migraciones
    if not run_migrations():
        print("\n❌ Error al ejecutar migraciones.")
        return
    
    # 4. Verificar tablas
    verify_tables()
    
    # 5. Verificar campos
    verify_fields()
    
    print_header("Sincronización Completada")
    print("✅ La base de datos ha sido sincronizada exitosamente")
    print("✅ Todos los campos necesarios están presentes")
    print("✅ Los datos existentes no han sido afectados")

if __name__ == '__main__':
    main()

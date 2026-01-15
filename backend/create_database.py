#!/usr/bin/env python
"""
Script para crear la base de datos PostgreSQL
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

def create_database():
    """Crear la base de datos si no existe"""
    
    # Configuración de conexión
    connection_params = {
        'host': 'localhost',
        'port': '5432',
        'user': 'postgres',
        'password': 'root007'
    }
    
    database_name = 'sos_habilidoso_db'
    
    try:
        # Conectar a PostgreSQL (base de datos por defecto)
        print("🔌 Conectando a PostgreSQL...")
        conn = psycopg2.connect(**connection_params)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Verificar si la base de datos existe
        cursor.execute(
            "SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s",
            (database_name,)
        )
        
        if cursor.fetchone():
            print(f"✅ La base de datos '{database_name}' ya existe")
        else:
            # Crear la base de datos
            print(f"🏗️  Creando base de datos '{database_name}'...")
            cursor.execute(f'CREATE DATABASE "{database_name}"')
            print(f"✅ Base de datos '{database_name}' creada exitosamente")
        
        cursor.close()
        conn.close()
        
        # Verificar conexión a la nueva base de datos
        print("🔍 Verificando conexión a la base de datos...")
        test_params = connection_params.copy()
        test_params['database'] = database_name
        
        test_conn = psycopg2.connect(**test_params)
        test_cursor = test_conn.cursor()
        test_cursor.execute("SELECT version();")
        version = test_cursor.fetchone()
        print(f"✅ Conexión exitosa. PostgreSQL version: {version[0]}")
        
        test_cursor.close()
        test_conn.close()
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Error de PostgreSQL: {e}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Iniciando creación de base de datos PostgreSQL...")
    
    if create_database():
        print("🎉 ¡Base de datos configurada correctamente!")
        print("\n📋 Próximos pasos:")
        print("1. python manage.py makemigrations")
        print("2. python manage.py migrate")
        print("3. python manage.py createsuperuser")
    else:
        print("💥 Error al configurar la base de datos")
        sys.exit(1)
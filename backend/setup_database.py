#!/usr/bin/env python
"""
Script para configurar la base de datos MySQL
Crea la base de datos y ejecuta las migraciones
"""

import os
import sys
import django
from django.conf import settings
from django.core.management import call_command

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

def setup_database():
    """Configurar la base de datos"""
    
    print("=" * 80)
    print("CONFIGURACIÓN DE BASE DE DATOS - SOS-HABILIDOSO")
    print("=" * 80)
    print()
    
    # Verificar conexión a MySQL
    print("1. Verificando conexión a MySQL...")
    try:
        import mysql.connector
        from mysql.connector import Error
        
        try:
            connection = mysql.connector.connect(
                host='127.0.0.1',
                user='root',
                password='',
                port=3307
            )
            
            if connection.is_connected():
                print("   ✅ Conexión a MySQL exitosa")
                cursor = connection.cursor()
                
                # Crear base de datos si no existe
                print("\n2. Creando base de datos 'habilidosos_db'...")
                try:
                    cursor.execute("CREATE DATABASE IF NOT EXISTS habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                    connection.commit()
                    print("   ✅ Base de datos creada/verificada")
                except Error as e:
                    print(f"   ❌ Error: {e}")
                    return False
                
                # Verificar tablas
                print("\n3. Verificando tablas...")
                cursor.execute("USE habilidosos_db")
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                
                if tables:
                    print(f"   ✅ Se encontraron {len(tables)} tablas")
                    for table in tables:
                        print(f"      - {table[0]}")
                else:
                    print("   ⚠️  No hay tablas. Se crearán con las migraciones")
                
                cursor.close()
                connection.close()
                
        except Error as e:
            print(f"   ❌ Error de conexión: {e}")
            print("   Asegúrate de que MySQL esté corriendo en puerto 3307")
            return False
            
    except ImportError:
        print("   ❌ mysql-connector-python no está instalado")
        print("   Instala con: pip install mysql-connector-python")
        return False
    
    # Ejecutar migraciones
    print("\n4. Ejecutando migraciones de Django...")
    try:
        django.setup()
        
        # Crear migraciones
        print("   - Creando migraciones...")
        call_command('makemigrations', verbosity=1)
        
        # Ejecutar migraciones
        print("   - Aplicando migraciones...")
        call_command('migrate', verbosity=1)
        
        print("   ✅ Migraciones ejecutadas exitosamente")
        
    except Exception as e:
        print(f"   ❌ Error en migraciones: {e}")
        return False
    
    # Crear superusuario (opcional)
    print("\n5. ¿Deseas crear un superusuario? (s/n): ", end="")
    response = input().strip().lower()
    
    if response == 's':
        try:
            call_command('createsuperuser', interactive=True)
            print("   ✅ Superusuario creado")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 80)
    print("✅ CONFIGURACIÓN COMPLETADA")
    print("=" * 80)
    print("\nPróximos pasos:")
    print("1. Inicia el backend: python manage.py runserver 0.0.0.0:8000")
    print("2. Inicia el frontend: npm run dev")
    print("3. Accede a: http://localhost:4000")
    print()
    
    return True

if __name__ == '__main__':
    success = setup_database()
    sys.exit(0 if success else 1)

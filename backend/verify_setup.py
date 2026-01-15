#!/usr/bin/env python
"""
Script para verificar la configuración de la aplicación
"""

import os
import sys

def verify_setup():
    """Verificar la configuración"""
    
    print("=" * 80)
    print("VERIFICACIÓN DE CONFIGURACIÓN - SOS-HABILIDOSO")
    print("=" * 80)
    print()
    
    checks = {
        'Python': False,
        'Django': False,
        'MySQL': False,
        'Base de datos': False,
        'Tablas': False,
        'Dependencias': False
    }
    
    # 1. Verificar Python
    print("1. Verificando Python...")
    try:
        import sys
        version = sys.version_info
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro}")
        checks['Python'] = True
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 2. Verificar Django
    print("\n2. Verificando Django...")
    try:
        import django
        print(f"   ✅ Django {django.get_version()}")
        checks['Django'] = True
    except ImportError:
        print("   ❌ Django no está instalado")
        print("   Instala con: pip install django")
    
    # 3. Verificar MySQL
    print("\n3. Verificando MySQL...")
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
                db_info = connection.get_server_info()
                print(f"   ✅ MySQL {db_info}")
                checks['MySQL'] = True
                
                # 4. Verificar base de datos
                print("\n4. Verificando base de datos...")
                cursor = connection.cursor()
                cursor.execute("SHOW DATABASES LIKE 'habilidosos_db'")
                result = cursor.fetchone()
                
                if result:
                    print("   ✅ Base de datos 'habilidosos_db' existe")
                    checks['Base de datos'] = True
                    
                    # 5. Verificar tablas
                    print("\n5. Verificando tablas...")
                    cursor.execute("USE habilidosos_db")
                    cursor.execute("SHOW TABLES")
                    tables = cursor.fetchall()
                    
                    if tables:
                        print(f"   ✅ Se encontraron {len(tables)} tablas:")
                        for table in tables:
                            print(f"      - {table[0]}")
                        checks['Tablas'] = True
                    else:
                        print("   ⚠️  No hay tablas. Ejecuta: python setup_database.py")
                else:
                    print("   ❌ Base de datos 'habilidosos_db' no existe")
                    print("   Ejecuta: python setup_database.py")
                
                cursor.close()
                connection.close()
                
        except Error as e:
            print(f"   ❌ Error de conexión: {e}")
            print("   Asegúrate de que MySQL esté corriendo en puerto 3307")
            
    except ImportError:
        print("   ❌ mysql-connector-python no está instalado")
        print("   Instala con: pip install mysql-connector-python")
    
    # 6. Verificar dependencias
    print("\n6. Verificando dependencias...")
    try:
        import rest_framework
        import corsheaders
        import rest_framework_simplejwt
        print("   ✅ Todas las dependencias instaladas")
        checks['Dependencias'] = True
    except ImportError as e:
        print(f"   ❌ Falta instalar: {e}")
        print("   Ejecuta: pip install -r requirements.txt")
    
    # Resumen
    print("\n" + "=" * 80)
    print("RESUMEN DE VERIFICACIÓN")
    print("=" * 80)
    
    for check, status in checks.items():
        status_str = "✅" if status else "❌"
        print(f"{status_str} {check}")
    
    all_ok = all(checks.values())
    
    print("\n" + "=" * 80)
    if all_ok:
        print("✅ TODO ESTÁ CONFIGURADO CORRECTAMENTE")
        print("=" * 80)
        print("\nPuedes iniciar el backend con:")
        print("python manage.py runserver 0.0.0.0:8000")
    else:
        print("❌ HAY PROBLEMAS DE CONFIGURACIÓN")
        print("=" * 80)
        print("\nSoluciona los problemas marcados con ❌")
        print("\nPasos recomendados:")
        print("1. Instala dependencias: pip install -r requirements.txt")
        print("2. Configura la BD: python setup_database.py")
        print("3. Verifica nuevamente: python verify_setup.py")
    
    print()
    
    return all_ok

if __name__ == '__main__':
    success = verify_setup()
    sys.exit(0 if success else 1)

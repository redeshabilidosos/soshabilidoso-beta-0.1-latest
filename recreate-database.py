#!/usr/bin/env python
"""
Script para recrear la base de datos habilidosos_db
"""
import subprocess
import sys
import os

def main():
    print("=" * 60)
    print("RECREANDO BASE DE DATOS habilidosos_db")
    print("=" * 60)
    
    try:
        import pymysql
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "pymysql"], check=True)
        import pymysql
    
    config = {
        'host': '127.0.0.1',
        'port': 3307,
        'user': 'root',
        'password': '',
    }
    
    print("\n[1/5] Conectando a MySQL...")
    conn = pymysql.connect(**config)
    cursor = conn.cursor()
    print("✓ Conexión exitosa")
    
    # Primero eliminar todas las tablas de la base de datos
    print("\n[2/5] Eliminando tablas corruptas...")
    try:
        cursor.execute("USE habilidosos_db")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        
        # Obtener todas las tablas
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        for (table,) in tables:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS `{table}`")
                print(f"  Eliminada: {table}")
            except Exception as e:
                print(f"  Error con {table}: {e}")
        
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        conn.commit()
    except Exception as e:
        print(f"  Info: {e}")
    
    # Ahora intentar eliminar y recrear la base de datos
    print("\n[3/5] Recreando base de datos...")
    try:
        cursor.execute("DROP DATABASE IF EXISTS habilidosos_db")
    except:
        pass
    
    try:
        cursor.execute("CREATE DATABASE habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        conn.commit()
        print("✓ Base de datos creada")
    except pymysql.err.ProgrammingError as e:
        if "database exists" in str(e).lower():
            print("✓ Base de datos ya existe (limpia)")
        else:
            raise
    
    cursor.close()
    conn.close()
    
    # Ejecutar migraciones
    print("\n[4/5] Ejecutando migraciones de Django...")
    
    # Usar Python del sistema directamente
    venv_python = "C:\\Python314\\python.exe"
    
    result = subprocess.run(
        [venv_python, "manage.py", "migrate"],
        cwd="backend",
        capture_output=True,
        text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    print("✓ Migraciones aplicadas")
    
    # Crear usuarios
    print("\n[5/5] Creando usuarios...")
    
    create_users = '''
import os, sys
sys.path.insert(0, ".")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sos_habilidoso.settings.development")
import django
django.setup()
from apps.users.models import User

if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser(username="admin", email="admin@habilidosos.com", password="admin123", first_name="Admin", last_name="Sistema")
    print("admin creado")

if not User.objects.filter(username="usuario1").exists():
    User.objects.create_user(username="usuario1", email="usuario1@test.com", password="test123", first_name="Usuario", last_name="Prueba")
    print("usuario1 creado")

print(f"Total: {User.objects.count()} usuarios")
'''
    
    result = subprocess.run([venv_python, "-c", create_users], cwd="backend", capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr)
    
    print("\n" + "=" * 60)
    print("¡LISTO! Usuarios: admin/admin123, usuario1/test123")
    print("=" * 60)

if __name__ == "__main__":
    main()

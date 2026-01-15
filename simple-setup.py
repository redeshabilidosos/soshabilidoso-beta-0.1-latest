#!/usr/bin/env python3
"""
Script simple para configurar SQLite sin emojis
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    print("Configuracion SQLite para SOS-HABILIDOSO")
    print("=" * 60)
    
    # Cambiar al directorio backend
    backend_dir = Path('backend')
    if not backend_dir.exists():
        print("ERROR: Directorio backend/ no encontrado")
        return False
    
    os.chdir(backend_dir)
    print("Cambiado al directorio backend")
    
    # Ejecutar migraciones directamente
    print("\nEjecutando migraciones...")
    
    try:
        # Makemigrations
        print("1. Creando migraciones...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'makemigrations', 
            '--settings=sos_habilidoso.settings.sqlite'
        ], capture_output=True, text=True, encoding='utf-8', errors='ignore')
        
        print("Makemigrations completado")
        
        # Migrate
        print("2. Aplicando migraciones...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'migrate',
            '--settings=sos_habilidoso.settings.sqlite'
        ], capture_output=True, text=True, encoding='utf-8', errors='ignore')
        
        if result.returncode == 0:
            print("EXITO: Migraciones aplicadas")
        else:
            print(f"ERROR en migraciones: {result.stderr}")
            return False
        
        # Crear superusuario
        print("3. Creando usuario...")
        
        # Configurar Django
        sys.path.append(str(Path.cwd()))
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.sqlite')
        
        import django
        django.setup()
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Crear usuario molo
        if not User.objects.filter(email='molo@molo.com').exists():
            user = User.objects.create_user(
                email='molo@molo.com',
                username='molo',
                display_name='Molo Usuario',
                password='molo123456',
                position='Jugador',
                team='Los Molos FC',
                bio='Usuario de prueba',
                is_verified=True
            )
            print(f"EXITO: Usuario creado - {user.display_name} (@{user.username})")
        else:
            user = User.objects.get(email='molo@molo.com')
            print(f"Usuario ya existe - {user.display_name} (@{user.username})")
        
        # Crear admin
        if not User.objects.filter(email='admin@test.com').exists():
            admin = User.objects.create_user(
                email='admin@test.com',
                username='admin',
                display_name='Administrador',
                password='admin123456',
                is_staff=True,
                is_superuser=True
            )
            print(f"EXITO: Admin creado - {admin.display_name}")
        else:
            print("Admin ya existe")
        
        print("\n" + "=" * 60)
        print("CONFIGURACION COMPLETADA")
        print("=" * 60)
        print("Base de datos: SQLite (db.sqlite3)")
        print("")
        print("Usuarios creados:")
        print("  Email: molo@molo.com")
        print("  Password: molo123456")
        print("")
        print("  Email: admin@test.com")
        print("  Password: admin123456 (Admin)")
        print("")
        print("Para iniciar el servidor:")
        print("  python manage.py runserver --settings=sos_habilidoso.settings.sqlite")
        print("")
        print("Admin panel: http://localhost:8000/admin/")
        print("API: http://localhost:8000/api/")
        
        return True
        
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    try:
        success = main()
        if success:
            print("\nCONFIGURACION EXITOSA!")
        else:
            print("\nCONFIGURACION FALLIDA")
    except Exception as e:
        print(f"ERROR INESPERADO: {e}")
        import traceback
        traceback.print_exc()
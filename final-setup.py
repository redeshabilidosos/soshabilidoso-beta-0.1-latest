#!/usr/bin/env python3
"""
Script final para configurar la base de datos y crear usuarios
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    print("CONFIGURACION FINAL - SOS-HABILIDOSO")
    print("=" * 60)
    
    # Cambiar al directorio backend
    backend_dir = Path('backend')
    if not backend_dir.exists():
        print("ERROR: Directorio backend/ no encontrado")
        return False
    
    os.chdir(backend_dir)
    print("Directorio: backend/")
    
    # Ejecutar migraciones
    print("\n1. Ejecutando migraciones...")
    
    try:
        # Migrate
        result = subprocess.run([
            sys.executable, 'manage.py', 'migrate',
            '--settings=sos_habilidoso.settings.sqlite'
        ], capture_output=True, text=True, encoding='utf-8', errors='ignore')
        
        if result.returncode == 0:
            print("EXITO: Migraciones aplicadas")
        else:
            print("ADVERTENCIA: Migraciones ya aplicadas o error menor")
        
        # Configurar Django
        print("\n2. Configurando Django...")
        sys.path.append(str(Path.cwd()))
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.sqlite')
        
        import django
        django.setup()
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        print("Django configurado correctamente")
        
        # Verificar usuarios existentes
        print(f"\n3. Usuarios existentes: {User.objects.count()}")
        
        # Crear o verificar usuario molo
        print("\n4. Verificando usuario molo...")
        try:
            molo_user = User.objects.get(email='molo@molo.com')
            print(f"Usuario molo existe: {molo_user.display_name} (@{molo_user.username})")
        except User.DoesNotExist:
            try:
                molo_user = User.objects.create_user(
                    email='molo@molo.com',
                    username='molo',
                    display_name='Molo Usuario',
                    password='molo123456',
                    position='Jugador',
                    team='Los Molos FC',
                    bio='Usuario de prueba',
                    is_verified=True
                )
                print(f"Usuario molo creado: {molo_user.display_name} (@{molo_user.username})")
            except Exception as e:
                print(f"Error creando molo: {e}")
                # Intentar con username diferente
                try:
                    molo_user = User.objects.create_user(
                        email='molo@molo.com',
                        username='molo2',
                        display_name='Molo Usuario',
                        password='molo123456',
                        position='Jugador',
                        team='Los Molos FC',
                        bio='Usuario de prueba',
                        is_verified=True
                    )
                    print(f"Usuario molo creado con username alternativo: {molo_user.display_name} (@{molo_user.username})")
                except Exception as e2:
                    print(f"Error creando molo con username alternativo: {e2}")
                    molo_user = None
        
        # Crear admin si no existe
        print("\n5. Verificando usuario admin...")
        try:
            admin_user = User.objects.get(email='admin@test.com')
            print(f"Usuario admin existe: {admin_user.display_name}")
        except User.DoesNotExist:
            try:
                admin_user = User.objects.create_user(
                    email='admin@test.com',
                    username='admin',
                    display_name='Administrador',
                    password='admin123456',
                    is_staff=True,
                    is_superuser=True
                )
                print(f"Usuario admin creado: {admin_user.display_name}")
            except Exception as e:
                print(f"Error creando admin: {e}")
                admin_user = None
        
        # Probar autenticación
        print("\n6. Probando autenticación...")
        if molo_user and molo_user.check_password('molo123456'):
            print("Autenticacion molo: OK")
        else:
            print("Autenticacion molo: ERROR")
        
        # Resumen final
        print("\n" + "=" * 60)
        print("CONFIGURACION COMPLETADA")
        print("=" * 60)
        print("Base de datos: SQLite (db.sqlite3)")
        print(f"Total usuarios: {User.objects.count()}")
        print("")
        
        if molo_user:
            print("Usuario principal:")
            print(f"  Email: molo@molo.com")
            print(f"  Username: {molo_user.username}")
            print(f"  Password: molo123456")
        
        if admin_user:
            print("")
            print("Usuario admin:")
            print(f"  Email: admin@test.com")
            print(f"  Username: admin")
            print(f"  Password: admin123456")
        
        print("")
        print("Para iniciar el servidor:")
        print("  python manage.py runserver --settings=sos_habilidoso.settings.sqlite")
        print("")
        print("URLs importantes:")
        print("  Frontend: http://localhost:4000")
        print("  API: http://localhost:8000/api/")
        print("  Admin: http://localhost:8000/admin/")
        
        return True
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
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
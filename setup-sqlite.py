#!/usr/bin/env python3
"""
Script para configurar SQLite temporalmente y crear usuarios
"""
import os
import sys
import subprocess
from pathlib import Path

def setup_django_with_sqlite():
    """Configurar Django con SQLite"""
    print("🔧 Configurando Django con SQLite...")
    
    try:
        # Cambiar al directorio backend
        backend_dir = Path('backend')
        if not backend_dir.exists():
            print("❌ Directorio backend/ no encontrado")
            return False
        
        os.chdir(backend_dir)
        
        # Configurar Django con SQLite
        sys.path.append(str(Path.cwd()))
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.sqlite')
        
        import django
        django.setup()
        print("✅ Django configurado con SQLite")
        
        return True
        
    except Exception as e:
        print(f"❌ Error configurando Django: {e}")
        return False

def run_migrations():
    """Ejecutar migraciones"""
    print("\n🔄 Ejecutando migraciones...")
    
    try:
        # Ejecutar makemigrations
        print("   📝 Creando migraciones...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'makemigrations', 
            '--settings=sos_habilidoso.settings.sqlite'
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"⚠️  Advertencia en makemigrations: {result.stderr}")
        else:
            print("✅ Migraciones creadas")
        
        # Ejecutar migrate
        print("   🔄 Aplicando migraciones...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'migrate',
            '--settings=sos_habilidoso.settings.sqlite'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Migraciones aplicadas exitosamente")
            return True
        else:
            print(f"❌ Error aplicando migraciones: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error ejecutando migraciones: {e}")
        return False

def test_database_connection():
    """Probar conexión a SQLite"""
    print("\n🔌 Probando conexión a SQLite...")
    
    try:
        from django.db import connection
        from django.contrib.auth import get_user_model
        
        # Probar conexión
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        
        if result[0] == 1:
            print("✅ Conexión a SQLite exitosa")
            
            # Contar usuarios
            User = get_user_model()
            user_count = User.objects.count()
            print(f"👥 Usuarios existentes: {user_count}")
            
            return True
        else:
            print("❌ Error en la consulta de prueba")
            return False
            
    except Exception as e:
        print(f"❌ Error en conexión SQLite: {e}")
        return False

def create_molo_user():
    """Crear usuario molo"""
    print("\n👤 Creando usuario molo...")
    
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Verificar si ya existe
        if User.objects.filter(email='molo@molo.com').exists():
            user = User.objects.get(email='molo@molo.com')
            print(f"✅ Usuario molo ya existe: {user.display_name} (@{user.username})")
            return user
        
        # Crear usuario
        user = User.objects.create_user(
            email='molo@molo.com',
            username='molo',
            display_name='Molo Usuario',
            password='molo123456',
            position='Jugador Estrella',
            team='Los Molos FC',
            bio='¡Hola! Soy Molo, nuevo en SOS-HABILIDOSO.',
            is_verified=True
        )
        
        print(f"✅ Usuario creado: {user.display_name} (@{user.username})")
        print(f"📧 Email: {user.email}")
        print(f"🔑 Contraseña: molo123456")
        
        return user
        
    except Exception as e:
        print(f"❌ Error creando usuario: {e}")
        return None

def create_additional_users():
    """Crear usuarios adicionales para pruebas"""
    print("\n👥 Creando usuarios adicionales...")
    
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        test_users = [
            {
                'email': 'admin@test.com',
                'username': 'admin',
                'display_name': 'Administrador',
                'password': 'admin123456',
                'position': 'Manager',
                'team': 'Staff',
                'is_staff': True,
                'is_superuser': True
            },
            {
                'email': 'user1@test.com',
                'username': 'user1',
                'display_name': 'Usuario Uno',
                'password': 'user123456',
                'position': 'Delantero',
                'team': 'Test FC'
            },
            {
                'email': 'user2@test.com',
                'username': 'user2',
                'display_name': 'Usuario Dos',
                'password': 'user123456',
                'position': 'Portero',
                'team': 'Test United'
            }
        ]
        
        created_count = 0
        for user_data in test_users:
            if not User.objects.filter(email=user_data['email']).exists():
                user = User.objects.create_user(
                    email=user_data['email'],
                    username=user_data['username'],
                    display_name=user_data['display_name'],
                    password=user_data['password'],
                    position=user_data['position'],
                    team=user_data['team'],
                    is_staff=user_data.get('is_staff', False),
                    is_superuser=user_data.get('is_superuser', False),
                    bio=f'Usuario de prueba: {user_data["display_name"]}'
                )
                print(f"✅ Usuario creado: {user.display_name} (@{user.username})")
                created_count += 1
            else:
                print(f"⚠️  Usuario {user_data['email']} ya existe")
        
        print(f"📊 {created_count} usuarios nuevos creados")
        return True
        
    except Exception as e:
        print(f"❌ Error creando usuarios adicionales: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Configuración SQLite para SOS-HABILIDOSO")
    print("=" * 60)
    print("⚠️  Usando SQLite temporalmente debido a problemas con PostgreSQL")
    print("=" * 60)
    
    # 1. Configurar Django
    if not setup_django_with_sqlite():
        print("\n❌ No se pudo configurar Django")
        return False
    
    # 2. Ejecutar migraciones
    if not run_migrations():
        print("\n❌ Error en las migraciones")
        return False
    
    # 3. Probar conexión
    if not test_database_connection():
        print("\n❌ Error en la conexión a la base de datos")
        return False
    
    # 4. Crear usuario molo
    molo_user = create_molo_user()
    
    # 5. Crear usuarios adicionales
    create_additional_users()
    
    # 6. Resumen final
    print("\n" + "=" * 60)
    print("✅ CONFIGURACIÓN SQLITE COMPLETADA")
    print("=" * 60)
    
    print("🗄️  Base de datos: SQLite (db.sqlite3)")
    print("🔌 Ubicación: backend/db.sqlite3")
    
    if molo_user:
        print(f"\n🎯 Usuario principal:")
        print(f"   📧 Email: molo@molo.com")
        print(f"   👤 Username: {molo_user.username}")
        print(f"   🔑 Contraseña: molo123456")
    
    print(f"\n👥 Usuarios adicionales:")
    print(f"   📧 admin@test.com / admin123456 (Admin)")
    print(f"   📧 user1@test.com / user123456")
    print(f"   📧 user2@test.com / user123456")
    
    print(f"\n🌐 Para probar:")
    print(f"1. cd backend")
    print(f"2. python manage.py runserver --settings=sos_habilidoso.settings.sqlite")
    print(f"3. Ve a http://localhost:3000 y prueba el login")
    
    print(f"\n📊 Admin panel: http://localhost:8000/admin/")
    print(f"   Usuario: admin@test.com")
    print(f"   Contraseña: admin123456")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        if success:
            print("\n🎉 ¡SQLite configurado correctamente!")
        else:
            print("\n❌ Configuración incompleta")
    except KeyboardInterrupt:
        print("\n\n⏹️  Operación cancelada")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
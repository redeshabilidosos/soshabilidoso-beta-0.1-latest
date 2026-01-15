#!/usr/bin/env python3
"""
Script para configurar y verificar la base de datos
"""
import os
import sys
import subprocess
import psycopg2
from pathlib import Path

def check_postgresql_service():
    """Verificar si PostgreSQL está ejecutándose"""
    print("🔍 Verificando servicio PostgreSQL...")
    
    try:
        # Intentar conectar a PostgreSQL
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            user='postgres',
            password='root007',
            database='postgres'  # Base de datos por defecto
        )
        conn.close()
        print("✅ PostgreSQL está ejecutándose")
        return True
    except psycopg2.OperationalError as e:
        print(f"❌ PostgreSQL no está disponible: {e}")
        print("\n🔧 Para iniciar PostgreSQL:")
        print("   Windows: Busca 'Services' y inicia 'PostgreSQL'")
        print("   macOS: brew services start postgresql")
        print("   Linux: sudo systemctl start postgresql")
        return False
    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL: {e}")
        return False

def create_database_if_not_exists():
    """Crear la base de datos si no existe"""
    print("\n🗄️  Verificando base de datos 'sos_habilidoso_db'...")
    
    try:
        # Conectar a PostgreSQL
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            user='postgres',
            password='root007',
            database='postgres'
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Verificar si la base de datos existe
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = 'sos_habilidoso_db'"
        )
        
        if cursor.fetchone():
            print("✅ Base de datos 'sos_habilidoso_db' ya existe")
        else:
            # Crear la base de datos
            cursor.execute("CREATE DATABASE sos_habilidoso_db")
            print("✅ Base de datos 'sos_habilidoso_db' creada")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creando base de datos: {e}")
        return False

def run_django_migrations():
    """Ejecutar migraciones de Django"""
    print("\n🔄 Ejecutando migraciones de Django...")
    
    try:
        # Cambiar al directorio backend
        backend_dir = Path(__file__).parent / 'backend'
        os.chdir(backend_dir)
        
        # Ejecutar makemigrations
        print("   📝 Creando migraciones...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'makemigrations'
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"⚠️  Advertencia en makemigrations: {result.stderr}")
        else:
            print("✅ Migraciones creadas")
        
        # Ejecutar migrate
        print("   🔄 Aplicando migraciones...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'migrate'
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

def test_django_connection():
    """Probar conexión de Django a la base de datos"""
    print("\n🔌 Probando conexión de Django...")
    
    try:
        # Configurar Django
        backend_dir = Path(__file__).parent / 'backend'
        sys.path.append(str(backend_dir))
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
        
        import django
        django.setup()
        
        from django.db import connection
        from django.contrib.auth import get_user_model
        
        # Probar conexión
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        
        if result[0] == 1:
            print("✅ Django conectado a la base de datos")
            
            # Contar usuarios
            User = get_user_model()
            user_count = User.objects.count()
            print(f"👥 Usuarios existentes: {user_count}")
            
            return True
        else:
            print("❌ Error en la consulta de prueba")
            return False
            
    except Exception as e:
        print(f"❌ Error en conexión Django: {e}")
        return False

def create_test_user():
    """Crear usuario de prueba"""
    print("\n👤 Creando usuario de prueba...")
    
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

def main():
    """Función principal"""
    print("🚀 Configuración de Base de Datos para SOS-HABILIDOSO")
    print("=" * 60)
    
    # 1. Verificar PostgreSQL
    if not check_postgresql_service():
        print("\n❌ PostgreSQL no está disponible. Por favor, inicia el servicio.")
        return False
    
    # 2. Crear base de datos
    if not create_database_if_not_exists():
        print("\n❌ No se pudo crear la base de datos.")
        return False
    
    # 3. Ejecutar migraciones
    if not run_django_migrations():
        print("\n❌ Error en las migraciones.")
        return False
    
    # 4. Probar conexión Django
    if not test_django_connection():
        print("\n❌ Django no puede conectar a la base de datos.")
        return False
    
    # 5. Crear usuario de prueba
    user = create_test_user()
    
    # 6. Resumen final
    print("\n" + "=" * 60)
    print("✅ CONFIGURACIÓN COMPLETADA")
    print("=" * 60)
    
    print("🗄️  Base de datos: sos_habilidoso_db")
    print("🔌 Conexión: PostgreSQL en localhost:5432")
    print("👤 Usuario: postgres")
    
    if user:
        print(f"\n🎯 Usuario de prueba creado:")
        print(f"   Email: molo@molo.com")
        print(f"   Username: {user.username}")
        print(f"   Contraseña: molo123456")
    
    print(f"\n🌐 Puedes probar el login en: http://localhost:3000")
    print(f"🔧 Para iniciar el servidor: cd backend && python manage.py runserver")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        if success:
            print("\n🎉 ¡Todo configurado correctamente!")
        else:
            print("\n❌ Configuración incompleta. Revisa los errores anteriores.")
    except KeyboardInterrupt:
        print("\n\n⏹️  Operación cancelada por el usuario")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
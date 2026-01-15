#!/usr/bin/env python3
"""
Script para crear el usuario molo@molo.com y verificar la base de datos
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.append(str(Path(__file__).parent))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

print("🔧 Configurando Django...")
try:
    django.setup()
    print("✅ Django configurado correctamente")
except Exception as e:
    print(f"❌ Error configurando Django: {e}")
    print("\n🔧 Posibles soluciones:")
    print("1. Verifica que estés en el directorio correcto")
    print("2. Instala las dependencias: pip install -r requirements.txt")
    print("3. Verifica la configuración de la base de datos")
    sys.exit(1)

from django.db import connection
from django.contrib.auth import get_user_model

User = get_user_model()

def test_database_connection():
    """Probar conexión a la base de datos"""
    print("\n🔌 Probando conexión a la base de datos...")
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        
        if result[0] == 1:
            print("✅ Conexión a la base de datos exitosa")
            
            # Obtener información de la base de datos
            db_settings = connection.settings_dict
            print(f"   Motor: {db_settings.get('ENGINE', 'No especificado')}")
            print(f"   Base de datos: {db_settings.get('NAME', 'No especificado')}")
            print(f"   Host: {db_settings.get('HOST', 'localhost')}")
            print(f"   Puerto: {db_settings.get('PORT', 'default')}")
            
            # Contar usuarios existentes
            user_count = User.objects.count()
            print(f"   Usuarios existentes: {user_count}")
            
            return True
        else:
            print("❌ Error en la consulta de prueba")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        print("\n🔧 Posibles soluciones:")
        print("1. Verifica que PostgreSQL esté ejecutándose")
        print("2. Revisa las credenciales en el archivo .env")
        print("3. Ejecuta las migraciones: python manage.py migrate")
        print("4. Verifica que la base de datos 'sos_habilidoso_db' exista")
        return False

def create_molo_user():
    """Crear usuario molo@molo.com"""
    print("\n👤 Creando usuario molo@molo.com...")
    
    # Verificar si el usuario ya existe
    if User.objects.filter(email='molo@molo.com').exists():
        print("⚠️  El usuario molo@molo.com ya existe")
        existing_user = User.objects.get(email='molo@molo.com')
        print(f"✅ Usuario existente: {existing_user.display_name} (@{existing_user.username})")
        return existing_user
    
    # Verificar si el username ya existe
    username = 'molo'
    counter = 1
    original_username = username
    
    while User.objects.filter(username=username).exists():
        username = f"{original_username}{counter}"
        counter += 1
    
    # Crear el usuario
    try:
        user = User.objects.create_user(
            email='molo@molo.com',
            username=username,
            display_name='Molo Usuario',
            password='molo123456',  # Contraseña por defecto
            position='Jugador Estrella',
            team='Los Molos FC',
            bio='¡Hola! Soy Molo, nuevo en SOS-HABILIDOSO. ¡Listo para conectar y compartir mi pasión por el fútbol!',
            is_verified=True  # Marcar como verificado
        )
        
        print("✅ Usuario creado exitosamente!")
        print(f"📧 Email: {user.email}")
        print(f"👤 Username: @{user.username}")
        print(f"🏷️ Nombre: {user.display_name}")
        print(f"⚽ Posición: {user.position}")
        print(f"🏆 Equipo: {user.team}")
        print(f"🔑 Contraseña: molo123456")
        print(f"✨ Verificado: {user.is_verified}")
        
        return user
        
    except Exception as e:
        print(f"❌ Error creando usuario: {e}")
        print("\n🔧 Posibles causas:")
        print("1. Error de validación en los datos")
        print("2. Problema con la base de datos")
        print("3. Restricciones de integridad")
        return None

def show_existing_users():
    """Mostrar usuarios existentes"""
    try:
        users = User.objects.all()[:5]  # Mostrar solo los primeros 5
        total_users = User.objects.count()
        
        if total_users > 0:
            print(f"\n👥 Usuarios existentes ({total_users} total):")
            for user in users:
                print(f"   - {user.display_name} (@{user.username}) - {user.email}")
            
            if total_users > 5:
                print(f"   ... y {total_users - 5} más")
        else:
            print("\n👥 No hay usuarios en la base de datos")
            
    except Exception as e:
        print(f"❌ Error obteniendo usuarios: {e}")

def main():
    """Función principal"""
    print("🚀 Verificación de Base de Datos y Creación de Usuario")
    print("=" * 60)
    
    # 1. Probar conexión a la base de datos
    if not test_database_connection():
        print("\n❌ No se puede continuar sin conexión a la base de datos")
        return
    
    # 2. Mostrar usuarios existentes
    show_existing_users()
    
    # 3. Crear usuario molo
    user = create_molo_user()
    
    # 4. Resumen final
    print("\n" + "=" * 60)
    print("📋 RESUMEN")
    print("=" * 60)
    
    if user:
        print("✅ Usuario molo disponible para login:")
        print(f"   📧 Email: molo@molo.com")
        print(f"   👤 Username: {user.username}")
        print(f"   🔑 Contraseña: molo123456")
        print("\n🌐 Puedes iniciar sesión en: http://localhost:3000")
        print("🔧 Para iniciar el servidor: python manage.py runserver")
    else:
        print("❌ No se pudo crear el usuario molo")
    
    print("\n✅ Verificación completada")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️  Operación cancelada por el usuario")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
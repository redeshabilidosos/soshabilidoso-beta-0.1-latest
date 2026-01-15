#!/usr/bin/env python3
"""
Script para verificar la conexión a la base de datos y crear usuarios de prueba
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.append(str(Path(__file__).parent / 'backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

try:
    django.setup()
    print("✅ Django configurado correctamente")
except Exception as e:
    print(f"❌ Error configurando Django: {e}")
    sys.exit(1)

from django.db import connection
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

def test_database_connection():
    """Probar conexión a la base de datos"""
    print("\n🔌 Probando conexión a la base de datos...")
    
    try:
        # Probar conexión básica
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            if result[0] == 1:
                print("✅ Conexión a la base de datos exitosa")
                return True
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        return False

def get_database_info():
    """Obtener información de la base de datos"""
    print("\n📊 Información de la base de datos:")
    
    try:
        db_settings = connection.settings_dict
        print(f"   Motor: {db_settings.get('ENGINE', 'No especificado')}")
        print(f"   Nombre: {db_settings.get('NAME', 'No especificado')}")
        print(f"   Host: {db_settings.get('HOST', 'localhost')}")
        print(f"   Puerto: {db_settings.get('PORT', 'default')}")
        print(f"   Usuario: {db_settings.get('USER', 'No especificado')}")
        
        # Obtener estadísticas de usuarios
        total_users = User.objects.count()
        print(f"   Total usuarios: {total_users}")
        
        if total_users > 0:
            print("\n👥 Usuarios existentes:")
            for user in User.objects.all()[:5]:  # Mostrar solo los primeros 5
                print(f"   - {user.display_name} (@{user.username}) - {user.email}")
            
            if total_users > 5:
                print(f"   ... y {total_users - 5} más")
                
    except Exception as e:
        print(f"❌ Error obteniendo información de la base de datos: {e}")

def test_user_creation():
    """Probar creación de usuarios"""
    print("\n👤 Probando creación de usuarios...")
    
    test_users = [
        {
            'email': 'test1@example.com',
            'username': 'test_user_1',
            'display_name': 'Usuario Test 1',
            'password': 'testpass123',
            'position': 'Delantero',
            'team': 'Test FC'
        },
        {
            'email': 'test2@example.com',
            'username': 'test_user_2',
            'display_name': 'Usuario Test 2',
            'password': 'testpass123',
            'position': 'Portero',
            'team': 'Test United'
        }
    ]
    
    created_users = []
    
    for user_data in test_users:
        try:
            # Verificar si ya existe
            if User.objects.filter(email=user_data['email']).exists():
                print(f"⚠️  Usuario {user_data['email']} ya existe")
                existing_user = User.objects.get(email=user_data['email'])
                print(f"   Nombre: {existing_user.display_name}")
                continue
            
            # Crear usuario
            user = User.objects.create_user(
                email=user_data['email'],
                username=user_data['username'],
                display_name=user_data['display_name'],
                password=user_data['password'],
                position=user_data['position'],
                team=user_data['team'],
                bio=f'Usuario de prueba creado automáticamente'
            )
            
            print(f"✅ Usuario creado: {user.display_name} (@{user.username})")
            created_users.append(user)
            
        except ValidationError as e:
            print(f"❌ Error de validación creando {user_data['email']}: {e}")
        except Exception as e:
            print(f"❌ Error creando {user_data['email']}: {e}")
    
    return created_users

def test_user_authentication():
    """Probar autenticación de usuarios"""
    print("\n🔐 Probando autenticación...")
    
    # Buscar un usuario existente o crear uno
    test_email = 'auth_test@example.com'
    test_username = 'auth_test'
    test_password = 'authtest123'
    
    try:
        user = User.objects.get(email=test_email)
        print(f"✅ Usuario encontrado: {user.display_name}")
    except User.DoesNotExist:
        try:
            user = User.objects.create_user(
                email=test_email,
                username=test_username,
                display_name='Usuario Auth Test',
                password=test_password
            )
            print(f"✅ Usuario de prueba creado: {user.display_name}")
        except Exception as e:
            print(f"❌ Error creando usuario de prueba: {e}")
            return
    
    # Probar autenticación
    try:
        # Test con contraseña correcta
        if user.check_password(test_password):
            print("✅ Autenticación con contraseña correcta: OK")
        else:
            print("❌ Autenticación con contraseña correcta: FALLO")
        
        # Test con contraseña incorrecta
        if not user.check_password('password_incorrecta'):
            print("✅ Rechazo de contraseña incorrecta: OK")
        else:
            print("❌ Rechazo de contraseña incorrecta: FALLO")
            
    except Exception as e:
        print(f"❌ Error en pruebas de autenticación: {e}")

def create_molo_user_if_not_exists():
    """Crear usuario molo si no existe"""
    print("\n🎯 Verificando usuario molo...")
    
    try:
        user = User.objects.get(email='molo@molo.com')
        print(f"✅ Usuario molo ya existe: {user.display_name} (@{user.username})")
        return user
    except User.DoesNotExist:
        try:
            # Verificar username disponible
            username = 'molo'
            counter = 1
            original_username = username
            
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                email='molo@molo.com',
                username=username,
                display_name='Molo Usuario',
                password='molo123456',
                position='Jugador Estrella',
                team='Los Molos FC',
                bio='¡Hola! Soy Molo, nuevo en SOS-HABILIDOSO. ¡Listo para conectar y compartir mi pasión por el fútbol!',
                is_verified=True
            )
            
            print(f"✅ Usuario molo creado: {user.display_name} (@{user.username})")
            print(f"📧 Email: {user.email}")
            print(f"🔑 Contraseña: molo123456")
            
            return user
            
        except Exception as e:
            print(f"❌ Error creando usuario molo: {e}")
            return None

def cleanup_test_users():
    """Limpiar usuarios de prueba (opcional)"""
    print("\n🧹 ¿Limpiar usuarios de prueba? (y/N): ", end="")
    
    try:
        response = input().lower().strip()
        if response == 'y' or response == 'yes':
            test_emails = [
                'test1@example.com',
                'test2@example.com',
                'auth_test@example.com'
            ]
            
            deleted_count = 0
            for email in test_emails:
                try:
                    user = User.objects.get(email=email)
                    user.delete()
                    print(f"🗑️  Usuario eliminado: {email}")
                    deleted_count += 1
                except User.DoesNotExist:
                    pass
            
            print(f"✅ {deleted_count} usuarios de prueba eliminados")
        else:
            print("⏭️  Usuarios de prueba conservados")
    except KeyboardInterrupt:
        print("\n⏭️  Operación cancelada")

def main():
    """Función principal"""
    print("🚀 Verificación de Base de Datos y Creación de Usuarios")
    print("=" * 60)
    
    # 1. Probar conexión
    if not test_database_connection():
        print("\n❌ No se puede continuar sin conexión a la base de datos")
        return
    
    # 2. Mostrar información
    get_database_info()
    
    # 3. Probar creación de usuarios
    created_users = test_user_creation()
    
    # 4. Probar autenticación
    test_user_authentication()
    
    # 5. Crear usuario molo
    molo_user = create_molo_user_if_not_exists()
    
    # 6. Resumen final
    print("\n" + "=" * 60)
    print("📋 RESUMEN DE PRUEBAS")
    print("=" * 60)
    
    total_users = User.objects.count()
    print(f"👥 Total de usuarios en la base de datos: {total_users}")
    
    if molo_user:
        print(f"🎯 Usuario molo disponible para login:")
        print(f"   Email: molo@molo.com")
        print(f"   Username: {molo_user.username}")
        print(f"   Contraseña: molo123456")
    
    print(f"\n🌐 Puedes probar el login en: http://localhost:3000")
    print(f"🔧 API disponible en: http://localhost:8000/api/")
    
    # 7. Opción de limpieza
    if created_users:
        cleanup_test_users()
    
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
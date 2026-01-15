#!/usr/bin/env python3
"""
Script para configurar el sistema de autenticación
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.append(str(Path(__file__).parent))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from django.core.management import execute_from_command_line

User = get_user_model()

def create_superuser():
    """Crear superusuario si no existe"""
    if not User.objects.filter(is_superuser=True).exists():
        print("Creando superusuario...")
        User.objects.create_superuser(
            email='admin@soshabilidoso.com',
            username='admin',
            display_name='Administrador',
            password='admin123'
        )
        print("✅ Superusuario creado: admin@soshabilidoso.com / admin123")
    else:
        print("✅ Superusuario ya existe")

def create_test_users():
    """Crear usuarios de prueba"""
    test_users = [
        {
            'email': 'messi@test.com',
            'username': 'messi10',
            'display_name': 'Lionel Messi',
            'position': 'Delantero',
            'team': 'Inter Miami',
            'bio': 'El mejor jugador de todos los tiempos'
        },
        {
            'email': 'ronaldo@test.com',
            'username': 'cr7',
            'display_name': 'Cristiano Ronaldo',
            'position': 'Delantero',
            'team': 'Al Nassr',
            'bio': 'SIUUUUU!'
        },
        {
            'email': 'neymar@test.com',
            'username': 'neymarjr',
            'display_name': 'Neymar Jr',
            'position': 'Extremo',
            'team': 'Al Hilal',
            'bio': 'Joga bonito'
        }
    ]
    
    for user_data in test_users:
        if not User.objects.filter(email=user_data['email']).exists():
            User.objects.create_user(
                password='test123',
                **user_data
            )
            print(f"✅ Usuario de prueba creado: {user_data['username']}")
        else:
            print(f"✅ Usuario {user_data['username']} ya existe")

def main():
    """Función principal"""
    print("🚀 Configurando sistema de autenticación...")
    print("=" * 50)
    
    # Ejecutar migraciones
    print("📦 Ejecutando migraciones...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Crear superusuario
    create_superuser()
    
    # Crear usuarios de prueba
    print("\n👥 Creando usuarios de prueba...")
    create_test_users()
    
    print("\n✅ ¡Configuración completada!")
    print("\n📋 Credenciales de prueba:")
    print("Admin: admin@soshabilidoso.com / admin123")
    print("Messi: messi@test.com / test123")
    print("Ronaldo: ronaldo@test.com / test123")
    print("Neymar: neymar@test.com / test123")
    print("\n🚀 Ejecuta: python manage.py runserver")

if __name__ == "__main__":
    main()
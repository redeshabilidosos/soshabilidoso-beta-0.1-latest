#!/usr/bin/env python
"""
Script para crear un usuario administrador para Django Admin
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.sqlite')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_admin_user():
    """Crear usuario administrador"""
    print("🔧 Creando usuario administrador...")
    
    try:
        # Verificar si ya existe un superusuario
        if User.objects.filter(is_superuser=True).exists():
            print("⚠️  Ya existe un superusuario en la base de datos")
            
            # Mostrar superusuarios existentes
            superusers = User.objects.filter(is_superuser=True)
            print("\n👥 Superusuarios existentes:")
            for user in superusers:
                print(f"   - Username: {user.username}")
                print(f"     Email: {user.email}")
                print(f"     Nombre: {user.display_name}")
                print()
            
            response = input("¿Deseas crear otro superusuario? (s/n): ").lower()
            if response != 's':
                return
        
        # Crear nuevo superusuario
        print("\n📝 Ingresa los datos del nuevo administrador:")
        
        username = input("Username: ").strip()
        if not username:
            username = "admin"
            print(f"Usando username por defecto: {username}")
        
        email = input("Email: ").strip()
        if not email:
            email = "admin@sos-habilidoso.com"
            print(f"Usando email por defecto: {email}")
        
        display_name = input("Nombre para mostrar: ").strip()
        if not display_name:
            display_name = "Administrador"
            print(f"Usando nombre por defecto: {display_name}")
        
        password = input("Contraseña (deja vacío para 'admin123'): ").strip()
        if not password:
            password = "admin123"
            print("Usando contraseña por defecto: admin123")
        
        # Verificar si el username ya existe
        if User.objects.filter(username=username).exists():
            print(f"❌ El username '{username}' ya existe")
            return False
        
        # Verificar si el email ya existe
        if User.objects.filter(email=email).exists():
            print(f"❌ El email '{email}' ya existe")
            return False
        
        # Crear el usuario
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            display_name=display_name,
            first_name="Admin",
            last_name="SOS",
            is_staff=True,
            is_superuser=True,
            is_active=True,
            email_verified=True
        )
        
        print(f"\n✅ Usuario administrador creado exitosamente!")
        print(f"   Username: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Nombre: {user.display_name}")
        print(f"   Contraseña: {password}")
        
        print(f"\n🌐 Puedes acceder al admin en:")
        print(f"   URL: http://127.0.0.1:8000/admin/")
        print(f"   Username: {username}")
        print(f"   Password: {password}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al crear el usuario administrador: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Script para crear usuario administrador de Django")
    print("=" * 50)
    
    if create_admin_user():
        print("\n🎉 ¡Usuario administrador creado exitosamente!")
        print("\n📋 Próximos pasos:")
        print("1. Ejecuta el servidor: python manage.py runserver")
        print("2. Ve a http://127.0.0.1:8000/admin/")
        print("3. Inicia sesión con las credenciales mostradas arriba")
    else:
        print("\n❌ Error al crear el usuario administrador")
        sys.exit(1)

if __name__ == '__main__':
    main()
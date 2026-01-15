#!/usr/bin/env python
"""
Script para crear un usuario administrador de prueba
Email: admin@test.com
Password: admin123
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

def create_test_admin():
    """Crear usuario administrador de prueba"""
    print("🔧 Creando usuario administrador de prueba...")
    
    try:
        # Datos del usuario de prueba
        username = "admin"
        email = "admin@test.com"
        password = "admin123"
        display_name = "Administrador de Prueba"
        
        # Verificar si el usuario ya existe
        if User.objects.filter(email=email).exists():
            print(f"⚠️  El usuario con email '{email}' ya existe")
            user = User.objects.get(email=email)
            print(f"   Username: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Nombre: {user.display_name}")
            print(f"   Es admin: {user.is_superuser}")
            
            # Actualizar contraseña si es necesario
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.email_verified = True
            user.save()
            print(f"✅ Usuario actualizado con contraseña: {password}")
            return True
        
        # Verificar si el username ya existe
        if User.objects.filter(username=username).exists():
            # Usar un username único
            username = f"admin_test_{User.objects.count()}"
        
        # Crear el usuario
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            display_name=display_name,
            first_name="Admin",
            last_name="Test",
            is_staff=True,
            is_superuser=True,
            is_active=True,
            email_verified=True
        )
        
        print(f"\n✅ Usuario administrador de prueba creado exitosamente!")
        print(f"   Username: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Nombre: {user.display_name}")
        print(f"   Contraseña: {password}")
        
        print(f"\n🌐 Credenciales para el frontend:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al crear el usuario administrador: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Función principal"""
    print("🚀 Creando usuario administrador de prueba")
    print("=" * 50)
    
    if create_test_admin():
        print("\n🎉 ¡Usuario administrador de prueba creado!")
        print("\n📋 Credenciales:")
        print("   Email: admin@test.com")
        print("   Password: admin123")
        print("\n🔗 Puedes usar estas credenciales en el frontend")
    else:
        print("\n❌ Error al crear el usuario administrador")
        sys.exit(1)

if __name__ == '__main__':
    main()
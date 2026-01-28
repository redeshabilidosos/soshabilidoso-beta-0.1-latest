#!/usr/bin/env python
"""
Script para resetear la contraseña del admin
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def reset_admin_password():
    """Resetear contraseña del admin"""
    
    username = 'admin'
    new_password = 'admin123'
    
    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.save()
        
        print("✅ Contraseña reseteada exitosamente!")
        print("\n🔑 Credenciales del Admin:")
        print("=" * 50)
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Password: {new_password}")
        print(f"Display Name: {user.display_name}")
        print(f"\n✅ Es superusuario: {user.is_superuser}")
        print(f"✅ Es staff: {user.is_staff}")
        print(f"✅ Activo: {user.is_active}")
        print("\n🌐 URL del Admin:")
        print("http://127.0.0.1:8000/admin/")
        
    except User.DoesNotExist:
        print(f"❌ Usuario '{username}' no existe")
        print("Creando nuevo usuario admin...")
        
        user = User.objects.create_superuser(
            username=username,
            email='admin@soshabilidoso.com',
            password=new_password,
            display_name='Administrador'
        )
        
        print("✅ Usuario admin creado exitosamente!")
        print("\n🔑 Credenciales del Admin:")
        print("=" * 50)
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Password: {new_password}")
        print("\n🌐 URL del Admin:")
        print("http://127.0.0.1:8000/admin/")

if __name__ == "__main__":
    reset_admin_password()

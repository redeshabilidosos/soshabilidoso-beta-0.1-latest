#!/usr/bin/env python
"""
Script para arreglar el login del admin
IMPORTANTE: Este sistema usa EMAIL como USERNAME_FIELD
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

def fix_admin_login():
    """Arreglar y probar login del admin"""
    
    print("🔧 Configurando usuarios admin...")
    print("=" * 60)
    print("⚠️  IMPORTANTE: Este sistema usa EMAIL para login, no username")
    print("=" * 60)
    
    # Configurar usuarios admin
    admin_configs = [
        {
            'username': 'admin',
            'email': 'admin@soshabilidoso.com',
            'display_name': 'Administrador',
            'password': 'admin123'
        },
        {
            'username': 'superadmin',
            'email': 'superadmin@habilidosos.com',
            'display_name': 'Super Admin',
            'password': 'admin123'
        },
    ]
    
    for config in admin_configs:
        try:
            user = User.objects.get(username=config['username'])
            user.email = config['email']
            user.display_name = config['display_name']
            user.set_password(config['password'])
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.save()
            
            print(f"\n✅ Usuario actualizado: {config['username']}")
            print(f"   Email: {config['email']}")
            print(f"   Password: {config['password']}")
            
            # Probar autenticación con EMAIL
            auth_user = authenticate(username=config['email'], password=config['password'])
            if auth_user:
                print(f"   ✅ AUTENTICACIÓN EXITOSA con email")
            else:
                print(f"   ❌ AUTENTICACIÓN FALLÓ")
                
        except User.DoesNotExist:
            print(f"❌ Usuario {config['username']} no existe")
    
    print("\n" + "=" * 60)
    print("\n🌐 CÓMO ACCEDER AL ADMIN:")
    print("=" * 60)
    print("\n1. Abre: http://127.0.0.1:8000/admin/")
    print("\n2. Usa estas credenciales:")
    print("\n   📧 OPCIÓN 1:")
    print("   Email:    admin@soshabilidoso.com")
    print("   Password: admin123")
    print("\n   📧 OPCIÓN 2:")
    print("   Email:    superadmin@habilidosos.com")
    print("   Password: admin123")
    print("\n⚠️  IMPORTANTE: Usa el EMAIL, no el username!")
    print("=" * 60)

if __name__ == "__main__":
    fix_admin_login()

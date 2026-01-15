#!/usr/bin/env python
"""
Script para crear usuario admin en MySQL
"""
import os
import sys
import django
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_admin():
    print("🔧 Creando usuario administrador en MySQL...")
    
    try:
        username = "admin"
        email = "admin@test.com"
        password = "admin123"
        
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.save()
            print(f"✅ Usuario actualizado")
        else:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                display_name="Administrador"
            )
            print(f"✅ Usuario creado")
        
        print(f"\n📋 Credenciales:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   URL: http://127.0.0.1:8000/admin/")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    create_admin()

#!/usr/bin/env python
"""
Script para crear un usuario administrador rápidamente
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

def create_admin():
    """Crea un usuario administrador"""
    try:
        # Verificar si ya existe un superusuario
        if User.objects.filter(is_superuser=True).exists():
            print("✅ Ya existe un superusuario en el sistema")
            admin_user = User.objects.filter(is_superuser=True).first()
            print(f"   Usuario: {admin_user.username}")
            print(f"   Email: {admin_user.email}")
            return admin_user
        
        # Crear nuevo superusuario
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@soshabilidoso.com',
            password='admin123',
            first_name='Administrador',
            last_name='SOS-HABILIDOSO',
            is_staff=True,
            is_superuser=True,
            is_active=True
        )
        
        print("🎉 ¡Superusuario creado exitosamente!")
        print(f"   Usuario: {admin_user.username}")
        print(f"   Email: {admin_user.email}")
        print(f"   Contraseña: admin123")
        print()
        print("🔗 Puedes acceder al admin en: http://127.0.0.1:8000/admin/")
        print("   Usuario: admin")
        print("   Contraseña: admin123")
        
        return admin_user
        
    except IntegrityError as e:
        print(f"❌ Error al crear el usuario: {e}")
        return None
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return None

if __name__ == '__main__':
    print("🔧 CREANDO USUARIO ADMINISTRADOR")
    print("=" * 40)
    create_admin()
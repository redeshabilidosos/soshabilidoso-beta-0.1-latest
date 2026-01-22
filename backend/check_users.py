#!/usr/bin/env python
"""
Script para verificar usuarios existentes
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def check_users():
    """Verificar usuarios existentes"""
    
    print("👥 Usuarios en la base de datos:")
    print("=" * 50)
    
    users = User.objects.all()
    
    if not users.exists():
        print("❌ No hay usuarios en la base de datos")
        return
    
    for user in users:
        print(f"\n📋 Usuario: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Display Name: {user.display_name}")
        print(f"   Es superusuario: {'✅' if user.is_superuser else '❌'}")
        print(f"   Es staff: {'✅' if user.is_staff else '❌'}")
        print(f"   Activo: {'✅' if user.is_active else '❌'}")
        print(f"   Fecha creación: {user.date_joined}")
    
    print(f"\n📊 Total de usuarios: {users.count()}")
    
    # Buscar superusuarios
    superusers = users.filter(is_superuser=True)
    print(f"👑 Superusuarios: {superusers.count()}")
    
    if superusers.exists():
        print("\n🔑 Credenciales para admin:")
        for su in superusers:
            print(f"   Username: {su.username}")
            print(f"   Email: {su.email}")
            print("   Password: (usar la contraseña que configuraste)")

if __name__ == "__main__":
    check_users()
#!/usr/bin/env python
"""
Script para resetear contraseñas de todos los superusuarios
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def reset_all_superusers():
    """Resetear contraseñas de todos los superusuarios"""
    
    superusers = User.objects.filter(is_superuser=True)
    
    if not superusers.exists():
        print("❌ No hay superusuarios en la base de datos")
        return
    
    print("🔑 Reseteando contraseñas de superusuarios...")
    print("=" * 60)
    
    for user in superusers:
        user.set_password('admin123')
        user.is_staff = True
        user.is_active = True
        user.save()
        
        print(f"\n✅ Usuario: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Password: admin123")
        print(f"   Display Name: {user.display_name}")
    
    print("\n" + "=" * 60)
    print(f"✅ Total de superusuarios actualizados: {superusers.count()}")
    print("\n🌐 URL del Admin:")
    print("http://127.0.0.1:8000/admin/")
    print("\n💡 Puedes usar cualquiera de estos usuarios con password: admin123")

if __name__ == "__main__":
    reset_all_superusers()

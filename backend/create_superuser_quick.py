#!/usr/bin/env python
"""
Script para crear un superusuario rápidamente
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superuser():
    """Crear superusuario si no existe"""
    
    # Datos del superusuario
    email = 'admin@soshabilidoso.com'
    username = 'admin'
    password = 'admin123'
    
    try:
        # Verificar si ya existe
        if User.objects.filter(email=email).exists():
            print(f"✅ Superusuario ya existe: {email}")
            user = User.objects.get(email=email)
            print(f"   Username: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Es superusuario: {user.is_superuser}")
            return user
        
        # Crear nuevo superusuario
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            display_name='Administrador SOS-HABILIDOSO'
        )
        
        print("🎉 Superusuario creado exitosamente!")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Display Name: {user.display_name}")
        
        return user
        
    except Exception as e:
        print(f"❌ Error creando superusuario: {str(e)}")
        return None

if __name__ == "__main__":
    print("👤 Creando superusuario para Django Admin")
    print("=" * 50)
    
    user = create_superuser()
    
    if user:
        print("\n" + "=" * 50)
        print("✅ ¡Listo para usar!")
        print("\n🌐 Accede al admin en:")
        print("   http://127.0.0.1:8000/admin/")
        print(f"\n🔑 Credenciales:")
        print(f"   Email: admin@soshabilidoso.com")
        print(f"   Password: admin123")
    else:
        print("\n❌ No se pudo crear el superusuario")
#!/usr/bin/env python
"""
Script para resetear contraseña de usuario
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.users.models import User

print("=" * 60)
print("RESETEAR CONTRASEÑA DE USUARIO")
print("=" * 60)

# Usuario y contraseña
username = 'camilogomezdeveloper@gmail.com'  # El email que estás usando
new_password = 'Camilo123!'  # Nueva contraseña

try:
    # Buscar por email o username
    if '@' in username:
        user = User.objects.get(email=username)
    else:
        user = User.objects.get(username=username)
    
    print(f"\n✅ Usuario encontrado:")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Nombre: {user.display_name}")
    
    # Cambiar contraseña
    user.set_password(new_password)
    user.save()
    
    print(f"\n✅ Contraseña cambiada exitosamente!")
    print(f"\n📋 Credenciales de acceso:")
    print(f"   Email/Username: {user.email}")
    print(f"   Contraseña: {new_password}")
    print(f"\n🔐 Ahora puedes iniciar sesión con estas credenciales")
    
except User.DoesNotExist:
    print(f"\n❌ Usuario no encontrado: {username}")
    print(f"\nUsuarios disponibles:")
    for u in User.objects.all()[:5]:
        print(f"   - {u.username} ({u.email})")

print("\n" + "=" * 60)

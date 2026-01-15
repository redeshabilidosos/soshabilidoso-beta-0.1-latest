#!/usr/bin/env python
"""
Script para resetear las contraseñas en MySQL
"""
import os
import sys
import django
from pathlib import Path

# Configurar Django con MySQL
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

sys.path.insert(0, os.path.dirname(__file__))

django.setup()

from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

print("=" * 60)
print("RESETEO DE CONTRASEÑAS EN MYSQL")
print("=" * 60)

print(f"\nBase de datos: {settings.DATABASES['default']}")

# Obtener todos los usuarios
users = User.objects.all()

if not users:
    print("No hay usuarios en la base de datos")
    sys.exit(1)

print(f"\nTotal de usuarios: {users.count()}")
print("\nResetando contraseñas a 'Password123!'...\n")

for user in users:
    try:
        user.set_password('Password123!')
        user.save()
        print(f"✓ {user.username} ({user.email})")
    except Exception as e:
        print(f"✗ {user.username}: {e}")

print("\n" + "=" * 60)
print("RESETEO COMPLETADO")
print("=" * 60)
print("\nAhora puedes probar el login con:")
print("  Email/Username: cualquier usuario listado arriba")
print("  Password: Password123!")

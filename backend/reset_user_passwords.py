#!/usr/bin/env python
"""
Script para resetear las contraseñas de los usuarios existentes
"""
import os
import sys
import django
from pathlib import Path

# Configurar Django con SQLite
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

# Cambiar temporalmente a SQLite
sys.path.insert(0, os.path.dirname(__file__))

# Importar settings y cambiar a SQLite
from django.conf import settings

# Cambiar a SQLite
settings.DATABASES['default'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': str(Path(__file__).resolve().parent / 'db.sqlite3'),
}

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("RESETEO DE CONTRASEÑAS DE USUARIOS")
print("=" * 60)

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
print("  Username: cualquier usuario listado arriba")
print("  Password: Password123!")

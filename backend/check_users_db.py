#!/usr/bin/env python
"""
Script para verificar los usuarios en la base de datos
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
print("VERIFICACIÓN DE USUARIOS EN LA BASE DE DATOS")
print("=" * 60)

users = User.objects.all()
print(f"\nTotal de usuarios: {users.count()}\n")

for user in users:
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print(f"Display Name: {user.display_name}")
    print(f"Is Active: {user.is_active}")
    print(f"Password hash: {user.password[:50]}...")
    
    # Probar contraseña
    if user.check_password('Password123!'):
        print(f"✓ Contraseña 'Password123!' es correcta")
    else:
        print(f"✗ Contraseña 'Password123!' es INCORRECTA")
    
    print("-" * 60)

print("\n" + "=" * 60)

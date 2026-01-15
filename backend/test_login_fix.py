#!/usr/bin/env python
"""
Script para probar que el login funciona correctamente
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
from apps.authentication.serializers import CustomTokenObtainPairSerializer

User = get_user_model()

print("=" * 60)
print("PRUEBA DE LOGIN")
print("=" * 60)

# Obtener un usuario existente
users = User.objects.all()[:3]

if not users:
    print("No hay usuarios en la base de datos")
    sys.exit(1)

for user in users:
    print(f"\n1. Probando login con usuario: {user.username}")
    print(f"   Email: {user.email}")
    
    # Intentar login con username
    print(f"\n   a) Intentando login con username...")
    serializer = CustomTokenObtainPairSerializer(data={
        'login': user.username,
        'password': 'Password123!'  # Contraseña por defecto
    })
    
    if serializer.is_valid():
        print(f"      ✓ Login exitoso con username")
        print(f"      Access token: {serializer.validated_data['access'][:50]}...")
        print(f"      User: {serializer.validated_data['user']['username']}")
    else:
        print(f"      ✗ Error: {serializer.errors}")
    
    # Intentar login con email
    print(f"\n   b) Intentando login con email...")
    serializer = CustomTokenObtainPairSerializer(data={
        'login': user.email,
        'password': 'Password123!'  # Contraseña por defecto
    })
    
    if serializer.is_valid():
        print(f"      ✓ Login exitoso con email")
        print(f"      Access token: {serializer.validated_data['access'][:50]}...")
        print(f"      User: {serializer.validated_data['user']['username']}")
    else:
        print(f"      ✗ Error: {serializer.errors}")

print("\n" + "=" * 60)
print("PRUEBA COMPLETADA")
print("=" * 60)

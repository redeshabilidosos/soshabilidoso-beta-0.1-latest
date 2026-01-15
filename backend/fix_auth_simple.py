#!/usr/bin/env python
"""
Script simple para arreglar la autenticación usando SQLite
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

from django.core.management import call_command
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("ARREGLO DE AUTENTICACIÓN - USANDO SQLITE")
print("=" * 60)

# 1. Ejecutar migraciones
print("\n1. Ejecutando migraciones...")
try:
    call_command('migrate', verbosity=1)
    print("   ✓ Migraciones completadas")
except Exception as e:
    print(f"   ✗ Error en migraciones: {e}")

# 2. Verificar usuarios
print("\n2. Verificando usuarios...")
user_count = User.objects.count()
print(f"   Total de usuarios: {user_count}")

if user_count == 0:
    print("\n   Creando usuario de prueba...")
    try:
        test_user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            display_name='Test User',
            password='TestPassword123!'
        )
        print(f"   ✓ Usuario creado: {test_user.username}")
        print(f"     Email: {test_user.email}")
        print(f"     Contraseña: TestPassword123!")
    except Exception as e:
        print(f"   ✗ Error al crear usuario: {e}")
else:
    print("   ✓ Hay usuarios en la base de datos")
    for user in User.objects.all()[:5]:
        print(f"     - {user.username} ({user.email})")

print("\n" + "=" * 60)
print("ARREGLO COMPLETADO")
print("=" * 60)
print("\nPara iniciar el servidor:")
print("  python manage.py runserver")
print("\nPara probar el login:")
print("  POST http://127.0.0.1:8000/api/auth/login/")
print("  Body: {\"login\": \"testuser\", \"password\": \"TestPassword123!\"}")

#!/usr/bin/env python
"""
Script para verificar y arreglar la configuración de autenticación
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
sys.path.insert(0, os.path.dirname(__file__))

django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.db import connection

User = get_user_model()

print("=" * 60)
print("VERIFICACIÓN Y ARREGLO DE AUTENTICACIÓN")
print("=" * 60)

# 1. Verificar que el modelo de usuario está configurado correctamente
print("\n1. Verificando configuración de AUTH_USER_MODEL...")
from django.conf import settings
print(f"   AUTH_USER_MODEL: {settings.AUTH_USER_MODEL}")
print(f"   User model: {User}")
print(f"   User model table: {User._meta.db_table}")

# 2. Verificar que la tabla existe
print("\n2. Verificando tabla de usuarios en la base de datos...")
with connection.cursor() as cursor:
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
    result = cursor.fetchone()
    if result:
        print("   ✓ Tabla 'users' existe")
    else:
        print("   ✗ Tabla 'users' NO existe - ejecutando migraciones...")
        call_command('migrate', 'users')

# 3. Verificar que hay usuarios en la base de datos
print("\n3. Verificando usuarios en la base de datos...")
user_count = User.objects.count()
print(f"   Total de usuarios: {user_count}")

if user_count == 0:
    print("\n   No hay usuarios. Creando usuario de prueba...")
    try:
        test_user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            display_name='Test User',
            password='TestPassword123!'
        )
        print(f"   ✓ Usuario creado: {test_user.username}")
    except Exception as e:
        print(f"   ✗ Error al crear usuario: {e}")
else:
    print("   ✓ Hay usuarios en la base de datos")
    # Listar usuarios
    for user in User.objects.all()[:5]:
        print(f"     - {user.username} ({user.email})")

# 4. Verificar que las apps están instaladas
print("\n4. Verificando apps instaladas...")
installed_apps = settings.INSTALLED_APPS
if 'apps.users' in installed_apps:
    print("   ✓ apps.users está instalada")
else:
    print("   ✗ apps.users NO está instalada")

if 'apps.authentication' in installed_apps:
    print("   ✓ apps.authentication está instalada")
else:
    print("   ✗ apps.authentication NO está instalada")

# 5. Verificar que rest_framework_simplejwt está instalada
if 'rest_framework_simplejwt' in installed_apps:
    print("   ✓ rest_framework_simplejwt está instalada")
else:
    print("   ✗ rest_framework_simplejwt NO está instalada")

print("\n" + "=" * 60)
print("VERIFICACIÓN COMPLETADA")
print("=" * 60)

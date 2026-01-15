#!/usr/bin/env python
"""Crear usuarios administradores"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

import django
django.setup()

from apps.users.models import User

print("Creando administradores...")

admins = [
    {'username': 'superadmin', 'email': 'superadmin@habilidosos.com', 'password': 'Super123!', 'display_name': 'Super Admin'},
    {'username': 'admin2', 'email': 'admin2@habilidosos.com', 'password': 'Admin123!', 'display_name': 'Admin 2'},
    {'username': 'admin3', 'email': 'admin3@habilidosos.com', 'password': 'Admin123!', 'display_name': 'Admin 3'},
]

for data in admins:
    user, created = User.objects.get_or_create(
        username=data['username'],
        defaults={
            'email': data['email'],
            'display_name': data['display_name'],
            'is_staff': True,
            'is_superuser': True,
        }
    )
    user.is_staff = True
    user.is_superuser = True
    user.set_password(data['password'])
    user.save()
    status = "Creado" if created else "Actualizado"
    print(f"  {status}: {data['username']} / {data['password']}")

# Actualizar admin existente
admin = User.objects.filter(username='admin').first()
if admin:
    admin.is_staff = True
    admin.is_superuser = True
    admin.set_password('admin123')
    admin.save()
    print("  Actualizado: admin / admin123")

print("\n¡Administradores listos para Django Admin!")
print("\nAccede a: http://127.0.0.1:8000/admin/")

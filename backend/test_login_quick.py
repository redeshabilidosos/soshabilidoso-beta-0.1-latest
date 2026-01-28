#!/usr/bin/env python
"""
Script rápido para probar el login
"""
import os
import django
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.users.models import User

print("=" * 60)
print("VERIFICACIÓN DE USUARIOS EN LA BASE DE DATOS")
print("=" * 60)

# Listar todos los usuarios
users = User.objects.all()
print(f"\n📊 Total de usuarios: {users.count()}\n")

if users.count() == 0:
    print("⚠️  NO HAY USUARIOS EN LA BASE DE DATOS")
    print("\nCreando usuario de prueba...")
    user = User.objects.create_user(
        username='testuser',
        email='test@test.com',
        password='Test1234!',
        display_name='Usuario de Prueba'
    )
    print(f"✅ Usuario creado: {user.username}")
else:
    print("Usuarios encontrados:")
    print("-" * 60)
    for user in users[:10]:  # Mostrar solo los primeros 10
        print(f"  👤 Username: {user.username}")
        print(f"     Email: {user.email}")
        print(f"     Nombre: {user.display_name}")
        print(f"     Activo: {'✅' if user.is_active else '❌'}")
        print(f"     Staff: {'✅' if user.is_staff else '❌'}")
        print("-" * 60)

print("\n" + "=" * 60)
print("PRUEBA DE AUTENTICACIÓN")
print("=" * 60)

# Probar autenticación con el primer usuario
if users.count() > 0:
    test_user = users.first()
    print(f"\n🔐 Probando autenticación con: {test_user.username}")
    print(f"   Email: {test_user.email}")
    
    # Intentar con una contraseña de prueba
    test_passwords = ['password', 'admin', 'Test1234!', '12345678']
    
    for pwd in test_passwords:
        if test_user.check_password(pwd):
            print(f"   ✅ Contraseña correcta: {pwd}")
            break
    else:
        print(f"   ❌ Ninguna de las contraseñas de prueba funcionó")
        print(f"   💡 Puedes cambiar la contraseña con:")
        print(f"      python manage.py shell")
        print(f"      >>> from apps.users.models import User")
        print(f"      >>> u = User.objects.get(username='{test_user.username}')")
        print(f"      >>> u.set_password('NuevaContraseña123!')")
        print(f"      >>> u.save()")

print("\n" + "=" * 60)

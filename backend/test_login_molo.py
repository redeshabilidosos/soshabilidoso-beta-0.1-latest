import os
import django
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model, authenticate
import requests

User = get_user_model()

print("=" * 50)
print("🔍 PROBANDO LOGIN CON USUARIO 'molo'")
print("=" * 50)
print()

# Verificar usuario
try:
    user = User.objects.get(username='molo')
    print(f"✅ Usuario encontrado:")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Display Name: {user.display_name}")
    print(f"   Activo: {user.is_active}")
    print()
    
    # Probar contraseña con authenticate
    print("🔐 Probando contraseña 'password123'...")
    auth_user = authenticate(username='molo', password='password123')
    if auth_user:
        print("✅ Autenticación exitosa con authenticate()")
    else:
        print("❌ Autenticación falló con authenticate()")
        print("   Probando check_password()...")
        if user.check_password('password123'):
            print("   ✅ check_password() dice que la contraseña es correcta")
        else:
            print("   ❌ check_password() dice que la contraseña es incorrecta")
    print()
    
    # Probar login via API
    print("🌐 Probando login via API...")
    try:
        response = requests.post(
            'http://127.0.0.1:8000/api/auth/login/',
            json={
                'login': 'molo',
                'password': 'password123'
            },
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Login exitoso via API")
            data = response.json()
            print(f"   Token recibido: {data.get('access', 'N/A')[:50]}...")
        else:
            print(f"   ❌ Login falló via API")
            print(f"   Respuesta: {response.text}")
    except Exception as e:
        print(f"   ❌ Error al conectar con API: {e}")
    
    print()
    print("=" * 50)
    print("📋 RESUMEN")
    print("=" * 50)
    print(f"Usuario: {user.username}")
    print(f"Email: {user.email}")
    print(f"Contraseña correcta: {'password123' if user.check_password('password123') else 'OTRA'}")
    
except User.DoesNotExist:
    print("❌ Usuario 'molo' no encontrado")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

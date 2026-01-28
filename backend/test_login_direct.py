"""
Script para probar login directamente con el backend
"""
import os
import sys
import django
import requests
import json

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def test_direct_login():
    """Probar login directamente"""
    print("\n" + "="*80)
    print("TEST DE LOGIN DIRECTO")
    print("="*80 + "\n")
    
    # 1. Verificar que el usuario existe
    print("1️⃣ Verificando usuario en la base de datos...")
    try:
        user = User.objects.get(username='molo')
        print(f"   ✅ Usuario encontrado: {user.username}")
        print(f"   📧 Email: {user.email}")
        print(f"   👤 Display Name: {user.display_name}")
        print(f"   🔓 Is Active: {user.is_active}")
    except User.DoesNotExist:
        print("   ❌ Usuario 'molo' no existe")
        return False
    
    # 2. Verificar contraseña
    print("\n2️⃣ Verificando contraseña...")
    password = 'password123'
    is_valid = user.check_password(password)
    if is_valid:
        print(f"   ✅ Contraseña '{password}' es válida")
    else:
        print(f"   ❌ Contraseña '{password}' es inválida")
        return False
    
    # 3. Probar login a través de la API
    print("\n3️⃣ Probando login a través de la API...")
    url = "http://127.0.0.1:8000/api/auth/login/"
    
    payload = {
        "login": "molo",
        "password": "password123"
    }
    
    print(f"   📤 URL: {url}")
    print(f"   📤 Payload: {json.dumps(payload, indent=6)}")
    
    try:
        print("\n   🔄 Enviando petición...")
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"\n   📥 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ LOGIN EXITOSO")
            data = response.json()
            print(f"\n   📦 Respuesta:")
            print(json.dumps(data, indent=6))
            
            # Verificar tokens
            if 'access' in data and 'refresh' in data:
                print(f"\n   🔑 Access Token: {data['access'][:50]}...")
                print(f"   🔑 Refresh Token: {data['refresh'][:50]}...")
            
            # Verificar usuario
            if 'user' in data:
                print(f"\n   👤 Usuario en respuesta:")
                print(f"      - Username: {data['user'].get('username')}")
                print(f"      - Email: {data['user'].get('email')}")
                print(f"      - Display Name: {data['user'].get('display_name')}")
                print(f"      - Avatar: {data['user'].get('avatar_url', 'N/A')[:60]}...")
            
            return True
        else:
            print("   ❌ LOGIN FALLIDO")
            print(f"\n   📦 Respuesta de error:")
            try:
                print(json.dumps(response.json(), indent=6))
            except:
                print(response.text)
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n   ❌ ERROR: No se pudo conectar al servidor")
        print("   ⚠️  Asegúrate de que el servidor Django esté corriendo:")
        print("      cd backend")
        print("      python manage.py runserver")
        return False
    except Exception as e:
        print(f"\n   ❌ ERROR: {e}")
        return False

def test_with_email():
    """Probar login con email"""
    print("\n" + "="*80)
    print("TEST DE LOGIN CON EMAIL")
    print("="*80 + "\n")
    
    url = "http://127.0.0.1:8000/api/auth/login/"
    
    payload = {
        "login": "camilogomezroman@protonmaill.com",
        "password": "password123"
    }
    
    print(f"📤 URL: {url}")
    print(f"📤 Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"\n📥 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ LOGIN CON EMAIL EXITOSO")
            return True
        else:
            print("❌ LOGIN CON EMAIL FALLIDO")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(response.text)
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def main():
    print("\n" + "="*80)
    print("🔐 PRUEBA COMPLETA DE LOGIN")
    print("="*80)
    
    # Test 1: Login con username
    success1 = test_direct_login()
    
    # Test 2: Login con email
    success2 = test_with_email()
    
    # Resumen
    print("\n" + "="*80)
    print("📊 RESUMEN")
    print("="*80)
    print(f"Login con username: {'✅ EXITOSO' if success1 else '❌ FALLIDO'}")
    print(f"Login con email: {'✅ EXITOSO' if success2 else '❌ FALLIDO'}")
    
    if success1 and success2:
        print("\n🎉 ¡Todos los tests pasaron!")
        print("\n📝 Puedes usar estas credenciales en el frontend:")
        print("   Username: molo")
        print("   Email: camilogomezroman@protonmaill.com")
        print("   Password: password123")
        print("\n🌐 Frontend: http://localhost:4000/login")
    else:
        print("\n⚠️  Algunos tests fallaron. Revisa los errores arriba.")
    
    print()

if __name__ == '__main__':
    main()

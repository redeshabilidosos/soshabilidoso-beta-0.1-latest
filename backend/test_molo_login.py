"""
Script para probar login con usuario molo
"""
import requests
import json

def test_login():
    """Probar login con usuario molo"""
    print("\n" + "="*80)
    print("PROBANDO LOGIN CON USUARIO MOLO")
    print("="*80 + "\n")
    
    url = "http://127.0.0.1:8000/api/auth/login/"
    
    # Credenciales correctas
    payload = {
        "login": "molo",
        "password": "admin123"
    }
    
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print()
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            print("\n" + "="*80)
            print("✅ LOGIN EXITOSO")
            print("="*80)
            
            data = response.json()
            if 'access' in data:
                print(f"\n🔑 Access Token: {data['access'][:50]}...")
            if 'user' in data:
                print(f"👤 Usuario: {data['user'].get('username')}")
                print(f"📧 Email: {data['user'].get('email')}")
                print(f"✨ Display Name: {data['user'].get('display_name')}")
            
            return True
        else:
            print("\n" + "="*80)
            print("❌ LOGIN FALLIDO")
            print("="*80)
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n" + "="*80)
        print("❌ ERROR: No se pudo conectar al servidor")
        print("="*80)
        print("\n⚠️  Asegúrate de que el servidor Django esté corriendo:")
        print("   cd backend")
        print("   python manage.py runserver")
        print()
        return False
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

if __name__ == '__main__':
    test_login()

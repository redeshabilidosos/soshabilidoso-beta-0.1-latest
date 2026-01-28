t"""
Script para probar los nuevos endpoints de sugerencias
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Primero hacer login para obtener el token
def get_token():
    login_data = {
        "login": "molo",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    if response.status_code == 200:
        data = response.json()
        return data.get('access')
    else:
        print(f"Error en login: {response.status_code}")
        print(response.text)
        return None

def test_endpoints(token):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    print("\n" + "="*60)
    print("PROBANDO ENDPOINTS DE SUGERENCIAS")
    print("="*60)
    
    # Test 1: Lista de usuarios
    print("\n1. GET /api/users/")
    response = requests.get(f"{BASE_URL}/api/users/", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        results = data.get('results', data)
        print(f"   Usuarios encontrados: {len(results)}")
        if results:
            print(f"   Primer usuario: {results[0].get('username')} - {results[0].get('display_name')}")
    else:
        print(f"   Error: {response.text}")
    
    # Test 2: Usuarios sugeridos
    print("\n2. GET /api/users/suggested/")
    response = requests.get(f"{BASE_URL}/api/users/suggested/", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        results = data if isinstance(data, list) else data.get('results', [])
        print(f"   Usuarios sugeridos: {len(results)}")
        if results:
            for user in results[:3]:
                print(f"   - {user.get('username')} ({user.get('display_name')})")
    else:
        print(f"   Error: {response.text}")
    
    # Test 3: Lista de comunidades
    print("\n3. GET /api/communities/")
    response = requests.get(f"{BASE_URL}/api/communities/", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        results = data if isinstance(data, list) else data.get('results', [])
        print(f"   Comunidades encontradas: {len(results)}")
        if results:
            print(f"   Primera comunidad: {results[0].get('name')}")
    else:
        print(f"   Error: {response.text}")
    
    # Test 4: Comunidades sugeridas
    print("\n4. GET /api/communities/suggested/")
    response = requests.get(f"{BASE_URL}/api/communities/suggested/", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        results = data if isinstance(data, list) else data.get('results', [])
        print(f"   Comunidades sugeridas: {len(results)}")
        if results:
            for community in results[:3]:
                print(f"   - {community.get('name')} ({community.get('members_count', 0)} miembros)")
    else:
        print(f"   Error: {response.text}")
    
    print("\n" + "="*60)
    print("PRUEBAS COMPLETADAS")
    print("="*60 + "\n")

if __name__ == "__main__":
    print("Obteniendo token de autenticación...")
    token = get_token()
    
    if token:
        print("✅ Token obtenido exitosamente")
        test_endpoints(token)
    else:
        print("❌ No se pudo obtener el token")

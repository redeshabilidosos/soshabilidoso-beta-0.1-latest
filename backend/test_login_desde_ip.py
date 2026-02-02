import requests

print("=" * 50)
print("🔍 PROBANDO LOGIN DESDE IP (como lo haría el móvil)")
print("=" * 50)
print()

# Probar con la IP que usa el móvil
url = 'http://10.87.23.237:8000/api/auth/login/'
print(f"URL: {url}")
print()

# Probar login
print("🌐 Enviando petición de login...")
try:
    response = requests.post(
        url,
        json={
            'login': 'molo',
            'password': 'password123'
        },
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print()
    
    if response.status_code == 200:
        print("✅ Login exitoso")
        data = response.json()
        print(f"Token: {data.get('access', 'N/A')[:50]}...")
        print(f"User: {data.get('user', {}).get('username', 'N/A')}")
    else:
        print("❌ Login falló")
        print(f"Respuesta: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ No se puede conectar al servidor")
    print("   Verifica que el backend esté corriendo en 0.0.0.0:8000")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

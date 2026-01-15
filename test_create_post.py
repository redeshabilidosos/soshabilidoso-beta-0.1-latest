import requests
import json

# URL del endpoint
url = "http://localhost:8000/api/posts/"

# Obtener token (asumiendo que tienes un usuario)
login_url = "http://localhost:8000/api/auth/login/"
login_data = {
    "username": "jazmin",  # Cambia esto por tu usuario
    "password": "123"  # Cambia esto por tu contraseña
}

# Login para obtener token
login_data_corrected = {
    "login": "jazmin",  # Usar 'login' en lugar de 'username'
    "password": "123"
}
login_response = requests.post(login_url, json=login_data_corrected)
if login_response.status_code == 200:
    token = login_response.json()['access']
    print(f"✅ Token obtenido: {token[:20]}...")
    
    # Datos del post
    post_data = {
        "content": "hola desde script de prueba",
        "post_type": "text",
        "category": "football",
        "is_public": True
    }
    
    # Headers con token
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Crear post
    print("\n📤 Enviando post...")
    response = requests.post(url, json=post_data, headers=headers)
    
    print(f"\n📊 Status Code: {response.status_code}")
    print(f"📄 Response Headers: {dict(response.headers)}")
    print(f"\n📝 Response Body:")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text[:500])
else:
    print(f"❌ Error en login: {login_response.status_code}")
    print(login_response.text)

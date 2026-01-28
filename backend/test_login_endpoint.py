#!/usr/bin/env python
"""
Test directo del endpoint de login
"""
import requests
import json

API_URL = "http://127.0.0.1:8000/api"

print("=" * 60)
print("TEST DE ENDPOINT DE LOGIN")
print("=" * 60)

# Credenciales
credentials = {
    "login": "camilogomezdeveloper@gmail.com",
    "password": "Camilo123!"
}

print(f"\n📤 Enviando petición a: {API_URL}/auth/login/")
print(f"📋 Datos: {json.dumps(credentials, indent=2)}")

try:
    response = requests.post(
        f"{API_URL}/auth/login/",
        json=credentials,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\n📥 Respuesta:")
    print(f"   Status Code: {response.status_code}")
    print(f"   Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        print(f"\n✅ LOGIN EXITOSO!")
        data = response.json()
        print(f"\n📊 Datos recibidos:")
        print(json.dumps(data, indent=2))
    else:
        print(f"\n❌ LOGIN FALLIDO!")
        print(f"   Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print(f"\n❌ ERROR: No se puede conectar al servidor")
    print(f"   Asegúrate de que el servidor Django esté corriendo en {API_URL}")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")

print("\n" + "=" * 60)

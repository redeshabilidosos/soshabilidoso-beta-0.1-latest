#!/usr/bin/env python
"""
Script para probar el endpoint de login desde la API
"""
import requests
import json

API_URL = "http://127.0.0.1:8000/api/auth/login/"

# Datos de prueba
test_data = {
    "login": "redes.habilidosos",
    "password": "Password123!"
}

print("=" * 60)
print("PRUEBA DE LOGIN API")
print("=" * 60)
print(f"\nURL: {API_URL}")
print(f"Datos: {json.dumps(test_data, indent=2)}")

try:
    response = requests.post(API_URL, json=test_data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("\n✓ Login exitoso")
        data = response.json()
        print(f"Access Token: {data.get('access', '')[:50]}...")
        print(f"User: {data.get('user', {}).get('username')}")
    else:
        print(f"\n✗ Error {response.status_code}")
        try:
            print(f"Error details: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Error details: {response.text}")
            
except Exception as e:
    print(f"\n✗ Exception: {e}")

print("\n" + "=" * 60)

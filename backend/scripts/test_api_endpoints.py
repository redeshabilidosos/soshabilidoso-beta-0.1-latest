#!/usr/bin/env python3
"""
Script para probar todos los endpoints principales de la API
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(url, method="GET", headers=None, data=None, auth_required=False):
    """Probar un endpoint específico"""
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=5)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, timeout=5)
        
        status = "✅" if response.status_code < 400 else "❌"
        auth_info = " (Auth required)" if auth_required and response.status_code == 401 else ""
        
        print(f"{status} {method} {url} - {response.status_code}{auth_info}")
        
        if response.status_code < 400:
            try:
                content = response.json()
                if isinstance(content, dict) and len(content) <= 3:
                    print(f"   Response: {content}")
                elif isinstance(content, list) and len(content) <= 2:
                    print(f"   Response: {content}")
                else:
                    print(f"   Response: {type(content).__name__} with {len(content)} items")
            except:
                print(f"   Response: {response.text[:100]}...")
        
        return response.status_code < 400
        
    except requests.exceptions.ConnectionError:
        print(f"❌ {method} {url} - CONNECTION REFUSED")
        return False
    except requests.exceptions.Timeout:
        print(f"❌ {method} {url} - TIMEOUT")
        return False
    except Exception as e:
        print(f"❌ {method} {url} - ERROR: {e}")
        return False

def main():
    print("🔍 Probando endpoints de SOS-HABILIDOSO API")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Base URL: {BASE_URL}")
    print("=" * 60)
    
    # Endpoints básicos
    print("\n📋 Endpoints Básicos:")
    test_endpoint(f"{BASE_URL}/")
    test_endpoint(f"{BASE_URL}/health/")
    test_endpoint(f"{BASE_URL}/admin/")
    
    # Endpoints públicos
    print("\n🌍 Endpoints Públicos:")
    test_endpoint(f"{BASE_URL}/api/site-settings/")
    
    # Endpoints que requieren autenticación
    print("\n🔐 Endpoints con Autenticación:")
    test_endpoint(f"{BASE_URL}/api/advertising/?position=0&count=5", auth_required=True)
    test_endpoint(f"{BASE_URL}/api/posts/", auth_required=True)
    test_endpoint(f"{BASE_URL}/api/users/", auth_required=True)
    test_endpoint(f"{BASE_URL}/api/reels/", auth_required=True)
    test_endpoint(f"{BASE_URL}/api/classifieds/", auth_required=True)
    test_endpoint(f"{BASE_URL}/api/communities/", auth_required=True)
    
    # Endpoint de autenticación
    print("\n🔑 Endpoint de Autenticación:")
    test_endpoint(f"{BASE_URL}/api/auth/login/", method="POST", 
                 data={"username": "test", "password": "test"})
    
    # Documentación (si está habilitada)
    print("\n📚 Documentación API:")
    test_endpoint(f"{BASE_URL}/api/docs/")
    test_endpoint(f"{BASE_URL}/api/redoc/")
    test_endpoint(f"{BASE_URL}/api/schema/")
    
    print("\n" + "=" * 60)
    print("✅ Prueba completada")
    print("\nSi ves CONNECTION REFUSED, el servidor Django no está corriendo.")
    print("Si ves 401 Unauthorized, el endpoint requiere autenticación (normal).")
    print("Si ves 200/302, el endpoint está funcionando correctamente.")

if __name__ == "__main__":
    main()
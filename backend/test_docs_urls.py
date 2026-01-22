#!/usr/bin/env python
"""
Script para probar las URLs de documentación de la API
"""
import requests
import time

def test_docs():
    """Prueba las URLs de documentación"""
    print("🧪 PROBANDO URLs DE DOCUMENTACIÓN DE LA API")
    print("=" * 60)
    
    base_url = "http://127.0.0.1:8000"
    
    docs_urls = [
        (f"{base_url}/api/schema/", "Schema OpenAPI"),
        (f"{base_url}/api/docs/", "Swagger UI"),
        (f"{base_url}/api/redoc/", "ReDoc"),
    ]
    
    print("⏳ Esperando a que el servidor esté listo...")
    time.sleep(3)
    
    for url, description in docs_urls:
        try:
            response = requests.get(url, timeout=10, allow_redirects=True)
            
            if response.status_code == 200:
                print(f"✅ {description}")
                print(f"    URL: {url}")
                print(f"    Status: {response.status_code}")
                print(f"    Content Type: {response.headers.get('content-type', 'N/A')}")
                print(f"    Size: {len(response.content)} bytes")
            else:
                print(f"❌ {description}")
                print(f"    URL: {url}")
                print(f"    Status: {response.status_code}")
            
            print()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ {description}")
            print(f"    URL: {url}")
            print(f"    Error: {e}")
            print()
    
    print("=" * 60)
    print("🔗 Accede a la documentación en:")
    print(f"   • Swagger UI: {base_url}/api/docs/")
    print(f"   • ReDoc: {base_url}/api/redoc/")
    print(f"   • Schema JSON: {base_url}/api/schema/")

if __name__ == '__main__':
    test_docs()
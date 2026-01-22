#!/usr/bin/env python
"""
Script para probar específicamente la URL de learning
"""
import requests
import time

def test_learning_url():
    """Prueba la URL de learning que estaba dando error 500"""
    url = "http://127.0.0.1:8000/admin/learning/seccion/"
    
    print("🧪 PROBANDO URL DE LEARNING ESPECÍFICAMENTE")
    print("=" * 50)
    print(f"URL: {url}")
    print()
    
    try:
        response = requests.get(url, timeout=10, allow_redirects=True)
        
        print(f"Status Code: {response.status_code}")
        print(f"Content Type: {response.headers.get('content-type', 'N/A')}")
        print(f"Content Length: {len(response.content)} bytes")
        print(f"Final URL: {response.url}")
        
        if response.status_code == 200:
            print("✅ SUCCESS: La URL de learning funciona correctamente!")
        elif response.status_code in [301, 302, 303, 307, 308]:
            print("⚠️ REDIRECT: La URL redirige (probablemente a login)")
        elif response.status_code == 500:
            print("❌ ERROR 500: Aún hay un error interno del servidor")
            print("Contenido de la respuesta:")
            print(response.text[:500] + "..." if len(response.text) > 500 else response.text)
        else:
            print(f"⚠️ Status {response.status_code}: Respuesta inesperada")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ ERROR DE CONEXIÓN: {e}")

if __name__ == '__main__':
    print("⏳ Esperando a que el servidor esté listo...")
    time.sleep(3)
    test_learning_url()
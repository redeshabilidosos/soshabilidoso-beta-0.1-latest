#!/usr/bin/env python3
"""
Script para probar las rutas de la API de Django
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_route(path, description):
    """Probar una ruta específica"""
    url = f"{BASE_URL}{path}"
    print(f"\n🔍 Probando: {description}")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Éxito")
            # Si es JSON, mostrar un preview
            try:
                if 'application/json' in response.headers.get('content-type', ''):
                    data = response.json()
                    if isinstance(data, dict) and len(str(data)) < 200:
                        print(f"Respuesta: {json.dumps(data, indent=2)}")
                    else:
                        print("Respuesta: JSON válido (muy largo para mostrar)")
                elif 'text/html' in response.headers.get('content-type', ''):
                    print("Respuesta: HTML válido")
                else:
                    print(f"Respuesta: {response.headers.get('content-type', 'unknown')}")
            except:
                print("Respuesta: Contenido válido")
        else:
            print(f"❌ Error: {re
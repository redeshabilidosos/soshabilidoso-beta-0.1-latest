#!/usr/bin/env python
"""
Script para probar que el servidor Django funcione correctamente
"""
import os
import django
import subprocess
import time
import requests
from threading import Thread

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

def test_server():
    """Probar que el servidor responda correctamente"""
    print("🚀 Probando servidor Django...")
    
    # URLs a probar
    urls_to_test = [
        ('http://127.0.0.1:8000/', 'API Root'),
        ('http://127.0.0.1:8000/admin/', 'Panel Admin'),
        ('http://127.0.0.1:8000/api/docs/', 'Swagger UI'),
        ('http://127.0.0.1:8000/api/redoc/', 'ReDoc'),
        ('http://127.0.0.1:8000/api/schema/', 'Esquema OpenAPI'),
    ]
    
    print("⏳ Esperando que el servidor esté listo...")
    time.sleep(2)
    
    for url, name in urls_to_test:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name}: OK (200)")
            elif response.status_code == 302:
                print(f"✅ {name}: Redirect (302) - Normal para admin sin login")
            else:
                print(f"⚠️  {name}: Status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {name}: Error - {str(e)}")

if __name__ == "__main__":
    print("🔍 Verificación del servidor Django")
    print("=" * 50)
    
    print("💡 Asegúrate de que el servidor esté corriendo:")
    print("   python manage.py runserver")
    print()
    
    input("Presiona Enter cuando el servidor esté corriendo...")
    
    test_server()
    
    print("\n" + "=" * 50)
    print("✅ Prueba completada")
    print("\n📖 Si todo está bien, deberías poder acceder a:")
    print("   • Admin: http://127.0.0.1:8000/admin/")
    print("   • API Docs: http://127.0.0.1:8000/api/docs/")
    print("   • ReDoc: http://127.0.0.1:8000/api/redoc/")
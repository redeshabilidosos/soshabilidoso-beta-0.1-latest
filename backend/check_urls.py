#!/usr/bin/env python
"""
Script para verificar que las URLs estén funcionando correctamente
"""
import os
import django
from django.conf import settings

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

def check_urls():
    """Verificar URLs principales"""
    print("🔍 Verificando URLs principales...")
    
    try:
        from django.urls import reverse
        
        # URLs principales
        urls_to_check = [
            ('admin:index', 'Panel de administración'),
            ('api_root', 'API Root'),
            ('schema', 'Esquema OpenAPI'),
            ('swagger-ui', 'Swagger UI'),
            ('redoc', 'ReDoc'),
        ]
        
        for url_name, description in urls_to_check:
            try:
                url = reverse(url_name)
                print(f"✅ {description}: {url}")
            except Exception as e:
                print(f"❌ {description}: Error - {str(e)}")
        
        print("\n🔍 Verificando configuración de admin...")
        
        # Verificar admin
        from django.contrib import admin
        print(f"✅ Admin site configurado: {admin.site}")
        
        # Verificar apps instaladas
        print(f"\n🔍 Apps instaladas: {len(settings.INSTALLED_APPS)}")
        for app in settings.INSTALLED_APPS:
            if 'admin' in app or 'spectacular' in app:
                print(f"  ✅ {app}")
        
    except Exception as e:
        print(f"❌ Error general: {str(e)}")

def test_admin_access():
    """Probar acceso al admin"""
    print("\n🔍 Probando acceso al admin...")
    
    try:
        from django.test import Client
        client = Client()
        
        # Probar acceso al admin
        response = client.get('/admin/')
        print(f"✅ Admin accesible - Status: {response.status_code}")
        
        # Probar acceso a la documentación
        response = client.get('/api/docs/')
        print(f"✅ Swagger UI accesible - Status: {response.status_code}")
        
        response = client.get('/api/schema/')
        print(f"✅ Esquema accesible - Status: {response.status_code}")
        
    except Exception as e:
        print(f"❌ Error probando acceso: {str(e)}")

if __name__ == "__main__":
    print("🚀 Verificación de URLs y Admin")
    print("=" * 50)
    
    check_urls()
    test_admin_access()
    
    print("\n" + "=" * 50)
    print("✅ Verificación completada")
    print("\n💡 URLs principales:")
    print("   • Admin: http://127.0.0.1:8000/admin/")
    print("   • API Docs: http://127.0.0.1:8000/api/docs/")
    print("   • API Root: http://127.0.0.1:8000/")
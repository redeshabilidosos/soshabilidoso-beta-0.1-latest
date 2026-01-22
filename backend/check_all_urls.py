#!/usr/bin/env python
"""
Script para verificar todas las URLs disponibles en Django
"""
import os
import sys
import django
from django.conf import settings

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.urls import get_resolver
from django.core.management import execute_from_command_line
import requests
import time

def get_all_urls():
    """Obtiene todas las URLs configuradas en Django"""
    resolver = get_resolver()
    urls = []
    
    def extract_urls(url_patterns, prefix=''):
        for pattern in url_patterns:
            if hasattr(pattern, 'url_patterns'):
                # Es un include, recursivamente obtener URLs
                extract_urls(pattern.url_patterns, prefix + str(pattern.pattern))
            else:
                # Es una URL individual
                url = prefix + str(pattern.pattern)
                # Limpiar la URL
                url = url.replace('^', '').replace('$', '').replace('\\', '')
                if url and not url.startswith('__'):
                    urls.append({
                        'url': url,
                        'name': getattr(pattern, 'name', 'Sin nombre'),
                        'view': str(pattern.callback) if hasattr(pattern, 'callback') else 'N/A'
                    })
    
    extract_urls(resolver.url_patterns)
    return urls

def test_url(url, base_url='http://127.0.0.1:8000'):
    """Prueba si una URL es accesible"""
    try:
        # Limpiar la URL para la prueba
        test_url = f"{base_url}/{url}".replace('//', '/')
        if not test_url.endswith('/') and not '.' in url.split('/')[-1]:
            test_url += '/'
            
        response = requests.get(test_url, timeout=5, allow_redirects=False)
        return {
            'status': response.status_code,
            'accessible': response.status_code < 400,
            'redirect': response.status_code in [301, 302, 303, 307, 308]
        }
    except requests.exceptions.RequestException as e:
        return {
            'status': 'ERROR',
            'accessible': False,
            'error': str(e)
        }

def main():
    print("🔍 ANÁLISIS COMPLETO DE URLs DE DJANGO")
    print("=" * 60)
    
    # Obtener todas las URLs
    urls = get_all_urls()
    
    print(f"\n📋 TOTAL DE URLs ENCONTRADAS: {len(urls)}")
    print("-" * 60)
    
    # Categorizar URLs
    admin_urls = []
    api_urls = []
    other_urls = []
    
    for url_info in urls:
        url = url_info['url']
        if url.startswith('admin/'):
            admin_urls.append(url_info)
        elif url.startswith('api/'):
            api_urls.append(url_info)
        else:
            other_urls.append(url_info)
    
    print(f"\n🔧 URLs DEL ADMIN: {len(admin_urls)}")
    for url_info in admin_urls:
        print(f"  - /{url_info['url']} ({url_info['name']})")
    
    print(f"\n🌐 URLs DE LA API: {len(api_urls)}")
    for url_info in api_urls:
        print(f"  - /{url_info['url']} ({url_info['name']})")
    
    print(f"\n📄 OTRAS URLs: {len(other_urls)}")
    for url_info in other_urls:
        print(f"  - /{url_info['url']} ({url_info['name']})")
    
    # Esperar a que el servidor esté listo
    print("\n⏳ Esperando a que el servidor esté listo...")
    time.sleep(3)
    
    # Probar URLs críticas
    critical_urls = [
        '',  # Root
        'admin/',
        'admin/login/',
        'api/',
        'health/',
        'debug/routes/',
    ]
    
    print(f"\n🧪 PROBANDO URLs CRÍTICAS:")
    print("-" * 60)
    
    for url in critical_urls:
        result = test_url(url)
        status_icon = "✅" if result['accessible'] else "❌"
        redirect_info = " (REDIRECT)" if result.get('redirect') else ""
        
        print(f"{status_icon} /{url} - Status: {result['status']}{redirect_info}")
        if 'error' in result:
            print(f"    Error: {result['error']}")
    
    # Probar algunas URLs del admin
    print(f"\n🔧 PROBANDO URLs DEL ADMIN:")
    print("-" * 60)
    
    admin_test_urls = [
        'admin/',
        'admin/login/',
        'admin/auth/',
        'admin/auth/user/',
        'admin/users/',
        'admin/users/user/',
    ]
    
    for url in admin_test_urls:
        result = test_url(url)
        status_icon = "✅" if result['accessible'] else "❌"
        redirect_info = " (REDIRECT)" if result.get('redirect') else ""
        
        print(f"{status_icon} /{url} - Status: {result['status']}{redirect_info}")
        if 'error' in result:
            print(f"    Error: {result['error']}")

if __name__ == '__main__':
    main()
#!/usr/bin/env python
"""
Script simple para probar URLs específicas
"""
import requests
import time

def test_url(url):
    """Prueba una URL específica"""
    try:
        response = requests.get(url, timeout=10, allow_redirects=True)
        return {
            'url': url,
            'status': response.status_code,
            'accessible': response.status_code < 400,
            'content_length': len(response.content) if response.content else 0
        }
    except requests.exceptions.RequestException as e:
        return {
            'url': url,
            'status': 'ERROR',
            'accessible': False,
            'error': str(e)
        }

def main():
    print("🧪 PROBANDO URLs CRÍTICAS DE DJANGO")
    print("=" * 50)
    
    base_url = "http://127.0.0.1:8000"
    
    # URLs críticas para probar
    test_urls = [
        f"{base_url}/",
        f"{base_url}/admin/",
        f"{base_url}/admin/login/",
        f"{base_url}/api/",
        f"{base_url}/health/",
        f"{base_url}/debug/routes/",
        f"{base_url}/api/site-settings/",
        f"{base_url}/admin/users/user/",
        f"{base_url}/admin/learning/seccion/",
        f"{base_url}/admin/communities/community/",
    ]
    
    print("⏳ Esperando a que el servidor esté listo...")
    time.sleep(2)
    
    for url in test_urls:
        result = test_url(url)
        status_icon = "✅" if result['accessible'] else "❌"
        
        print(f"{status_icon} {result['url']}")
        print(f"    Status: {result['status']}")
        
        if 'error' in result:
            print(f"    Error: {result['error']}")
        elif result['accessible']:
            print(f"    Content Length: {result['content_length']} bytes")
        
        print()

if __name__ == '__main__':
    main()
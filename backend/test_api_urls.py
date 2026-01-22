#!/usr/bin/env python
"""
Script para probar URLs específicas de la API
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
            'accessible': response.status_code < 500,  # Permitir 4xx como válidos
            'content_length': len(response.content) if response.content else 0,
            'content_type': response.headers.get('content-type', 'N/A')
        }
    except requests.exceptions.RequestException as e:
        return {
            'url': url,
            'status': 'ERROR',
            'accessible': False,
            'error': str(e)
        }

def main():
    print("🌐 PROBANDO URLs DE LA API")
    print("=" * 50)
    
    base_url = "http://127.0.0.1:8000"
    
    # URLs de la API para probar
    api_urls = [
        f"{base_url}/api/",
        f"{base_url}/api/auth/",
        f"{base_url}/api/users/",
        f"{base_url}/api/posts/",
        f"{base_url}/api/communities/",
        f"{base_url}/api/messaging/",
        f"{base_url}/api/notifications/",
        f"{base_url}/api/reels/",
        f"{base_url}/api/advertising/",
        f"{base_url}/api/classifieds/",
        f"{base_url}/api/learning/",
        f"{base_url}/api/media/",
        f"{base_url}/api/stories/",
        f"{base_url}/api/donations/",
        f"{base_url}/api/enterprises/",
        f"{base_url}/api/payments/",
        f"{base_url}/api/site-settings/",
        f"{base_url}/api/reality/",
        f"{base_url}/health/",
        f"{base_url}/debug/routes/",
    ]
    
    print("⏳ Esperando a que el servidor esté listo...")
    time.sleep(2)
    
    working_urls = []
    broken_urls = []
    
    for url in api_urls:
        result = test_url(url)
        
        if result['status'] == 200:
            status_icon = "✅"
        elif result['status'] in [401, 403, 404, 405]:
            status_icon = "⚠️"  # Advertencia pero no roto
        else:
            status_icon = "❌"
        
        print(f"{status_icon} {result['url']}")
        print(f"    Status: {result['status']}")
        
        if 'error' in result:
            print(f"    Error: {result['error']}")
            broken_urls.append(result)
        else:
            print(f"    Content Type: {result['content_type']}")
            print(f"    Content Length: {result['content_length']} bytes")
            
            if result['accessible']:
                working_urls.append(result)
            else:
                broken_urls.append(result)
        
        print()
    
    print("\n" + "=" * 50)
    print(f"📊 RESUMEN:")
    print(f"✅ URLs funcionando: {len(working_urls)}")
    print(f"❌ URLs con problemas: {len(broken_urls)}")
    
    if broken_urls:
        print(f"\n🚨 URLs PROBLEMÁTICAS:")
        for url_info in broken_urls:
            print(f"  - {url_info['url']} (Status: {url_info['status']})")

if __name__ == '__main__':
    main()
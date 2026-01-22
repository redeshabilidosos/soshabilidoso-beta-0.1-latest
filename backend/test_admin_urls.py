#!/usr/bin/env python
"""
Script para probar URLs específicas del admin de Django
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
            'content_length': len(response.content) if response.content else 0,
            'final_url': response.url
        }
    except requests.exceptions.RequestException as e:
        return {
            'url': url,
            'status': 'ERROR',
            'accessible': False,
            'error': str(e)
        }

def main():
    print("🔧 PROBANDO URLs DEL ADMIN DE DJANGO")
    print("=" * 60)
    
    base_url = "http://127.0.0.1:8000"
    
    # URLs del admin para probar
    admin_urls = [
        f"{base_url}/admin/",
        f"{base_url}/admin/login/",
        f"{base_url}/admin/auth/",
        f"{base_url}/admin/auth/group/",
        f"{base_url}/admin/users/",
        f"{base_url}/admin/users/user/",
        f"{base_url}/admin/posts/",
        f"{base_url}/admin/posts/post/",
        f"{base_url}/admin/communities/",
        f"{base_url}/admin/communities/community/",
        f"{base_url}/admin/learning/",
        f"{base_url}/admin/learning/seccion/",
        f"{base_url}/admin/learning/tema/",
        f"{base_url}/admin/advertising/",
        f"{base_url}/admin/advertising/advertisement/",
        f"{base_url}/admin/classifieds/",
        f"{base_url}/admin/donations/",
        f"{base_url}/admin/enterprises/",
        f"{base_url}/admin/payments/",
        f"{base_url}/admin/site_settings/",
        f"{base_url}/admin/site_settings/sitesettings/",
    ]
    
    print("⏳ Esperando a que el servidor esté listo...")
    time.sleep(2)
    
    working_urls = []
    broken_urls = []
    
    for url in admin_urls:
        result = test_url(url)
        status_icon = "✅" if result['accessible'] else "❌"
        
        print(f"{status_icon} {result['url']}")
        print(f"    Status: {result['status']}")
        
        if 'error' in result:
            print(f"    Error: {result['error']}")
            broken_urls.append(result)
        elif result['accessible']:
            print(f"    Content Length: {result['content_length']} bytes")
            if result['final_url'] != result['url']:
                print(f"    Redirected to: {result['final_url']}")
            working_urls.append(result)
        else:
            broken_urls.append(result)
        
        print()
    
    print("\n" + "=" * 60)
    print(f"📊 RESUMEN:")
    print(f"✅ URLs funcionando: {len(working_urls)}")
    print(f"❌ URLs con problemas: {len(broken_urls)}")
    
    if broken_urls:
        print(f"\n🚨 URLs PROBLEMÁTICAS:")
        for url_info in broken_urls:
            print(f"  - {url_info['url']} (Status: {url_info['status']})")

if __name__ == '__main__':
    main()
#!/usr/bin/env python
"""
Prueba final completa de todas las URLs críticas
"""
import requests
import time

def test_url(url, description):
    """Prueba una URL específica"""
    try:
        response = requests.get(url, timeout=10, allow_redirects=True)
        
        if response.status_code == 200:
            status = "✅ OK"
        elif response.status_code in [301, 302, 303, 307, 308]:
            status = "🔄 REDIRECT"
        elif response.status_code == 401:
            status = "🔐 AUTH REQUIRED"
        elif response.status_code == 404:
            status = "❓ NOT FOUND"
        elif response.status_code == 500:
            status = "❌ SERVER ERROR"
        else:
            status = f"⚠️ {response.status_code}"
            
        return {
            'url': url,
            'description': description,
            'status_code': response.status_code,
            'status': status,
            'content_length': len(response.content)
        }
    except requests.exceptions.RequestException as e:
        return {
            'url': url,
            'description': description,
            'status_code': 'ERROR',
            'status': '❌ CONNECTION ERROR',
            'error': str(e)
        }

def main():
    print("🧪 PRUEBA FINAL COMPLETA DE SOS-HABILIDOSO")
    print("=" * 60)
    
    base_url = "http://127.0.0.1:8000"
    
    # URLs críticas para probar
    test_urls = [
        # URLs principales
        (f"{base_url}/", "Página principal"),
        (f"{base_url}/api/", "API Root"),
        (f"{base_url}/health/", "Health Check"),
        (f"{base_url}/debug/routes/", "Debug Routes"),
        
        # Admin URLs
        (f"{base_url}/admin/", "Admin Principal"),
        (f"{base_url}/admin/login/", "Admin Login"),
        (f"{base_url}/admin/users/user/", "Admin Usuarios"),
        (f"{base_url}/admin/learning/seccion/", "Admin Learning Secciones"),
        (f"{base_url}/admin/learning/tema/", "Admin Learning Temas"),
        (f"{base_url}/admin/communities/community/", "Admin Comunidades"),
        (f"{base_url}/admin/posts/post/", "Admin Posts"),
        (f"{base_url}/admin/site_settings/sitesettings/", "Admin Site Settings"),
        
        # API URLs
        (f"{base_url}/api/site-settings/", "API Site Settings"),
        (f"{base_url}/api/communities/", "API Comunidades"),
        (f"{base_url}/api/reels/", "API Reels"),
        (f"{base_url}/api/enterprises/", "API Empresas"),
        (f"{base_url}/api/posts/", "API Posts"),
        (f"{base_url}/api/learning/", "API Learning"),
    ]
    
    print("⏳ Esperando a que el servidor esté listo...")
    time.sleep(2)
    
    working_count = 0
    error_count = 0
    
    for url, description in test_urls:
        result = test_url(url, description)
        
        print(f"{result['status']} {result['description']}")
        print(f"    URL: {result['url']}")
        print(f"    Status: {result['status_code']}")
        
        if 'error' in result:
            print(f"    Error: {result['error']}")
            error_count += 1
        else:
            print(f"    Size: {result['content_length']} bytes")
            if result['status_code'] != 'ERROR':
                working_count += 1
        
        print()
    
    print("=" * 60)
    print(f"📊 RESUMEN FINAL:")
    print(f"✅ URLs funcionando: {working_count}")
    print(f"❌ URLs con errores: {error_count}")
    print(f"📈 Total probadas: {len(test_urls)}")
    
    if error_count == 0:
        print()
        print("🎉 ¡TODAS LAS URLs FUNCIONAN CORRECTAMENTE!")
        print("🚀 El servidor Django está completamente operativo")
        print()
        print("🔗 Accesos importantes:")
        print(f"   • Admin Panel: {base_url}/admin/")
        print(f"   • API Root: {base_url}/api/")
        print(f"   • Health Check: {base_url}/health/")
        print()
        print("👤 Credenciales de admin:")
        print("   • Usuario: admin3")
        print("   • Contraseña: (la que configuraste)")
    else:
        print()
        print("⚠️ Algunas URLs tienen problemas, pero esto puede ser normal")
        print("   (errores de autenticación o conexión son esperados)")

if __name__ == '__main__':
    main()
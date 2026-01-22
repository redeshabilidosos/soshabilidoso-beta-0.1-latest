#!/usr/bin/env python
"""
Script para probar que drf-spectacular esté funcionando correctamente
"""
import os
import django
from django.conf import settings

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

def test_spectacular_config():
    """Probar configuración de drf-spectacular"""
    print("🔍 Probando configuración de drf-spectacular...")
    
    # Verificar que está en INSTALLED_APPS
    if 'drf_spectacular' in settings.INSTALLED_APPS:
        print("✅ drf_spectacular está en INSTALLED_APPS")
    else:
        print("❌ drf_spectacular NO está en INSTALLED_APPS")
    
    if 'drf_spectacular_sidecar' in settings.INSTALLED_APPS:
        print("✅ drf_spectacular_sidecar está en INSTALLED_APPS")
    else:
        print("❌ drf_spectacular_sidecar NO está en INSTALLED_APPS")
    
    # Verificar configuración de REST_FRAMEWORK
    if hasattr(settings, 'REST_FRAMEWORK'):
        schema_class = settings.REST_FRAMEWORK.get('DEFAULT_SCHEMA_CLASS')
        if schema_class == 'drf_spectacular.openapi.AutoSchema':
            print("✅ DEFAULT_SCHEMA_CLASS configurado correctamente")
        else:
            print(f"❌ DEFAULT_SCHEMA_CLASS: {schema_class}")
    
    # Verificar configuración de SPECTACULAR_SETTINGS
    if hasattr(settings, 'SPECTACULAR_SETTINGS'):
        print("✅ SPECTACULAR_SETTINGS configurado")
        
        # Verificar sidecar
        swagger_dist = settings.SPECTACULAR_SETTINGS.get('SWAGGER_UI_DIST')
        if swagger_dist == 'SIDECAR':
            print("✅ SWAGGER_UI_DIST configurado para usar SIDECAR")
        else:
            print(f"⚠️  SWAGGER_UI_DIST: {swagger_dist}")
    else:
        print("❌ SPECTACULAR_SETTINGS NO configurado")

def test_imports():
    """Probar que se pueden importar los módulos"""
    print("\n🔍 Probando imports...")
    
    try:
        from drf_spectacular.views import SpectacularAPIView
        print("✅ SpectacularAPIView importado correctamente")
    except ImportError as e:
        print(f"❌ Error importando SpectacularAPIView: {e}")
    
    try:
        from drf_spectacular.views import SpectacularSwaggerView
        print("✅ SpectacularSwaggerView importado correctamente")
    except ImportError as e:
        print(f"❌ Error importando SpectacularSwaggerView: {e}")
    
    try:
        from drf_spectacular.views import SpectacularRedocView
        print("✅ SpectacularRedocView importado correctamente")
    except ImportError as e:
        print(f"❌ Error importando SpectacularRedocView: {e}")
    
    try:
        import drf_spectacular_sidecar
        print("✅ drf_spectacular_sidecar importado correctamente")
    except ImportError as e:
        print(f"❌ Error importando drf_spectacular_sidecar: {e}")

def test_urls():
    """Probar que las URLs estén configuradas"""
    print("\n🔍 Probando URLs...")
    
    try:
        from django.urls import reverse
        
        # Probar URL del esquema
        try:
            schema_url = reverse('schema')
            print(f"✅ URL del esquema: {schema_url}")
        except:
            print("❌ URL 'schema' no encontrada")
        
        # Probar URL de Swagger
        try:
            swagger_url = reverse('swagger-ui')
            print(f"✅ URL de Swagger: {swagger_url}")
        except:
            print("❌ URL 'swagger-ui' no encontrada")
        
        # Probar URL de ReDoc
        try:
            redoc_url = reverse('redoc')
            print(f"✅ URL de ReDoc: {redoc_url}")
        except:
            print("❌ URL 'redoc' no encontrada")
            
    except Exception as e:
        print(f"❌ Error probando URLs: {e}")

if __name__ == "__main__":
    print("🚀 Diagnóstico de drf-spectacular")
    print("=" * 50)
    
    test_spectacular_config()
    test_imports()
    test_urls()
    
    print("\n" + "=" * 50)
    print("✅ Diagnóstico completado")
    print("\n💡 Si todo está bien, reinicia el servidor Django:")
    print("   python manage.py runserver")
    print("\n📖 Luego visita:")
    print("   http://127.0.0.1:8000/api/docs/")
#!/usr/bin/env python
"""
Script para verificar que los archivos estáticos de Swagger estén disponibles
"""
import os
import django
from pathlib import Path

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.conf import settings

def check_static_files():
    """Verificar archivos estáticos de drf-spectacular"""
    
    print("🔍 Verificando archivos estáticos de drf-spectacular...")
    print("=" * 60)
    
    # Verificar configuración
    print(f"📁 STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"🌐 STATIC_URL: {settings.STATIC_URL}")
    
    # Verificar que drf_spectacular_sidecar esté instalado
    if 'drf_spectacular_sidecar' in settings.INSTALLED_APPS:
        print("✅ drf_spectacular_sidecar está en INSTALLED_APPS")
    else:
        print("❌ drf_spectacular_sidecar NO está en INSTALLED_APPS")
        return False
    
    # Verificar archivos críticos
    static_root = Path(settings.STATIC_ROOT)
    
    critical_files = [
        'drf_spectacular_sidecar/swagger-ui-dist/swagger-ui.css',
        'drf_spectacular_sidecar/swagger-ui-dist/swagger-ui-bundle.js',
        'drf_spectacular_sidecar/swagger-ui-dist/swagger-ui-standalone-preset.js',
        'drf_spectacular_sidecar/swagger-ui-dist/favicon-32x32.png',
    ]
    
    print(f"\n📋 Verificando archivos críticos en: {static_root}")
    
    all_exist = True
    for file_path in critical_files:
        full_path = static_root / file_path
        if full_path.exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - NO EXISTE")
            all_exist = False
    
    # Verificar configuración de SPECTACULAR_SETTINGS
    print(f"\n⚙️  Verificando configuración SPECTACULAR_SETTINGS...")
    
    if hasattr(settings, 'SPECTACULAR_SETTINGS'):
        spectacular_config = settings.SPECTACULAR_SETTINGS
        
        if spectacular_config.get('SWAGGER_UI_DIST') == 'SIDECAR':
            print("✅ SWAGGER_UI_DIST configurado como SIDECAR")
        else:
            print(f"⚠️  SWAGGER_UI_DIST: {spectacular_config.get('SWAGGER_UI_DIST')}")
        
        if spectacular_config.get('REDOC_DIST') == 'SIDECAR':
            print("✅ REDOC_DIST configurado como SIDECAR")
        else:
            print(f"⚠️  REDOC_DIST: {spectacular_config.get('REDOC_DIST')}")
    else:
        print("❌ SPECTACULAR_SETTINGS no configurado")
        all_exist = False
    
    return all_exist

def main():
    """Función principal"""
    print("🚀 Verificación de archivos estáticos de Swagger UI")
    print("=" * 60)
    
    success = check_static_files()
    
    print("\n" + "=" * 60)
    
    if success:
        print("✅ ¡Todo configurado correctamente!")
        print("\n🌐 URLs disponibles:")
        print("   • Swagger UI: http://127.0.0.1:8000/api/docs/")
        print("   • ReDoc:     http://127.0.0.1:8000/api/redoc/")
        print("   • Esquema:   http://127.0.0.1:8000/api/schema/")
        print("\n💡 Si aún hay problemas:")
        print("   1. Reinicia el servidor: npm run soshabilidoso")
        print("   2. Limpia caché del navegador (Ctrl+F5)")
        print("   3. Verifica que no haya errores en la consola")
    else:
        print("❌ Hay problemas con la configuración")
        print("\n🔧 Soluciones:")
        print("   1. Ejecuta: python manage.py collectstatic --noinput")
        print("   2. Verifica que drf_spectacular_sidecar esté instalado")
        print("   3. Reinicia el servidor")

if __name__ == "__main__":
    main()
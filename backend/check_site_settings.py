#!/usr/bin/env python
"""
Script para verificar la configuración de site_settings
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')

try:
    django.setup()
    
    from django.conf import settings
    
    print("=" * 60)
    print("Verificando configuración de site_settings")
    print("=" * 60)
    
    # Verificar si está en INSTALLED_APPS
    if 'apps.site_settings' in settings.INSTALLED_APPS:
        print("✓ 'apps.site_settings' está en INSTALLED_APPS")
    else:
        print("✗ 'apps.site_settings' NO está en INSTALLED_APPS")
        print("\nINSTALLED_APPS actuales:")
        for app in settings.INSTALLED_APPS:
            print(f"  - {app}")
        sys.exit(1)
    
    # Intentar importar el modelo
    try:
        from apps.site_settings.models import SiteSettings
        print("✓ Modelo SiteSettings importado correctamente")
        
        # Verificar campos del modelo
        fields = [f.name for f in SiteSettings._meta.get_fields()]
        print(f"\nCampos del modelo: {', '.join(fields)}")
        
        if 'reality_form_enabled' in fields:
            print("✓ Campo 'reality_form_enabled' existe en el modelo")
        else:
            print("✗ Campo 'reality_form_enabled' NO existe en el modelo")
            
    except Exception as e:
        print(f"✗ Error al importar modelo: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("Configuración correcta!")
    print("=" * 60)
    print("\nPasos siguientes:")
    print("1. Detén el servidor Django (Ctrl+C)")
    print("2. Ejecuta: python manage.py migrate")
    print("3. Reinicia el servidor: python manage.py runserver")
    print("4. Accede a: http://127.0.0.1:8000/admin/site_settings/sitesettings/")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

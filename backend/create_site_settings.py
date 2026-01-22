#!/usr/bin/env python
"""
Script para crear la configuración inicial de site_settings
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.site_settings.models import SiteSettings

def main():
    print("=" * 60)
    print("Creando configuración inicial de Site Settings")
    print("=" * 60)
    
    try:
        # Crear o obtener la configuración
        settings = SiteSettings.get_settings()
        
        print(f"\n✓ Configuración creada/actualizada:")
        print(f"  - ID: {settings.pk}")
        print(f"  - Botón Registrarte: {'Activado' if settings.show_register_habilidosos_button else 'Desactivado'}")
        print(f"  - Formulario Reality: {'Activado' if settings.reality_form_enabled else 'Desactivado'}")
        print(f"  - Última actualización: {settings.updated_at}")
        
        print("\n" + "=" * 60)
        print("✓ Configuración lista!")
        print("=" * 60)
        print("\nAccede al admin en:")
        print("http://127.0.0.1:8000/admin/site_settings/sitesettings/1/change/")
        print("\nO busca 'Configuraciones del Sitio' en el menú lateral")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()

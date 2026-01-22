#!/usr/bin/env python
"""
Script para aplicar las migraciones de site_settings y crear la configuración inicial
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.core.management import call_command
from apps.site_settings.models import SiteSettings

def main():
    print("=" * 60)
    print("Aplicando migraciones de site_settings...")
    print("=" * 60)
    
    try:
        # Crear las migraciones si no existen
        print("\n1. Creando migraciones...")
        call_command('makemigrations', 'site_settings', interactive=False)
        
        # Aplicar las migraciones
        print("\n2. Aplicando migraciones...")
        call_command('migrate', 'site_settings', interactive=False)
        
        # Crear o actualizar la configuración del sitio
        print("\n3. Creando/actualizando configuración del sitio...")
        settings = SiteSettings.get_settings()
        print(f"   - Botón Registrarte: {'Activado' if settings.show_register_habilidosos_button else 'Desactivado'}")
        print(f"   - Formulario Reality: {'Activado' if settings.reality_form_enabled else 'Desactivado'}")
        
        print("\n" + "=" * 60)
        print("✓ Migraciones aplicadas exitosamente!")
        print("=" * 60)
        print("\nAhora puedes acceder al admin en:")
        print("http://127.0.0.1:8000/admin/site_settings/sitesettings/1/change/")
        print("\nO buscar 'Configuraciones del Sitio' en el panel de admin")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()

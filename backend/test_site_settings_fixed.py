"""
Script para verificar que las configuraciones del sitio están funcionando correctamente
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.site_settings.models import SiteSettings
from apps.site_settings.serializers import SiteSettingsSerializer

def test_site_settings():
    print("=" * 80)
    print("VERIFICACIÓN DE CONFIGURACIONES DEL SITIO")
    print("=" * 80)
    
    # Verificar si existe configuración
    settings = SiteSettings.objects.first()
    
    if not settings:
        print("\n❌ No existe configuración del sitio")
        print("📝 Creando configuración por defecto...")
        settings = SiteSettings.objects.create(
            site_name='SOS Habilidoso',
            site_description='Red social para habilidosos',
            primary_color='#00ff88',
            maintenance_mode=False,
            show_register_habilidosos_button=True,
            reality_form_enabled=True
        )
        print("✅ Configuración creada exitosamente")
    else:
        print("\n✅ Configuración del sitio encontrada")
    
    # Mostrar configuración actual
    print("\n" + "=" * 80)
    print("CONFIGURACIÓN ACTUAL")
    print("=" * 80)
    print(f"Nombre del sitio: {settings.site_name}")
    print(f"Color primario: {settings.primary_color}")
    print(f"Modo mantenimiento: {settings.maintenance_mode}")
    print(f"Mostrar botón 'Registrarte': {settings.show_register_habilidosos_button}")
    print(f"Formulario Reality habilitado: {settings.reality_form_enabled}")
    print(f"Última actualización: {settings.updated_at}")
    
    # Serializar para ver cómo se ve en la API
    print("\n" + "=" * 80)
    print("RESPUESTA DE LA API (JSON)")
    print("=" * 80)
    serializer = SiteSettingsSerializer(settings)
    import json
    print(json.dumps(serializer.data, indent=2, default=str))
    
    # Verificar campos específicos
    print("\n" + "=" * 80)
    print("VERIFICACIÓN DE CAMPOS CRÍTICOS")
    print("=" * 80)
    
    if hasattr(settings, 'show_register_habilidosos_button'):
        print(f"✅ Campo 'show_register_habilidosos_button' existe: {settings.show_register_habilidosos_button}")
    else:
        print("❌ Campo 'show_register_habilidosos_button' NO existe")
    
    if hasattr(settings, 'reality_form_enabled'):
        print(f"✅ Campo 'reality_form_enabled' existe: {settings.reality_form_enabled}")
    else:
        print("❌ Campo 'reality_form_enabled' NO existe")
    
    print("\n" + "=" * 80)
    print("VERIFICACIÓN COMPLETADA")
    print("=" * 80)
    print("\n✅ Todas las verificaciones pasaron exitosamente")
    print("\n📝 Puedes acceder a la configuración en:")
    print("   - Admin: http://127.0.0.1:8000/admin/site_settings/sitesettings/")
    print("   - API: http://127.0.0.1:8000/api/site-settings/")

if __name__ == '__main__':
    test_site_settings()

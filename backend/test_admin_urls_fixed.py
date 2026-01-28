"""
Test para verificar que las URLs del admin funcionan correctamente
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.urls import reverse
from django.contrib.admin.sites import site
from apps.site_settings.models import SiteSettings

def test_admin_urls():
    """Verificar que las URLs personalizadas del admin existen"""
    print("\n" + "="*80)
    print("VERIFICACIÓN DE URLs DEL ADMIN")
    print("="*80 + "\n")
    
    # Obtener o crear configuración
    settings, created = SiteSettings.objects.get_or_create(
        pk=1,
        defaults={
            'site_name': 'SOS Habilidoso',
            'primary_color': '#00ff88',
            'show_register_habilidosos_button': True,
            'reality_form_enabled': True
        }
    )
    
    print(f"✅ Configuración del sitio: ID={settings.pk}")
    
    # Verificar URLs
    try:
        enable_url = reverse('admin:sitesettings_enable_button_and_form', args=[settings.pk])
        print(f"✅ URL para habilitar: {enable_url}")
    except Exception as e:
        print(f"❌ Error al generar URL para habilitar: {e}")
        return False
    
    try:
        disable_url = reverse('admin:sitesettings_disable_button_and_form', args=[settings.pk])
        print(f"✅ URL para deshabilitar: {disable_url}")
    except Exception as e:
        print(f"❌ Error al generar URL para deshabilitar: {e}")
        return False
    
    print("\n" + "="*80)
    print("TODAS LAS URLs FUNCIONAN CORRECTAMENTE")
    print("="*80 + "\n")
    
    print("📝 Puedes acceder al admin en:")
    print(f"   http://127.0.0.1:8000/admin/site_settings/sitesettings/{settings.pk}/change/")
    print("\n")
    
    return True

if __name__ == '__main__':
    success = test_admin_urls()
    sys.exit(0 if success else 1)

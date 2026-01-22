"""
Script de prueba para verificar las configuraciones del sitio
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from apps.site_settings.models import SiteSettings

def test_site_settings():
    print("=" * 60)
    print("PRUEBA DE CONFIGURACIONES DEL SITIO")
    print("=" * 60)
    
    # Obtener o crear configuración
    settings = SiteSettings.get_settings()
    
    print(f"\n✅ Configuración obtenida correctamente")
    print(f"   - ID: {settings.pk}")
    print(f"   - Botón de registro visible: {settings.show_register_habilidosos_button}")
    print(f"   - Formulario Reality habilitado: {settings.reality_form_enabled}")
    print(f"   - Última actualización: {settings.updated_at}")
    
    print("\n" + "=" * 60)
    print("ENDPOINTS DISPONIBLES:")
    print("=" * 60)
    print(f"   - Panel Admin: http://127.0.0.1:8000/admin/site_settings/sitesettings/1/change/")
    print(f"   - API Endpoint: http://127.0.0.1:8000/api/site-settings/")
    print("\n")

if __name__ == '__main__':
    test_site_settings()

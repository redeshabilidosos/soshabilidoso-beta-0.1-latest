"""
Script para habilitar el botón flotante y formulario del Reality Show
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.site_settings.models import SiteSettings

def enable_button_and_form():
    """Habilitar botón flotante y formulario"""
    print("\n" + "="*80)
    print("🔧 HABILITAR BOTÓN FLOTANTE Y FORMULARIO")
    print("="*80 + "\n")
    
    settings = SiteSettings.objects.first()
    
    if not settings:
        print("❌ No se encontró configuración del sitio")
        print("   Creando configuración por defecto...")
        settings = SiteSettings.objects.create(
            site_name='SOS Habilidoso',
            primary_color='#00ff88',
            show_register_habilidosos_button=True,
            reality_form_enabled=True
        )
        print("✅ Configuración creada y habilitada")
    else:
        print(f"📊 Estado actual:")
        print(f"   - Botón flotante: {'✅ Habilitado' if settings.show_register_habilidosos_button else '❌ Deshabilitado'}")
        print(f"   - Formulario Reality: {'✅ Habilitado' if settings.reality_form_enabled else '❌ Deshabilitado'}")
        
        settings.show_register_habilidosos_button = True
        settings.reality_form_enabled = True
        settings.save()
        
        print(f"\n✅ Configuración actualizada:")
        print(f"   - Botón flotante: ✅ Habilitado")
        print(f"   - Formulario Reality: ✅ Habilitado")
    
    print("\n" + "="*80)
    print("✅ BOTÓN FLOTANTE Y FORMULARIO HABILITADOS")
    print("="*80)
    
    print("\n💡 Recarga la página del frontend para ver los cambios")
    print("🌐 Frontend: http://localhost:4000")
    print()

if __name__ == '__main__':
    enable_button_and_form()

#!/usr/bin/env python
"""
Crear registro de configuración del sitio
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.site_settings.models import SiteSettings

print("=" * 60)
print("CREAR CONFIGURACIÓN DEL SITIO")
print("=" * 60)

# Verificar si ya existe
existing = SiteSettings.objects.first()

if existing:
    print(f"\n✅ Ya existe una configuración:")
    print(f"   show_register_habilidosos_button: {existing.show_register_habilidosos_button}")
    print(f"   reality_form_enabled: {existing.reality_form_enabled}")
    print(f"   updated_at: {existing.updated_at}")
    
    # Actualizar para asegurar que los campos existen
    existing.show_register_habilidosos_button = True
    existing.reality_form_enabled = True
    existing.save()
    print(f"\n✅ Configuración actualizada!")
else:
    # Crear nueva configuración
    settings = SiteSettings.objects.create(
        site_name="SOS Habilidoso",
        site_description="Plataforma social para habilidosos",
        show_register_habilidosos_button=True,
        reality_form_enabled=True
    )
    print(f"\n✅ Configuración creada exitosamente!")
    print(f"   show_register_habilidosos_button: {settings.show_register_habilidosos_button}")
    print(f"   reality_form_enabled: {settings.reality_form_enabled}")

print("\n" + "=" * 60)

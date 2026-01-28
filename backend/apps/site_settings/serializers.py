"""
Serializers para configuración del sitio
"""
from rest_framework import serializers
from .models import SiteSettings, MenuRoute


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializer para configuración del sitio"""
    
    class Meta:
        model = SiteSettings
        fields = [
            'site_name',
            'site_description',
            'logo_url',
            'primary_color',
            'maintenance_mode',
            'maintenance_message',
            'show_register_habilidosos_button',
            'reality_form_enabled',
            'updated_at'
        ]


class MenuRouteSerializer(serializers.ModelSerializer):
    """Serializer para rutas del menú"""
    
    class Meta:
        model = MenuRoute
        fields = [
            'id',
            'route_key',
            'label',
            'path',
            'icon',
            'is_enabled',
            'order',
            'badge_count',
            'requires_auth'
        ]

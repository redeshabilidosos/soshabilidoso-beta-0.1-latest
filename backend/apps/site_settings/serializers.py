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
            # Control de visibilidad del Sidebar
            'sidebar_show_feed',
            'sidebar_show_profile',
            'sidebar_show_search',
            'sidebar_show_notifications',
            'sidebar_show_clips',
            'sidebar_show_reels',
            'sidebar_show_live',
            'sidebar_show_communities',
            'sidebar_show_classifieds',
            'sidebar_show_donations',
            'sidebar_show_news',
            'sidebar_show_messages',
            'sidebar_show_settings',
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

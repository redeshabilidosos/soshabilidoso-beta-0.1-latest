"""
Admin para configuración del sitio
"""
from django.contrib import admin
from django.utils.html import format_html
from django.shortcuts import redirect
from django.urls import path
from django.contrib import messages
from .models import SiteSettings, MenuRoute


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Admin para configuración general del sitio"""
    
    list_display = ['site_name', 'maintenance_mode', 'primary_color', 'show_register_habilidosos_button', 'reality_form_enabled']
    fieldsets = (
        ('Información General', {
            'fields': ('site_name', 'site_description', 'logo_url')
        }),
        ('Apariencia', {
            'fields': ('primary_color',)
        }),
        ('Control de Funcionalidades', {
            'fields': ('show_register_habilidosos_button', 'reality_form_enabled'),
            'description': 'Controla la visibilidad de funcionalidades en la aplicación'
        }),
        ('Mantenimiento', {
            'fields': ('maintenance_mode', 'maintenance_message'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Solo permitir una instancia
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # No permitir eliminar
        return False
    
    def get_urls(self):
        """Agregar URLs personalizadas para acciones rápidas"""
        urls = super().get_urls()
        custom_urls = [
            path(
                '<path:object_id>/enable-button-form/',
                self.admin_site.admin_view(self.enable_button_and_form),
                name='sitesettings_enable_button_and_form',
            ),
            path(
                '<path:object_id>/disable-button-form/',
                self.admin_site.admin_view(self.disable_button_and_form),
                name='sitesettings_disable_button_and_form',
            ),
        ]
        return custom_urls + urls
    
    def enable_button_and_form(self, request, object_id):
        """Habilitar botón flotante y formulario del Reality Show"""
        settings = self.get_object(request, object_id)
        if settings:
            settings.show_register_habilidosos_button = True
            settings.reality_form_enabled = True
            settings.save()
            messages.success(
                request,
                '✅ Botón flotante y formulario del Reality Show habilitados exitosamente.'
            )
        return redirect('admin:site_settings_sitesettings_change', object_id)
    
    def disable_button_and_form(self, request, object_id):
        """Deshabilitar botón flotante y formulario del Reality Show"""
        settings = self.get_object(request, object_id)
        if settings:
            settings.show_register_habilidosos_button = False
            settings.reality_form_enabled = False
            settings.save()
            messages.success(
                request,
                '🚫 Botón flotante y formulario del Reality Show deshabilitados exitosamente.'
            )
        return redirect('admin:site_settings_sitesettings_change', object_id)



@admin.register(MenuRoute)
class MenuRouteAdmin(admin.ModelAdmin):
    """Admin para configuración de rutas del menú"""
    
    list_display = [
        'status_icon',
        'label',
        'path',
        'icon',
        'order',
        'badge_display',
        'requires_auth',
        'updated_at'
    ]
    list_display_links = ['label']
    list_editable = ['order']
    list_filter = ['is_enabled', 'requires_auth', 'icon']
    search_fields = ['label', 'path', 'description']
    ordering = ['order', 'label']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('route_key', 'label', 'path', 'icon')
        }),
        ('Configuración', {
            'fields': ('is_enabled', 'order', 'requires_auth')
        }),
        ('Badge', {
            'fields': ('badge_count',),
            'classes': ('collapse',)
        }),
        ('Descripción', {
            'fields': ('description',),
            'classes': ('collapse',)
        }),
    )
    
    def status_icon(self, obj):
        """Mostrar icono de estado"""
        if obj.is_enabled:
            return format_html(
                '<span style="color: green; font-size: 18px;">✓</span>'
            )
        return format_html(
            '<span style="color: red; font-size: 18px;">✗</span>'
        )
    status_icon.short_description = 'Estado'
    
    def badge_display(self, obj):
        """Mostrar badge si existe"""
        if obj.badge_count > 0:
            return format_html(
                '<span style="background: #ff4444; color: white; '
                'padding: 2px 8px; border-radius: 10px; font-size: 11px;">{}</span>',
                obj.badge_count
            )
        return '-'
    badge_display.short_description = 'Badge'
    
    actions = ['enable_routes', 'disable_routes', 'reset_badges']
    
    def enable_routes(self, request, queryset):
        """Habilitar rutas seleccionadas"""
        updated = queryset.update(is_enabled=True)
        self.message_user(
            request,
            f'{updated} ruta(s) habilitada(s) exitosamente.'
        )
    enable_routes.short_description = '✓ Habilitar rutas seleccionadas'
    
    def disable_routes(self, request, queryset):
        """Deshabilitar rutas seleccionadas"""
        updated = queryset.update(is_enabled=False)
        self.message_user(
            request,
            f'{updated} ruta(s) deshabilitada(s) exitosamente.'
        )
    disable_routes.short_description = '✗ Deshabilitar rutas seleccionadas'
    
    def reset_badges(self, request, queryset):
        """Resetear badges a 0"""
        updated = queryset.update(badge_count=0)
        self.message_user(
            request,
            f'Badges reseteados en {updated} ruta(s).'
        )
    reset_badges.short_description = '🔄 Resetear badges'

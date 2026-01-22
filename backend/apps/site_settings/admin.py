from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.contrib import messages
from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """
    Panel de administración para las configuraciones del sitio
    """
    list_display = ['id', 'show_register_habilidosos_button', 'reality_form_enabled', 'updated_at']
    
    fieldsets = (
        ('Botones y Navegación', {
            'fields': ('show_register_habilidosos_button',),
            'description': 'Controla la visibilidad de botones y elementos de navegación'
        }),
        ('Reality Show Habilidosos', {
            'fields': ('reality_form_enabled',),
            'description': 'Controla el formulario de registro para el Reality Show'
        }),
        ('Información', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['updated_at']
    
    change_form_template = 'admin/sitesettings/change_form.html'
    
    def has_add_permission(self, request):
        # Solo permitir una instancia de configuración
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # No permitir eliminar la configuración
        return False
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                '<path:object_id>/enable-button-and-form/',
                self.admin_site.admin_view(self.enable_button_and_form),
                name='sitesettings_enable_button_and_form',
            ),
            path(
                '<path:object_id>/disable-button-and-form/',
                self.admin_site.admin_view(self.disable_button_and_form),
                name='sitesettings_disable_button_and_form',
            ),
        ]
        return custom_urls + urls
    
    def enable_button_and_form(self, request, object_id):
        """Habilitar botón y formulario"""
        settings = SiteSettings.get_settings()
        settings.show_register_habilidosos_button = True
        settings.reality_form_enabled = True
        settings.save()
        messages.success(request, '✅ Botón y formulario habilitados correctamente')
        return redirect('admin:site_settings_sitesettings_change', object_id)
    
    def disable_button_and_form(self, request, object_id):
        """Deshabilitar botón y formulario"""
        settings = SiteSettings.get_settings()
        settings.show_register_habilidosos_button = False
        settings.reality_form_enabled = False
        settings.save()
        messages.warning(request, '⚠️ Botón y formulario deshabilitados correctamente')
        return redirect('admin:site_settings_sitesettings_change', object_id)

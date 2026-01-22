from django.db import models


class SiteSettings(models.Model):
    """
    Configuraciones globales del sitio que se pueden controlar desde el panel de Django
    """
    # Configuración del botón de registro de habilidosos
    show_register_habilidosos_button = models.BooleanField(
        default=True,
        verbose_name="Mostrar botón 'Registrarte'",
        help_text="Activa o desactiva la visibilidad del botón de registro de habilidosos en toda la aplicación"
    )
    
    # Configuración del formulario de Reality Show
    reality_form_enabled = models.BooleanField(
        default=True,
        verbose_name="Formulario Reality Habilidosos Activado",
        help_text="Activa o desactiva el formulario de registro para el Reality Show Habilidosos"
    )
    
    # Metadatos
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")
    
    class Meta:
        verbose_name = "Configuración del Sitio"
        verbose_name_plural = "Configuraciones del Sitio"
        db_table = 'site_settings'
    
    def __str__(self):
        return "Configuraciones del Sitio"
    
    def save(self, *args, **kwargs):
        # Asegurar que solo exista una instancia de configuración
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Obtener o crear la configuración del sitio"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

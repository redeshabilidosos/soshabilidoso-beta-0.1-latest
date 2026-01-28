"""
Modelos para configuración del sitio
"""
from django.db import models
from django.core.cache import cache


class SiteSettings(models.Model):
    """Configuración general del sitio"""
    
    site_name = models.CharField(
        max_length=100,
        default='SOS Habilidoso',
        verbose_name='Nombre del sitio'
    )
    site_description = models.TextField(
        blank=True,
        verbose_name='Descripción del sitio'
    )
    logo_url = models.URLField(
        blank=True,
        verbose_name='URL del logo'
    )
    primary_color = models.CharField(
        max_length=7,
        default='#00ff88',
        verbose_name='Color primario'
    )
    maintenance_mode = models.BooleanField(
        default=False,
        verbose_name='Modo mantenimiento'
    )
    maintenance_message = models.TextField(
        blank=True,
        verbose_name='Mensaje de mantenimiento'
    )
    
    # Campos para control de funcionalidades
    show_register_habilidosos_button = models.BooleanField(
        default=True,
        verbose_name="Mostrar botón 'Registrarte'",
        help_text="Activa o desactiva la visibilidad del botón de registro de habilidosos en toda la aplicación"
    )
    reality_form_enabled = models.BooleanField(
        default=True,
        verbose_name='Formulario Reality habilitado',
        help_text='Activa o desactiva el acceso al formulario de registro del reality'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Última actualización'
    )
    
    class Meta:
        verbose_name = 'Configuración del Sitio'
        verbose_name_plural = 'Configuración del Sitio'
    
    def __str__(self):
        return self.site_name
    
    def save(self, *args, **kwargs):
        # Limpiar cache al guardar
        cache.delete('site_settings')
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Obtener o crear configuración del sitio"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class MenuRoute(models.Model):
    """Configuración de rutas del menú de navegación"""
    
    ROUTE_CHOICES = [
        ('feed', 'Feed Principal'),
        ('profile', 'Perfil'),
        ('users', 'Usuarios'),
        ('notifications', 'Notificaciones'),
        ('clips', 'Clips'),
        ('reels', 'Reels'),
        ('live', 'En Vivo'),
        ('communities', 'Comunidades'),
        ('classifieds', 'Clasificados'),
        ('donations', 'Donaciones'),
        ('habil-news', 'Hábil News'),
        ('messages', 'Mensajes'),
        ('settings', 'Configuración'),
    ]
    
    ICON_CHOICES = [
        ('Home', 'Inicio'),
        ('User', 'Usuario'),
        ('Users', 'Usuarios'),
        ('Bell', 'Campana'),
        ('Video', 'Video'),
        ('Film', 'Película'),
        ('Radio', 'Radio/En Vivo'),
        ('Users', 'Comunidad'),
        ('ShoppingBag', 'Bolsa de compras'),
        ('Heart', 'Corazón'),
        ('Newspaper', 'Periódico'),
        ('MessageSquare', 'Mensajes'),
        ('Settings', 'Configuración'),
    ]
    
    route_key = models.CharField(
        max_length=50,
        choices=ROUTE_CHOICES,
        unique=True,
        verbose_name='Ruta'
    )
    label = models.CharField(
        max_length=100,
        verbose_name='Etiqueta del menú'
    )
    path = models.CharField(
        max_length=200,
        verbose_name='Ruta URL',
        help_text='Ejemplo: /feed, /communities'
    )
    icon = models.CharField(
        max_length=50,
        choices=ICON_CHOICES,
        verbose_name='Icono'
    )
    is_enabled = models.BooleanField(
        default=True,
        verbose_name='Habilitado',
        help_text='Si está deshabilitado, la ruta no aparecerá en el menú y retornará 404'
    )
    order = models.IntegerField(
        default=0,
        verbose_name='Orden',
        help_text='Orden de aparición en el menú (menor número = más arriba)'
    )
    badge_count = models.IntegerField(
        default=0,
        verbose_name='Contador de badge',
        help_text='Número que aparece en el badge (0 = no mostrar)'
    )
    requires_auth = models.BooleanField(
        default=True,
        verbose_name='Requiere autenticación',
        help_text='Si está marcado, solo usuarios autenticados pueden acceder'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Descripción',
        help_text='Descripción interna de la funcionalidad'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de creación'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Última actualización'
    )
    
    class Meta:
        verbose_name = 'Ruta del Menú'
        verbose_name_plural = 'Configuración del Menú'
        ordering = ['order', 'label']
    
    def __str__(self):
        status = "✓" if self.is_enabled else "✗"
        return f"{status} {self.label} ({self.path})"
    
    def save(self, *args, **kwargs):
        # Limpiar cache al guardar
        cache.delete('menu_routes')
        cache.delete('enabled_routes')
        super().save(*args, **kwargs)
    
    @classmethod
    def get_enabled_routes(cls):
        """Obtener rutas habilitadas desde cache"""
        routes = cache.get('enabled_routes')
        if routes is None:
            routes = list(cls.objects.filter(is_enabled=True).values_list('path', flat=True))
            cache.set('enabled_routes', routes, 300)  # Cache por 5 minutos
        return routes
    
    @classmethod
    def is_route_enabled(cls, path):
        """Verificar si una ruta está habilitada"""
        # Normalizar path
        if not path.startswith('/'):
            path = f'/{path}'
        
        enabled_routes = cls.get_enabled_routes()
        return path in enabled_routes

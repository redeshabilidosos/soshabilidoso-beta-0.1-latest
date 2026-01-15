"""
Modelo de Empresa para SOS-HABILIDOSO
"""
import uuid
from django.db import models
from django.conf import settings


class Enterprise(models.Model):
    """Modelo de empresa/negocio"""
    
    CATEGORY_CHOICES = [
        ('deportes', 'Deportes'),
        ('fitness', 'Fitness'),
        ('nutricion', 'Nutrición'),
        ('tecnologia', 'Tecnología'),
        ('salud', 'Salud'),
        ('educacion', 'Educación'),
        ('entretenimiento', 'Entretenimiento'),
        ('moda', 'Moda'),
        ('alimentos', 'Alimentos'),
        ('servicios', 'Servicios'),
        ('otro', 'Otro'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Propietario (usuario que creó la empresa)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_enterprises',
        verbose_name='Propietario'
    )
    
    # Información básica
    name = models.CharField(max_length=200, verbose_name='Nombre de la empresa')
    username = models.CharField(max_length=50, unique=True, verbose_name='Usuario de empresa')
    tagline = models.CharField(max_length=200, blank=True, verbose_name='Eslogan')
    description = models.TextField(max_length=1000, blank=True, verbose_name='Descripción')
    
    # Imágenes
    logo = models.ImageField(upload_to='enterprises/logos/', null=True, blank=True, verbose_name='Logo')
    cover_image = models.ImageField(upload_to='enterprises/covers/', null=True, blank=True, verbose_name='Imagen de portada')
    
    # Categorización
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='otro', verbose_name='Categoría')
    industry = models.CharField(max_length=100, blank=True, verbose_name='Industria')
    
    # Ubicación y contacto
    location = models.CharField(max_length=200, blank=True, verbose_name='Ubicación')
    website = models.URLField(max_length=200, blank=True, verbose_name='Sitio web')
    email = models.EmailField(blank=True, verbose_name='Email de contacto')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Teléfono')
    
    # Información adicional
    founded_year = models.PositiveIntegerField(null=True, blank=True, verbose_name='Año de fundación')
    employees_count = models.CharField(max_length=50, blank=True, verbose_name='Número de empleados')
    
    # Redes sociales (JSON)
    social_links = models.JSONField(default=list, blank=True, verbose_name='Redes sociales')
    
    # Estadísticas
    followers_count = models.PositiveIntegerField(default=0, verbose_name='Seguidores')
    posts_count = models.PositiveIntegerField(default=0, verbose_name='Publicaciones')
    
    # Verificación y estado
    is_verified = models.BooleanField(default=False, verbose_name='Verificada')
    is_featured = models.BooleanField(default=False, verbose_name='Destacada')
    is_active = models.BooleanField(default=True, verbose_name='Activa')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    
    class Meta:
        db_table = 'enterprises'
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner']),
            models.Index(fields=['username']),
            models.Index(fields=['category']),
            models.Index(fields=['is_active', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} (@{self.username})"
    
    def get_logo_url(self):
        """Obtener URL del logo o logo por defecto"""
        if self.logo:
            return self.logo.url
        return f"https://ui-avatars.com/api/?name={self.name}&background=8B5CF6&color=fff"


class EnterpriseFollow(models.Model):
    """Modelo para seguir empresas"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='following_enterprises',
        verbose_name='Usuario'
    )
    enterprise = models.ForeignKey(
        Enterprise,
        on_delete=models.CASCADE,
        related_name='followers',
        verbose_name='Empresa'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de seguimiento')
    
    class Meta:
        db_table = 'enterprise_follows'
        unique_together = ('user', 'enterprise')
        verbose_name = 'Seguimiento de Empresa'
        verbose_name_plural = 'Seguimientos de Empresas'
    
    def __str__(self):
        return f"{self.user.username} sigue a {self.enterprise.name}"

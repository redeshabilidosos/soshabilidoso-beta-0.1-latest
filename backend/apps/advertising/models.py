"""
Modelos para el sistema de publicidad
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

User = get_user_model()


class Advertisement(models.Model):
    """Modelo para anuncios publicitarios"""
    
    AD_TYPES = [
        ('image', 'Imagen'),
        ('video', 'Video'),
        ('carousel', 'Carrusel'),
        ('banner', 'Banner'),
        ('sponsored_post', 'Post Patrocinado'),
    ]
    
    AD_POSITIONS = [
        ('feed', 'Feed Principal'),
        ('feed_top', 'Feed - Superior'),
        ('between_posts', 'Entre Publicaciones'),
        ('sidebar', 'Barra Lateral'),
        ('stories', 'Historias'),
        ('reels', 'Reels'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('pending', 'Pendiente de Aprobación'),
        ('active', 'Activo'),
        ('paused', 'Pausado'),
        ('completed', 'Completado'),
        ('rejected', 'Rechazado'),
    ]
    
    PRIORITY_CHOICES = [
        (1, 'Baja'),
        (2, 'Normal'),
        (3, 'Alta'),
        (4, 'Muy Alta'),
        (5, 'Máxima'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Información básica
    title = models.CharField(max_length=200, verbose_name='Título del Anuncio')
    description = models.TextField(blank=True, verbose_name='Descripción')
    advertiser_name = models.CharField(max_length=200, verbose_name='Nombre del Anunciante')
    advertiser_email = models.EmailField(blank=True, verbose_name='Email del Anunciante')
    advertiser_logo = models.ImageField(upload_to='ads/logos/', null=True, blank=True, verbose_name='Logo del Anunciante')
    
    # Tipo y posición
    ad_type = models.CharField(max_length=20, choices=AD_TYPES, default='image', verbose_name='Tipo de Anuncio')
    position = models.CharField(max_length=20, choices=AD_POSITIONS, default='feed', verbose_name='Posición')
    
    # Contenido multimedia
    image = models.ImageField(upload_to='ads/images/', null=True, blank=True, verbose_name='Imagen')
    video = models.FileField(upload_to='ads/videos/', null=True, blank=True, verbose_name='Video')
    video_url = models.URLField(blank=True, verbose_name='URL del Video (YouTube/Vimeo)')
    carousel_images = models.JSONField(default=list, blank=True, verbose_name='Imágenes del Carrusel')
    
    # Enlaces y CTA
    link_url = models.URLField(blank=True, verbose_name='URL de Destino')
    call_to_action = models.CharField(max_length=50, default='Ver más', verbose_name='Texto del Botón')
    
    # ============================================================
    # CONFIGURACIÓN DE FRECUENCIA EN FEED
    # ============================================================
    show_every_n_posts = models.IntegerField(
        default=5, 
        validators=[MinValueValidator(1), MaxValueValidator(50)],
        verbose_name='Mostrar cada N publicaciones',
        help_text='El anuncio aparecerá cada N publicaciones en el feed (ej: 5 = cada 5 posts)'
    )
    max_impressions_per_user = models.IntegerField(
        default=10,
        validators=[MinValueValidator(1)],
        verbose_name='Máx. impresiones por usuario',
        help_text='Número máximo de veces que un usuario verá este anuncio'
    )
    max_impressions_per_day = models.IntegerField(
        default=3,
        validators=[MinValueValidator(1)],
        verbose_name='Máx. impresiones por día por usuario',
        help_text='Límite diario de veces que un usuario verá este anuncio'
    )
    priority = models.IntegerField(
        choices=PRIORITY_CHOICES, 
        default=2, 
        verbose_name='Prioridad',
        help_text='Los anuncios con mayor prioridad se muestran primero'
    )
    weight = models.IntegerField(
        default=100,
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        verbose_name='Peso',
        help_text='Peso para rotación aleatoria (mayor peso = más probabilidad)'
    )
    
    # ============================================================
    # SEGMENTACIÓN
    # ============================================================
    target_countries = models.JSONField(default=list, blank=True, verbose_name='Países Objetivo')
    target_cities = models.JSONField(default=list, blank=True, verbose_name='Ciudades Objetivo')
    target_age_min = models.IntegerField(
        null=True, blank=True, 
        validators=[MinValueValidator(13), MaxValueValidator(100)], 
        verbose_name='Edad Mínima'
    )
    target_age_max = models.IntegerField(
        null=True, blank=True, 
        validators=[MinValueValidator(13), MaxValueValidator(100)], 
        verbose_name='Edad Máxima'
    )
    target_interests = models.JSONField(default=list, blank=True, verbose_name='Intereses Objetivo')
    target_gender = models.CharField(
        max_length=10, 
        choices=[('all', 'Todos'), ('male', 'Masculino'), ('female', 'Femenino')],
        default='all',
        verbose_name='Género Objetivo'
    )
    
    # ============================================================
    # PRESUPUESTO Y ALCANCE
    # ============================================================
    budget = models.DecimalField(
        max_digits=12, decimal_places=2, 
        default=0,
        verbose_name='Presupuesto Total (USD)'
    )
    daily_budget = models.DecimalField(
        max_digits=10, decimal_places=2, 
        default=0,
        verbose_name='Presupuesto Diario (USD)'
    )
    cost_per_click = models.DecimalField(
        max_digits=8, decimal_places=4, 
        default=0, 
        verbose_name='Costo por Click (CPC)'
    )
    cost_per_impression = models.DecimalField(
        max_digits=8, decimal_places=4, 
        default=0, 
        verbose_name='Costo por 1000 Impresiones (CPM)'
    )
    max_impressions = models.IntegerField(
        default=0,
        verbose_name='Máximo de Impresiones Totales',
        help_text='0 = sin límite'
    )
    max_clicks = models.IntegerField(
        default=0,
        verbose_name='Máximo de Clicks Totales',
        help_text='0 = sin límite'
    )
    
    # ============================================================
    # ESTADÍSTICAS
    # ============================================================
    impressions = models.IntegerField(default=0, verbose_name='Impresiones')
    clicks = models.IntegerField(default=0, verbose_name='Clicks')
    unique_views = models.IntegerField(default=0, verbose_name='Vistas Únicas')
    conversions = models.IntegerField(default=0, verbose_name='Conversiones')
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Total Gastado')
    video_views = models.IntegerField(default=0, verbose_name='Reproducciones de Video')
    video_completions = models.IntegerField(default=0, verbose_name='Videos Completados')
    
    # ============================================================
    # ESTADO Y PROGRAMACIÓN
    # ============================================================
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='Estado')
    start_date = models.DateTimeField(verbose_name='Fecha de Inicio')
    end_date = models.DateTimeField(verbose_name='Fecha de Fin')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    
    # Horarios de visualización
    show_on_weekdays = models.JSONField(
        default=list,
        blank=True,
        verbose_name='Días de la semana',
        help_text='Lista de días: [0,1,2,3,4,5,6] donde 0=Lunes'
    )
    show_from_hour = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(23)],
        verbose_name='Mostrar desde hora'
    )
    show_until_hour = models.IntegerField(
        default=23,
        validators=[MinValueValidator(0), MaxValueValidator(23)],
        verbose_name='Mostrar hasta hora'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última Actualización')
    
    # Aprobación
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='created_ads', verbose_name='Creado por'
    )
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name='approved_ads', verbose_name='Aprobado por'
    )
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de Aprobación')
    rejection_reason = models.TextField(blank=True, verbose_name='Razón de Rechazo')
    
    class Meta:
        verbose_name = 'Anuncio Publicitario'
        verbose_name_plural = 'Anuncios Publicitarios'
        ordering = ['-priority', '-created_at']
        indexes = [
            models.Index(fields=['status', 'is_active', 'start_date', 'end_date']),
            models.Index(fields=['position', 'status']),
            models.Index(fields=['priority', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"
    
    @property
    def ctr(self):
        """Click Through Rate"""
        if self.impressions > 0:
            return round((self.clicks / self.impressions) * 100, 2)
        return 0
    
    @property
    def conversion_rate(self):
        """Tasa de conversión"""
        if self.clicks > 0:
            return round((self.conversions / self.clicks) * 100, 2)
        return 0
    
    @property
    def video_completion_rate(self):
        """Tasa de completación de video"""
        if self.video_views > 0:
            return round((self.video_completions / self.video_views) * 100, 2)
        return 0
    
    @property
    def is_currently_active(self):
        """Verificar si el anuncio está activo ahora"""
        now = timezone.now()
        return (
            self.status == 'active' and 
            self.is_active and 
            self.start_date <= now <= self.end_date
        )
    
    @property
    def budget_remaining(self):
        """Presupuesto restante"""
        return max(0, float(self.budget) - float(self.total_spent))
    
    def can_show_to_user(self, user_impression_count, user_daily_count):
        """Verificar si se puede mostrar al usuario"""
        if not self.is_currently_active:
            return False
        if self.max_impressions > 0 and self.impressions >= self.max_impressions:
            return False
        if self.max_clicks > 0 and self.clicks >= self.max_clicks:
            return False
        if user_impression_count >= self.max_impressions_per_user:
            return False
        if user_daily_count >= self.max_impressions_per_day:
            return False
        if self.budget > 0 and self.total_spent >= self.budget:
            return False
        return True


class AdImpression(models.Model):
    """Modelo para rastrear impresiones de anuncios"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ad = models.ForeignKey(Advertisement, on_delete=models.CASCADE, related_name='ad_impressions')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True, verbose_name='ID de Sesión')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    position_in_feed = models.IntegerField(default=0, verbose_name='Posición en Feed')
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Impresión de Anuncio'
        verbose_name_plural = 'Impresiones de Anuncios'
        ordering = ['-viewed_at']
        indexes = [
            models.Index(fields=['ad', 'user', '-viewed_at']),
            models.Index(fields=['user', '-viewed_at']),
        ]


class AdClick(models.Model):
    """Modelo para rastrear clicks en anuncios"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ad = models.ForeignKey(Advertisement, on_delete=models.CASCADE, related_name='ad_clicks')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    impression = models.ForeignKey(AdImpression, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    clicked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Click en Anuncio'
        verbose_name_plural = 'Clicks en Anuncios'
        ordering = ['-clicked_at']
        indexes = [
            models.Index(fields=['ad', '-clicked_at']),
        ]


class AdVideoView(models.Model):
    """Modelo para rastrear reproducciones de video"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ad = models.ForeignKey(Advertisement, on_delete=models.CASCADE, related_name='video_views_log')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    watch_duration = models.IntegerField(default=0, verbose_name='Duración vista (segundos)')
    video_duration = models.IntegerField(default=0, verbose_name='Duración total (segundos)')
    completed = models.BooleanField(default=False, verbose_name='Completado')
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Vista de Video'
        verbose_name_plural = 'Vistas de Videos'
        ordering = ['-viewed_at']

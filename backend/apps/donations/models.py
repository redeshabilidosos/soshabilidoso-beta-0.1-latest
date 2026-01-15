"""
Modelos para el sistema de donaciones a deportistas
"""
import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class SportCategory(models.Model):
    """Categorías de deportes"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, verbose_name='Nombre')
    slug = models.SlugField(max_length=100, unique=True, verbose_name='Slug')
    icon = models.CharField(max_length=50, blank=True, verbose_name='Icono')
    description = models.TextField(blank=True, verbose_name='Descripción')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'donation_sport_categories'
        verbose_name = 'Categoría de Deporte'
        verbose_name_plural = 'Categorías de Deportes'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class AthleteProfile(models.Model):
    """Perfil de deportista para recibir donaciones"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente de aprobación'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
        ('suspended', 'Suspendido'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='athlete_profile',
        verbose_name='Usuario'
    )
    
    # Información personal
    full_name = models.CharField(max_length=200, verbose_name='Nombre completo')
    age = models.PositiveIntegerField(verbose_name='Edad')
    height = models.CharField(max_length=20, verbose_name='Altura')
    weight = models.CharField(max_length=20, blank=True, verbose_name='Peso')
    city = models.CharField(max_length=100, verbose_name='Ciudad')
    country = models.CharField(max_length=100, default='Colombia', verbose_name='País')
    
    # Información deportiva
    sport = models.ForeignKey(
        SportCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name='athletes',
        verbose_name='Deporte'
    )
    position = models.CharField(max_length=100, verbose_name='Posición/Especialidad')
    team = models.CharField(max_length=200, blank=True, verbose_name='Equipo/Club')
    experience_years = models.PositiveIntegerField(default=0, verbose_name='Años de experiencia')
    achievements = models.TextField(blank=True, verbose_name='Logros deportivos')
    
    # Descripción y campaña
    description = models.TextField(verbose_name='Descripción/Historia')
    goal_description = models.TextField(verbose_name='¿Para qué necesitas el apoyo?')
    
    # Meta de recaudación
    goal_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Meta de recaudación (COP)'
    )
    raised_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name='Monto recaudado (COP)'
    )
    donors_count = models.PositiveIntegerField(default=0, verbose_name='Número de donantes')
    
    # Estado y verificación
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    is_verified = models.BooleanField(default=False, verbose_name='Verificado')
    is_featured = models.BooleanField(default=False, verbose_name='Destacado')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de aprobación')
    
    class Meta:
        db_table = 'donation_athlete_profiles'
        verbose_name = 'Perfil de Deportista'
        verbose_name_plural = 'Perfiles de Deportistas'
        ordering = ['-is_featured', '-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['sport', 'status']),
            models.Index(fields=['is_featured', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.full_name} - {self.sport.name if self.sport else 'Sin deporte'}"
    
    @property
    def progress_percentage(self):
        """Porcentaje de progreso hacia la meta"""
        if self.goal_amount > 0:
            return min(100, (self.raised_amount / self.goal_amount) * 100)
        return 0
    
    def update_stats(self):
        """Actualizar estadísticas de donaciones"""
        donations = self.donations.filter(status='completed')
        self.raised_amount = donations.aggregate(
            total=models.Sum('amount')
        )['total'] or 0
        self.donors_count = donations.values('donor').distinct().count()
        self.save(update_fields=['raised_amount', 'donors_count'])


class AthleteMedia(models.Model):
    """Fotos y videos del deportista"""
    
    MEDIA_TYPE_CHOICES = [
        ('image', 'Imagen'),
        ('video', 'Video'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    athlete = models.ForeignKey(
        AthleteProfile,
        on_delete=models.CASCADE,
        related_name='media',
        verbose_name='Deportista'
    )
    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPE_CHOICES,
        verbose_name='Tipo de medio'
    )
    file = models.FileField(
        upload_to='donations/athletes/%Y/%m/',
        verbose_name='Archivo'
    )
    thumbnail = models.ImageField(
        upload_to='donations/thumbnails/%Y/%m/',
        null=True,
        blank=True,
        verbose_name='Miniatura'
    )
    title = models.CharField(max_length=200, blank=True, verbose_name='Título')
    description = models.TextField(blank=True, verbose_name='Descripción')
    order = models.PositiveIntegerField(default=0, verbose_name='Orden')
    is_cover = models.BooleanField(default=False, verbose_name='Es portada')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'donation_athlete_media'
        verbose_name = 'Medio del Deportista'
        verbose_name_plural = 'Medios de Deportistas'
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.athlete.full_name} - {self.media_type}"
    
    def get_url(self):
        """Obtener URL del archivo"""
        if self.file:
            try:
                from django.conf import settings
                backend_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
                return f"{backend_url}{self.file.url}"
            except:
                pass
        return None
    
    def get_thumbnail_url(self):
        """Obtener URL de la miniatura"""
        if self.thumbnail:
            try:
                from django.conf import settings
                backend_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
                return f"{backend_url}{self.thumbnail.url}"
            except:
                pass
        return self.get_url()


class Donation(models.Model):
    """Donaciones realizadas a deportistas"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('processing', 'Procesando'),
        ('completed', 'Completada'),
        ('failed', 'Fallida'),
        ('refunded', 'Reembolsada'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('card', 'Tarjeta de Crédito/Débito'),
        ('nequi', 'Nequi'),
        ('daviplata', 'Daviplata'),
        ('pse', 'PSE'),
        ('cash', 'Efectivo'),
        ('other', 'Otro'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    athlete = models.ForeignKey(
        AthleteProfile,
        on_delete=models.CASCADE,
        related_name='donations',
        verbose_name='Deportista'
    )
    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='donations_made',
        verbose_name='Donante'
    )
    
    # Información del donante (para donaciones anónimas o sin cuenta)
    donor_name = models.CharField(max_length=200, blank=True, verbose_name='Nombre del donante')
    donor_email = models.EmailField(blank=True, verbose_name='Email del donante')
    is_anonymous = models.BooleanField(default=False, verbose_name='Donación anónima')
    
    # Monto y pago
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(1000)],
        verbose_name='Monto (COP)'
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        verbose_name='Método de pago'
    )
    transaction_id = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='ID de transacción'
    )
    
    # Estado
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    
    # Mensaje opcional
    message = models.TextField(blank=True, verbose_name='Mensaje de apoyo')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de donación')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de completado')
    
    class Meta:
        db_table = 'donations'
        verbose_name = 'Donación'
        verbose_name_plural = 'Donaciones'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['athlete', 'status', '-created_at']),
            models.Index(fields=['donor', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]
    
    def __str__(self):
        donor_display = self.donor.display_name if self.donor else (self.donor_name or 'Anónimo')
        return f"Donación de {donor_display} a {self.athlete.full_name} - ${self.amount}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Actualizar estadísticas del deportista
        if self.status == 'completed':
            self.athlete.update_stats()

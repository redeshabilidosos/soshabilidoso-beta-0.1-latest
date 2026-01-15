"""
Modelos para Clasificados - Productos, Servicios y Trabajos Freelancer
"""
import uuid
import string
import random
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


def generate_short_id():
    """Genera un ID corto único de 8 caracteres alfanuméricos"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=8))


class ClassifiedBase(models.Model):
    """Modelo base abstracto para todos los clasificados"""
    
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('active', 'Activo'),
        ('paused', 'Pausado'),
        ('sold', 'Vendido'),
        ('expired', 'Expirado'),
        ('deleted', 'Eliminado'),
    ]
    
    CURRENCY_CHOICES = [
        ('COP', 'Peso Colombiano'),
        ('USD', 'Dólar Estadounidense'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    short_id = models.CharField(max_length=8, unique=True, blank=True, verbose_name='ID Corto')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    
    # Información básica
    title = models.CharField(max_length=200, verbose_name='Título')
    description = models.TextField(max_length=2000, verbose_name='Descripción')
    
    # Precio
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Precio')
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='COP', verbose_name='Moneda')
    negotiable = models.BooleanField(default=False, verbose_name='Precio negociable')
    
    # Ubicación
    location = models.CharField(max_length=200, verbose_name='Ubicación')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Imágenes (URLs de Cloudinary o locales)
    images = models.JSONField(default=list, blank=True, verbose_name='Imágenes')
    
    # Estado y visibilidad
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name='Estado')
    is_featured = models.BooleanField(default=False, verbose_name='Destacado')
    
    # Estadísticas
    views_count = models.PositiveIntegerField(default=0, verbose_name='Visualizaciones')
    likes_count = models.PositiveIntegerField(default=0, verbose_name='Me gusta')
    contacts_count = models.PositiveIntegerField(default=0, verbose_name='Contactos')
    
    # Tags
    tags = models.JSONField(default=list, blank=True, verbose_name='Etiquetas')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de expiración')
    
    class Meta:
        abstract = True
    
    def save(self, *args, **kwargs):
        if not self.short_id:
            while True:
                short_id = generate_short_id()
                if not self.__class__.objects.filter(short_id=short_id).exists():
                    self.short_id = short_id
                    break
        super().save(*args, **kwargs)


class ProductClassified(ClassifiedBase):
    """Modelo para productos físicos en venta"""
    
    CONDITION_CHOICES = [
        ('new', 'Nuevo'),
        ('like_new', 'Usado - Como Nuevo'),
        ('good', 'Usado - Buen Estado'),
        ('fair', 'Usado - Regular'),
    ]
    
    PRODUCT_CATEGORIES = [
        ('electronics', 'Electrónicos'),
        ('clothing', 'Ropa y Accesorios'),
        ('sports', 'Deportes'),
        ('music', 'Música'),
        ('books', 'Libros'),
        ('home', 'Hogar y Jardín'),
        ('vehicles', 'Vehículos'),
        ('pets', 'Mascotas'),
        ('toys', 'Juguetes'),
        ('other', 'Otros'),
    ]
    
    category = models.CharField(max_length=50, choices=PRODUCT_CATEGORIES, verbose_name='Categoría')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='new', verbose_name='Estado del producto')
    
    # Detalles adicionales del producto
    brand = models.CharField(max_length=100, blank=True, verbose_name='Marca')
    model = models.CharField(max_length=100, blank=True, verbose_name='Modelo')
    
    # Opciones de entrega
    delivery_available = models.BooleanField(default=False, verbose_name='Envío disponible')
    delivery_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Costo de envío')
    pickup_available = models.BooleanField(default=True, verbose_name='Retiro en persona')
    
    class Meta:
        db_table = 'classifieds_products'
        verbose_name = 'Producto Clasificado'
        verbose_name_plural = 'Productos Clasificados'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['category', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['condition', '-created_at']),
        ]
    
    def __str__(self):
        return f"Producto: {self.title} - {self.user.username}"


class ServiceClassified(ClassifiedBase):
    """Modelo para servicios del marketplace"""
    
    SERVICE_CATEGORIES = [
        ('cleaning', 'Limpieza'),
        ('repairs', 'Reparaciones'),
        ('delivery', 'Delivery'),
        ('tutoring', 'Tutorías'),
        ('personal_care', 'Cuidado Personal'),
        ('gardening', 'Jardinería'),
        ('transport', 'Transporte'),
        ('events', 'Eventos'),
        ('pets', 'Mascotas'),
        ('other', 'Otros Servicios'),
    ]
    
    DURATION_CHOICES = [
        ('30min', '30 minutos'),
        ('1hour', '1 hora'),
        ('2-3hours', '2-3 horas'),
        ('half_day', 'Medio día'),
        ('full_day', 'Día completo'),
        ('custom', 'Personalizado'),
    ]
    
    category = models.CharField(max_length=50, choices=SERVICE_CATEGORIES, verbose_name='Categoría')
    
    # Disponibilidad
    availability = models.CharField(max_length=200, blank=True, verbose_name='Horarios disponibles')
    typical_duration = models.CharField(max_length=20, choices=DURATION_CHOICES, blank=True, verbose_name='Duración típica')
    
    # Área de cobertura
    coverage_area = models.CharField(max_length=200, blank=True, verbose_name='Área de cobertura')
    coverage_radius_km = models.PositiveIntegerField(null=True, blank=True, verbose_name='Radio de cobertura (km)')
    
    # Precio por hora o servicio
    price_type = models.CharField(max_length=20, choices=[
        ('hourly', 'Por hora'),
        ('service', 'Por servicio'),
        ('project', 'Por proyecto'),
    ], default='service', verbose_name='Tipo de precio')
    
    # Calificaciones
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, verbose_name='Calificación')
    reviews_count = models.PositiveIntegerField(default=0, verbose_name='Número de reseñas')
    
    # Reserva instantánea
    instant_booking = models.BooleanField(default=False, verbose_name='Reserva instantánea')
    
    class Meta:
        db_table = 'classifieds_services'
        verbose_name = 'Servicio Clasificado'
        verbose_name_plural = 'Servicios Clasificados'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['category', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['rating', '-created_at']),
        ]
    
    def __str__(self):
        return f"Servicio: {self.title} - {self.user.username}"


class FreelancerClassified(ClassifiedBase):
    """Modelo para trabajos freelancer"""
    
    FREELANCER_CATEGORIES = [
        ('graphic_design', 'Diseño Gráfico'),
        ('web_development', 'Desarrollo Web'),
        ('digital_marketing', 'Marketing Digital'),
        ('writing', 'Redacción'),
        ('translation', 'Traducción'),
        ('photography', 'Fotografía'),
        ('video_editing', 'Video Edición'),
        ('consulting', 'Consultoría'),
        ('music', 'Música'),
        ('other', 'Otros'),
    ]
    
    DELIVERY_TIME_CHOICES = [
        ('1-3days', '1-3 días'),
        ('1week', '1 semana'),
        ('2weeks', '2 semanas'),
        ('1month', '1 mes'),
        ('more', 'Más de 1 mes'),
        ('custom', 'Personalizado'),
    ]
    
    PROJECT_TYPE_CHOICES = [
        ('one_time', 'Proyecto único'),
        ('ongoing', 'Trabajo continuo'),
        ('both', 'Ambos'),
    ]
    
    category = models.CharField(max_length=50, choices=FREELANCER_CATEGORIES, verbose_name='Categoría')
    
    # Habilidades
    skills = models.JSONField(default=list, blank=True, verbose_name='Habilidades')
    
    # Portfolio
    portfolio_url = models.URLField(blank=True, verbose_name='URL del Portfolio')
    portfolio_images = models.JSONField(default=list, blank=True, verbose_name='Imágenes del Portfolio')
    
    # Tiempo de entrega
    delivery_time = models.CharField(max_length=20, choices=DELIVERY_TIME_CHOICES, blank=True, verbose_name='Tiempo de entrega')
    
    # Tipo de proyecto
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES, default='both', verbose_name='Tipo de proyecto')
    
    # Experiencia
    years_experience = models.PositiveIntegerField(default=0, verbose_name='Años de experiencia')
    
    # Calificaciones
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, verbose_name='Calificación')
    reviews_count = models.PositiveIntegerField(default=0, verbose_name='Número de reseñas')
    completed_projects = models.PositiveIntegerField(default=0, verbose_name='Proyectos completados')
    
    class Meta:
        db_table = 'classifieds_freelancer'
        verbose_name = 'Trabajo Freelancer'
        verbose_name_plural = 'Trabajos Freelancer'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['category', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['rating', '-created_at']),
        ]
    
    def __str__(self):
        return f"Freelancer: {self.title} - {self.user.username}"


class ClassifiedLike(models.Model):
    """Modelo para likes en clasificados"""
    
    CLASSIFIED_TYPES = [
        ('product', 'Producto'),
        ('service', 'Servicio'),
        ('freelancer', 'Freelancer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    classified_type = models.CharField(max_length=20, choices=CLASSIFIED_TYPES, verbose_name='Tipo')
    classified_id = models.UUIDField(verbose_name='ID del clasificado')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha')
    
    class Meta:
        db_table = 'classifieds_likes'
        unique_together = ('user', 'classified_type', 'classified_id')
        verbose_name = 'Like de Clasificado'
        verbose_name_plural = 'Likes de Clasificados'
        indexes = [
            models.Index(fields=['classified_type', 'classified_id']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.classified_type} {self.classified_id}"


class ClassifiedView(models.Model):
    """Modelo para rastrear visualizaciones de clasificados"""
    
    CLASSIFIED_TYPES = [
        ('product', 'Producto'),
        ('service', 'Servicio'),
        ('freelancer', 'Freelancer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, verbose_name='Usuario')
    classified_type = models.CharField(max_length=20, choices=CLASSIFIED_TYPES, verbose_name='Tipo')
    classified_id = models.UUIDField(verbose_name='ID del clasificado')
    ip_address = models.GenericIPAddressField(verbose_name='Dirección IP')
    user_agent = models.TextField(blank=True, verbose_name='User Agent')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha')
    
    class Meta:
        db_table = 'classifieds_views'
        verbose_name = 'Vista de Clasificado'
        verbose_name_plural = 'Vistas de Clasificados'
        indexes = [
            models.Index(fields=['classified_type', 'classified_id', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"Vista: {self.classified_type} {self.classified_id}"


class ClassifiedContact(models.Model):
    """Modelo para contactos/mensajes en clasificados"""
    
    CLASSIFIED_TYPES = [
        ('product', 'Producto'),
        ('service', 'Servicio'),
        ('freelancer', 'Freelancer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_contacts', verbose_name='Remitente')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_contacts', verbose_name='Destinatario')
    classified_type = models.CharField(max_length=20, choices=CLASSIFIED_TYPES, verbose_name='Tipo')
    classified_id = models.UUIDField(verbose_name='ID del clasificado')
    message = models.TextField(max_length=1000, verbose_name='Mensaje')
    is_read = models.BooleanField(default=False, verbose_name='Leído')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha')
    
    class Meta:
        db_table = 'classifieds_contacts'
        verbose_name = 'Contacto de Clasificado'
        verbose_name_plural = 'Contactos de Clasificados'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['receiver', 'is_read', '-created_at']),
            models.Index(fields=['classified_type', 'classified_id']),
        ]
    
    def __str__(self):
        return f"Contacto de {self.sender.username} a {self.receiver.username}"


class ClassifiedReport(models.Model):
    """Modelo para reportar clasificados"""
    
    CLASSIFIED_TYPES = [
        ('product', 'Producto'),
        ('service', 'Servicio'),
        ('freelancer', 'Freelancer'),
    ]
    
    REPORT_REASONS = [
        ('spam', 'Spam'),
        ('scam', 'Estafa'),
        ('inappropriate', 'Contenido inapropiado'),
        ('wrong_category', 'Categoría incorrecta'),
        ('duplicate', 'Duplicado'),
        ('other', 'Otro'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('reviewed', 'Revisado'),
        ('resolved', 'Resuelto'),
        ('dismissed', 'Desestimado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Reportador')
    classified_type = models.CharField(max_length=20, choices=CLASSIFIED_TYPES, verbose_name='Tipo')
    classified_id = models.UUIDField(verbose_name='ID del clasificado')
    reason = models.CharField(max_length=30, choices=REPORT_REASONS, verbose_name='Razón')
    description = models.TextField(max_length=500, blank=True, verbose_name='Descripción')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending', verbose_name='Estado')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_classified_reports')
    reviewed_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de revisión')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de reporte')
    
    class Meta:
        db_table = 'classifieds_reports'
        unique_together = ('reporter', 'classified_type', 'classified_id')
        verbose_name = 'Reporte de Clasificado'
        verbose_name_plural = 'Reportes de Clasificados'
        indexes = [
            models.Index(fields=['status', '-created_at']),
        ]
    
    def __str__(self):
        return f"Reporte: {self.classified_type} {self.classified_id} - {self.reason}"


class ServiceReview(models.Model):
    """Modelo para reseñas de servicios y freelancers"""
    
    CLASSIFIED_TYPES = [
        ('service', 'Servicio'),
        ('freelancer', 'Freelancer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews', verbose_name='Revisor')
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews', verbose_name='Proveedor')
    classified_type = models.CharField(max_length=20, choices=CLASSIFIED_TYPES, verbose_name='Tipo')
    classified_id = models.UUIDField(verbose_name='ID del clasificado')
    rating = models.PositiveIntegerField(verbose_name='Calificación')  # 1-5
    comment = models.TextField(max_length=500, blank=True, verbose_name='Comentario')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha')
    
    class Meta:
        db_table = 'classifieds_reviews'
        unique_together = ('reviewer', 'classified_type', 'classified_id')
        verbose_name = 'Reseña de Servicio'
        verbose_name_plural = 'Reseñas de Servicios'
        indexes = [
            models.Index(fields=['provider', '-created_at']),
            models.Index(fields=['classified_type', 'classified_id']),
        ]
    
    def __str__(self):
        return f"Reseña de {self.reviewer.username} - {self.rating} estrellas"

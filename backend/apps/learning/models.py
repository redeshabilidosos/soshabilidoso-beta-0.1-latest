"""
Modelos para el módulo de Capacitaciones y Aprendizaje
"""
import uuid
from django.db import models
from django.conf import settings


class Seccion(models.Model):
    """Secciones de aprendizaje (ej: Técnicas, Reglamentos, etc.)"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=100, unique=True, verbose_name='Slug')
    nombre = models.CharField(max_length=200, verbose_name='Nombre')
    descripcion = models.TextField(verbose_name='Descripción')
    icono = models.CharField(max_length=50, blank=True, verbose_name='Icono (nombre del componente)')
    color = models.CharField(max_length=20, default='#00ff88', verbose_name='Color hexadecimal')
    orden = models.PositiveIntegerField(default=0, verbose_name='Orden de visualización')
    imagen = models.ImageField(upload_to='learning/secciones/', null=True, blank=True, verbose_name='Imagen')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')

    class Meta:
        db_table = 'learning_secciones'
        verbose_name = 'Sección'
        verbose_name_plural = 'Secciones'
        ordering = ['orden', 'nombre']

    def __str__(self):
        return self.nombre

    @property
    def temas_count(self):
        return self.temas.filter(is_active=True).count()

    @property
    def duracion_total(self):
        total_minutos = self.temas.filter(is_active=True).aggregate(
            total=models.Sum('duracion_minutos')
        )['total'] or 0
        horas = total_minutos // 60
        minutos = total_minutos % 60
        if horas > 0:
            return f"{horas}h {minutos}min"
        return f"{minutos}min"


class Tema(models.Model):
    """Temas individuales dentro de una sección"""
    
    NIVEL_CHOICES = [
        ('basico', 'Básico'),
        ('intermedio', 'Intermedio'),
        ('avanzado', 'Avanzado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seccion = models.ForeignKey(
        Seccion, 
        on_delete=models.CASCADE, 
        related_name='temas',
        verbose_name='Sección'
    )
    slug = models.SlugField(max_length=100, verbose_name='Slug')
    titulo = models.CharField(max_length=200, verbose_name='Título')
    descripcion = models.TextField(verbose_name='Descripción corta')
    nivel = models.CharField(max_length=20, choices=NIVEL_CHOICES, default='basico', verbose_name='Nivel')
    duracion_minutos = models.PositiveIntegerField(default=30, verbose_name='Duración (minutos)')
    # Multimedia - Archivos
    imagen = models.ImageField(upload_to='learning/temas/', null=True, blank=True, verbose_name='Imagen de portada')
    video = models.FileField(upload_to='learning/videos/', null=True, blank=True, verbose_name='Video del tema')
    # Multimedia - URLs externas
    imagen_url = models.URLField(blank=True, verbose_name='URL de imagen externa')
    video_url = models.URLField(blank=True, verbose_name='URL de video (YouTube, Vimeo)')
    orden = models.PositiveIntegerField(default=0, verbose_name='Orden')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')

    class Meta:
        db_table = 'learning_temas'
        verbose_name = 'Tema'
        verbose_name_plural = 'Temas'
        ordering = ['seccion', 'orden', 'titulo']
        unique_together = ['seccion', 'slug']

    def __str__(self):
        return f"{self.seccion.nombre} - {self.titulo}"

    @property
    def duracion_formateada(self):
        if self.duracion_minutos >= 60:
            horas = self.duracion_minutos // 60
            minutos = self.duracion_minutos % 60
            return f"{horas}h {minutos}min"
        return f"{self.duracion_minutos} min"


class TemaContenido(models.Model):
    """Contenido detallado de un tema (secciones de texto)"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tema = models.ForeignKey(
        Tema,
        on_delete=models.CASCADE,
        related_name='contenidos',
        verbose_name='Tema'
    )
    subtitulo = models.CharField(max_length=200, verbose_name='Subtítulo')
    contenido = models.TextField(verbose_name='Contenido')
    orden = models.PositiveIntegerField(default=0, verbose_name='Orden')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'learning_tema_contenido'
        verbose_name = 'Contenido de Tema'
        verbose_name_plural = 'Contenidos de Temas'
        ordering = ['tema', 'orden']

    def __str__(self):
        return f"{self.tema.titulo} - {self.subtitulo}"


class TemaPuntoClave(models.Model):
    """Puntos clave de un tema"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tema = models.ForeignKey(
        Tema,
        on_delete=models.CASCADE,
        related_name='puntos_clave',
        verbose_name='Tema'
    )
    texto = models.CharField(max_length=500, verbose_name='Punto clave')
    orden = models.PositiveIntegerField(default=0, verbose_name='Orden')

    class Meta:
        db_table = 'learning_tema_puntos_clave'
        verbose_name = 'Punto Clave'
        verbose_name_plural = 'Puntos Clave'
        ordering = ['tema', 'orden']

    def __str__(self):
        return f"{self.tema.titulo} - Punto {self.orden}"


class ProgresoUsuario(models.Model):
    """Progreso del usuario en cada tema"""
    
    ESTADO_CHOICES = [
        ('no_iniciado', 'No Iniciado'),
        ('en_progreso', 'En Progreso'),
        ('completado', 'Completado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='progreso_learning',
        verbose_name='Usuario'
    )
    tema = models.ForeignKey(
        Tema,
        on_delete=models.CASCADE,
        related_name='progresos',
        verbose_name='Tema'
    )
    estado = models.CharField(
        max_length=20, 
        choices=ESTADO_CHOICES, 
        default='no_iniciado',
        verbose_name='Estado'
    )
    fecha_inicio = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de inicio')
    fecha_completado = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de completado')
    tiempo_dedicado_minutos = models.PositiveIntegerField(default=0, verbose_name='Tiempo dedicado (min)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'learning_progreso_usuario'
        verbose_name = 'Progreso de Usuario'
        verbose_name_plural = 'Progresos de Usuarios'
        unique_together = ['usuario', 'tema']

    def __str__(self):
        return f"{self.usuario.username} - {self.tema.titulo} ({self.estado})"


class Logro(models.Model):
    """Logros/Insignias que los usuarios pueden obtener"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=100, unique=True, verbose_name='Slug')
    nombre = models.CharField(max_length=100, verbose_name='Nombre')
    descripcion = models.TextField(verbose_name='Descripción')
    icono = models.CharField(max_length=50, verbose_name='Icono/Emoji')
    color = models.CharField(max_length=20, default='#FFD700', verbose_name='Color')
    puntos = models.PositiveIntegerField(default=10, verbose_name='Puntos')
    
    # Condiciones para obtener el logro
    seccion_requerida = models.ForeignKey(
        Seccion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='logros',
        verbose_name='Sección requerida (completar toda)'
    )
    temas_requeridos = models.PositiveIntegerField(
        default=0,
        verbose_name='Temas requeridos (cantidad mínima)'
    )
    
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'learning_logros'
        verbose_name = 'Logro'
        verbose_name_plural = 'Logros'
        ordering = ['puntos', 'nombre']

    def __str__(self):
        return f"{self.icono} {self.nombre}"


class UsuarioLogro(models.Model):
    """Relación entre usuarios y logros obtenidos"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='logros_obtenidos',
        verbose_name='Usuario'
    )
    logro = models.ForeignKey(
        Logro,
        on_delete=models.CASCADE,
        related_name='usuarios',
        verbose_name='Logro'
    )
    fecha_obtenido = models.DateTimeField(auto_now_add=True, verbose_name='Fecha obtenido')

    class Meta:
        db_table = 'learning_usuario_logros'
        verbose_name = 'Logro de Usuario'
        verbose_name_plural = 'Logros de Usuarios'
        unique_together = ['usuario', 'logro']

    def __str__(self):
        return f"{self.usuario.username} - {self.logro.nombre}"

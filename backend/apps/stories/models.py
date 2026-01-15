"""
Modelos para Stories (Historias efímeras de 24 horas)
"""
import uuid
from datetime import timedelta
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


def get_expiry_time():
    """Retorna la fecha de expiración (24 horas desde ahora)"""
    return timezone.now() + timedelta(hours=24)


class Story(models.Model):
    """Modelo para historias efímeras"""
    
    MEDIA_TYPES = [
        ('image', 'Imagen'),
        ('video', 'Video'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories', verbose_name='Usuario')
    
    # Contenido multimedia
    media = models.FileField(upload_to='stories/%Y/%m/%d/', verbose_name='Archivo multimedia')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='image', verbose_name='Tipo de medio')
    thumbnail = models.ImageField(upload_to='stories/thumbnails/', null=True, blank=True, verbose_name='Miniatura')
    
    # Estadísticas
    views_count = models.PositiveIntegerField(default=0, verbose_name='Visualizaciones')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    expires_at = models.DateTimeField(default=get_expiry_time, verbose_name='Fecha de expiración')
    
    class Meta:
        db_table = 'stories'
        verbose_name = 'Historia'
        verbose_name_plural = 'Historias'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"Historia de {self.user.username} - {self.created_at}"
    
    @property
    def is_expired(self):
        """Verificar si la historia ha expirado"""
        return timezone.now() > self.expires_at
    
    @property
    def media_url(self):
        """URL del archivo multimedia"""
        if self.media:
            return self.media.url
        return None
    
    def update_views_count(self):
        """Actualizar contador de visualizaciones"""
        self.views_count = self.views.count()
        self.save(update_fields=['views_count'])


class StoryView(models.Model):
    """Modelo para rastrear visualizaciones de historias"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='views', verbose_name='Historia')
    viewed_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de visualización')
    
    class Meta:
        db_table = 'story_views'
        unique_together = ('user', 'story')
        verbose_name = 'Visualización de Historia'
        verbose_name_plural = 'Visualizaciones de Historias'
        indexes = [
            models.Index(fields=['story', '-viewed_at']),
            models.Index(fields=['user', '-viewed_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} vio historia de {self.story.user.username}"


class StoryReaction(models.Model):
    """Modelo para reacciones a historias"""
    
    REACTION_TYPES = [
        ('like', '❤️ Me gusta'),
        ('fire', '🔥 Fuego'),
        ('celebrate', '🎉 Celebración'),
        ('thumbsup', '👍 Pulgar arriba'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='reactions', verbose_name='Historia')
    reaction_type = models.CharField(max_length=15, choices=REACTION_TYPES, verbose_name='Tipo de reacción')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de reacción')
    
    class Meta:
        db_table = 'story_reactions'
        unique_together = ('user', 'story')  # Un usuario solo puede tener una reacción por historia
        verbose_name = 'Reacción de Historia'
        verbose_name_plural = 'Reacciones de Historias'
        indexes = [
            models.Index(fields=['story', 'reaction_type']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.reaction_type} en historia de {self.story.user.username}"


class StoryReply(models.Model):
    """Modelo para respuestas/mensajes a historias"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='story_replies', verbose_name='Usuario')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='replies', verbose_name='Historia')
    message = models.TextField(max_length=500, verbose_name='Mensaje')
    is_read = models.BooleanField(default=False, verbose_name='Leído')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de envío')
    
    class Meta:
        db_table = 'story_replies'
        verbose_name = 'Respuesta de Historia'
        verbose_name_plural = 'Respuestas de Historias'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['story', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"Respuesta de {self.user.username} a historia de {self.story.user.username}"

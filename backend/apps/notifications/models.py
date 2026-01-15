"""
Modelos para notificaciones
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    """Modelo para notificaciones de usuarios"""
    
    NOTIFICATION_TYPES = [
        ('like', 'Me gusta'),
        ('celebration', 'Celebración'),
        ('golazo', 'Golazo'),
        ('comment', 'Comentario'),
        ('reply', 'Respuesta'),
        ('share', 'Compartido'),
        ('follow', 'Nuevo seguidor'),
        ('friend_request', 'Solicitud de amistad'),
        ('friend_accept', 'Amistad aceptada'),
        ('mention', 'Mención'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='notifications',
        verbose_name='Destinatario'
    )
    sender = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sent_notifications',
        verbose_name='Remitente'
    )
    
    notification_type = models.CharField(
        max_length=20, 
        choices=NOTIFICATION_TYPES,
        verbose_name='Tipo de notificación'
    )
    
    # Referencias opcionales
    post_id = models.UUIDField(null=True, blank=True, verbose_name='ID del post')
    comment_id = models.UUIDField(null=True, blank=True, verbose_name='ID del comentario')
    friend_request_id = models.UUIDField(null=True, blank=True, verbose_name='ID de solicitud de amistad')
    
    # Contenido
    message = models.TextField(max_length=500, verbose_name='Mensaje')
    
    # Estado
    is_read = models.BooleanField(default=False, verbose_name='Leída')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    read_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de lectura')
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['sender', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.notification_type} de {self.sender.username} para {self.recipient.username}"
    
    def mark_as_read(self):
        """Marcar notificación como leída"""
        if not self.is_read:
            self.is_read = True
            from django.utils import timezone
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])

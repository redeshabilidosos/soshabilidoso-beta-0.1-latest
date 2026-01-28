from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class StreamSession(models.Model):
    """Sesión de streaming en vivo"""
    STATUS_CHOICES = [
        ('live', 'En Vivo'),
        ('ended', 'Finalizado'),
        ('banned', 'Baneado'),
    ]
    
    streamer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stream_sessions')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    stream_key = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='live')
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    peak_viewers = models.IntegerField(default=0)
    total_gifts_received = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_banned = models.BooleanField(default=False)
    ban_reason = models.TextField(blank=True)
    banned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='banned_streams')
    banned_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        app_label = 'streaming'
        db_table = 'streaming_sessions'
        ordering = ['-started_at']
        
    def __str__(self):
        return f"{self.streamer.username} - {self.title}"


class StreamGift(models.Model):
    """Regalos/Tips enviados durante el stream"""
    GIFT_TYPES = [
        ('heart', 'Corazón'),
        ('star', 'Estrella'),
        ('zap', 'Rayo'),
        ('crown', 'Corona'),
        ('diamond', 'Diamante'),
        ('gift', 'Regalo'),
    ]
    
    stream_session = models.ForeignKey(StreamSession, on_delete=models.CASCADE, related_name='gifts')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_gifts')
    gift_type = models.CharField(max_length=20, choices=GIFT_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        app_label = 'streaming'
        db_table = 'streaming_gifts'
        ordering = ['-sent_at']
        
    def __str__(self):
        return f"{self.sender.username} -> {self.stream_session.streamer.username}: ${self.amount}"


class StreamViewer(models.Model):
    """Espectadores del stream"""
    stream_session = models.ForeignKey(StreamSession, on_delete=models.CASCADE, related_name='viewers')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='viewed_streams')
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    is_banned = models.BooleanField(default=False)
    ban_reason = models.TextField(blank=True)
    banned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='banned_viewers')
    banned_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        app_label = 'streaming'
        db_table = 'streaming_viewers'
        unique_together = ['stream_session', 'user']
        
    def __str__(self):
        return f"{self.user.username} watching {self.stream_session.title}"


class StreamChatMessage(models.Model):
    """Mensajes del chat del stream"""
    stream_session = models.ForeignKey(StreamSession, on_delete=models.CASCADE, related_name='chat_messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stream_messages')
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    deleted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_messages')
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        app_label = 'streaming'
        db_table = 'streaming_chat_messages'
        ordering = ['sent_at']
        
    def __str__(self):
        return f"{self.user.username}: {self.message[:50]}"


class StreamReport(models.Model):
    """Reportes de contenido inapropiado"""
    REPORT_TYPES = [
        ('offensive', 'Contenido Ofensivo'),
        ('spam', 'Spam'),
        ('harassment', 'Acoso'),
        ('inappropriate', 'Contenido Inapropiado'),
        ('other', 'Otro'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('reviewed', 'Revisado'),
        ('action_taken', 'Acción Tomada'),
        ('dismissed', 'Descartado'),
    ]
    
    stream_session = models.ForeignKey(StreamSession, on_delete=models.CASCADE, related_name='reports')
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stream_reports_made')
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stream_reports_received', null=True, blank=True)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='stream_reviewed_reports')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    action_taken = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        app_label = 'streaming'
        db_table = 'streaming_reports'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Report: {self.report_type} - {self.stream_session.title}"


class StreamEarnings(models.Model):
    """Ganancias del streamer"""
    streamer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stream_earnings')
    stream_session = models.ForeignKey(StreamSession, on_delete=models.CASCADE, related_name='earnings')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Comisión de la plataforma
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Monto neto para el streamer
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        app_label = 'streaming'
        db_table = 'streaming_earnings'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.streamer.username} - ${self.net_amount}"
    
    def save(self, *args, **kwargs):
        # Calcular comisión de la plataforma (ejemplo: 20%)
        self.platform_fee = self.total_amount * 0.20
        self.net_amount = self.total_amount - self.platform_fee
        super().save(*args, **kwargs)

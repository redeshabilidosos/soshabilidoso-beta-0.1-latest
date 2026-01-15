"""
Modelos para Posts y interacciones
"""
import uuid
import string
import random
from django.db import models
from django.contrib.auth import get_user_model
# Imports simplificados para desarrollo

User = get_user_model()


def generate_short_id():
    """Genera un ID corto único de 8 caracteres alfanuméricos"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=8))


class Post(models.Model):
    """Modelo para publicaciones"""
    
    POST_TYPES = [
        ('text', 'Texto'),
        ('image', 'Imagen'),
        ('video', 'Video'),
        ('highlight', 'Highlight'),
        ('podcast', 'Podcast'),
        ('streaming', 'Streaming'),
    ]
    
    CATEGORIES = [
        ('football', 'Fútbol'),
        ('general_sport', 'Deporte General'),
        ('culture', 'Cultura'),
        ('music', 'Música'),
        ('dance', 'Danza'),
        ('education', 'Educación'),
        ('gaming', 'Gaming'),
        ('food', 'Comida'),
        ('other', 'Otro'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    short_id = models.CharField(max_length=8, unique=True, blank=True, verbose_name='ID Corto')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(max_length=2000, blank=True, default='', verbose_name='Contenido')
    
    # Archivos multimedia
    images = models.JSONField(default=list, blank=True, verbose_name='Imágenes')  # URLs de Cloudinary
    video = models.FileField(upload_to='videos/', null=True, blank=True, verbose_name='Video')
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True, verbose_name='Miniatura')
    podcast_url = models.URLField(blank=True, verbose_name='URL del Podcast')
    streaming_url = models.URLField(blank=True, verbose_name='URL del Streaming')
    
    # Metadatos
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='text', verbose_name='Tipo de post')
    category = models.CharField(max_length=20, choices=CATEGORIES, blank=True, verbose_name='Categoría')
    
    # Relaciones (simplificado para desarrollo)
    # community = models.ForeignKey('communities.Community', ...) # Deshabilitado temporalmente
    
    # Estadísticas (actualizadas con signals)
    likes_count = models.PositiveIntegerField(default=0, verbose_name='Likes')
    celebrations_count = models.PositiveIntegerField(default=0, verbose_name='Celebraciones')
    golazos_count = models.PositiveIntegerField(default=0, verbose_name='Golazos')
    comments_count = models.PositiveIntegerField(default=0, verbose_name='Comentarios')
    shares_count = models.PositiveIntegerField(default=0, verbose_name='Compartidos')
    views_count = models.PositiveIntegerField(default=0, verbose_name='Visualizaciones')
    
    # Configuraciones
    is_pinned = models.BooleanField(default=False, verbose_name='Fijado')
    is_archived = models.BooleanField(default=False, verbose_name='Archivado')
    allow_comments = models.BooleanField(default=True, verbose_name='Permitir comentarios')
    is_public = models.BooleanField(default=True, verbose_name='Público')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    
    class Meta:
        db_table = 'posts'
        verbose_name = 'Publicación'
        verbose_name_plural = 'Publicaciones'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            # models.Index(fields=['community', '-created_at']), # Deshabilitado temporalmente
            models.Index(fields=['category', '-created_at']),
            models.Index(fields=['post_type', '-created_at']),
            models.Index(fields=['is_public', '-created_at']),
        ]
    
    def save(self, *args, **kwargs):
        """Generar short_id antes de guardar si no existe"""
        if not self.short_id:
            # Generar un short_id único
            while True:
                short_id = generate_short_id()
                if not Post.objects.filter(short_id=short_id).exists():
                    self.short_id = short_id
                    break
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Post de {self.user.username} - {self.post_type}"
    
    @property
    def total_reactions(self):
        """Total de reacciones (likes + celebrations + golazos)"""
        return self.likes_count + self.celebrations_count + self.golazos_count
    
    def update_reaction_counts(self):
        """Actualizar contadores de reacciones"""
        self.likes_count = self.reactions.filter(reaction_type='like').count()
        self.celebrations_count = self.reactions.filter(reaction_type='celebration').count()
        self.golazos_count = self.reactions.filter(reaction_type='golazo').count()
        self.save(update_fields=['likes_count', 'celebrations_count', 'golazos_count'])
    
    def update_comments_count(self):
        """Actualizar contador de comentarios"""
        self.comments_count = self.comments.count()
        self.save(update_fields=['comments_count'])
    
    def update_shares_count(self):
        """Actualizar contador de compartidos"""
        self.shares_count = self.shares.count()
        self.save(update_fields=['shares_count'])


class PostReaction(models.Model):
    """Modelo para reacciones a posts (likes, celebraciones, golazos)"""
    
    REACTION_TYPES = [
        ('like', 'Me gusta'),
        ('celebration', 'Celebración'),
        ('golazo', 'Golazo'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions', verbose_name='Post')
    reaction_type = models.CharField(max_length=15, choices=REACTION_TYPES, verbose_name='Tipo de reacción')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de reacción')
    
    class Meta:
        db_table = 'post_reactions'
        unique_together = ('user', 'post', 'reaction_type')
        verbose_name = 'Reacción'
        verbose_name_plural = 'Reacciones'
        indexes = [
            models.Index(fields=['post', 'reaction_type']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.reaction_type} en post {self.post.id}"


class Comment(models.Model):
    """Modelo para comentarios en posts"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments', verbose_name='Post')
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        verbose_name='Comentario padre'
    )
    content = models.TextField(max_length=500, verbose_name='Contenido')
    
    # Archivos multimedia en comentarios
    image = models.ImageField(upload_to='comments/', null=True, blank=True, verbose_name='Imagen')
    
    # Estadísticas
    likes_count = models.PositiveIntegerField(default=0, verbose_name='Likes')
    replies_count = models.PositiveIntegerField(default=0, verbose_name='Respuestas')
    
    # Configuraciones
    is_edited = models.BooleanField(default=False, verbose_name='Editado')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    
    class Meta:
        db_table = 'comments'
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['post', 'created_at']),
            models.Index(fields=['parent', 'created_at']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"Comentario de {self.user.username} en post {self.post.id}"
    
    @property
    def is_reply(self):
        """Verificar si es una respuesta a otro comentario"""
        return self.parent is not None
    
    def update_likes_count(self):
        """Actualizar contador de likes"""
        self.likes_count = self.likes.count()
        self.save(update_fields=['likes_count'])
    
    def update_replies_count(self):
        """Actualizar contador de respuestas"""
        self.replies_count = self.replies.count()
        self.save(update_fields=['replies_count'])


class CommentLike(models.Model):
    """Modelo para likes en comentarios"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes', verbose_name='Comentario')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de like')
    
    class Meta:
        db_table = 'comment_likes'
        unique_together = ('user', 'comment')
        verbose_name = 'Like de Comentario'
        verbose_name_plural = 'Likes de Comentarios'
        indexes = [
            models.Index(fields=['comment', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} like en comentario {self.comment.id}"


class PostShare(models.Model):
    """Modelo para compartir posts"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='shares', verbose_name='Post')
    message = models.TextField(max_length=200, blank=True, verbose_name='Mensaje')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de compartir')
    
    class Meta:
        db_table = 'post_shares'
        unique_together = ('user', 'post')
        verbose_name = 'Compartir Post'
        verbose_name_plural = 'Posts Compartidos'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['post', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} compartió post {self.post.id}"


class PostView(models.Model):
    """Modelo para rastrear visualizaciones de posts"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, verbose_name='Usuario')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='views', verbose_name='Post')
    ip_address = models.GenericIPAddressField(verbose_name='Dirección IP')
    user_agent = models.TextField(blank=True, verbose_name='User Agent')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de visualización')
    
    class Meta:
        db_table = 'post_views'
        verbose_name = 'Visualización de Post'
        verbose_name_plural = 'Visualizaciones de Posts'
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['ip_address', '-created_at']),
        ]
    
    def __str__(self):
        return f"Vista de post {self.post.id}"


class PostBookmark(models.Model):
    """Modelo para guardar posts favoritos"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarks', verbose_name='Post')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de guardado')
    
    class Meta:
        db_table = 'post_bookmarks'
        unique_together = ('user', 'post')
        verbose_name = 'Post Guardado'
        verbose_name_plural = 'Posts Guardados'
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} guardó post {self.post.id}"


class PostReport(models.Model):
    """Modelo para reportar posts inapropiados"""
    
    REPORT_REASONS = [
        ('spam', 'Spam'),
        ('harassment', 'Acoso'),
        ('hate_speech', 'Discurso de odio'),
        ('violence', 'Violencia'),
        ('inappropriate_content', 'Contenido inapropiado'),
        ('copyright', 'Violación de derechos de autor'),
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
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reports', verbose_name='Post')
    reason = models.CharField(max_length=30, choices=REPORT_REASONS, verbose_name='Razón')
    description = models.TextField(max_length=500, blank=True, verbose_name='Descripción')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending', verbose_name='Estado')
    
    # Moderación
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_reports',
        verbose_name='Revisado por'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de revisión')
    moderator_notes = models.TextField(blank=True, verbose_name='Notas del moderador')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de reporte')
    
    class Meta:
        db_table = 'post_reports'
        unique_together = ('reporter', 'post')
        verbose_name = 'Reporte de Post'
        verbose_name_plural = 'Reportes de Posts'
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['post', '-created_at']),
        ]
    
    def __str__(self):
        return f"Reporte de {self.reporter.username} - {self.reason}"
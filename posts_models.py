"""
Modelos para Posts y interacciones
apps/posts/models.py
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()


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
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(max_length=2000)
    
    # Archivos multimedia
    images = models.JSONField(default=list, blank=True)  # URLs de Cloudinary
    video = CloudinaryField('video', null=True, blank=True, resource_type='video')
    thumbnail = CloudinaryField('thumbnail', null=True, blank=True)
    podcast_url = models.URLField(blank=True)
    streaming_url = models.URLField(blank=True)
    
    # Metadatos
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='text')
    category = models.CharField(max_length=20, choices=CATEGORIES, blank=True)
    
    # Relaciones
    community = models.ForeignKey(
        'communities.Community',
        on_delete=models.CASCADE,
        related_name='posts',
        null=True,
        blank=True
    )
    
    # Estadísticas (actualizadas con signals)
    likes_count = models.PositiveIntegerField(default=0)
    celebrations_count = models.PositiveIntegerField(default=0)
    golazos_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)
    
    # Configuraciones
    is_pinned = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    allow_comments = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'posts'
        verbose_name = 'Publicación'
        verbose_name_plural = 'Publicaciones'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['community', '-created_at']),
            models.Index(fields=['category', '-created_at']),
        ]
    
    def __str__(self):
        return f"Post de {self.user.username} - {self.post_type}"


class PostReaction(models.Model):
    """Modelo para reacciones a posts (likes, celebraciones, golazos)"""
    
    REACTION_TYPES = [
        ('like', 'Me gusta'),
        ('celebration', 'Celebración'),
        ('golazo', 'Golazo'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=15, choices=REACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'post_reactions'
        unique_together = ('user', 'post', 'reaction_type')
        verbose_name = 'Reacción'
        verbose_name_plural = 'Reacciones'
    
    def __str__(self):
        return f"{self.user.username} - {self.reaction_type} en post {self.post.id}"


class Comment(models.Model):
    """Modelo para comentarios en posts"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    content = models.TextField(max_length=500)
    
    # Estadísticas
    likes_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'comments'
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['post', 'created_at']),
        ]
    
    def __str__(self):
        return f"Comentario de {self.user.username} en post {self.post.id}"


class CommentLike(models.Model):
    """Modelo para likes en comentarios"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'comment_likes'
        unique_together = ('user', 'comment')
        verbose_name = 'Like de Comentario'
        verbose_name_plural = 'Likes de Comentarios'
    
    def __str__(self):
        return f"{self.user.username} like en comentario {self.comment.id}"


class PostShare(models.Model):
    """Modelo para compartir posts"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='shares')
    message = models.TextField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'post_shares'
        unique_together = ('user', 'post')
        verbose_name = 'Compartir Post'
        verbose_name_plural = 'Posts Compartidos'
    
    def __str__(self):
        return f"{self.user.username} compartió post {self.post.id}"
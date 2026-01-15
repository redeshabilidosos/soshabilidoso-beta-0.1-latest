import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Reel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reels')
    video = models.FileField(upload_to='reels/videos/')
    thumbnail = models.ImageField(upload_to='reels/thumbnails/', blank=True, null=True)
    caption = models.TextField(blank=True)
    hashtags = models.CharField(max_length=500, blank=True)
    
    # Estadísticas
    views_count = models.IntegerField(default=0)
    likes = models.ManyToManyField(User, related_name='liked_reels', blank=True)
    
    # Metadata
    duration = models.IntegerField(default=0, help_text="Duración en segundos")
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Reel'
        verbose_name_plural = 'Reels'
    
    def __str__(self):
        return f"Reel by {self.author.username} - {self.created_at.strftime('%Y-%m-%d')}"
    
    @property
    def like_count(self):
        return self.likes.count()
    
    def is_liked_by(self, user):
        return self.likes.filter(id=user.id).exists()


class ReelComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reel = models.ForeignKey(Reel, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.reel}"

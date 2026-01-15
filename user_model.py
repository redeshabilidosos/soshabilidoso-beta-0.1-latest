"""
Modelo de Usuario personalizado para SOS-HABILIDOSO
apps/users/models.py
"""
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from phonenumber_field.modelfields import PhoneNumberField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    """Modelo de usuario personalizado"""
    
    # Campos básicos
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(
        max_length=30,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9_]+$',
                message='El username solo puede contener letras, números y guiones bajos'
            )
        ]
    )
    display_name = models.CharField(max_length=100)
    
    # Campos de perfil
    avatar = CloudinaryField('avatar', null=True, blank=True)
    cover_photo = CloudinaryField('cover_photo', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    
    # Campos deportivos
    position = models.CharField(max_length=100, blank=True)
    team = models.CharField(max_length=100, blank=True)
    
    # Contacto
    contact_number = PhoneNumberField(blank=True, null=True)
    
    # Intereses y redes sociales (JSON fields)
    interests = models.JSONField(default=list, blank=True)
    social_links = models.JSONField(default=list, blank=True)
    
    # Configuraciones de privacidad
    is_private = models.BooleanField(default=False)
    show_email = models.BooleanField(default=False)
    show_phone = models.BooleanField(default=False)
    
    # Estadísticas (se actualizan con signals)
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    posts_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(auto_now=True)
    
    # Configuración de autenticación
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'display_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.display_name} (@{self.username})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.display_name


class Follow(models.Model):
    """Modelo para seguir usuarios"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='following_set'
    )
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='followers_set'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_follows'
        unique_together = ('follower', 'following')
        verbose_name = 'Seguimiento'
        verbose_name_plural = 'Seguimientos'
    
    def __str__(self):
        return f"{self.follower.username} sigue a {self.following.username}"


class FriendRequest(models.Model):
    """Modelo para solicitudes de amistad"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('accepted', 'Aceptada'),
        ('rejected', 'Rechazada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_friend_requests'
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_friend_requests'
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'friend_requests'
        unique_together = ('sender', 'receiver')
        verbose_name = 'Solicitud de Amistad'
        verbose_name_plural = 'Solicitudes de Amistad'
    
    def __str__(self):
        return f"Solicitud de {self.sender.username} a {self.receiver.username}"


class Friendship(models.Model):
    """Modelo para amistades confirmadas"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user1 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='friendships_as_user1'
    )
    user2 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='friendships_as_user2'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'friendships'
        unique_together = ('user1', 'user2')
        verbose_name = 'Amistad'
        verbose_name_plural = 'Amistades'
    
    def __str__(self):
        return f"Amistad entre {self.user1.username} y {self.user2.username}"
    
    def save(self, *args, **kwargs):
        # Asegurar que user1.id < user2.id para evitar duplicados
        if self.user1.id > self.user2.id:
            self.user1, self.user2 = self.user2, self.user1
        super().save(*args, **kwargs)
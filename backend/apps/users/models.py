"""
Modelo de Usuario personalizado para SOS-HABILIDOSO
"""
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
# Imports simplificados para desarrollo


class User(AbstractUser):
    """Modelo de usuario personalizado"""
    
    # Campos básicos
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, verbose_name='Email')
    username = models.CharField(
        max_length=30,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9_]+$',
                message='El username solo puede contener letras, números y guiones bajos'
            )
        ],
        verbose_name='Nombre de usuario'
    )
    display_name = models.CharField(max_length=100, verbose_name='Nombre para mostrar')
    
    # Campos de perfil
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name='Avatar')
    cover_photo = models.ImageField(upload_to='covers/', null=True, blank=True, verbose_name='Foto de portada')
    bio = models.TextField(max_length=500, blank=True, verbose_name='Biografía')
    
    # Campos deportivos
    position = models.CharField(max_length=100, blank=True, verbose_name='Posición')
    team = models.CharField(max_length=100, blank=True, verbose_name='Equipo')
    
    # Contacto
    contact_number = models.CharField(max_length=20, blank=True, verbose_name='Número de contacto')
    
    # Intereses y redes sociales (JSON fields)
    interests = models.JSONField(default=list, blank=True, verbose_name='Intereses')
    social_links = models.JSONField(default=list, blank=True, verbose_name='Enlaces sociales')
    
    # Configuraciones de privacidad
    is_private = models.BooleanField(default=False, verbose_name='Perfil privado')
    show_email = models.BooleanField(default=False, verbose_name='Mostrar email')
    show_phone = models.BooleanField(default=False, verbose_name='Mostrar teléfono')
    
    # Estadísticas (se actualizan con signals)
    followers_count = models.PositiveIntegerField(default=0, verbose_name='Seguidores')
    following_count = models.PositiveIntegerField(default=0, verbose_name='Siguiendo')
    posts_count = models.PositiveIntegerField(default=0, verbose_name='Publicaciones')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    last_active = models.DateTimeField(auto_now=True, verbose_name='Última actividad')
    
    # Verificación
    is_verified = models.BooleanField(default=False, verbose_name='Verificado')
    email_verified = models.BooleanField(default=False, verbose_name='Email verificado')
    
    # Tipo de cuenta (usuario o empresa)
    ACCOUNT_TYPE_CHOICES = [
        ('user', 'Usuario'),
        ('enterprise', 'Empresa'),
    ]
    account_type = models.CharField(
        max_length=20,
        choices=ACCOUNT_TYPE_CHOICES,
        default='user',
        verbose_name='Tipo de cuenta'
    )
    
    # Campos específicos para empresas
    company_name = models.CharField(max_length=200, blank=True, verbose_name='Nombre de empresa')
    industry = models.CharField(max_length=100, blank=True, verbose_name='Industria')
    website = models.URLField(max_length=200, blank=True, verbose_name='Sitio web')
    
    # Configuración de autenticación
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'display_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['is_active', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.display_name} (@{self.username})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.display_name
    
    def get_avatar_url(self):
        """Obtener URL del avatar o avatar por defecto"""
        if self.avatar:
            try:
                # Si la URL ya es absoluta (empieza con http), devolverla tal cual
                if self.avatar.url.startswith('http'):
                    return self.avatar.url
                # Si es relativa, construir URL completa
                from django.conf import settings
                backend_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
                return f"{backend_url}{self.avatar.url}"
            except Exception as e:
                print(f"Error obteniendo URL del avatar: {e}")
                pass
        return f"https://ui-avatars.com/api/?name={self.display_name}&background=00ff88&color=fff"
    
    def get_friends(self):
        """Obtener lista de amigos"""
        friendships = Friendship.objects.filter(
            models.Q(user1=self) | models.Q(user2=self)
        )
        friends = []
        for friendship in friendships:
            if friendship.user1 == self:
                friends.append(friendship.user2)
            else:
                friends.append(friendship.user1)
        return friends


class Follow(models.Model):
    """Modelo para seguir usuarios"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='following_set',
        verbose_name='Seguidor'
    )
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='followers_set',
        verbose_name='Siguiendo'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de seguimiento')
    
    class Meta:
        db_table = 'user_follows'
        unique_together = ('follower', 'following')
        verbose_name = 'Seguimiento'
        verbose_name_plural = 'Seguimientos'
        indexes = [
            models.Index(fields=['follower', '-created_at']),
            models.Index(fields=['following', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.follower.username} sigue a {self.following.username}"
    
    def save(self, *args, **kwargs):
        # Evitar que un usuario se siga a sí mismo
        if self.follower == self.following:
            raise ValueError("Un usuario no puede seguirse a sí mismo")
        super().save(*args, **kwargs)


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
        related_name='sent_friend_requests',
        verbose_name='Remitente'
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_friend_requests',
        verbose_name='Destinatario'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Estado'
    )
    message = models.TextField(max_length=200, blank=True, verbose_name='Mensaje')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de solicitud')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    
    class Meta:
        db_table = 'friend_requests'
        unique_together = ('sender', 'receiver')
        verbose_name = 'Solicitud de Amistad'
        verbose_name_plural = 'Solicitudes de Amistad'
        indexes = [
            models.Index(fields=['receiver', 'status', '-created_at']),
            models.Index(fields=['sender', '-created_at']),
        ]
    
    def __str__(self):
        return f"Solicitud de {self.sender.username} a {self.receiver.username}"
    
    def save(self, *args, **kwargs):
        # Evitar solicitudes a uno mismo
        if self.sender == self.receiver:
            raise ValueError("No puedes enviarte una solicitud de amistad a ti mismo")
        super().save(*args, **kwargs)


class Friendship(models.Model):
    """Modelo para amistades confirmadas"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user1 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='friendships_as_user1',
        verbose_name='Usuario 1'
    )
    user2 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='friendships_as_user2',
        verbose_name='Usuario 2'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de amistad')
    
    class Meta:
        db_table = 'friendships'
        unique_together = ('user1', 'user2')
        verbose_name = 'Amistad'
        verbose_name_plural = 'Amistades'
        indexes = [
            models.Index(fields=['user1', '-created_at']),
            models.Index(fields=['user2', '-created_at']),
        ]
    
    def __str__(self):
        return f"Amistad entre {self.user1.username} y {self.user2.username}"
    
    def save(self, *args, **kwargs):
        # Asegurar que user1.id < user2.id para evitar duplicados
        if self.user1.id > self.user2.id:
            self.user1, self.user2 = self.user2, self.user1
        super().save(*args, **kwargs)
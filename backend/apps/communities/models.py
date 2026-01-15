import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class CommunityCategory(models.Model):
    """Categorías principales de comunidades (Deportes, Música, Tecnología, etc.)"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Descripción")
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icono (emoji o clase)")
    color = models.CharField(max_length=7, default='#00ff88', verbose_name="Color (hex)")
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name="Imagen")
    order = models.IntegerField(default=0, verbose_name="Orden")
    is_active = models.BooleanField(default=True, verbose_name="Activa")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def community_count(self):
        return self.communities.filter(is_active=True, parent__isnull=True).count()
    
    @property
    def subcommunity_count(self):
        return self.communities.filter(is_active=True, parent__isnull=False).count()


class Community(models.Model):
    COMMUNITY_TYPES = [
        ('public', 'Comunidad Pública'),
        ('private', 'Comunidad Privada'),
        ('page', 'Página Abierta'),
    ]
    
    # Mantener CATEGORIES para compatibilidad, pero usar CommunityCategory
    CATEGORIES = [
        ('deportes', 'Deportes'),
        ('musica', 'Música'),
        ('arte', 'Arte'),
        ('gaming', 'Gaming'),
        ('tecnologia', 'Tecnología'),
        ('lifestyle', 'Lifestyle'),
        ('educacion', 'Educación'),
        ('negocios', 'Negocios'),
        ('salud', 'Salud'),
        ('viajes', 'Viajes'),
    ]
    
    # ID único inmutable para URLs
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Información básica
    name = models.CharField(max_length=100, verbose_name="Nombre")
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(verbose_name="Descripción")
    
    # Categoría (nueva relación con CommunityCategory)
    category_obj = models.ForeignKey(
        CommunityCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='communities',
        verbose_name="Categoría"
    )
    # Mantener campo legacy para compatibilidad
    category = models.CharField(max_length=20, choices=CATEGORIES, verbose_name="Categoría (legacy)", blank=True)
    
    # Subcomunidad - referencia a comunidad padre
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcommunities',
        verbose_name="Comunidad padre"
    )
    
    type = models.CharField(max_length=10, choices=COMMUNITY_TYPES, default='public', verbose_name="Tipo")
    
    # Propietario y moderadores
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_communities', verbose_name="Propietario")
    moderators = models.ManyToManyField(User, blank=True, related_name='moderated_communities', verbose_name="Moderadores")
    
    # Miembros/Seguidores
    members = models.ManyToManyField(User, through='CommunityMembership', related_name='joined_communities', verbose_name="Miembros")
    
    # Imágenes
    profile_image = models.ImageField(upload_to='communities/profiles/', blank=True, null=True, verbose_name="Imagen de perfil")
    cover_image = models.ImageField(upload_to='communities/covers/', blank=True, null=True, verbose_name="Imagen de portada")
    
    # Configuración
    is_active = models.BooleanField(default=True, verbose_name="Activa")
    is_verified = models.BooleanField(default=False, verbose_name="Verificada")
    allow_posts = models.BooleanField(default=True, verbose_name="Permitir publicaciones")
    require_approval = models.BooleanField(default=False, verbose_name="Requiere aprobación para unirse")
    
    # Ubicación (opcional)
    location = models.CharField(max_length=100, blank=True, verbose_name="Ubicación")
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")
    
    class Meta:
        verbose_name = "Comunidad"
        verbose_name_plural = "Comunidades"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Community.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    @property
    def member_count(self):
        return self.members.count()
    
    @property
    def post_count(self):
        return self.posts.count()
    
    def is_member(self, user):
        if not user.is_authenticated:
            return False
        return self.members.filter(id=user.id).exists()
    
    def is_owner(self, user):
        return self.owner == user
    
    def is_moderator(self, user):
        return self.moderators.filter(id=user.id).exists()
    
    def can_moderate(self, user):
        return self.is_owner(user) or self.is_moderator(user)
    
    @property
    def is_subcommunity(self):
        return self.parent is not None
    
    @property
    def subcommunity_count(self):
        return self.subcommunities.filter(is_active=True).count()
    
    @property
    def root_community(self):
        """Obtiene la comunidad raíz (padre principal)"""
        if self.parent is None:
            return self
        return self.parent.root_community
    
    def get_all_subcommunities(self):
        """Obtiene todas las subcomunidades recursivamente"""
        subs = list(self.subcommunities.filter(is_active=True))
        for sub in self.subcommunities.filter(is_active=True):
            subs.extend(sub.get_all_subcommunities())
        return subs


class CommunityMembership(models.Model):
    MEMBERSHIP_ROLES = [
        ('member', 'Miembro'),
        ('moderator', 'Moderador'),
        ('admin', 'Administrador'),
    ]
    
    community = models.ForeignKey(Community, on_delete=models.CASCADE, verbose_name="Comunidad")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Usuario")
    role = models.CharField(max_length=10, choices=MEMBERSHIP_ROLES, default='member', verbose_name="Rol")
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de unión")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    
    class Meta:
        unique_together = ['community', 'user']
        verbose_name = "Membresía"
        verbose_name_plural = "Membresías"
    
    def __str__(self):
        return f"{self.user.username} - {self.community.name}"


class CommunitySocialLink(models.Model):
    SOCIAL_PLATFORMS = [
        ('instagram', 'Instagram'),
        ('twitter', 'Twitter/X'),
        ('facebook', 'Facebook'),
        ('youtube', 'YouTube'),
        ('website', 'Sitio Web'),
        ('linkedin', 'LinkedIn'),
        ('tiktok', 'TikTok'),
        ('discord', 'Discord'),
    ]
    
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='social_links', verbose_name="Comunidad")
    platform = models.CharField(max_length=20, choices=SOCIAL_PLATFORMS, verbose_name="Plataforma")
    url = models.URLField(verbose_name="URL")
    username = models.CharField(max_length=100, blank=True, verbose_name="Usuario")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    
    class Meta:
        unique_together = ['community', 'platform']
        verbose_name = "Enlace Social"
        verbose_name_plural = "Enlaces Sociales"
    
    def __str__(self):
        return f"{self.community.name} - {self.get_platform_display()}"


class CommunityPost(models.Model):
    POST_TYPES = [
        ('text', 'Texto'),
        ('image', 'Imagen'),
        ('video', 'Video'),
        ('podcast', 'Podcast'),
        ('live', 'En Vivo'),
        ('link', 'Enlace'),
        ('poll', 'Encuesta'),
    ]
    
    # ID único inmutable
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='posts', verbose_name="Comunidad")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_posts', verbose_name="Autor")
    
    # Contenido
    content = models.TextField(blank=True, default='', verbose_name="Contenido")
    post_type = models.CharField(max_length=10, choices=POST_TYPES, default='text', verbose_name="Tipo")
    
    # Imágenes y archivos
    image = models.ImageField(upload_to='community_posts/images/', blank=True, null=True, verbose_name="Imagen")
    video = models.FileField(upload_to='community_posts/videos/', blank=True, null=True, verbose_name="Video")
    podcast = models.FileField(upload_to='community_posts/podcasts/', blank=True, null=True, verbose_name="Podcast")
    video_url = models.URLField(blank=True, null=True, verbose_name="URL del Video")
    podcast_url = models.URLField(blank=True, null=True, verbose_name="URL del Podcast")
    live_url = models.URLField(blank=True, null=True, verbose_name="URL de Transmisión en Vivo")
    
    # Interacciones
    likes = models.ManyToManyField(User, blank=True, related_name='liked_community_posts', verbose_name="Me gusta")
    
    # Estado
    is_pinned = models.BooleanField(default=False, verbose_name="Fijado")
    is_approved = models.BooleanField(default=True, verbose_name="Aprobado")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")
    
    class Meta:
        verbose_name = "Publicación de Comunidad"
        verbose_name_plural = "Publicaciones de Comunidad"
        ordering = ['-is_pinned', '-created_at']
    
    def __str__(self):
        return f"{self.community.name} - {self.content[:50]}..."
    
    @property
    def like_count(self):
        return self.likes.count()
    
    @property
    def comment_count(self):
        return self.comments.count()
    
    def is_liked_by(self, user):
        if not user.is_authenticated:
            return False
        return self.likes.filter(id=user.id).exists()


class CommunityPostComment(models.Model):
    # ID único inmutable
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='comments', verbose_name="Publicación")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_comments', verbose_name="Autor")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies', verbose_name="Comentario padre")
    
    content = models.TextField(verbose_name="Contenido")
    
    # Interacciones
    likes = models.ManyToManyField(User, blank=True, related_name='liked_community_comments', verbose_name="Me gusta")
    
    # Estado
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")
    
    class Meta:
        verbose_name = "Comentario"
        verbose_name_plural = "Comentarios"
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.author.username} - {self.content[:30]}..."
    
    @property
    def like_count(self):
        return self.likes.count()
    
    def is_liked_by(self, user):
        if not user.is_authenticated:
            return False
        return self.likes.filter(id=user.id).exists()
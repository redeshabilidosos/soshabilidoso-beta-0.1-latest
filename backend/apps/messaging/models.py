"""
Modelos para sistema de mensajería
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model
# Imports simplificados para desarrollo

User = get_user_model()


class ChatRoom(models.Model):
    """Modelo para salas de chat"""
    
    CHAT_TYPES = [
        ('private', 'Chat Privado'),
        ('group', 'Chat Grupal'),
        ('community', 'Chat de Comunidad'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, verbose_name='Nombre del chat')
    chat_type = models.CharField(max_length=15, choices=CHAT_TYPES, default='private', verbose_name='Tipo de chat')
    
    # Participantes
    participants = models.ManyToManyField(
        User,
        through='ChatParticipant',
        related_name='chat_rooms',
        verbose_name='Participantes'
    )
    
    # Creador del chat
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_chats',
        verbose_name='Creado por'
    )
    
    # Configuraciones del chat
    description = models.TextField(max_length=500, blank=True, verbose_name='Descripción')
    avatar = models.ImageField(upload_to='chat_avatars/', null=True, blank=True, verbose_name='Avatar del chat')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    last_activity = models.DateTimeField(auto_now=True, verbose_name='Última actividad')
    
    class Meta:
        db_table = 'chat_rooms'
        verbose_name = 'Sala de Chat'
        verbose_name_plural = 'Salas de Chat'
        ordering = ['-last_activity']
        indexes = [
            models.Index(fields=['chat_type', '-last_activity']),
            models.Index(fields=['created_by', '-created_at']),
        ]
    
    def __str__(self):
        if self.name:
            return self.name
        elif self.chat_type == 'private':
            participants = list(self.participants.all()[:2])
            if len(participants) == 2:
                return f"Chat entre {participants[0].username} y {participants[1].username}"
        return f"Chat {self.id}"
    
    def get_other_participant(self, user):
        """Obtener el otro participante en un chat privado"""
        if self.chat_type == 'private':
            participants = self.participants.exclude(id=user.id)
            return participants.first()
        return None
    
    def get_display_name(self, for_user):
        """Obtener nombre para mostrar según el usuario"""
        if self.name:
            return self.name
        elif self.chat_type == 'private':
            other = self.get_other_participant(for_user)
            if other:
                # Verificar si hay un apodo personalizado
                participant = ChatParticipant.objects.filter(
                    chat_room=self,
                    user=for_user
                ).first()
                if participant and participant.other_user_nickname:
                    return participant.other_user_nickname
                return other.display_name
        return f"Chat {self.id}"


class ChatParticipant(models.Model):
    """Modelo para participantes de chat con configuraciones personalizadas"""
    
    ROLES = [
        ('member', 'Miembro'),
        ('admin', 'Administrador'),
        ('owner', 'Propietario'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, verbose_name='Sala de chat')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    role = models.CharField(max_length=10, choices=ROLES, default='member', verbose_name='Rol')
    
    # Configuraciones personalizadas del chat
    other_user_nickname = models.CharField(max_length=50, blank=True, verbose_name='Apodo del otro usuario')
    chat_background = models.CharField(max_length=20, blank=True, verbose_name='Fondo del chat')
    chat_color = models.CharField(max_length=30, blank=True, verbose_name='Color de mis mensajes')
    other_message_color = models.CharField(max_length=30, blank=True, verbose_name='Color de otros mensajes')
    
    # Configuraciones de notificaciones
    notifications_enabled = models.BooleanField(default=True, verbose_name='Notificaciones habilitadas')
    sound_enabled = models.BooleanField(default=True, verbose_name='Sonido habilitado')
    
    # Estado del participante
    is_muted = models.BooleanField(default=False, verbose_name='Silenciado')
    is_blocked = models.BooleanField(default=False, verbose_name='Bloqueado')
    
    # Timestamps
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de ingreso')
    last_read_at = models.DateTimeField(auto_now_add=True, verbose_name='Última lectura')
    
    class Meta:
        db_table = 'chat_participants'
        unique_together = ('chat_room', 'user')
        verbose_name = 'Participante de Chat'
        verbose_name_plural = 'Participantes de Chat'
        indexes = [
            models.Index(fields=['user', '-joined_at']),
            models.Index(fields=['chat_room', 'user']),
        ]
    
    def __str__(self):
        return f"{self.user.username} en {self.chat_room}"
    
    def get_unread_count(self):
        """Obtener cantidad de mensajes no leídos"""
        return Message.objects.filter(
            chat_room=self.chat_room,
            created_at__gt=self.last_read_at
        ).exclude(sender=self.user).count()


class Message(models.Model):
    """Modelo para mensajes"""
    
    MESSAGE_TYPES = [
        ('text', 'Texto'),
        ('image', 'Imagen'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('file', 'Archivo'),
        ('emoji', 'Emoji'),
        ('system', 'Sistema'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages', verbose_name='Sala de chat')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages', verbose_name='Remitente')
    
    # Contenido del mensaje
    content = models.TextField(max_length=2000, verbose_name='Contenido')
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='text', verbose_name='Tipo de mensaje')
    
    # Archivos multimedia
    image = models.ImageField(upload_to='messages/images/', null=True, blank=True, verbose_name='Imagen')
    video = models.FileField(upload_to='messages/videos/', null=True, blank=True, verbose_name='Video')
    audio = models.FileField(upload_to='messages/audio/', null=True, blank=True, verbose_name='Audio')
    file_url = models.URLField(blank=True, verbose_name='URL del archivo')
    file_name = models.CharField(max_length=255, blank=True, verbose_name='Nombre del archivo')
    file_size = models.PositiveIntegerField(null=True, blank=True, verbose_name='Tamaño del archivo')
    
    # Mensaje de respuesta
    reply_to = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        verbose_name='Respuesta a'
    )
    
    # Estado del mensaje
    is_edited = models.BooleanField(default=False, verbose_name='Editado')
    is_deleted = models.BooleanField(default=False, verbose_name='Eliminado')
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de eliminación')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de envío')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    
    class Meta:
        db_table = 'messages'
        verbose_name = 'Mensaje'
        verbose_name_plural = 'Mensajes'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['chat_room', 'created_at']),
            models.Index(fields=['sender', '-created_at']),
            models.Index(fields=['chat_room', 'is_deleted', 'created_at']),
        ]
    
    def __str__(self):
        return f"Mensaje de {self.sender.username} en {self.chat_room}"
    
    @property
    def is_reply(self):
        """Verificar si es una respuesta"""
        return self.reply_to is not None


class MessageReaction(models.Model):
    """Modelo para reacciones a mensajes"""
    
    REACTION_TYPES = [
        ('like', '👍'),
        ('love', '❤️'),
        ('laugh', '😂'),
        ('wow', '😮'),
        ('sad', '😢'),
        ('angry', '😠'),
        ('fire', '🔥'),
        ('golazo', '⚽'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='reactions', verbose_name='Mensaje')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    reaction_type = models.CharField(max_length=10, choices=REACTION_TYPES, verbose_name='Tipo de reacción')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de reacción')
    
    class Meta:
        db_table = 'message_reactions'
        unique_together = ('message', 'user', 'reaction_type')
        verbose_name = 'Reacción a Mensaje'
        verbose_name_plural = 'Reacciones a Mensajes'
        indexes = [
            models.Index(fields=['message', 'reaction_type']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.get_reaction_type_display()} en mensaje {self.message.id}"


class MessageRead(models.Model):
    """Modelo para rastrear mensajes leídos"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='read_by', verbose_name='Mensaje')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    read_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de lectura')
    
    class Meta:
        db_table = 'message_reads'
        unique_together = ('message', 'user')
        verbose_name = 'Mensaje Leído'
        verbose_name_plural = 'Mensajes Leídos'
        indexes = [
            models.Index(fields=['user', '-read_at']),
            models.Index(fields=['message', 'user']),
        ]
    
    def __str__(self):
        return f"{self.user.username} leyó mensaje {self.message.id}"


class ChatInvitation(models.Model):
    """Modelo para invitaciones a chats grupales"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('accepted', 'Aceptada'),
        ('rejected', 'Rechazada'),
        ('expired', 'Expirada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='invitations', verbose_name='Sala de chat')
    inviter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations', verbose_name='Invitador')
    invitee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_invitations', verbose_name='Invitado')
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name='Estado')
    message = models.TextField(max_length=200, blank=True, verbose_name='Mensaje de invitación')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de invitación')
    responded_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de respuesta')
    expires_at = models.DateTimeField(verbose_name='Fecha de expiración')
    
    class Meta:
        db_table = 'chat_invitations'
        unique_together = ('chat_room', 'invitee')
        verbose_name = 'Invitación a Chat'
        verbose_name_plural = 'Invitaciones a Chat'
        indexes = [
            models.Index(fields=['invitee', 'status', '-created_at']),
            models.Index(fields=['chat_room', 'status']),
        ]
    
    def __str__(self):
        return f"Invitación de {self.inviter.username} a {self.invitee.username}"
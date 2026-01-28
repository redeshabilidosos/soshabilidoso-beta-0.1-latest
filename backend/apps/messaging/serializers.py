"""
Serializers para sistema de mensajería
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.authentication.serializers import UserProfileSerializer
from .models import (
    ChatRoom, ChatParticipant, Message, MessageReaction,
    MessageRead, ChatInvitation
)

User = get_user_model()


class MessageReactionSerializer(serializers.ModelSerializer):
    """Serializer para reacciones a mensajes"""
    
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = MessageReaction
        fields = ['id', 'user', 'reaction_type', 'created_at']
        read_only_fields = ['id', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer para mensajes"""
    
    sender = UserProfileSerializer(read_only=True)
    reply_to = serializers.SerializerMethodField()
    reactions = MessageReactionSerializer(many=True, read_only=True)
    user_reaction = serializers.SerializerMethodField()
    is_read = serializers.SerializerMethodField()
    read_by_count = serializers.SerializerMethodField()
    story_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 'chat_room', 'sender', 'content', 'message_type',
            'image', 'video', 'audio', 'file_url', 'file_name', 'file_size',
            'reply_to', 'is_edited', 'is_deleted', 'created_at', 'updated_at',
            'reactions', 'user_reaction', 'is_read', 'read_by_count', 'is_reply',
            'story_id', 'story_preview'
        ]
        read_only_fields = [
            'id', 'sender', 'is_edited', 'is_deleted', 'created_at', 'updated_at'
        ]
    
    def get_story_preview(self, obj):
        """Obtener preview de la historia si el mensaje es una respuesta a historia"""
        if obj.story_id and obj.message_type == 'story_reply':
            try:
                from apps.stories.models import Story
                story = Story.objects.filter(id=obj.story_id).select_related('user').first()
                if story:
                    # Obtener avatar del usuario
                    avatar_url = None
                    if hasattr(story.user, 'avatar') and story.user.avatar:
                        avatar_url = story.user.avatar.url
                    elif hasattr(story.user, 'avatar_url') and story.user.avatar_url:
                        avatar_url = story.user.avatar_url
                    
                    return {
                        'id': str(story.id),
                        'media_url': story.media_url,
                        'media_type': story.media_type,
                        'user': {
                            'id': str(story.user.id),
                            'username': story.user.username,
                            'display_name': getattr(story.user, 'display_name', story.user.username),
                            'avatar_url': avatar_url,
                        },
                        'created_at': story.created_at.isoformat(),
                        'is_expired': story.is_expired
                    }
            except Exception as e:
                print(f'[ERROR] Error al obtener preview de historia: {str(e)}')
                import traceback
                traceback.print_exc()
        return None
    
    def get_reply_to(self, obj):
        """Obtener mensaje al que responde (versión simplificada)"""
        if obj.reply_to:
            return {
                'id': str(obj.reply_to.id),
                'sender': {
                    'username': obj.reply_to.sender.username,
                    'display_name': obj.reply_to.sender.display_name
                },
                'content': obj.reply_to.content[:100] + '...' if len(obj.reply_to.content) > 100 else obj.reply_to.content,
                'message_type': obj.reply_to.message_type
            }
        return None
    
    def get_user_reaction(self, obj):
        """Obtener reacción del usuario actual al mensaje"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = MessageReaction.objects.filter(
                message=obj,
                user=request.user
            ).first()
            if reaction:
                return reaction.reaction_type
        return None
    
    def get_is_read(self, obj):
        """Verificar si el usuario actual leyó el mensaje"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return MessageRead.objects.filter(
                message=obj,
                user=request.user
            ).exists()
        return False
    
    def get_read_by_count(self, obj):
        """Obtener cantidad de usuarios que leyeron el mensaje"""
        return obj.read_by.count()


class MessageCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear mensajes"""
    
    class Meta:
        model = Message
        fields = [
            'content', 'message_type', 'image', 'video', 'audio',
            'file_url', 'file_name', 'file_size', 'reply_to'
        ]
    
    def validate_reply_to(self, value):
        """Validar mensaje de respuesta"""
        if value:
            chat_room_id = self.context['view'].kwargs.get('chat_room_id')
            if str(value.chat_room.id) != chat_room_id:
                raise serializers.ValidationError(
                    "El mensaje de respuesta debe pertenecer al mismo chat."
                )
        return value
    
    def validate(self, attrs):
        """Validaciones generales"""
        message_type = attrs.get('message_type', 'text')
        content = attrs.get('content', '').strip()
        
        # Validar que mensajes de texto tengan contenido
        if message_type == 'text' and not content:
            raise serializers.ValidationError({
                'content': 'Los mensajes de texto requieren contenido.'
            })
        
        # Validar que mensajes multimedia tengan archivos
        if message_type == 'image' and not attrs.get('image'):
            raise serializers.ValidationError({
                'image': 'Los mensajes de imagen requieren un archivo de imagen.'
            })
        
        if message_type == 'video' and not attrs.get('video'):
            raise serializers.ValidationError({
                'video': 'Los mensajes de video requieren un archivo de video.'
            })
        
        if message_type == 'audio' and not attrs.get('audio'):
            raise serializers.ValidationError({
                'audio': 'Los mensajes de audio requieren un archivo de audio.'
            })
        
        if message_type == 'file' and not attrs.get('file_url'):
            raise serializers.ValidationError({
                'file_url': 'Los mensajes de archivo requieren una URL.'
            })
        
        return attrs


class ChatParticipantSerializer(serializers.ModelSerializer):
    """Serializer para participantes de chat"""
    
    user = UserProfileSerializer(read_only=True)
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatParticipant
        fields = [
            'id', 'user', 'role', 'other_user_nickname', 'chat_background',
            'chat_color', 'other_message_color', 'notifications_enabled',
            'sound_enabled', 'is_muted', 'joined_at', 'last_read_at',
            'unread_count'
        ]
        read_only_fields = ['id', 'joined_at']
    
    def get_unread_count(self, obj):
        """Obtener cantidad de mensajes no leídos"""
        return obj.get_unread_count()


class ChatRoomSerializer(serializers.ModelSerializer):
    """Serializer para salas de chat"""
    
    participants = ChatParticipantSerializer(
        source='chatparticipant_set',
        many=True,
        read_only=True
    )
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    other_user = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    user_settings = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'chat_type', 'description', 'avatar',
            'is_active', 'created_at', 'updated_at', 'last_activity',
            'participants', 'last_message', 'unread_count', 'other_user',
            'display_name', 'user_settings'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_activity']
    
    def get_last_message(self, obj):
        """Obtener último mensaje del chat"""
        last_message = obj.messages.filter(is_deleted=False).last()
        if last_message:
            return {
                'id': str(last_message.id),
                'content': last_message.content,
                'message_type': last_message.message_type,
                'sender': {
                    'username': last_message.sender.username,
                    'display_name': last_message.sender.display_name
                },
                'created_at': last_message.created_at
            }
        return None
    
    def get_unread_count(self, obj):
        """Obtener cantidad de mensajes no leídos para el usuario actual"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            participant = ChatParticipant.objects.filter(
                chat_room=obj,
                user=request.user
            ).first()
            if participant:
                return participant.get_unread_count()
        return 0
    
    def get_other_user(self, obj):
        """Obtener el otro usuario en chats privados"""
        request = self.context.get('request')
        if request and request.user.is_authenticated and obj.chat_type == 'private':
            other_user = obj.get_other_participant(request.user)
            if other_user:
                return UserProfileSerializer(other_user, context=self.context).data
        return None
    
    def get_display_name(self, obj):
        """Obtener nombre para mostrar"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.get_display_name(request.user)
        return obj.name or str(obj.id)
    
    def get_user_settings(self, obj):
        """Obtener configuraciones del usuario para este chat"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            participant = ChatParticipant.objects.filter(
                chat_room=obj,
                user=request.user
            ).first()
            if participant:
                return {
                    'other_user_nickname': participant.other_user_nickname,
                    'chat_background': participant.chat_background,
                    'chat_color': participant.chat_color,
                    'other_message_color': participant.other_message_color,
                    'notifications_enabled': participant.notifications_enabled,
                    'sound_enabled': participant.sound_enabled,
                    'is_muted': participant.is_muted
                }
        return {}


class ChatRoomCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear salas de chat"""
    
    participant_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = ChatRoom
        fields = ['name', 'chat_type', 'description', 'avatar', 'participant_ids']
    
    def validate_participant_ids(self, value):
        """Validar IDs de participantes"""
        if not value:
            return value
        
        # Verificar que todos los usuarios existan
        existing_users = User.objects.filter(id__in=value).count()
        if existing_users != len(value):
            raise serializers.ValidationError(
                "Algunos usuarios no existen."
            )
        
        return value
    
    def validate(self, attrs):
        """Validaciones generales"""
        chat_type = attrs.get('chat_type', 'private')
        participant_ids = attrs.get('participant_ids', [])
        
        # Validar chats privados
        if chat_type == 'private':
            if len(participant_ids) != 1:
                raise serializers.ValidationError({
                    'participant_ids': 'Los chats privados requieren exactamente 1 participante adicional.'
                })
        
        # Validar chats grupales
        elif chat_type == 'group':
            if len(participant_ids) < 2:
                raise serializers.ValidationError({
                    'participant_ids': 'Los chats grupales requieren al menos 2 participantes adicionales.'
                })
            
            if not attrs.get('name'):
                raise serializers.ValidationError({
                    'name': 'Los chats grupales requieren un nombre.'
                })
        
        return attrs
    
    def create(self, validated_data):
        """Crear sala de chat"""
        participant_ids = validated_data.pop('participant_ids', [])
        user = self.context['request'].user
        
        # Crear chat room
        chat_room = ChatRoom.objects.create(
            created_by=user,
            **validated_data
        )
        
        # Agregar creador como participante
        ChatParticipant.objects.create(
            chat_room=chat_room,
            user=user,
            role='owner' if validated_data.get('chat_type') != 'private' else 'member'
        )
        
        # Agregar otros participantes
        for participant_id in participant_ids:
            participant_user = User.objects.get(id=participant_id)
            ChatParticipant.objects.create(
                chat_room=chat_room,
                user=participant_user,
                role='member'
            )
        
        return chat_room


class ChatSettingsSerializer(serializers.ModelSerializer):
    """Serializer para configuraciones de chat"""
    
    class Meta:
        model = ChatParticipant
        fields = [
            'other_user_nickname', 'chat_background', 'chat_color',
            'other_message_color', 'notifications_enabled', 'sound_enabled'
        ]


class ChatInvitationSerializer(serializers.ModelSerializer):
    """Serializer para invitaciones a chat"""
    
    inviter = UserProfileSerializer(read_only=True)
    invitee = UserProfileSerializer(read_only=True)
    chat_room = ChatRoomSerializer(read_only=True)
    
    class Meta:
        model = ChatInvitation
        fields = [
            'id', 'chat_room', 'inviter', 'invitee', 'status',
            'message', 'created_at', 'responded_at', 'expires_at'
        ]
        read_only_fields = ['id', 'created_at', 'responded_at']
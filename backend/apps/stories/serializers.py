"""
Serializers para Stories
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Story, StoryView, StoryReaction, StoryReply

User = get_user_model()


class StoryUserSerializer(serializers.ModelSerializer):
    """Serializer para usuario en historias"""
    display_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar_url']
    
    def get_display_name(self, obj):
        return getattr(obj, 'display_name', None) or obj.get_full_name() or obj.username
    
    def get_avatar_url(self, obj):
        if hasattr(obj, 'avatar') and obj.avatar:
            return obj.avatar.url
        if hasattr(obj, 'avatar_url') and obj.avatar_url:
            return obj.avatar_url
        return None


class StorySerializer(serializers.ModelSerializer):
    """Serializer para historias"""
    user = StoryUserSerializer(read_only=True)
    media_url = serializers.SerializerMethodField()
    viewed = serializers.SerializerMethodField()
    reactions = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    
    class Meta:
        model = Story
        fields = [
            'id', 'user', 'media_url', 'media_type', 
            'created_at', 'expires_at', 'views_count',
            'viewed', 'reactions', 'user_reaction'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'expires_at', 'views_count']
    
    def get_media_url(self, obj):
        request = self.context.get('request')
        if obj.media:
            if request:
                return request.build_absolute_uri(obj.media.url)
            return obj.media.url
        return None
    
    def get_viewed(self, obj):
        """Verificar si el usuario actual ha visto esta historia"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return StoryView.objects.filter(user=request.user, story=obj).exists()
        return False
    
    def get_reactions(self, obj):
        """Obtener conteo de reacciones por tipo"""
        return {
            'like': obj.reactions.filter(reaction_type='like').count(),
            'fire': obj.reactions.filter(reaction_type='fire').count(),
            'celebrate': obj.reactions.filter(reaction_type='celebrate').count(),
            'thumbsup': obj.reactions.filter(reaction_type='thumbsup').count(),
        }
    
    def get_user_reaction(self, obj):
        """Obtener la reacción del usuario actual"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            if reaction:
                return reaction.reaction_type
        return None


class StoryCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear historias"""
    media = serializers.FileField(required=True)
    
    class Meta:
        model = Story
        fields = ['media', 'media_type']
    
    def validate_media(self, value):
        """Validar el archivo multimedia"""
        # Validar tamaño máximo (50MB)
        max_size = 50 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("El archivo no puede superar los 50MB")
        
        # Validar tipo de archivo
        content_type = value.content_type
        allowed_image_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        allowed_video_types = ['video/mp4', 'video/webm', 'video/quicktime']
        
        if content_type not in allowed_image_types + allowed_video_types:
            raise serializers.ValidationError("Tipo de archivo no permitido")
        
        return value
    
    def create(self, validated_data):
        """Crear historia con el usuario actual"""
        validated_data['user'] = self.context['request'].user
        
        # Detectar tipo de medio automáticamente
        media = validated_data.get('media')
        if media:
            content_type = media.content_type
            if content_type.startswith('video/'):
                validated_data['media_type'] = 'video'
            else:
                validated_data['media_type'] = 'image'
        
        return super().create(validated_data)


class UserStoriesSerializer(serializers.Serializer):
    """Serializer para agrupar historias por usuario"""
    user = StoryUserSerializer()
    stories = StorySerializer(many=True)
    has_unviewed = serializers.BooleanField()


class StoryReactionSerializer(serializers.ModelSerializer):
    """Serializer para reacciones"""
    
    class Meta:
        model = StoryReaction
        fields = ['id', 'reaction_type', 'created_at']
        read_only_fields = ['id', 'created_at']


class StoryReplySerializer(serializers.ModelSerializer):
    """Serializer para respuestas"""
    user = StoryUserSerializer(read_only=True)
    
    class Meta:
        model = StoryReply
        fields = ['id', 'user', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'user', 'is_read', 'created_at']

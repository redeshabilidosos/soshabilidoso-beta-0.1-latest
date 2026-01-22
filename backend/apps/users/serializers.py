"""
Serializers para la app de usuarios
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import models
from .models import Follow, FriendRequest, Friendship

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """Serializer básico para usuarios (para notificaciones, etc.)"""
    avatar = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'display_name', 'avatar', 'avatar_url', 'is_verified'
        ]
    
    def get_avatar(self, obj):
        """Devolver URL completa del avatar"""
        return obj.get_avatar_url()
    
    def get_avatar_url(self, obj):
        return obj.get_avatar_url()


class UserSearchSerializer(serializers.ModelSerializer):
    """Serializer para búsqueda de usuarios"""
    avatar = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    is_friend = serializers.SerializerMethodField()
    friend_request_status = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'display_name', 'avatar', 'avatar_url',
            'bio', 'position', 'team', 'is_verified', 'followers_count',
            'following_count', 'posts_count', 'is_following', 'is_friend',
            'friend_request_status'
        ]
    
    def get_avatar(self, obj):
        """Devolver URL completa del avatar"""
        return obj.get_avatar_url()
    
    def get_avatar_url(self, obj):
        return obj.get_avatar_url()
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(
                follower=request.user,
                following=obj
            ).exists()
        return False
    
    def get_is_friend(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Friendship.objects.filter(
                models.Q(user1=request.user, user2=obj) |
                models.Q(user1=obj, user2=request.user)
            ).exists()
        return False
    
    def get_friend_request_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Verificar si hay solicitud pendiente
            sent_request = FriendRequest.objects.filter(
                sender=request.user,
                receiver=obj,
                status='pending'
            ).first()
            
            received_request = FriendRequest.objects.filter(
                sender=obj,
                receiver=request.user,
                status='pending'
            ).first()
            
            if sent_request:
                return 'sent'
            elif received_request:
                return 'received'
            
        return None


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer completo para perfil de usuario"""
    avatar = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    is_friend = serializers.SerializerMethodField()
    friend_request_status = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'display_name', 'first_name', 'last_name',
            'email', 'avatar', 'avatar_url', 'cover_photo', 'bio',
            'position', 'team', 'contact_number', 'interests',
            'social_links', 'is_verified', 'followers_count',
            'following_count', 'posts_count', 'created_at',
            'is_following', 'is_friend', 'friend_request_status'
        ]
        read_only_fields = [
            'id', 'followers_count', 'following_count', 'posts_count',
            'created_at', 'is_verified', 'is_following', 'is_friend', 'friend_request_status'
        ]
    
    def get_avatar(self, obj):
        """Devolver URL completa del avatar"""
        return obj.get_avatar_url()
    
    def get_avatar_url(self, obj):
        """Devolver URL completa del avatar (para compatibilidad)"""
        return obj.get_avatar_url()
    
    def get_cover_photo(self, obj):
        """Devolver URL completa de la foto de portada"""
        if obj.cover_photo:
            if obj.cover_photo.url.startswith('http'):
                return obj.cover_photo.url
            from django.conf import settings
            return f"{settings.BACKEND_URL}{obj.cover_photo.url}"
        return None
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(
                follower=request.user,
                following=obj
            ).exists()
        return False
    
    def get_is_friend(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Friendship.objects.filter(
                models.Q(user1=request.user, user2=obj) |
                models.Q(user1=obj, user2=request.user)
            ).exists()
        return False
    
    def get_friend_request_status(self, obj):
        """Obtener estado de solicitud de amistad"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Verificar si hay solicitud pendiente enviada
            sent_request = FriendRequest.objects.filter(
                sender=request.user,
                receiver=obj,
                status='pending'
            ).first()
            
            # Verificar si hay solicitud pendiente recibida
            received_request = FriendRequest.objects.filter(
                sender=obj,
                receiver=request.user,
                status='pending'
            ).first()
            
            if sent_request:
                return 'sent'
            elif received_request:
                return 'received'
            
        return None


class FollowSerializer(serializers.ModelSerializer):
    """Serializer para seguimientos"""
    follower = UserBasicSerializer(read_only=True)
    following = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['id', 'created_at']


class FriendRequestSerializer(serializers.ModelSerializer):
    """Serializer para solicitudes de amistad"""
    sender = UserBasicSerializer(read_only=True)
    receiver = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'status', 'message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sender', 'created_at', 'updated_at']


class FriendshipSerializer(serializers.ModelSerializer):
    """Serializer para amistades"""
    user1 = UserBasicSerializer(read_only=True)
    user2 = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'created_at']
        read_only_fields = ['id', 'created_at']
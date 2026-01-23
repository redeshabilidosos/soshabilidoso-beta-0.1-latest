from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Reel, ReelComment

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar']
    
    def get_avatar(self, obj):
        """Devolver URL completa del avatar"""
        return obj.get_avatar_url()

class ReelSerializer(serializers.ModelSerializer):
    author = UserBasicSerializer(read_only=True)
    like_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    
    class Meta:
        model = Reel
        fields = [
            'id', 'author', 'video', 'thumbnail', 'caption', 'hashtags',
            'views_count', 'like_count', 'is_liked', 'comment_count', 'share_count',
            'duration', 'created_at', 'is_following'
        ]
        read_only_fields = ['id', 'author', 'views_count', 'share_count', 'created_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_liked_by(request.user)
        return False
    
    def get_comment_count(self, obj):
        return obj.comments.count()
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from apps.users.models import Follow
            return Follow.objects.filter(
                follower=request.user,
                following=obj.author
            ).exists()
        return False

class ReelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reel
        fields = ['video', 'caption', 'hashtags']
    
    def create(self, validated_data):
        request = self.context.get('request')
        reel = Reel.objects.create(
            author=request.user,
            **validated_data
        )
        return reel

class ReelCommentSerializer(serializers.ModelSerializer):
    author = UserBasicSerializer(read_only=True)
    likes_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = ReelComment
        fields = ['id', 'author', 'content', 'parent', 'likes_count', 'is_liked', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_liked_by(request.user)
        return False

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Community, CommunityCategory, CommunityMembership, CommunitySocialLink, CommunityPost, CommunityPostComment

User = get_user_model()


class CommunityCategorySerializer(serializers.ModelSerializer):
    community_count = serializers.ReadOnlyField()
    subcommunity_count = serializers.ReadOnlyField()
    
    class Meta:
        model = CommunityCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'color', 
            'image', 'order', 'community_count', 'subcommunity_count'
        ]

class UserBasicSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']
    
    def get_avatar(self, obj):
        """Devolver URL completa del avatar"""
        return obj.get_avatar_url()

class CommunitySocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunitySocialLink
        fields = ['platform', 'url', 'username']

class CommunityListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados"""
    owner = UserBasicSerializer(read_only=True)
    member_count = serializers.ReadOnlyField()
    subcommunity_count = serializers.ReadOnlyField()
    category_info = serializers.SerializerMethodField()
    is_subcommunity = serializers.ReadOnlyField()
    
    class Meta:
        model = Community
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'type',
            'owner', 'profile_image', 'cover_image', 'member_count',
            'subcommunity_count', 'is_subcommunity', 'category_info',
            'is_verified', 'created_at'
        ]
    
    def get_category_info(self, obj):
        if obj.category_obj:
            return {
                'id': str(obj.category_obj.id),
                'name': obj.category_obj.name,
                'slug': obj.category_obj.slug,
                'icon': obj.category_obj.icon,
                'color': obj.category_obj.color,
            }
        return None


class CommunitySerializer(serializers.ModelSerializer):
    owner = UserBasicSerializer(read_only=True)
    social_links = CommunitySocialLinkSerializer(many=True, read_only=True)
    member_count = serializers.ReadOnlyField()
    post_count = serializers.ReadOnlyField()
    subcommunity_count = serializers.ReadOnlyField()
    is_member = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    is_subcommunity = serializers.ReadOnlyField()
    category_info = serializers.SerializerMethodField()
    parent_info = serializers.SerializerMethodField()
    subcommunities = serializers.SerializerMethodField()
    
    class Meta:
        model = Community
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'type',
            'owner', 'profile_image', 'cover_image', 'location',
            'is_active', 'is_verified', 'member_count', 'post_count',
            'subcommunity_count', 'social_links', 'is_member', 'is_owner',
            'is_subcommunity', 'category_info', 'parent_info', 'subcommunities',
            'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at']
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_member(request.user)
        return False
    
    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_owner(request.user)
        return False
    
    def get_category_info(self, obj):
        if obj.category_obj:
            return {
                'id': str(obj.category_obj.id),
                'name': obj.category_obj.name,
                'slug': obj.category_obj.slug,
                'icon': obj.category_obj.icon,
                'color': obj.category_obj.color,
            }
        return None
    
    def get_parent_info(self, obj):
        if obj.parent:
            return {
                'id': str(obj.parent.id),
                'name': obj.parent.name,
                'slug': obj.parent.slug,
            }
        return None
    
    def get_subcommunities(self, obj):
        subs = obj.subcommunities.filter(is_active=True)[:10]
        return [{
            'id': str(s.id),
            'name': s.name,
            'slug': s.slug,
            'description': s.description[:100] if s.description else '',
            'member_count': s.member_count,
            'profile_image': s.profile_image.url if s.profile_image else None,
        } for s in subs]

class CommunityCreateSerializer(serializers.ModelSerializer):
    social_links = serializers.JSONField(required=False, write_only=True)
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Community.objects.filter(is_active=True, parent__isnull=True),
        required=False,
        allow_null=True,
        write_only=True
    )
    
    class Meta:
        model = Community
        fields = [
            'name', 'description', 'category', 'type', 'location',
            'profile_image', 'cover_image', 'social_links', 'parent'
        ]
    
    def create(self, validated_data):
        social_links_data = validated_data.pop('social_links', {})
        parent = validated_data.pop('parent', None)
        category_slug = validated_data.get('category', '')
        request = self.context.get('request')
        
        # Buscar la categoría por slug y asignarla
        if category_slug:
            try:
                category_obj = CommunityCategory.objects.get(slug=category_slug)
                validated_data['category_obj'] = category_obj
            except CommunityCategory.DoesNotExist:
                # Si no existe la categoría, intentar crearla
                pass
        
        # Si es subcomunidad, heredar la categoría del padre
        if parent:
            validated_data['category_obj'] = parent.category_obj
            validated_data['parent'] = parent
        
        community = Community.objects.create(
            owner=request.user,
            **validated_data
        )
        
        # Crear enlaces sociales
        if social_links_data and isinstance(social_links_data, dict):
            for platform, data in social_links_data.items():
                if data and isinstance(data, str) and data.strip():
                    CommunitySocialLink.objects.create(
                        community=community,
                        platform=platform,
                        url=data if data.startswith('http') else f'https://{data}',
                        username=data.replace('@', '') if platform in ['instagram', 'twitter'] else ''
                    )
        
        # Agregar al propietario como miembro
        CommunityMembership.objects.create(
            community=community,
            user=request.user,
            role='admin'
        )
        
        return community

class CommunityPostCommentSerializer(serializers.ModelSerializer):
    author = UserBasicSerializer(read_only=True)
    like_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityPostComment
        fields = [
            'id', 'content', 'author', 'parent', 'like_count', 
            'is_liked', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_liked_by(request.user)
        return False

class CommunityPostSerializer(serializers.ModelSerializer):
    author = UserBasicSerializer(read_only=True)
    community = serializers.StringRelatedField(read_only=True)
    like_count = serializers.ReadOnlyField()
    comment_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    comments = CommunityPostCommentSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    video_file_url = serializers.SerializerMethodField()
    podcast_file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityPost
        fields = [
            'id', 'community', 'author', 'content', 'post_type',
            'image_url', 'video_file_url', 'podcast_file_url',
            'video_url', 'podcast_url', 'live_url',
            'like_count', 'comment_count', 'is_liked', 'is_pinned',
            'comments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_liked_by(request.user)
        return False
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_video_file_url(self, obj):
        if obj.video:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return None
    
    def get_podcast_file_url(self, obj):
        if obj.podcast:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.podcast.url)
            return obj.podcast.url
        return None

class CommunityPostCreateSerializer(serializers.ModelSerializer):
    content = serializers.CharField(required=False, allow_blank=True, default='')
    image = serializers.ImageField(required=False, write_only=True)
    video = serializers.FileField(required=False, write_only=True)
    podcast = serializers.FileField(required=False, write_only=True)
    
    class Meta:
        model = CommunityPost
        fields = ['content', 'post_type', 'image', 'video', 'podcast']
    
    def create(self, validated_data):
        image = validated_data.pop('image', None)
        video = validated_data.pop('video', None)
        podcast = validated_data.pop('podcast', None)
        
        post = CommunityPost.objects.create(**validated_data)
        
        # Guardar archivos si existen
        if image:
            post.image = image
        if video:
            post.video = video
        if podcast:
            post.podcast = podcast
        
        if image or video or podcast:
            post.save()
        
        return post

class CommunityMembershipSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = CommunityMembership
        fields = ['user', 'role', 'joined_at', 'is_active']
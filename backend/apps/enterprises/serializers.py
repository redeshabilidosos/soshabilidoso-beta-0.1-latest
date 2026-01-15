"""
Serializers para Empresas
"""
from rest_framework import serializers
from .models import Enterprise, EnterpriseFollow


class EnterpriseSerializer(serializers.ModelSerializer):
    """Serializer para empresas"""
    
    logo_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = Enterprise
        fields = [
            'id',
            'owner',
            'owner_username',
            'name',
            'username',
            'tagline',
            'description',
            'logo',
            'logo_url',
            'cover_image',
            'cover_image_url',
            'category',
            'industry',
            'location',
            'website',
            'email',
            'phone',
            'founded_year',
            'employees_count',
            'social_links',
            'followers_count',
            'posts_count',
            'is_verified',
            'is_featured',
            'is_active',
            'created_at',
            'is_following',
            'is_owner',
        ]
        read_only_fields = [
            'id', 'owner', 'followers_count', 'posts_count',
            'is_verified', 'is_featured', 'created_at'
        ]
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return obj.get_logo_url()
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return EnterpriseFollow.objects.filter(
                user=request.user,
                enterprise=obj
            ).exists()
        return False
    
    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.owner == request.user
        return False


class EnterpriseCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear empresas"""
    
    class Meta:
        model = Enterprise
        fields = [
            'name',
            'username',
            'tagline',
            'description',
            'category',
            'industry',
            'location',
            'website',
            'email',
            'phone',
            'founded_year',
            'employees_count',
        ]
    
    def validate_username(self, value):
        """Validar username único"""
        if Enterprise.objects.filter(username=value.lower()).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value.lower()
    
    def create(self, validated_data):
        """Crear empresa con el usuario actual como propietario"""
        request = self.context.get('request')
        validated_data['owner'] = request.user
        return super().create(validated_data)


class EnterpriseListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    
    logo_url = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    
    class Meta:
        model = Enterprise
        fields = [
            'id',
            'name',
            'username',
            'tagline',
            'logo_url',
            'category',
            'industry',
            'location',
            'followers_count',
            'is_verified',
            'is_following',
        ]
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return obj.get_logo_url()
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return EnterpriseFollow.objects.filter(
                user=request.user,
                enterprise=obj
            ).exists()
        return False

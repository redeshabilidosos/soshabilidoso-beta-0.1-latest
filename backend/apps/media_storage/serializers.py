"""
Serializers para Media Storage
"""
from rest_framework import serializers
from .models import MediaFile, MediaAlbum


class MediaFileSerializer(serializers.ModelSerializer):
    """Serializer para archivos multimedia"""
    
    file_url = serializers.SerializerMethodField()
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    
    class Meta:
        model = MediaFile
        fields = [
            'id',
            'file',
            'file_url',
            'file_type',
            'original_name',
            'file_size',
            'mime_type',
            'width',
            'height',
            'duration',
            'uploaded_by',
            'uploaded_by_username',
            'is_public',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'uploaded_by']
    
    def get_file_url(self, obj):
        """Obtener URL absoluta del archivo"""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            from django.conf import settings
            backend_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
            return f"{backend_url}{obj.file.url}"
        return None


class MediaAlbumSerializer(serializers.ModelSerializer):
    """Serializer para álbumes multimedia"""
    
    files = MediaFileSerializer(many=True, read_only=True)
    file_count = serializers.IntegerField(read_only=True)
    cover_image = serializers.SerializerMethodField()
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = MediaAlbum
        fields = [
            'id',
            'name',
            'description',
            'files',
            'file_count',
            'cover_image',
            'owner',
            'owner_username',
            'is_public',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']
    
    def get_cover_image(self, obj):
        """Obtener URL de la imagen de portada"""
        image = obj.files.filter(file_type='image').order_by('-created_at').first()
        if image and image.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.file.url)
            from django.conf import settings
            backend_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
            return f"{backend_url}{image.file.url}"
        return None


class MediaAlbumListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar álbumes"""
    
    file_count = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaAlbum
        fields = [
            'id',
            'name',
            'description',
            'file_count',
            'cover_image',
            'is_public',
            'created_at',
        ]
    
    def get_file_count(self, obj):
        return obj.files.count()
    
    def get_cover_image(self, obj):
        """Obtener URL de la imagen de portada"""
        image = obj.files.filter(file_type='image').order_by('-created_at').first()
        if image and image.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.file.url)
            from django.conf import settings
            backend_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
            return f"{backend_url}{image.file.url}"
        return None

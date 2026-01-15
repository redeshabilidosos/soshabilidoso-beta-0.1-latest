"""
Serializers para Clasificados
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    ProductClassified, ServiceClassified, FreelancerClassified,
    ClassifiedLike, ClassifiedView, ClassifiedContact, ClassifiedReport, ServiceReview
)

User = get_user_model()


class UserMiniSerializer(serializers.ModelSerializer):
    """Serializer mínimo para usuario"""
    avatar = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    verified = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'rating', 'verified']
    
    def get_avatar(self, obj):
        if hasattr(obj, 'avatar') and obj.avatar:
            return obj.avatar.url if hasattr(obj.avatar, 'url') else str(obj.avatar)
        return None
    
    def get_rating(self, obj):
        return 4.8  # TODO: Calcular rating real
    
    def get_verified(self, obj):
        return getattr(obj, 'is_verified', False)


class ProductClassifiedSerializer(serializers.ModelSerializer):
    """Serializer para productos físicos"""
    seller = UserMiniSerializer(source='user', read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductClassified
        fields = [
            'id', 'short_id', 'title', 'description', 'price', 'currency', 'negotiable',
            'location', 'latitude', 'longitude', 'images', 'status', 'is_featured',
            'views_count', 'likes_count', 'contacts_count', 'tags',
            'category', 'condition', 'brand', 'model',
            'delivery_available', 'delivery_cost', 'pickup_available',
            'created_at', 'updated_at', 'expires_at', 'seller', 'is_liked'
        ]
        read_only_fields = ['id', 'short_id', 'views_count', 'likes_count', 'contacts_count', 'created_at', 'updated_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ClassifiedLike.objects.filter(
                user=request.user,
                classified_type='product',
                classified_id=obj.id
            ).exists()
        return False


class ProductClassifiedCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear productos"""
    
    class Meta:
        model = ProductClassified
        fields = [
            'title', 'description', 'price', 'currency', 'negotiable',
            'location', 'latitude', 'longitude', 'images', 'tags',
            'category', 'condition', 'brand', 'model',
            'delivery_available', 'delivery_cost', 'pickup_available'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ServiceClassifiedSerializer(serializers.ModelSerializer):
    """Serializer para servicios marketplace"""
    seller = UserMiniSerializer(source='user', read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceClassified
        fields = [
            'id', 'short_id', 'title', 'description', 'price', 'currency', 'negotiable',
            'location', 'latitude', 'longitude', 'images', 'status', 'is_featured',
            'views_count', 'likes_count', 'contacts_count', 'tags',
            'category', 'availability', 'typical_duration', 'coverage_area',
            'coverage_radius_km', 'price_type', 'rating', 'reviews_count', 'instant_booking',
            'created_at', 'updated_at', 'expires_at', 'seller', 'is_liked'
        ]
        read_only_fields = ['id', 'short_id', 'views_count', 'likes_count', 'contacts_count', 'rating', 'reviews_count', 'created_at', 'updated_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ClassifiedLike.objects.filter(
                user=request.user,
                classified_type='service',
                classified_id=obj.id
            ).exists()
        return False


class ServiceClassifiedCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear servicios"""
    
    class Meta:
        model = ServiceClassified
        fields = [
            'title', 'description', 'price', 'currency', 'negotiable',
            'location', 'latitude', 'longitude', 'images', 'tags',
            'category', 'availability', 'typical_duration', 'coverage_area',
            'coverage_radius_km', 'price_type', 'instant_booking'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class FreelancerClassifiedSerializer(serializers.ModelSerializer):
    """Serializer para trabajos freelancer"""
    seller = UserMiniSerializer(source='user', read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = FreelancerClassified
        fields = [
            'id', 'short_id', 'title', 'description', 'price', 'currency', 'negotiable',
            'location', 'latitude', 'longitude', 'images', 'status', 'is_featured',
            'views_count', 'likes_count', 'contacts_count', 'tags',
            'category', 'skills', 'portfolio_url', 'portfolio_images',
            'delivery_time', 'project_type', 'years_experience',
            'rating', 'reviews_count', 'completed_projects',
            'created_at', 'updated_at', 'expires_at', 'seller', 'is_liked'
        ]
        read_only_fields = ['id', 'short_id', 'views_count', 'likes_count', 'contacts_count', 'rating', 'reviews_count', 'completed_projects', 'created_at', 'updated_at']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ClassifiedLike.objects.filter(
                user=request.user,
                classified_type='freelancer',
                classified_id=obj.id
            ).exists()
        return False


class FreelancerClassifiedCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear trabajos freelancer"""
    
    class Meta:
        model = FreelancerClassified
        fields = [
            'title', 'description', 'price', 'currency', 'negotiable',
            'location', 'latitude', 'longitude', 'images', 'tags',
            'category', 'skills', 'portfolio_url', 'portfolio_images',
            'delivery_time', 'project_type', 'years_experience'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ClassifiedContactSerializer(serializers.ModelSerializer):
    """Serializer para contactos"""
    sender = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = ClassifiedContact
        fields = ['id', 'sender', 'classified_type', 'classified_id', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']


class ServiceReviewSerializer(serializers.ModelSerializer):
    """Serializer para reseñas"""
    reviewer = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = ServiceReview
        fields = ['id', 'reviewer', 'classified_type', 'classified_id', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'reviewer', 'created_at']


class ClassifiedReportSerializer(serializers.ModelSerializer):
    """Serializer para reportes"""
    
    class Meta:
        model = ClassifiedReport
        fields = ['id', 'classified_type', 'classified_id', 'reason', 'description', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

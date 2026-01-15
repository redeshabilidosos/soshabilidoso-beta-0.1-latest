"""
Serializers para el sistema de publicidad
"""
from rest_framework import serializers
from .models import Advertisement, AdImpression, AdClick, AdVideoView


class AdvertisementSerializer(serializers.ModelSerializer):
    """Serializer para anuncios (vista pública)"""
    ctr = serializers.ReadOnlyField()
    is_currently_active = serializers.ReadOnlyField()
    media_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Advertisement
        fields = [
            'id', 'title', 'description', 'advertiser_name', 'advertiser_logo',
            'ad_type', 'position', 'image', 'video', 'video_url', 'carousel_images',
            'link_url', 'call_to_action', 'is_currently_active', 'ctr', 'media_url'
        ]
    
    def get_media_url(self, obj):
        """Obtener URL del medio principal"""
        request = self.context.get('request')
        if obj.ad_type == 'video':
            if obj.video:
                return request.build_absolute_uri(obj.video.url) if request else obj.video.url
            return obj.video_url
        elif obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class AdvertisementAdminSerializer(serializers.ModelSerializer):
    """Serializer completo para administración"""
    ctr = serializers.ReadOnlyField()
    conversion_rate = serializers.ReadOnlyField()
    video_completion_rate = serializers.ReadOnlyField()
    is_currently_active = serializers.ReadOnlyField()
    budget_remaining = serializers.ReadOnlyField()
    
    class Meta:
        model = Advertisement
        fields = '__all__'
        read_only_fields = [
            'id', 'impressions', 'clicks', 'unique_views', 'conversions',
            'total_spent', 'video_views', 'video_completions',
            'created_at', 'updated_at', 'approved_at'
        ]


class AdForFeedSerializer(serializers.ModelSerializer):
    """Serializer optimizado para mostrar en el feed"""
    media_url = serializers.SerializerMethodField()
    advertiser_logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Advertisement
        fields = [
            'id', 'title', 'description', 'advertiser_name', 
            'ad_type', 'media_url', 'advertiser_logo_url',
            'link_url', 'call_to_action', 'carousel_images'
        ]
    
    def get_media_url(self, obj):
        request = self.context.get('request')
        if obj.ad_type == 'video':
            if obj.video:
                return request.build_absolute_uri(obj.video.url) if request else obj.video.url
            return obj.video_url
        elif obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None
    
    def get_advertiser_logo_url(self, obj):
        request = self.context.get('request')
        if obj.advertiser_logo:
            return request.build_absolute_uri(obj.advertiser_logo.url) if request else obj.advertiser_logo.url
        return None


class AdImpressionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdImpression
        fields = ['id', 'ad', 'position_in_feed', 'viewed_at']
        read_only_fields = ['id', 'viewed_at']


class AdClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdClick
        fields = ['id', 'ad', 'clicked_at']
        read_only_fields = ['id', 'clicked_at']


class AdVideoViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdVideoView
        fields = ['id', 'ad', 'watch_duration', 'video_duration', 'completed', 'viewed_at']
        read_only_fields = ['id', 'viewed_at']


class AdStatsSerializer(serializers.Serializer):
    """Serializer para estadísticas de anuncios"""
    total_ads = serializers.IntegerField()
    active_ads = serializers.IntegerField()
    total_impressions = serializers.IntegerField()
    total_clicks = serializers.IntegerField()
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2)
    average_ctr = serializers.FloatField()

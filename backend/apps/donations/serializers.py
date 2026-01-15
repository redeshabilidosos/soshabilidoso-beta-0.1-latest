"""
Serializers para el sistema de donaciones
"""
from rest_framework import serializers
from .models import SportCategory, AthleteProfile, AthleteMedia, Donation


class SportCategorySerializer(serializers.ModelSerializer):
    """Serializer para categorías de deportes"""
    
    athletes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SportCategory
        fields = ['id', 'name', 'slug', 'icon', 'description', 'athletes_count']
    
    def get_athletes_count(self, obj):
        return obj.athletes.filter(status='approved').count()


class AthleteMediaSerializer(serializers.ModelSerializer):
    """Serializer para medios del deportista"""
    
    url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AthleteMedia
        fields = [
            'id', 'media_type', 'url', 'thumbnail_url',
            'title', 'description', 'order', 'is_cover'
        ]
    
    def get_url(self, obj):
        return obj.get_url()
    
    def get_thumbnail_url(self, obj):
        return obj.get_thumbnail_url()


class AthleteProfileListSerializer(serializers.ModelSerializer):
    """Serializer para listado de deportistas"""
    
    sport_name = serializers.CharField(source='sport.name', read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    cover_image = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = AthleteProfile
        fields = [
            'id', 'full_name', 'age', 'height', 'city', 'country',
            'sport', 'sport_name', 'position', 'team',
            'description', 'goal_amount', 'raised_amount',
            'donors_count', 'progress_percentage',
            'is_verified', 'is_featured',
            'cover_image', 'avatar', 'created_at'
        ]
    
    def get_cover_image(self, obj):
        cover = obj.media.filter(is_cover=True).first()
        if cover:
            return cover.get_url()
        first_media = obj.media.first()
        if first_media:
            return first_media.get_url()
        return None
    
    def get_avatar(self, obj):
        if obj.user:
            return obj.user.get_avatar_url()
        return None


class AthleteProfileDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado para perfil de deportista"""
    
    sport = SportCategorySerializer(read_only=True)
    sport_id = serializers.UUIDField(write_only=True, required=False)
    media = AthleteMediaSerializer(many=True, read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    avatar = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = AthleteProfile
        fields = [
            'id', 'user', 'full_name', 'age', 'height', 'weight',
            'city', 'country', 'sport', 'sport_id', 'position', 'team',
            'experience_years', 'achievements', 'description',
            'goal_description', 'goal_amount', 'raised_amount',
            'donors_count', 'progress_percentage',
            'status', 'is_verified', 'is_featured',
            'media', 'avatar', 'username',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'raised_amount', 'donors_count', 'status']
    
    def get_avatar(self, obj):
        if obj.user:
            return obj.user.get_avatar_url()
        return None
    
    def get_username(self, obj):
        if obj.user:
            return obj.user.username
        return None


class AthleteProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear perfil de deportista"""
    
    sport_id = serializers.UUIDField(required=True)
    
    class Meta:
        model = AthleteProfile
        fields = [
            'full_name', 'age', 'height', 'weight', 'city', 'country',
            'sport_id', 'position', 'team', 'experience_years',
            'achievements', 'description', 'goal_description', 'goal_amount'
        ]
    
    def create(self, validated_data):
        sport_id = validated_data.pop('sport_id')
        sport = SportCategory.objects.get(id=sport_id)
        validated_data['sport'] = sport
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DonationSerializer(serializers.ModelSerializer):
    """Serializer para donaciones"""
    
    donor_display_name = serializers.SerializerMethodField()
    athlete_name = serializers.CharField(source='athlete.full_name', read_only=True)
    
    class Meta:
        model = Donation
        fields = [
            'id', 'athlete', 'athlete_name', 'donor', 'donor_display_name',
            'donor_name', 'donor_email', 'is_anonymous',
            'amount', 'payment_method', 'status', 'message',
            'created_at', 'completed_at'
        ]
        read_only_fields = ['donor', 'status', 'completed_at']
    
    def get_donor_display_name(self, obj):
        if obj.is_anonymous:
            return 'Anónimo'
        if obj.donor:
            return obj.donor.display_name
        return obj.donor_name or 'Anónimo'


class DonationCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear donaciones"""
    
    class Meta:
        model = Donation
        fields = [
            'athlete', 'amount', 'payment_method',
            'donor_name', 'donor_email', 'is_anonymous', 'message'
        ]
    
    def validate_amount(self, value):
        if value < 1000:
            raise serializers.ValidationError(
                'El monto mínimo de donación es $1,000 COP'
            )
        return value
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['donor'] = request.user
        return super().create(validated_data)


class AthleteMediaUploadSerializer(serializers.ModelSerializer):
    """Serializer para subir medios"""
    
    class Meta:
        model = AthleteMedia
        fields = ['file', 'media_type', 'title', 'description', 'order', 'is_cover']
    
    def create(self, validated_data):
        athlete_id = self.context.get('athlete_id')
        athlete = AthleteProfile.objects.get(id=athlete_id)
        validated_data['athlete'] = athlete
        return super().create(validated_data)

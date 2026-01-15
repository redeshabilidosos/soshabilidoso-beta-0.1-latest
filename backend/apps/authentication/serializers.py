"""
Serializers para autenticación
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import models
import re

User = get_user_model()


class CustomTokenObtainPairSerializer(serializers.Serializer):
    """Serializer personalizado para obtener tokens JWT con email o username"""
    
    login = serializers.CharField(required=True, help_text='Ingresa tu email o nombre de usuario')
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        # Obtener el valor de login (puede ser email o username)
        login_value = attrs.get('login')
        password = attrs.get('password')
        
        print(f"DEBUG SERIALIZER: Received data - {attrs}")
        print(f"DEBUG: Login attempt - login_value={login_value}, password={'*' * len(password) if password else 'None'}")
        
        if not login_value or not password:
            print(f"DEBUG: Missing credentials - login_value={login_value}, password={password}")
            raise serializers.ValidationError('Debe proporcionar email/username y contraseña.')
        
        # Intentar encontrar el usuario por email o username
        user = None
        
        # Primero intentar por email
        if '@' in login_value:
            try:
                user = User.objects.get(email=login_value.lower())
                print(f"DEBUG: User found by email: {user.username}")
            except User.DoesNotExist:
                print(f"DEBUG: User not found by email: {login_value}")
                pass
        
        # Si no se encontró por email, intentar por username
        if not user:
            try:
                user = User.objects.get(username=login_value.lower())
                print(f"DEBUG: User found by username: {user.username}")
            except User.DoesNotExist:
                print(f"DEBUG: User not found by username: {login_value}")
                pass
        
        # Si no se encontró el usuario
        if not user:
            print(f"DEBUG: User not found for login_value: {login_value}")
            raise serializers.ValidationError('Credenciales inválidas.')
        
        # Verificar la contraseña
        if not user.check_password(password):
            print(f"DEBUG: Invalid password for user: {user.username}")
            raise serializers.ValidationError('Credenciales inválidas.')
        
        # Verificar si el usuario está activo
        if not user.is_active:
            print(f"DEBUG: User is not active: {user.username}")
            raise serializers.ValidationError('Esta cuenta está desactivada.')
        
        print(f"DEBUG: Login successful for user: {user.username}")
        
        # Generar tokens
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        # Agregar claims personalizados al token
        refresh.access_token['username'] = user.username
        refresh.access_token['display_name'] = user.display_name
        refresh.access_token['is_verified'] = user.is_verified
        
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        # Agregar información del usuario al response usando el serializer completo
        user_serializer = UserProfileSerializer(user, context=self.context)
        data['user'] = user_serializer.data
        
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer para registro de usuarios"""
    
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'email',
            'username', 
            'display_name',
            'password',
            'password_confirm',
            'position',
            'team',
            'bio',
            'contact_number',
            'account_type',
            'company_name',
            'industry',
            'website',
        ]
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'display_name': {'required': True},
            'account_type': {'required': False},
            'company_name': {'required': False},
            'industry': {'required': False},
            'website': {'required': False},
        }
    
    def validate_email(self, value):
        """Validar email único"""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value.lower()
    
    def validate_username(self, value):
        """Validar username único y formato"""
        if User.objects.filter(username=value.lower()).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        
        # Validar formato del username
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError(
                "El nombre de usuario solo puede contener letras, números y guiones bajos."
            )
        
        # Validar longitud mínima
        if len(value) < 3:
            raise serializers.ValidationError(
                "El nombre de usuario debe tener al menos 3 caracteres."
            )
        
        return value.lower()
    
    def validate_display_name(self, value):
        """Validar nombre para mostrar"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "El nombre para mostrar debe tener al menos 2 caracteres."
            )
        return value.strip()
    
    def validate(self, attrs):
        """Validaciones generales"""
        # Validar que las contraseñas coincidan
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        
        # Validar fortaleza de la contraseña
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })
        
        return attrs
    
    def create(self, validated_data):
        """Crear nuevo usuario"""
        # Remover password_confirm del dict
        validated_data.pop('password_confirm')
        
        # Crear usuario
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            display_name=validated_data['display_name'],
            password=validated_data['password'],
            position=validated_data.get('position', ''),
            team=validated_data.get('team', ''),
            bio=validated_data.get('bio', ''),
            contact_number=validated_data.get('contact_number', ''),
            account_type=validated_data.get('account_type', 'user'),
            company_name=validated_data.get('company_name', ''),
            industry=validated_data.get('industry', ''),
            website=validated_data.get('website', ''),
        )
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para perfil de usuario"""
    
    avatar = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    cover_photo_url = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'display_name',
            'full_name',
            'avatar',
            'avatar_url',
            'cover_photo',
            'cover_photo_url',
            'bio',
            'position',
            'team',
            'contact_number',
            'interests',
            'social_links',
            'followers_count',
            'following_count',
            'posts_count',
            'is_verified',
            'is_private',
            'show_email',
            'show_phone',
            'created_at',
            'last_active',
            'account_type',
            'company_name',
            'industry',
            'website',
        ]
        read_only_fields = [
            'id',
            'email',
            'username',
            'is_verified',
            'created_at',
            'last_active',
        ]
        extra_kwargs = {
            'avatar': {'required': False},
            'cover_photo': {'required': False},
        }
    
    def get_avatar(self, obj):
        """Devolver URL completa del avatar"""
        if obj.avatar:
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.avatar.url)
                # Fallback: construir URL manualmente
                from django.conf import settings
                backend_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
                if obj.avatar.url.startswith('http'):
                    return obj.avatar.url
                return f"{backend_url}{obj.avatar.url}"
            except Exception as e:
                print(f"Error obteniendo avatar: {e}")
        return obj.get_avatar_url()
    
    def get_avatar_url(self, obj):
        """Devolver URL completa del avatar (alias)"""
        return self.get_avatar(obj)
    
    def get_cover_photo(self, obj):
        """Devolver URL completa de la foto de portada"""
        if obj.cover_photo:
            if obj.cover_photo.url.startswith('http'):
                return obj.cover_photo.url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_photo.url)
            from django.conf import settings
            return f"{settings.BACKEND_URL}{obj.cover_photo.url}"
        return None
    
    def get_cover_photo_url(self, obj):
        if obj.cover_photo:
            if obj.cover_photo.url.startswith('http'):
                return obj.cover_photo.url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_photo.url)
            from django.conf import settings
            return f"{settings.BACKEND_URL}{obj.cover_photo.url}"
        return None
    
    def get_full_name(self, obj):
        return obj.full_name
    
    def get_followers_count(self, obj):
        """Obtener cantidad de seguidores"""
        try:
            from apps.users.models import Follow
            return Follow.objects.filter(following=obj).count()
        except:
            return 0
    
    def get_following_count(self, obj):
        """Obtener cantidad de usuarios que sigue"""
        try:
            from apps.users.models import Follow
            return Follow.objects.filter(follower=obj).count()
        except:
            return 0
    
    def get_posts_count(self, obj):
        """Obtener cantidad de posts"""
        from apps.posts.models import Post
        return Post.objects.filter(user=obj).count()


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer para cambio de contraseña"""
    
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)
    
    def validate_current_password(self, value):
        """Validar contraseña actual"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        return value
    
    def validate(self, attrs):
        """Validar que las nuevas contraseñas coincidan"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden.'
            })
        
        # Validar fortaleza de la nueva contraseña
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                'new_password': list(e.messages)
            })
        
        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer para solicitar reset de contraseña"""
    
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer para confirmar reset de contraseña"""
    
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        """Validar token y contraseñas"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden.'
            })
        
        # Validar fortaleza de la contraseña
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                'new_password': list(e.messages)
            })
        
        return attrs
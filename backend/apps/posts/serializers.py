"""
Serializers para posts y interacciones
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Post, PostReaction, Comment, CommentLike
from apps.authentication.serializers import UserProfileSerializer

User = get_user_model()


class PostReactionSerializer(serializers.ModelSerializer):
    """Serializer para reacciones de posts"""
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = PostReaction
        fields = ['id', 'user', 'reaction_type', 'created_at']
        read_only_fields = ['id', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer para comentarios"""
    user = UserProfileSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'content', 'image', 'likes_count', 'replies_count',
            'is_edited', 'created_at', 'updated_at', 'replies', 'is_liked'
        ]
        read_only_fields = ['id', 'likes_count', 'replies_count', 'created_at', 'updated_at']
    
    def get_replies(self, obj):
        """Obtener respuestas del comentario"""
        if obj.replies.exists():
            return CommentSerializer(
                obj.replies.all()[:3],  # Solo las primeras 3 respuestas
                many=True,
                context=self.context
            ).data
        return []
    
    def get_is_liked(self, obj):
        """Verificar si el usuario actual ha dado like"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CommentLike.objects.filter(
                user=request.user,
                comment=obj
            ).exists()
        return False


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear comentarios"""
    
    class Meta:
        model = Comment
        fields = ['content', 'image', 'parent']
    
    def validate_content(self, value):
        """Validar contenido del comentario"""
        if not value.strip():
            raise serializers.ValidationError("El comentario no puede estar vacío")
        return value.strip()


class PostSerializer(serializers.ModelSerializer):
    """Serializer para posts"""
    user = UserProfileSerializer(read_only=True)
    reactions = PostReactionSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    # Alias para compatibilidad con frontend
    laughs_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'short_id', 'user', 'content', 'images', 'video', 'thumbnail',
            'podcast_url', 'streaming_url', 'post_type', 'category',
            'likes_count', 'celebrations_count', 'golazos_count',
            'laughs_count', 'dislikes_count',  # Alias para frontend
            'comments_count', 'shares_count', 'views_count',
            'is_pinned', 'allow_comments', 'is_public',
            'created_at', 'updated_at', 'reactions', 'comments',
            'user_reaction', 'is_bookmarked'
        ]
        read_only_fields = [
            'id', 'short_id', 'likes_count', 'celebrations_count', 'golazos_count',
            'comments_count', 'shares_count', 'views_count', 'created_at', 'updated_at'
        ]
    
    def get_laughs_count(self, obj):
        """Alias de celebrations_count para frontend"""
        return obj.celebrations_count
    
    def get_dislikes_count(self, obj):
        """Alias de golazos_count para frontend"""
        return obj.golazos_count
    
    def get_comments(self, obj):
        """Obtener comentarios principales del post"""
        main_comments = obj.comments.filter(parent=None)[:5]  # Solo los primeros 5
        return CommentSerializer(
            main_comments,
            many=True,
            context=self.context
        ).data
    
    def get_user_reaction(self, obj):
        """Obtener reacción del usuario actual"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = PostReaction.objects.filter(
                user=request.user,
                post=obj
            ).first()
            if reaction:
                # Mapear tipos del backend a tipos del frontend
                type_mapping = {
                    'like': 'like',
                    'celebration': 'laugh',
                    'golazo': 'dislike',
                }
                return type_mapping.get(reaction.reaction_type, reaction.reaction_type)
        return None
    
    def get_is_bookmarked(self, obj):
        """Verificar si el post está en favoritos del usuario"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from .models import PostBookmark
            return PostBookmark.objects.filter(
                user=request.user,
                post=obj
            ).exists()
        return False
    
    def to_representation(self, instance):
        """Convertir instancia a representación JSON con manejo de errores"""
        try:
            data = super().to_representation(instance)
            # Asegurar que comments_count refleje el número real de comentarios
            data['comments_count'] = instance.comments.count()
            return data
        except Exception as e:
            print(f"❌ Error en to_representation: {str(e)}")
            import traceback
            traceback.print_exc()
            # Devolver una representación mínima si hay error
            return {
                'id': str(instance.id),
                'short_id': instance.short_id,
                'content': instance.content,
                'post_type': instance.post_type,
                'created_at': instance.created_at.isoformat(),
                'comments_count': instance.comments.count(),
                'error': str(e)
            }


class PostCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear posts"""
    image = serializers.ImageField(write_only=True, required=False)
    
    class Meta:
        model = Post
        fields = [
            'content', 'images', 'image', 'video', 'thumbnail', 'podcast_url',
            'streaming_url', 'post_type', 'category', 'allow_comments', 'is_public'
        ]
    
    def validate_content(self, value):
        """Validar contenido del post"""
        # Permitir contenido vacío si hay imagen o video
        if value is None:
            return ''
        return value.strip()
    
    def validate(self, attrs):
        """Validaciones generales"""
        post_type = attrs.get('post_type', 'text')
        
        # Validar según el tipo de post
        if post_type == 'podcast' and not attrs.get('podcast_url'):
            raise serializers.ValidationError({
                'podcast_url': 'URL del podcast es requerida para posts de tipo podcast'
            })
        
        if post_type == 'streaming' and not attrs.get('streaming_url'):
            raise serializers.ValidationError({
                'streaming_url': 'URL del streaming es requerida para posts de tipo streaming'
            })
        
        return attrs
    
    def create(self, validated_data):
        """Crear post y manejar subida de imagen"""
        print(f"📝 Datos recibidos en serializer: {validated_data.keys()}")
        
        image_file = validated_data.pop('image', None)
        print(f"📷 Archivo de imagen: {image_file}")
        
        # Crear el post
        post = super().create(validated_data)
        print(f"✅ Post creado con ID: {post.id}")
        
        # Si hay una imagen, guardarla y agregar la URL al campo images
        if image_file:
            print(f"📁 Procesando imagen: {image_file.name}, tamaño: {image_file.size} bytes")
            
            # Guardar la imagen en el sistema de archivos
            from django.core.files.storage import default_storage
            import os
            from datetime import datetime
            
            # Crear directorio si no existe
            posts_dir = os.path.join('media', 'posts')
            os.makedirs(posts_dir, exist_ok=True)
            print(f"📂 Directorio creado/verificado: {posts_dir}")
            
            # Generar nombre único para el archivo
            ext = os.path.splitext(image_file.name)[1]
            filename = f"posts/{post.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
            print(f"📝 Nombre de archivo: {filename}")
            
            # Guardar el archivo
            path = default_storage.save(filename, image_file)
            print(f"💾 Archivo guardado en: {path}")
            
            # Obtener la URL completa (absoluta si hay request en el contexto)
            request = self.context.get('request')
            if request:
                image_url = request.build_absolute_uri(f"/media/{path}")
            else:
                from django.conf import settings
                image_url = f"{settings.MEDIA_URL}{path}"
            
            print(f"🔗 URL de imagen: {image_url}")
            
            # Agregar la URL al campo images
            try:
                if post.images is None:
                    post.images = []
                elif not isinstance(post.images, list):
                    post.images = []
                
                post.images.append(image_url)
                post.save()
                print(f"✅ Imagen guardada exitosamente. Array images: {post.images}")
            except Exception as e:
                print(f"❌ Error al guardar imagen: {str(e)}")
                raise serializers.ValidationError(f"Error al procesar la imagen: {str(e)}")
        else:
            print(f"⚠️ No se recibió archivo de imagen")
        
        return post
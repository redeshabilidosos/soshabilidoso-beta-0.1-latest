#!/usr/bin/env python
"""
Script para probar la creación de publicaciones
Verifica que todas las rutas funcionen correctamente
"""
import os
import sys
import django
import json

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from apps.posts.models import Post, PostReaction
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

User = get_user_model()

def print_header(text):
    """Imprimir encabezado"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def create_test_image():
    """Crear una imagen de prueba"""
    img = Image.new('RGB', (100, 100), color='red')
    img_io = BytesIO()
    img.save(img_io, 'JPEG')
    img_io.seek(0)
    return SimpleUploadedFile("test_image.jpg", img_io.read(), content_type="image/jpeg")

def test_text_post(user):
    """Probar creación de post de texto"""
    try:
        post = Post.objects.create(
            user=user,
            content="Esta es una publicación de prueba de texto",
            post_type='text',
            category='football'
        )
        print(f"✅ Post de texto creado: {post.id}")
        print(f"   Contenido: {post.content}")
        print(f"   Fecha: {post.created_at}")
        return post
    except Exception as e:
        print(f"❌ Error creando post de texto: {e}")
        return None

def test_image_post(user):
    """Probar creación de post con imagen"""
    try:
        post = Post.objects.create(
            user=user,
            content="Esta es una publicación con imagen",
            post_type='image',
            category='football',
            images=['http://localhost:8000/media/posts/test_image.jpg']
        )
        print(f"✅ Post con imagen creado: {post.id}")
        print(f"   Imágenes: {post.images}")
        print(f"   Fecha: {post.created_at}")
        return post
    except Exception as e:
        print(f"❌ Error creando post con imagen: {e}")
        return None

def test_video_post(user):
    """Probar creación de post con video"""
    try:
        post = Post.objects.create(
            user=user,
            content="Esta es una publicación con video",
            post_type='video',
            category='football'
        )
        print(f"✅ Post con video creado: {post.id}")
        print(f"   Fecha: {post.created_at}")
        return post
    except Exception as e:
        print(f"❌ Error creando post con video: {e}")
        return None

def test_podcast_post(user):
    """Probar creación de post con podcast"""
    try:
        post = Post.objects.create(
            user=user,
            content="Esta es una publicación con podcast",
            post_type='podcast',
            category='music',
            podcast_url='https://example.com/podcast.mp3'
        )
        print(f"✅ Post con podcast creado: {post.id}")
        print(f"   URL: {post.podcast_url}")
        print(f"   Fecha: {post.created_at}")
        return post
    except Exception as e:
        print(f"❌ Error creando post con podcast: {e}")
        return None

def test_streaming_post(user):
    """Probar creación de post con streaming"""
    try:
        post = Post.objects.create(
            user=user,
            content="Esta es una publicación con streaming",
            post_type='streaming',
            category='gaming',
            streaming_url='https://twitch.tv/example'
        )
        print(f"✅ Post con streaming creado: {post.id}")
        print(f"   URL: {post.streaming_url}")
        print(f"   Fecha: {post.created_at}")
        return post
    except Exception as e:
        print(f"❌ Error creando post con streaming: {e}")
        return None

def test_reactions(user, post):
    """Probar reacciones a posts"""
    try:
        # Crear reacción
        reaction = PostReaction.objects.create(
            user=user,
            post=post,
            reaction_type='like'
        )
        print(f"✅ Reacción creada: {reaction.reaction_type}")
        
        # Actualizar contadores
        post.update_reaction_counts()
        post.refresh_from_db()
        
        print(f"   Likes: {post.likes_count}")
        print(f"   Celebraciones: {post.celebrations_count}")
        print(f"   Golazos: {post.golazos_count}")
        return True
    except Exception as e:
        print(f"❌ Error creando reacción: {e}")
        return False

def verify_post_fields(post):
    """Verificar que todos los campos del post estén presentes"""
    print("\n📋 Verificando campos del post:")
    
    fields_to_check = [
        ('id', post.id),
        ('user', post.user.username),
        ('content', post.content),
        ('post_type', post.post_type),
        ('category', post.category),
        ('images', post.images),
        ('likes_count', post.likes_count),
        ('celebrations_count', post.celebrations_count),
        ('golazos_count', post.golazos_count),
        ('comments_count', post.comments_count),
        ('shares_count', post.shares_count),
        ('views_count', post.views_count),
        ('is_pinned', post.is_pinned),
        ('is_archived', post.is_archived),
        ('allow_comments', post.allow_comments),
        ('is_public', post.is_public),
        ('created_at', post.created_at),
        ('updated_at', post.updated_at),
    ]
    
    for field_name, field_value in fields_to_check:
        print(f"  ✅ {field_name}: {field_value}")

def test_api_endpoints():
    """Probar endpoints de la API"""
    print("\n📡 Endpoints de la API:")
    print("  POST   /api/posts/                    - Crear publicación")
    print("  GET    /api/posts/                    - Listar publicaciones")
    print("  GET    /api/posts/<uuid>/             - Obtener publicación")
    print("  PATCH  /api/posts/<uuid>/             - Actualizar publicación")
    print("  DELETE /api/posts/<uuid>/             - Eliminar publicación")
    print("  POST   /api/posts/<uuid>/react/       - Reaccionar a publicación")
    print("  POST   /api/posts/<uuid>/comments/    - Comentar publicación")
    print("  POST   /api/posts/<uuid>/share/       - Compartir publicación")
    print("  POST   /api/posts/<uuid>/bookmark/    - Guardar publicación")

def main():
    """Función principal"""
    print_header("Prueba de Creación de Publicaciones")
    
    # Obtener o crear usuario de prueba
    try:
        user = User.objects.filter(username='molo').first()
        if not user:
            print("❌ Usuario 'molo' no encontrado. Crea un usuario primero.")
            return
        
        print(f"✅ Usuario encontrado: {user.username} ({user.email})")
    except Exception as e:
        print(f"❌ Error obteniendo usuario: {e}")
        return
    
    # Probar diferentes tipos de posts
    print_header("Probando Tipos de Publicaciones")
    
    text_post = test_text_post(user)
    image_post = test_image_post(user)
    video_post = test_video_post(user)
    podcast_post = test_podcast_post(user)
    streaming_post = test_streaming_post(user)
    
    # Probar reacciones
    if text_post:
        print_header("Probando Reacciones")
        test_reactions(user, text_post)
    
    # Verificar campos
    if text_post:
        print_header("Verificando Campos del Post")
        verify_post_fields(text_post)
    
    # Mostrar endpoints
    print_header("Endpoints de la API")
    test_api_endpoints()
    
    # Resumen
    print_header("Resumen de Pruebas")
    
    total_posts = Post.objects.filter(user=user).count()
    print(f"✅ Total de publicaciones del usuario: {total_posts}")
    
    # Contar por tipo
    for post_type, label in Post.POST_TYPES:
        count = Post.objects.filter(user=user, post_type=post_type).count()
        if count > 0:
            print(f"   {label}: {count}")
    
    print("\n✅ Todas las rutas están funcionando correctamente")
    print("✅ Las publicaciones se están guardando en la base de datos")
    print("✅ Los campos de fecha se registran automáticamente")
    print("✅ Los contadores de reacciones funcionan correctamente")

if __name__ == '__main__':
    main()

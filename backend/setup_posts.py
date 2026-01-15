#!/usr/bin/env python3
"""
Script para configurar el sistema de Posts
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.append(str(Path(__file__).parent))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from django.core.management import execute_from_command_line
from apps.posts.models import Post, PostReaction, Comment

User = get_user_model()

def create_sample_posts():
    """Crear posts de ejemplo"""
    
    # Obtener usuarios de prueba
    try:
        messi = User.objects.get(username='messi10')
        ronaldo = User.objects.get(username='cr7')
        neymar = User.objects.get(username='neymarjr')
    except User.DoesNotExist:
        print("❌ Primero ejecuta setup_auth.py para crear usuarios de prueba")
        return
    
    sample_posts = [
        {
            'user': messi,
            'content': '¡Qué partido increíble! Gracias a todos los fanáticos por el apoyo. 🐐⚽',
            'post_type': 'text',
            'category': 'football'
        },
        {
            'user': ronaldo,
            'content': 'Entrenamiento completado. Siempre trabajando para ser mejor. SIUUUU! 💪',
            'post_type': 'text',
            'category': 'football'
        },
        {
            'user': neymar,
            'content': 'Joga bonito! El fútbol es arte y pasión. ¿Cuál es su jugada favorita? 🎨⚽',
            'post_type': 'text',
            'category': 'football'
        },
        {
            'user': messi,
            'content': 'Compartiendo algunos momentos del último partido. ¡Gracias equipo! 📸',
            'post_type': 'image',
            'category': 'football',
            'images': ['https://example.com/messi1.jpg', 'https://example.com/messi2.jpg']
        },
        {
            'user': ronaldo,
            'content': 'Nuevo video de entrenamiento disponible. ¡Vamos a por más! 🎥',
            'post_type': 'video',
            'category': 'football'
        },
        {
            'user': neymar,
            'content': 'Escuchen mi nuevo podcast sobre técnicas de regate. Link en bio! 🎧',
            'post_type': 'podcast',
            'category': 'football',
            'podcast_url': 'https://example.com/neymar-podcast'
        }
    ]
    
    created_posts = []
    for post_data in sample_posts:
        post = Post.objects.create(**post_data)
        created_posts.append(post)
        print(f"✅ Post creado: {post.user.username} - {post.post_type}")
    
    return created_posts

def create_sample_interactions(posts):
    """Crear interacciones de ejemplo"""
    
    users = [
        User.objects.get(username='messi10'),
        User.objects.get(username='cr7'),
        User.objects.get(username='neymarjr')
    ]
    
    # Crear reacciones
    reactions = ['like', 'celebration', 'golazo']
    for post in posts[:3]:  # Solo primeros 3 posts
        for i, user in enumerate(users):
            if user != post.user:  # No reaccionar a posts propios
                PostReaction.objects.create(
                    user=user,
                    post=post,
                    reaction_type=reactions[i % len(reactions)]
                )
                print(f"✅ Reacción creada: {user.username} -> {post.user.username}")
    
    # Crear comentarios
    sample_comments = [
        "¡Increíble jugada! 🔥",
        "Eres una inspiración para todos nosotros",
        "¡Qué técnica tan perfecta!",
        "Siempre dando lo mejor 💪",
        "¡Leyenda del fútbol! ⚽"
    ]
    
    for post in posts[:4]:  # Comentarios en primeros 4 posts
        for i, user in enumerate(users):
            if user != post.user:  # No comentar posts propios
                Comment.objects.create(
                    user=user,
                    post=post,
                    content=sample_comments[i % len(sample_comments)]
                )
                print(f"✅ Comentario creado: {user.username} -> {post.user.username}")

def main():
    """Función principal"""
    print("🚀 Configurando sistema de Posts...")
    print("=" * 50)
    
    # Ejecutar migraciones
    print("📦 Ejecutando migraciones...")
    execute_from_command_line(['manage.py', 'makemigrations', 'posts'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Crear posts de ejemplo
    print("\n📝 Creando posts de ejemplo...")
    posts = create_sample_posts()
    
    if posts:
        # Crear interacciones
        print("\n💬 Creando interacciones de ejemplo...")
        create_sample_interactions(posts)
    
    print("\n✅ ¡Sistema de Posts configurado!")
    print("\n📋 Endpoints disponibles:")
    print("GET  /api/posts/                    # Listar posts")
    print("POST /api/posts/                    # Crear post")
    print("GET  /api/posts/{id}/               # Obtener post")
    print("PUT  /api/posts/{id}/               # Actualizar post")
    print("DELETE /api/posts/{id}/             # Eliminar post")
    print("POST /api/posts/{id}/react/         # Reaccionar")
    print("POST /api/posts/{id}/share/         # Compartir")
    print("POST /api/posts/{id}/bookmark/      # Guardar")
    print("GET  /api/posts/{id}/comments/      # Comentarios")
    print("POST /api/posts/{id}/add_comment/   # Agregar comentario")
    print("GET  /api/posts/feed/               # Feed personalizado")
    print("GET  /api/posts/bookmarks/          # Posts guardados")
    print("\n🚀 Ejecuta: python manage.py runserver")

if __name__ == "__main__":
    main()
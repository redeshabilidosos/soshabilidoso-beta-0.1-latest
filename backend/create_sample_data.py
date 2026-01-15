#!/usr/bin/env python
"""
Script para crear datos de prueba
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from apps.posts.models import Post

User = get_user_model()

def create_sample_data():
    """Crear datos de prueba"""
    
    print("🚀 Creando datos de prueba...")
    
    # Crear usuario si no existe
    user, created = User.objects.get_or_create(
        username='test_user',
        email='test@example.com',
        defaults={
            'display_name': 'Usuario de Prueba',
            'first_name': 'Usuario',
            'last_name': 'Prueba',
            'bio': 'Este es un usuario de prueba para el sistema SOS-HABILIDOSO.',
        }
    )
    
    if created:
        user.set_password('password123')
        user.save()
        print(f"✅ Usuario creado: {user.username}")
    else:
        print(f"ℹ️  Usuario ya existe: {user.username}")
    
    # Crear posts de prueba
    posts_data = [
        {
            'content': '¡Mi primera publicación de texto! 🎉',
            'post_type': 'text',
            'category': 'general_sport'
        },
        {
            'content': 'Compartiendo una imagen increíble',
            'post_type': 'image',
            'category': 'football',
            'images': ['https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg']
        },
        {
            'content': 'Nuevo podcast sobre técnicas de fútbol',
            'post_type': 'podcast',
            'category': 'football',
            'podcast_url': 'https://example.com/podcast'
        },
        {
            'content': 'Streaming en vivo desde el entrenamiento',
            'post_type': 'streaming',
            'category': 'football',
            'streaming_url': 'https://example.com/stream'
        }
    ]
    
    for post_data in posts_data:
        post, created = Post.objects.get_or_create(
            user=user,
            content=post_data['content'],
            defaults=post_data
        )
        
        if created:
            print(f"✅ Post creado: {post.content[:50]}...")
        else:
            print(f"ℹ️  Post ya existe: {post.content[:50]}...")
    
    print("\n🎉 ¡Datos de prueba creados!")
    print(f"\n📝 Usuario: {user.username}")
    print("🔑 Contraseña: password123")
    print(f"📊 Posts creados: {Post.objects.filter(user=user).count()}")

if __name__ == "__main__":
    try:
        create_sample_data()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
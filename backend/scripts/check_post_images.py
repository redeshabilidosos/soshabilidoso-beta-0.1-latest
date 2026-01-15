#!/usr/bin/env python
"""
Script para verificar las imágenes de las publicaciones
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from apps.posts.models import Post
from django.contrib.auth import get_user_model

User = get_user_model()

def main():
    print("\n" + "="*60)
    print("  Verificación de Imágenes en Publicaciones")
    print("="*60 + "\n")
    
    # Obtener todas las publicaciones
    posts = Post.objects.all().order_by('-created_at')[:10]
    
    print(f"Total de publicaciones (últimas 10): {posts.count()}\n")
    
    for post in posts:
        print(f"\n📝 Post ID: {post.id}")
        print(f"   Usuario: {post.user.username}")
        print(f"   Tipo: {post.post_type}")
        print(f"   Contenido: {post.content[:50]}...")
        print(f"   Imágenes (JSON): {post.images}")
        print(f"   Tipo de dato: {type(post.images)}")
        
        if post.images:
            print(f"   ✅ Tiene {len(post.images)} imagen(es)")
            for i, img_url in enumerate(post.images):
                print(f"      {i+1}. {img_url}")
        else:
            print(f"   ❌ No tiene imágenes")
        
        print(f"   Fecha: {post.created_at}")
        print("-" * 60)
    
    # Verificar archivos en el sistema
    print("\n" + "="*60)
    print("  Archivos en media/posts/")
    print("="*60 + "\n")
    
    media_posts_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'media', 'posts')
    
    if os.path.exists(media_posts_dir):
        files = os.listdir(media_posts_dir)
        if files:
            print(f"✅ Encontrados {len(files)} archivos:")
            for file in files[:10]:  # Mostrar solo los primeros 10
                file_path = os.path.join(media_posts_dir, file)
                size = os.path.getsize(file_path)
                print(f"   - {file} ({size} bytes)")
        else:
            print("❌ El directorio está vacío")
    else:
        print(f"❌ El directorio no existe: {media_posts_dir}")

if __name__ == '__main__':
    main()

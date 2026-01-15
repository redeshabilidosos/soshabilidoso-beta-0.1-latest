#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.posts.models import Post

User = get_user_model()

# Obtener un usuario
user = User.objects.first()

if not user:
    print("No hay usuarios")
else:
    print(f"Usuario: {user.username}")
    
    try:
        # Crear post directamente sin serializer
        post = Post.objects.create(
            user=user,
            content='Este es un post de prueba',
            post_type='text',
            category='other',
            is_public=True
        )
        print(f"Post creado exitosamente: {post.id}")
        print(f"Contenido: {post.content}")
        print(f"Categoria: {post.category}")
    except Exception as e:
        print(f"Error al crear post: {e}")
        import traceback
        traceback.print_exc()

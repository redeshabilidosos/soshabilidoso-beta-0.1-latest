#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.posts.models import Post
from apps.users.models import Follow

User = get_user_model()

# Obtener usuarios
current_user = User.objects.filter(username='soshabilidosos').first()
molo_user = User.objects.filter(username='molo').first()

if not current_user:
    print("Usuario actual no encontrado")
else:
    print(f"Usuario actual: {current_user.username}")
    
    # Ver a quién sigue
    following = current_user.following_set.all()
    print(f"Siguiendo a {following.count()} usuarios:")
    for follow in following:
        print(f"  - {follow.following.username}")
    
    if molo_user:
        print(f"\nBuscando usuario: {molo_user.username}")
        
        # Ver si sigue a molo
        is_following = following.filter(following=molo_user).exists()
        print(f"¿Sigue a {molo_user.username}? {is_following}")
        
        if not is_following:
            print(f"\nCreando relación de seguimiento...")
            Follow.objects.create(follower=current_user, following=molo_user)
            print(f"Ahora {current_user.username} sigue a {molo_user.username}")
        
        # Ver posts de molo
        molo_posts = Post.objects.filter(user=molo_user, is_public=True)
        print(f"\nPublicaciones públicas de {molo_user.username}: {molo_posts.count()}")
        for post in molo_posts[:3]:
            print(f"  - {post.content[:50]}... ({post.created_at})")
        
        # Ver posts en el feed del usuario actual
        following_users = current_user.following_set.values_list('following', flat=True)
        feed_posts = Post.objects.filter(
            user__in=following_users,
            is_public=True
        ).order_by('-created_at')
        print(f"\nPublicaciones en el feed del usuario actual: {feed_posts.count()}")
        for post in feed_posts[:5]:
            print(f"  - {post.user.username}: {post.content[:50]}... ({post.created_at})")
    else:
        print("Usuario molo no encontrado")

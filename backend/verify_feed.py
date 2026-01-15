#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.posts.models import Post
from django.db.models import Q

User = get_user_model()

# Verificar el feed de cada usuario
users = User.objects.all()

print("=== Verificacion de Feed ===\n")

for user in users:
    following_users = user.following_set.values_list('following', flat=True)
    
    # Posts del usuario y de usuarios que sigue
    feed_posts = Post.objects.filter(
        Q(user=user) | Q(user__in=following_users),
        is_public=True
    ).order_by('-created_at')
    
    print(f"{user.username}:")
    print(f"  Sigue a: {following_users.count()} usuarios")
    print(f"  Posts en feed: {feed_posts.count()}")
    
    if feed_posts.count() > 0:
        print(f"  Ultimos posts:")
        for post in feed_posts[:3]:
            print(f"    - {post.user.username}: {post.content[:40]}...")
    print()

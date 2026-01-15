#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.communities.models import Community
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# Obtener un usuario
user = User.objects.first()
if user:
    # Generar token
    refresh = RefreshToken.for_user(user)
    token = str(refresh.access_token)
    print(f"Token: {token[:50]}...")
    
    # Obtener comunidades
    communities = Community.objects.all()
    print(f"\nTotal de comunidades: {communities.count()}")
    
    for community in communities:
        print(f"\nComunidad: {community.id}")
        print(f"  Nombre: {community.name}")
        print(f"  Slug: {community.slug}")
        print(f"  Member count: {community.member_count}")
        print(f"  Post count: {community.post_count}")
        print(f"  Is active: {community.is_active}")
else:
    print("No hay usuarios")

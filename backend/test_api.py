#!/usr/bin/env python
import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from apps.communities.models import Community

User = get_user_model()

# Obtener un usuario
user = User.objects.first()
if user:
    # Generar token
    refresh = RefreshToken.for_user(user)
    token = str(refresh.access_token)
    
    # Obtener una comunidad
    community = Community.objects.first()
    if community:
        print(f"Probando con comunidad: {community.id} - {community.name} (slug: {community.slug})")
        
        headers = {'Authorization': f'Bearer {token}'}
        
        # Hacer request al endpoint de detalle con ID
        response = requests.get(f'http://127.0.0.1:8000/api/communities/{community.id}/', headers=headers)
        print(f"\nDetalle por ID - Status: {response.status_code}")
        if response.status_code == 200:
            print("OK - Funciona con ID")
        else:
            print(f"ERROR: {response.text[:100]}")
        
        # Hacer request al endpoint de detalle con slug
        response = requests.get(f'http://127.0.0.1:8000/api/communities/{community.slug}/', headers=headers)
        print(f"\nDetalle por slug - Status: {response.status_code}")
        if response.status_code == 200:
            print("OK - Funciona con slug")
        else:
            print(f"ERROR: {response.text[:100]}")
        
        # Hacer request al endpoint de posts con ID
        response = requests.get(f'http://127.0.0.1:8000/api/communities/{community.id}/posts/', headers=headers)
        print(f"\nPosts por ID - Status: {response.status_code}")
        if response.status_code == 200:
            print("OK - Funciona con ID")
        else:
            print(f"ERROR: {response.text[:100]}")
        
        # Hacer request al endpoint de posts con slug
        response = requests.get(f'http://127.0.0.1:8000/api/communities/{community.slug}/posts/', headers=headers)
        print(f"\nPosts por slug - Status: {response.status_code}")
        if response.status_code == 200:
            print("OK - Funciona con slug")
        else:
            print(f"ERROR: {response.text[:100]}")
    else:
        print("No hay comunidades")
else:
    print("No hay usuarios")

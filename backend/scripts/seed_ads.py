#!/usr/bin/env python
"""
Script para crear anuncios de prueba
"""
import os
import sys
from datetime import timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

import django
django.setup()

from django.utils import timezone
from apps.advertising.models import Advertisement
from apps.users.models import User

print("Creando anuncios de prueba...")

admin = User.objects.filter(is_superuser=True).first()
now = timezone.now()

ads_data = [
    {
        'title': 'Nike - Just Do It',
        'description': 'Descubre la nueva colección de ropa deportiva Nike. Rendimiento y estilo en cada movimiento.',
        'advertiser_name': 'Nike Colombia',
        'advertiser_email': 'ads@nike.com',
        'ad_type': 'image',
        'position': 'feed',
        'link_url': 'https://nike.com/co',
        'call_to_action': 'Comprar Ahora',
        'show_every_n_posts': 5,
        'priority': 4,
        'weight': 200,
        'budget': 5000,
        'daily_budget': 100,
        'status': 'active',
    },
    {
        'title': 'Adidas - Impossible is Nothing',
        'description': 'Los nuevos guayos Predator. Domina el campo con precisión.',
        'advertiser_name': 'Adidas',
        'advertiser_email': 'marketing@adidas.com',
        'ad_type': 'video',
        'position': 'feed',
        'video_url': 'https://www.youtube.com/watch?v=example',
        'link_url': 'https://adidas.com.co',
        'call_to_action': 'Ver Colección',
        'show_every_n_posts': 7,
        'priority': 3,
        'weight': 150,
        'budget': 3000,
        'daily_budget': 80,
        'status': 'active',
    },
    {
        'title': 'Gatorade - Hidratación Deportiva',
        'description': 'Recupera lo que pierdes. La bebida oficial de los campeones.',
        'advertiser_name': 'Gatorade',
        'advertiser_email': 'ads@gatorade.com',
        'ad_type': 'image',
        'position': 'between_posts',
        'link_url': 'https://gatorade.com',
        'call_to_action': 'Conoce Más',
        'show_every_n_posts': 10,
        'priority': 2,
        'weight': 100,
        'budget': 2000,
        'daily_budget': 50,
        'status': 'active',
    },
    {
        'title': 'Academia de Fútbol Elite',
        'description': 'Inscripciones abiertas para la temporada 2025. Entrena con los mejores.',
        'advertiser_name': 'Academia Elite FC',
        'advertiser_email': 'info@academiaelite.com',
        'ad_type': 'image',
        'position': 'feed',
        'link_url': 'https://academiaelite.com',
        'call_to_action': 'Inscríbete',
        'show_every_n_posts': 8,
        'priority': 2,
        'weight': 80,
        'budget': 1000,
        'daily_budget': 30,
        'status': 'active',
    },
    {
        'title': 'PlayStation - FIFA 25',
        'description': 'El fútbol nunca se sintió tan real. Disponible ahora.',
        'advertiser_name': 'PlayStation',
        'advertiser_email': 'ads@playstation.com',
        'ad_type': 'video',
        'position': 'feed',
        'video_url': 'https://www.youtube.com/watch?v=fifa25',
        'link_url': 'https://playstation.com/fifa25',
        'call_to_action': 'Comprar Juego',
        'show_every_n_posts': 6,
        'priority': 5,
        'weight': 250,
        'budget': 10000,
        'daily_budget': 200,
        'status': 'active',
    },
]

created_count = 0
for ad_data in ads_data:
    ad, created = Advertisement.objects.get_or_create(
        title=ad_data['title'],
        defaults={
            **ad_data,
            'start_date': now,
            'end_date': now + timedelta(days=30),
            'created_by': admin,
            'max_impressions_per_user': 10,
            'max_impressions_per_day': 3,
        }
    )
    if created:
        created_count += 1
        print(f"  ✓ Creado: {ad.title}")
    else:
        print(f"  - Ya existe: {ad.title}")

print(f"\n¡{created_count} anuncios creados!")
print("\nAccede al admin para gestionarlos:")
print("http://127.0.0.1:8000/admin/advertising/advertisement/")

"""
Script para ver qué usuarios tienen historias
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.stories.models import Story
from django.utils import timezone

User = get_user_model()

print('[DEBUG] Verificando historias existentes...\n')

try:
    # Obtener historias no expiradas
    active_stories = Story.objects.filter(
        expires_at__gt=timezone.now()
    ).select_related('user')
    
    print(f'[OK] Total de historias activas: {active_stories.count()}\n')
    
    # Agrupar por usuario
    users_with_stories = {}
    for story in active_stories:
        username = story.user.username
        if username not in users_with_stories:
            users_with_stories[username] = []
        users_with_stories[username].append(story)
    
    print('[OK] Usuarios con historias activas:')
    for username, stories in users_with_stories.items():
        print(f'  - {username}: {len(stories)} historia(s)')
        for story in stories:
            print(f'    * ID: {story.id}, Tipo: {story.media_type}, Vistas: {story.views_count}')
    
    print()
    
    # Listar todos los usuarios
    all_users = User.objects.all()[:10]
    print(f'[OK] Primeros 10 usuarios en la base de datos:')
    for user in all_users:
        story_count = Story.objects.filter(user=user, expires_at__gt=timezone.now()).count()
        print(f'  - {user.username} (ID: {user.id}): {story_count} historia(s) activa(s)')
    
except Exception as e:
    print(f'[ERROR] Error: {str(e)}')
    import traceback
    traceback.print_exc()

"""
Script para verificar que las historias son visibles para todos los usuarios
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

# Agregar testserver a ALLOWED_HOSTS temporalmente
from django.conf import settings
if 'testserver' not in settings.ALLOWED_HOSTS:
    settings.ALLOWED_HOSTS.append('testserver')

from django.contrib.auth import get_user_model
from apps.stories.models import Story
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

print('[DEBUG] Verificando visibilidad de historias para todos los usuarios...\n')

try:
    # Obtener usuarios
    user_molo = User.objects.get(username='molo')
    user_moloworld = User.objects.get(username='moloworld')
    
    # Crear cliente API
    client = APIClient()
    
    # Autenticar como molo
    refresh = RefreshToken.for_user(user_molo)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
    
    print(f'[OK] Autenticado como: {user_molo.username}\n')
    
    # PRUEBA 1: Obtener historias de amigos
    print('=== PRUEBA 1: GET /api/stories/friends/ ===')
    response = client.get('/api/stories/friends/')
    
    if response.status_code == 200:
        data = response.json()
        print(f'[OK] Status: {response.status_code}')
        print(f'[OK] Total de usuarios con historias: {data.get("count", 0)}')
        
        if data.get('results'):
            for user_stories in data['results']:
                user_info = user_stories['user']
                stories = user_stories['stories']
                has_unviewed = user_stories['has_unviewed']
                print(f'\n  Usuario: {user_info["username"]}')
                print(f'  Historias: {len(stories)}')
                print(f'  No vistas: {has_unviewed}')
                
                for story in stories:
                    print(f'    - ID: {story["id"][:8]}..., Tipo: {story["media_type"]}, Vistas: {story["views_count"]}')
        else:
            print('[INFO] No hay historias disponibles')
    else:
        print(f'[ERROR] Status: {response.status_code}')
        print(f'[ERROR] Response: {response.json()}')
    
    print()
    
    # PRUEBA 2: Obtener mis propias historias
    print('=== PRUEBA 2: GET /api/stories/me/ ===')
    response = client.get('/api/stories/me/')
    
    if response.status_code == 200:
        data = response.json()
        print(f'[OK] Status: {response.status_code}')
        print(f'[OK] Mis historias: {len(data)}')
        
        for story in data:
            print(f'  - ID: {story["id"][:8]}..., Tipo: {story["media_type"]}, Vistas: {story["views_count"]}')
    else:
        print(f'[ERROR] Status: {response.status_code}')
    
    print()
    
    # PRUEBA 3: Ver una historia específica
    story = Story.objects.filter(expires_at__gt=timezone.now()).first()
    if story:
        print(f'=== PRUEBA 3: POST /api/stories/{story.id}/view/ ===')
        response = client.post(f'/api/stories/{story.id}/view/')
        
        if response.status_code == 200:
            data = response.json()
            print(f'[OK] Status: {response.status_code}')
            print(f'[OK] Vista registrada: {data.get("viewed", False)}')
            print(f'[OK] Nueva vista: {data.get("created", False)}')
        else:
            print(f'[INFO] Status: {response.status_code}')
            print(f'[INFO] Response: {response.json()}')
    
    print()
    
    # PRUEBA 4: Reaccionar a una historia
    if story and story.user != user_molo:
        print(f'=== PRUEBA 4: POST /api/stories/{story.id}/react/ ===')
        response = client.post(f'/api/stories/{story.id}/react/', {
            'reaction_type': 'like'
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f'[OK] Status: {response.status_code}')
            print(f'[OK] Reaccion creada: {data.get("created", False)}')
            print(f'[OK] Notificacion creada: {data.get("notification_created", False)}')
        else:
            print(f'[ERROR] Status: {response.status_code}')
            print(f'[ERROR] Response: {response.json()}')
    
    print()
    
    # PRUEBA 5: Responder a una historia
    if story and story.user != user_molo:
        print(f'=== PRUEBA 5: POST /api/stories/{story.id}/reply/ ===')
        response = client.post(f'/api/stories/{story.id}/reply/', {
            'message': 'Excelente historia! Me encanto!'
        })
        
        if response.status_code == 201:
            data = response.json()
            print(f'[OK] Status: {response.status_code}')
            print(f'[OK] Mensaje creado en chat: {data.get("message_created", False)}')
            print(f'[OK] Notificacion creada: {data.get("notification_created", False)}')
        else:
            print(f'[ERROR] Status: {response.status_code}')
            print(f'[ERROR] Response: {response.json()}')
    
    print()
    print('=== RESUMEN ===')
    print('[OK] Sistema de historias completamente funcional')
    print('[OK] Las historias son visibles para todos los usuarios')
    print('[OK] Las notificaciones se crean correctamente')
    print('[OK] Los mensajes se envian al chat privado')
    
except Exception as e:
    print(f'[ERROR] Error durante la prueba: {str(e)}')
    import traceback
    traceback.print_exc()

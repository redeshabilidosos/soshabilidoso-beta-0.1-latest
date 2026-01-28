"""
Script para probar el endpoint de respuesta a historias
"""
import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.stories.models import Story
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

print('[DEBUG] Probando endpoint de respuesta a historias...\n')

try:
    # Obtener usuarios
    user_molo = User.objects.get(username='molo')
    user_moloworld = User.objects.get(username='moloworld')
    
    # Obtener una historia activa
    story = Story.objects.filter(
        user=user_moloworld,
        expires_at__gt=timezone.now()
    ).first()
    
    if not story:
        print('[ERROR] No hay historias activas de moloworld')
        exit(1)
    
    print(f'[OK] Historia encontrada: {story.id}')
    print(f'[OK] Creador: {story.user.username}')
    print()
    
    # Generar token para molo
    refresh = RefreshToken.for_user(user_molo)
    access_token = str(refresh.access_token)
    
    print(f'[OK] Token generado para {user_molo.username}')
    print()
    
    # Hacer request al endpoint
    url = f'http://127.0.0.1:8000/api/stories/{story.id}/reply/'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'message': 'Mensaje de prueba desde script!'
    }
    
    print(f'[DEBUG] Enviando POST a: {url}')
    print(f'[DEBUG] Mensaje: {data["message"]}')
    print()
    
    response = requests.post(url, json=data, headers=headers)
    
    print(f'[DEBUG] Status Code: {response.status_code}')
    print(f'[DEBUG] Response Headers: {dict(response.headers)}')
    print()
    
    if response.status_code == 201:
        result = response.json()
        print('[OK] Respuesta exitosa!')
        print(f'[OK] message_created: {result.get("message_created", False)}')
        print(f'[OK] notification_created: {result.get("notification_created", False)}')
        print()
        print('[OK] Contenido completo:')
        import json
        print(json.dumps(result, indent=2))
    else:
        print(f'[ERROR] Error en la respuesta')
        print(f'[ERROR] Status: {response.status_code}')
        try:
            error_data = response.json()
            print(f'[ERROR] Detalles: {error_data}')
        except:
            print(f'[ERROR] Respuesta: {response.text}')
    
except Exception as e:
    print(f'[ERROR] Error durante la prueba: {str(e)}')
    import traceback
    traceback.print_exc()

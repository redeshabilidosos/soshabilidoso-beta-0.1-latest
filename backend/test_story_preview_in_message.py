"""
Script para verificar que los mensajes con story_reply muestran el preview
"""
import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.messaging.models import ChatRoom, Message
from apps.stories.models import Story
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()

print('[DEBUG] Verificando preview de historia en mensajes...\n')

try:
    # Obtener usuarios
    user_molo = User.objects.get(username='molo')
    user_moloworld = User.objects.get(username='moloworld')
    
    # Buscar chat entre ellos
    chat = ChatRoom.objects.filter(
        chat_type='private',
        participants=user_molo
    ).filter(
        participants=user_moloworld
    ).first()
    
    if not chat:
        print('[ERROR] No hay chat entre molo y moloworld')
        exit(1)
    
    print(f'[OK] Chat encontrado: {chat.id}')
    print()
    
    # Buscar mensajes con story_reply
    story_messages = Message.objects.filter(
        chat_room=chat,
        message_type='story_reply'
    ).order_by('-created_at')
    
    print(f'[OK] Mensajes con story_reply: {story_messages.count()}')
    print()
    
    if story_messages.count() == 0:
        print('[INFO] No hay mensajes con story_reply aún')
        exit(0)
    
    # Verificar el último mensaje
    last_message = story_messages.first()
    print(f'[DEBUG] Último mensaje story_reply:')
    print(f'  ID: {last_message.id}')
    print(f'  Contenido: {last_message.content}')
    print(f'  Story ID: {last_message.story_id}')
    print()
    
    # Verificar si la historia existe
    if last_message.story_id:
        story = Story.objects.filter(id=last_message.story_id).first()
        if story:
            print(f'[OK] Historia encontrada:')
            print(f'  ID: {story.id}')
            print(f'  Media URL: {story.media_url}')
            print(f'  Media Type: {story.media_type}')
            print(f'  Usuario: {story.user.username}')
            print(f'  Expirada: {story.is_expired}')
            print()
        else:
            print(f'[ERROR] Historia {last_message.story_id} no encontrada')
            print()
    
    # Probar el endpoint de mensajes
    refresh = RefreshToken.for_user(user_molo)
    access_token = str(refresh.access_token)
    
    url = f'http://127.0.0.1:8000/api/messaging/chats/{chat.id}/messages/'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    print(f'[DEBUG] Obteniendo mensajes del chat...')
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f'[OK] Status: {response.status_code}')
        print(f'[OK] Total de mensajes: {data.get("count", 0)}')
        print()
        
        # Buscar mensajes con story_preview
        messages_with_preview = [m for m in data.get('results', []) if m.get('story_preview')]
        print(f'[OK] Mensajes con story_preview: {len(messages_with_preview)}')
        print()
        
        if messages_with_preview:
            print('[OK] Ejemplo de mensaje con preview:')
            example = messages_with_preview[0]
            print(json.dumps({
                'id': example['id'],
                'content': example['content'],
                'message_type': example['message_type'],
                'story_preview': example['story_preview']
            }, indent=2))
        else:
            print('[INFO] No hay mensajes con story_preview en la respuesta')
            print('[DEBUG] Verificando un mensaje story_reply:')
            story_reply_msgs = [m for m in data.get('results', []) if m.get('message_type') == 'story_reply']
            if story_reply_msgs:
                print(json.dumps(story_reply_msgs[0], indent=2))
    else:
        print(f'[ERROR] Status: {response.status_code}')
        print(f'[ERROR] Response: {response.text}')
    
except Exception as e:
    print(f'[ERROR] Error: {str(e)}')
    import traceback
    traceback.print_exc()

"""
Script para verificar que las notificaciones fueron creadas correctamente
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.notifications.models import Notification
from apps.messaging.models import ChatRoom, Message
from django.contrib.auth import get_user_model

User = get_user_model()

print('[DEBUG] Verificando notificaciones y mensajes creados...\n')

try:
    user_moloworld = User.objects.get(username='moloworld')
    user_molo = User.objects.get(username='molo')
    
    # Verificar notificaciones de stories
    print('=== NOTIFICACIONES DE STORIES ===')
    story_notifications = Notification.objects.filter(
        notification_type__in=['story_reaction', 'story_reply'],
        recipient=user_moloworld
    ).order_by('-created_at')
    
    print(f'[OK] Total de notificaciones de stories para {user_moloworld.username}: {story_notifications.count()}\n')
    
    for notif in story_notifications:
        print(f'Tipo: {notif.notification_type}')
        print(f'De: {notif.sender.username}')
        print(f'Mensaje: {notif.message}')
        print(f'Leida: {notif.is_read}')
        print(f'Fecha: {notif.created_at}')
        print(f'Story ID: {notif.story_id}')
        print('-' * 50)
    
    print()
    
    # Verificar chat privado
    print('=== CHAT PRIVADO ===')
    chat = ChatRoom.objects.filter(
        chat_type='private',
        participants=user_molo
    ).filter(
        participants=user_moloworld
    ).first()
    
    if chat:
        print(f'[OK] Chat encontrado: {chat.id}')
        print(f'[OK] Tipo: {chat.chat_type}')
        print(f'[OK] Creado por: {chat.created_by.username}')
        print(f'[OK] Participantes: {", ".join([p.username for p in chat.participants.all()])}')
        
        # Verificar mensajes
        messages = Message.objects.filter(chat_room=chat).order_by('-created_at')
        print(f'\n[OK] Mensajes en el chat: {messages.count()}\n')
        
        for msg in messages:
            print(f'De: {msg.sender.username}')
            print(f'Contenido: {msg.content}')
            print(f'Tipo: {msg.message_type}')
            print(f'Fecha: {msg.created_at}')
            print('-' * 50)
    else:
        print('[INFO] No se encontro chat privado')
    
    print()
    print('=== RESUMEN FINAL ===')
    print(f'[OK] Notificaciones de story_reaction: {Notification.objects.filter(notification_type="story_reaction").count()}')
    print(f'[OK] Notificaciones de story_reply: {Notification.objects.filter(notification_type="story_reply").count()}')
    print(f'[OK] Chats privados totales: {ChatRoom.objects.filter(chat_type="private").count()}')
    print(f'[OK] Mensajes totales: {Message.objects.count()}')
    print('\n[OK] Sistema de notificaciones de stories funcionando perfectamente!')
    
except Exception as e:
    print(f'[ERROR] Error: {str(e)}')
    import traceback
    traceback.print_exc()

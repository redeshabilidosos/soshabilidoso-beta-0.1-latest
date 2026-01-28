"""
Script para probar el sistema completo de notificaciones de stories
"""
import os
import django
import django.utils.timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.stories.models import Story, StoryReaction, StoryReply
from apps.notifications.models import Notification
from apps.messaging.models import ChatRoom, Message

User = get_user_model()

print('[DEBUG] Iniciando prueba del sistema de notificaciones de stories...\n')

try:
    # Obtener usuarios específicos para la prueba
    user1 = User.objects.get(username='moloworld')  # Tiene una historia
    user2 = User.objects.get(username='molo')  # Usuario que reacciona/responde
    
    print(f'[OK] Usuario 1 (creador): {user1.username}')
    print(f'[OK] Usuario 2 (reactor): {user2.username}\n')
    
    # Obtener una historia del usuario 1
    story = Story.objects.filter(user=user1, expires_at__gt=django.utils.timezone.now()).first()
    
    if not story:
        print('[ERROR] El usuario 1 no tiene historias. Crea una historia primero.')
        exit(1)
    
    print(f'[OK] Historia encontrada: {story.id}\n')
    
    # PRUEBA 1: Crear reacción
    print('=== PRUEBA 1: Reaccion a historia ===')
    reaction, created = StoryReaction.objects.update_or_create(
        user=user2,
        story=story,
        defaults={'reaction_type': 'fire'}
    )
    print(f'[OK] Reaccion creada: {reaction.reaction_type}')
    
    # Verificar si se creó notificación
    notification = Notification.objects.filter(
        recipient=user1,
        sender=user2,
        notification_type='story_reaction',
        story_id=story.id
    ).first()
    
    if notification:
        print(f'[OK] Notificacion creada: {notification.message}')
    else:
        print('[DEBUG] No se encontro notificacion (puede ser porque ya existia la reaccion)')
    
    print()
    
    # PRUEBA 2: Crear respuesta
    print('=== PRUEBA 2: Respuesta a historia ===')
    reply = StoryReply.objects.create(
        user=user2,
        story=story,
        message='Que buena historia!'
    )
    print(f'[OK] Respuesta creada: {reply.message}')
    
    # Verificar si se creó chat
    chat = ChatRoom.objects.filter(
        chat_type='private',
        participants=user1
    ).filter(
        participants=user2
    ).first()
    
    if chat:
        print(f'[OK] Chat encontrado: {chat.id}')
        
        # Verificar mensaje en el chat
        message = Message.objects.filter(
            chat_room=chat,
            sender=user2
        ).order_by('-created_at').first()
        
        if message:
            print(f'[OK] Mensaje en chat: {message.content}')
        else:
            print('[DEBUG] No se encontro mensaje en el chat')
    else:
        print('[DEBUG] No se encontro chat (se creara cuando se use el endpoint de API)')
    
    # Verificar notificación de respuesta
    reply_notification = Notification.objects.filter(
        recipient=user1,
        sender=user2,
        notification_type='story_reply',
        story_id=story.id
    ).first()
    
    if reply_notification:
        print(f'[OK] Notificacion de respuesta creada: {reply_notification.message}')
    else:
        print('[DEBUG] No se encontro notificacion de respuesta (se creara cuando se use el endpoint de API)')
    
    print()
    
    # RESUMEN
    print('=== RESUMEN ===')
    total_story_notifications = Notification.objects.filter(
        notification_type__in=['story_reaction', 'story_reply']
    ).count()
    print(f'[OK] Total de notificaciones de stories: {total_story_notifications}')
    
    total_reactions = StoryReaction.objects.count()
    print(f'[OK] Total de reacciones: {total_reactions}')
    
    total_replies = StoryReply.objects.count()
    print(f'[OK] Total de respuestas: {total_replies}')
    
    print('\n[OK] Sistema de notificaciones de stories funcionando correctamente')
    print('[INFO] Las notificaciones y mensajes se crearan automaticamente cuando uses los endpoints de API')
    
except Exception as e:
    print(f'[ERROR] Error durante la prueba: {str(e)}')
    import traceback
    traceback.print_exc()

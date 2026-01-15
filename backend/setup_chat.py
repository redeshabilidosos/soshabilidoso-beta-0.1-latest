#!/usr/bin/env python3
"""
Script para configurar el sistema de Chat
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.append(str(Path(__file__).parent))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from django.core.management import execute_from_command_line
from apps.messaging.models import ChatRoom, ChatParticipant, Message

User = get_user_model()

def create_sample_chats():
    """Crear chats de ejemplo"""
    
    # Obtener usuarios de prueba
    try:
        messi = User.objects.get(username='messi10')
        ronaldo = User.objects.get(username='cr7')
        neymar = User.objects.get(username='neymarjr')
        users = [messi, ronaldo, neymar]
    except User.DoesNotExist:
        print("❌ Primero ejecuta setup_auth.py para crear usuarios de prueba")
        return []
    
    created_chats = []
    
    # Crear chat privado entre Messi y Ronaldo
    chat1 = ChatRoom.objects.create(
        chat_type='private',
        created_by=messi
    )
    
    # Agregar participantes
    ChatParticipant.objects.create(chat_room=chat1, user=messi, role='member')
    ChatParticipant.objects.create(chat_room=chat1, user=ronaldo, role='member')
    
    created_chats.append(chat1)
    print(f"✅ Chat privado creado: {messi.username} - {ronaldo.username}")
    
    # Crear chat privado entre Messi y Neymar
    chat2 = ChatRoom.objects.create(
        chat_type='private',
        created_by=messi
    )
    
    ChatParticipant.objects.create(chat_room=chat2, user=messi, role='member')
    ChatParticipant.objects.create(chat_room=chat2, user=neymar, role='member')
    
    created_chats.append(chat2)
    print(f"✅ Chat privado creado: {messi.username} - {neymar.username}")
    
    # Crear chat grupal
    chat3 = ChatRoom.objects.create(
        name='Leyendas del Fútbol',
        chat_type='group',
        description='Chat de las leyendas del fútbol mundial',
        created_by=messi
    )
    
    # Agregar todos los usuarios al chat grupal
    ChatParticipant.objects.create(chat_room=chat3, user=messi, role='owner')
    ChatParticipant.objects.create(chat_room=chat3, user=ronaldo, role='admin')
    ChatParticipant.objects.create(chat_room=chat3, user=neymar, role='member')
    
    created_chats.append(chat3)
    print(f"✅ Chat grupal creado: {chat3.name}")
    
    return created_chats

def create_sample_messages(chats):
    """Crear mensajes de ejemplo"""
    
    users = [
        User.objects.get(username='messi10'),
        User.objects.get(username='cr7'),
        User.objects.get(username='neymarjr')
    ]
    
    sample_messages = [
        "¡Hola! ¿Cómo estás?",
        "¡Todo bien! ¿Listo para el próximo partido?",
        "Siempre listo para competir 💪",
        "¡Vamos a darlo todo en el campo! ⚽",
        "¡Será un gran partido!",
        "¡Que gane el mejor! 🔥",
        "¡Nos vemos en el campo! 👑",
        "¡A por la victoria! SIUUUU!",
        "Joga bonito, hermanos! 🎨",
        "¡El fútbol es pasión! ❤️"
    ]
    
    for chat in chats:
        participants = list(chat.participants.all())
        
        # Crear algunos mensajes en cada chat
        for i in range(min(5, len(sample_messages))):
            sender = participants[i % len(participants)]
            
            Message.objects.create(
                chat_room=chat,
                sender=sender,
                content=sample_messages[i],
                message_type='text'
            )
            
            print(f"✅ Mensaje creado en {chat}: {sender.username}")

def main():
    """Función principal"""
    print("🚀 Configurando sistema de Chat...")
    print("=" * 50)
    
    # Ejecutar migraciones
    print("📦 Ejecutando migraciones...")
    execute_from_command_line(['manage.py', 'makemigrations', 'messaging'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Crear chats de ejemplo
    print("\n💬 Creando chats de ejemplo...")
    chats = create_sample_chats()
    
    if chats:
        # Crear mensajes de ejemplo
        print("\n📝 Creando mensajes de ejemplo...")
        create_sample_messages(chats)
    
    print("\n✅ ¡Sistema de Chat configurado!")
    print("\n📋 Endpoints disponibles:")
    print("GET  /api/messaging/chats/                    # Listar chats")
    print("POST /api/messaging/chats/                    # Crear chat")
    print("GET  /api/messaging/chats/{id}/               # Obtener chat")
    print("GET  /api/messaging/chats/{id}/messages/      # Mensajes del chat")
    print("POST /api/messaging/chats/{id}/send_message/  # Enviar mensaje")
    print("POST /api/messaging/chats/{id}/mark_as_read/  # Marcar como leído")
    print("PATCH /api/messaging/chats/{id}/settings/    # Configurar chat")
    print("\n🔌 WebSocket:")
    print("ws://localhost:8000/ws/chat/{chat_id}/        # Conexión en tiempo real")
    print("\n📱 Funcionalidades WebSocket:")
    print("- Mensajes en tiempo real")
    print("- Indicador de escritura")
    print("- Estados de lectura")
    print("- Reacciones a mensajes")
    print("- Edición y eliminación")
    print("\n🚀 Ejecuta: python manage.py runserver")

if __name__ == "__main__":
    main()
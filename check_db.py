#!/usr/bin/env python3
"""
Script para verificar las tablas de la base de datos
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
sys.path.append(str(Path(__file__).parent / 'backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.db import connection
from django.contrib.auth import get_user_model

User = get_user_model()

def check_database():
    """Verificar el estado de la base de datos"""
    print('🗄️ Verificando base de datos...')
    print('=' * 50)
    
    # Obtener todas las tablas
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f'📋 Tablas encontradas ({len(tables)}):')
    for table in sorted(tables):
        print(f'  • {table}')
    
    # Verificar datos de usuario
    print(f'\n👥 Usuarios en la base de datos: {User.objects.count()}')
    
    if User.objects.exists():
        print('\n📊 Usuarios registrados:')
        for user in User.objects.all()[:5]:  # Mostrar solo los primeros 5
            print(f'  • {user.display_name} (@{user.username}) - {user.email}')
            if user.avatar:
                print(f'    Avatar: {user.avatar}')
            if user.cover_photo:
                print(f'    Portada: {user.cover_photo}')
    
    # Verificar posts
    try:
        from apps.posts.models import Post, PostReaction, Comment
        print(f'\n📝 Posts: {Post.objects.count()}')
        print(f'❤️ Reacciones: {PostReaction.objects.count()}')
        print(f'💬 Comentarios: {Comment.objects.count()}')
    except Exception as e:
        print(f'\n⚠️ Error verificando posts: {e}')
    
    # Verificar mensajes
    try:
        from apps.messaging.models import ChatRoom, Message
        print(f'\n💬 Salas de chat: {ChatRoom.objects.count()}')
        print(f'📨 Mensajes: {Message.objects.count()}')
    except Exception as e:
        print(f'\n⚠️ Error verificando mensajes: {e}')

if __name__ == '__main__':
    check_database()
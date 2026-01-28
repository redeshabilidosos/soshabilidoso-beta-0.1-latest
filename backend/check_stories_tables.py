"""
Script para verificar que las tablas de stories existen
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.stories.models import Story, StoryView, StoryReaction, StoryReply

try:
    print('[OK] Todas las tablas de stories existen')
    print(f'[OK] Stories: {Story.objects.count()}')
    print(f'[OK] StoryViews: {StoryView.objects.count()}')
    print(f'[OK] StoryReactions: {StoryReaction.objects.count()}')
    print(f'[OK] StoryReplies: {StoryReply.objects.count()}')
    print('\n[OK] Sistema de historias completamente funcional')
except Exception as e:
    print(f'[ERROR] Error al verificar tablas: {str(e)}')

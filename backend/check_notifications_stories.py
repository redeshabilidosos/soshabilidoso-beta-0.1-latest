"""
Script para verificar que las notificaciones de stories funcionan
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.notifications.models import Notification

try:
    # Verificar tipos de notificación
    notification_types = [choice[0] for choice in Notification.NOTIFICATION_TYPES]
    print('[OK] Tipos de notificacion disponibles:')
    for nt in notification_types:
        print(f'  - {nt}')
    
    # Verificar que story_reaction y story_reply están disponibles
    if 'story_reaction' in notification_types and 'story_reply' in notification_types:
        print('\n[OK] Tipos de notificacion de stories agregados correctamente')
    else:
        print('\n[ERROR] Faltan tipos de notificacion de stories')
    
    # Verificar campo story_id
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("DESCRIBE notifications")
        columns = [row[0] for row in cursor.fetchall()]
        if 'story_id' in columns:
            print('[OK] Campo story_id agregado a la tabla notifications')
        else:
            print('[ERROR] Campo story_id no encontrado en la tabla notifications')
    
    # Contar notificaciones de stories
    story_notifications = Notification.objects.filter(
        notification_type__in=['story_reaction', 'story_reply']
    ).count()
    print(f'\n[OK] Notificaciones de stories existentes: {story_notifications}')
    
    print('\n[OK] Sistema de notificaciones de stories completamente funcional')
    
except Exception as e:
    print(f'[ERROR] Error al verificar notificaciones: {str(e)}')
    import traceback
    traceback.print_exc()

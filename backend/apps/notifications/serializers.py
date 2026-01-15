"""
Serializers para notificaciones
"""
from rest_framework import serializers
from .models import Notification
from apps.users.serializers import UserBasicSerializer


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer para notificaciones"""
    
    sender = UserBasicSerializer(read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'sender',
            'notification_type',
            'post_id',
            'comment_id',
            'friend_request_id',
            'message',
            'is_read',
            'created_at',
            'read_at',
            'time_ago',
        ]
        read_only_fields = ['id', 'created_at', 'read_at']
    
    def get_time_ago(self, obj):
        """Obtener tiempo transcurrido"""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff < timedelta(minutes=1):
            return 'Hace un momento'
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f'Hace {minutes} minuto{"s" if minutes > 1 else ""}'
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f'Hace {hours} hora{"s" if hours > 1 else ""}'
        elif diff < timedelta(days=7):
            days = diff.days
            return f'Hace {days} día{"s" if days > 1 else ""}'
        elif diff < timedelta(days=30):
            weeks = diff.days // 7
            return f'Hace {weeks} semana{"s" if weeks > 1 else ""}'
        else:
            months = diff.days // 30
            return f'Hace {months} mes{"es" if months > 1 else ""}'

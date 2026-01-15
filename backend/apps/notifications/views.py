"""
Vistas para notificaciones
"""
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """Vista para listar notificaciones del usuario"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Obtener notificaciones del usuario autenticado"""
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related('sender').order_by('-created_at')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_unread_count(request):
    """Obtener cantidad de notificaciones no leídas"""
    count = Notification.objects.filter(
        recipient=request.user,
        is_read=False
    ).count()
    
    return Response({'unread_count': count})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_as_read(request, notification_id):
    """Marcar una notificación como leída"""
    try:
        notification = Notification.objects.get(
            id=notification_id,
            recipient=request.user
        )
        notification.mark_as_read()
        
        return Response({
            'message': 'Notificación marcada como leída',
            'notification': NotificationSerializer(notification).data
        })
    except Notification.DoesNotExist:
        return Response({
            'error': 'Notificación no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_as_read(request):
    """Marcar todas las notificaciones como leídas"""
    from django.utils import timezone
    
    updated = Notification.objects.filter(
        recipient=request.user,
        is_read=False
    ).update(
        is_read=True,
        read_at=timezone.now()
    )
    
    return Response({
        'message': f'{updated} notificaciones marcadas como leídas',
        'updated_count': updated
    })


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_notification(request, notification_id):
    """Eliminar una notificación"""
    try:
        notification = Notification.objects.get(
            id=notification_id,
            recipient=request.user
        )
        notification.delete()
        
        return Response({
            'message': 'Notificación eliminada'
        }, status=status.HTTP_204_NO_CONTENT)
    except Notification.DoesNotExist:
        return Response({
            'error': 'Notificación no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_all_notifications(request):
    """Eliminar todas las notificaciones del usuario"""
    deleted = Notification.objects.filter(
        recipient=request.user
    ).delete()
    
    return Response({
        'message': 'Todas las notificaciones eliminadas',
        'deleted_count': deleted[0]
    })

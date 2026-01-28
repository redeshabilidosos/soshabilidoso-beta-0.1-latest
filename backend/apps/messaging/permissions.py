"""
Permisos personalizados para sistema de mensajería
"""
from rest_framework import permissions
from .models import ChatParticipant


class IsChatParticipant(permissions.BasePermission):
    """
    Permiso que solo permite acceso a participantes del chat
    """
    
    def has_permission(self, request, view):
        """Verificar permiso a nivel de vista"""
        if not request.user.is_authenticated:
            return False
        
        # Obtener chat_room_id de diferentes fuentes
        chat_room_id = (
            view.kwargs.get('chat_room_pk') or  # Para rutas anidadas
            view.kwargs.get('chat_room_id') or
            view.kwargs.get('pk')
        )
        
        if not chat_room_id:
            return False
        
        return ChatParticipant.objects.filter(
            chat_room_id=chat_room_id,
            user=request.user
        ).exists()
    
    def has_object_permission(self, request, view, obj):
        """Verificar permiso a nivel de objeto"""
        if not request.user.is_authenticated:
            return False
        
        # Para ChatRoom
        if hasattr(obj, 'participants'):
            return obj.participants.filter(id=request.user.id).exists()
        
        # Para Message
        if hasattr(obj, 'chat_room'):
            return ChatParticipant.objects.filter(
                chat_room=obj.chat_room,
                user=request.user
            ).exists()
        
        return False


class IsChatParticipantOrReadOnly(permissions.BasePermission):
    """
    Permiso que permite lectura a todos pero escritura solo a participantes
    """
    
    def has_permission(self, request, view):
        """Verificar permiso a nivel de vista"""
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        if not request.user.is_authenticated:
            return False
        
        # Obtener chat_room_id de diferentes fuentes
        chat_room_id = (
            view.kwargs.get('chat_room_pk') or  # Para rutas anidadas
            view.kwargs.get('chat_room_id') or
            view.kwargs.get('pk')
        )
        
        if not chat_room_id:
            return True  # Para crear nuevos chats
        
        return ChatParticipant.objects.filter(
            chat_room_id=chat_room_id,
            user=request.user
        ).exists()
    
    def has_object_permission(self, request, view, obj):
        """Verificar permiso a nivel de objeto"""
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if not request.user.is_authenticated:
            return False
        
        # Para ChatRoom
        if hasattr(obj, 'participants'):
            return obj.participants.filter(id=request.user.id).exists()
        
        # Para Message
        if hasattr(obj, 'chat_room'):
            return ChatParticipant.objects.filter(
                chat_room=obj.chat_room,
                user=request.user
            ).exists()
        
        return False


class IsChatAdmin(permissions.BasePermission):
    """
    Permiso que solo permite acceso a administradores del chat
    """
    
    def has_permission(self, request, view):
        """Verificar permiso a nivel de vista"""
        if not request.user.is_authenticated:
            return False
        
        chat_room_id = view.kwargs.get('pk') or view.kwargs.get('chat_room_id')
        if not chat_room_id:
            return False
        
        return ChatParticipant.objects.filter(
            chat_room_id=chat_room_id,
            user=request.user,
            role__in=['admin', 'owner']
        ).exists()
    
    def has_object_permission(self, request, view, obj):
        """Verificar permiso a nivel de objeto"""
        if not request.user.is_authenticated:
            return False
        
        # Para ChatRoom
        if hasattr(obj, 'participants'):
            participant = ChatParticipant.objects.filter(
                chat_room=obj,
                user=request.user
            ).first()
            return participant and participant.role in ['admin', 'owner']
        
        return False


class IsMessageOwner(permissions.BasePermission):
    """
    Permiso que solo permite al autor del mensaje editarlo/eliminarlo
    """
    
    def has_object_permission(self, request, view, obj):
        """Verificar permiso a nivel de objeto"""
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.sender == request.user
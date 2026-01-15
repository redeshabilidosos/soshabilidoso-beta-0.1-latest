"""
Permisos personalizados para Posts
"""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado que solo permite a los propietarios editar sus posts
    """
    
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura para cualquier request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permisos de escritura solo para el propietario
        return obj.user == request.user


class IsOwnerOrModeratorOrReadOnly(permissions.BasePermission):
    """
    Permiso que permite editar al propietario o moderadores
    """
    
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura para cualquier request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permisos de escritura para propietario o staff
        return obj.user == request.user or request.user.is_staff


class CanCommentPermission(permissions.BasePermission):
    """
    Permiso para comentar en posts
    """
    
    def has_object_permission(self, request, view, obj):
        # Solo usuarios autenticados pueden comentar
        if not request.user.is_authenticated:
            return False
        
        # Verificar si los comentarios están habilitados
        if hasattr(obj, 'allow_comments'):
            return obj.allow_comments
        
        return True


class IsCommentOwnerOrPostOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso para comentarios: propietario del comentario o del post pueden editar
    """
    
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura para cualquier request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permisos de escritura para:
        # - Propietario del comentario
        # - Propietario del post
        # - Staff/moderadores
        return (
            obj.user == request.user or 
            obj.post.user == request.user or 
            request.user.is_staff
        )
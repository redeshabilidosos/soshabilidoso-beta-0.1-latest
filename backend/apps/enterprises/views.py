"""
Views para Empresas
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import Enterprise, EnterpriseFollow
from .serializers import (
    EnterpriseSerializer,
    EnterpriseCreateSerializer,
    EnterpriseListSerializer
)


class EnterpriseViewSet(viewsets.ModelViewSet):
    """ViewSet para empresas"""
    
    queryset = Enterprise.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'username', 'description', 'category', 'industry']
    ordering_fields = ['created_at', 'followers_count', 'name']
    ordering = ['-created_at']
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EnterpriseCreateSerializer
        if self.action == 'list':
            return EnterpriseListSerializer
        return EnterpriseSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por categoría
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filtrar por propietario
        owner = self.request.query_params.get('owner')
        if owner:
            queryset = queryset.filter(owner__username=owner)
        
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_enterprises(self, request):
        """Obtener empresas del usuario actual"""
        enterprises = Enterprise.objects.filter(owner=request.user, is_active=True)
        serializer = EnterpriseListSerializer(enterprises, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def follow(self, request, id=None):
        """Seguir una empresa"""
        enterprise = self.get_object()
        
        follow, created = EnterpriseFollow.objects.get_or_create(
            user=request.user,
            enterprise=enterprise
        )
        
        if created:
            enterprise.followers_count += 1
            enterprise.save(update_fields=['followers_count'])
            return Response({'following': True, 'followers_count': enterprise.followers_count})
        
        return Response({'following': True, 'followers_count': enterprise.followers_count})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unfollow(self, request, id=None):
        """Dejar de seguir una empresa"""
        enterprise = self.get_object()
        
        deleted, _ = EnterpriseFollow.objects.filter(
            user=request.user,
            enterprise=enterprise
        ).delete()
        
        if deleted:
            enterprise.followers_count = max(0, enterprise.followers_count - 1)
            enterprise.save(update_fields=['followers_count'])
        
        return Response({'following': False, 'followers_count': enterprise.followers_count})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upload_logo(self, request, id=None):
        """Subir logo de empresa"""
        enterprise = self.get_object()
        
        # Verificar que el usuario es el propietario
        if enterprise.owner != request.user:
            return Response(
                {'error': 'No tienes permiso para editar esta empresa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'logo' not in request.FILES:
            return Response(
                {'error': 'No se proporcionó ningún archivo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        enterprise.logo = request.FILES['logo']
        enterprise.save(update_fields=['logo'])
        
        serializer = EnterpriseSerializer(enterprise, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upload_cover(self, request, id=None):
        """Subir imagen de portada"""
        enterprise = self.get_object()
        
        if enterprise.owner != request.user:
            return Response(
                {'error': 'No tienes permiso para editar esta empresa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'cover_image' not in request.FILES:
            return Response(
                {'error': 'No se proporcionó ningún archivo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        enterprise.cover_image = request.FILES['cover_image']
        enterprise.save(update_fields=['cover_image'])
        
        serializer = EnterpriseSerializer(enterprise, context={'request': request})
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """Actualizar empresa (solo propietario)"""
        enterprise = self.get_object()
        
        if enterprise.owner != request.user:
            return Response(
                {'error': 'No tienes permiso para editar esta empresa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar empresa (solo propietario)"""
        enterprise = self.get_object()
        
        if enterprise.owner != request.user:
            return Response(
                {'error': 'No tienes permiso para eliminar esta empresa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Soft delete
        enterprise.is_active = False
        enterprise.save(update_fields=['is_active'])
        
        return Response(status=status.HTTP_204_NO_CONTENT)

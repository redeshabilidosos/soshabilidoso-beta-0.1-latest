"""
Views para el sistema de donaciones
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q, Sum
from django.utils import timezone

from .models import SportCategory, AthleteProfile, AthleteMedia, Donation
from .serializers import (
    SportCategorySerializer,
    AthleteProfileListSerializer,
    AthleteProfileDetailSerializer,
    AthleteProfileCreateSerializer,
    AthleteMediaSerializer,
    AthleteMediaUploadSerializer,
    DonationSerializer,
    DonationCreateSerializer,
)


class SportCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para categorías de deportes"""
    
    queryset = SportCategory.objects.filter(is_active=True)
    serializer_class = SportCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class AthleteProfileViewSet(viewsets.ModelViewSet):
    """ViewSet para perfiles de deportistas"""
    
    queryset = AthleteProfile.objects.filter(status='approved')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AthleteProfileCreateSerializer
        if self.action in ['retrieve', 'update', 'partial_update']:
            return AthleteProfileDetailSerializer
        return AthleteProfileListSerializer
    
    def get_queryset(self):
        queryset = AthleteProfile.objects.all()
        
        # Solo mostrar aprobados para usuarios no autenticados
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='approved')
        elif self.action == 'list':
            # Para listado, mostrar aprobados + los propios del usuario
            queryset = queryset.filter(
                Q(status='approved') | Q(user=self.request.user)
            )
        
        # Filtros
        sport = self.request.query_params.get('sport')
        if sport:
            queryset = queryset.filter(sport__slug=sport)
        
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(sport__name__icontains=search) |
                Q(city__icontains=search) |
                Q(description__icontains=search)
            )
        
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        return queryset.select_related('sport', 'user').prefetch_related('media')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Obtener el perfil de deportista del usuario actual"""
        try:
            profile = AthleteProfile.objects.get(user=request.user)
            serializer = AthleteProfileDetailSerializer(profile)
            return Response(serializer.data)
        except AthleteProfile.DoesNotExist:
            return Response(
                {'detail': 'No tienes un perfil de deportista'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_media(self, request, pk=None):
        """Subir foto o video al perfil"""
        athlete = self.get_object()
        
        # Verificar que el usuario es el dueño del perfil
        if athlete.user != request.user:
            return Response(
                {'detail': 'No tienes permiso para modificar este perfil'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = AthleteMediaUploadSerializer(
            data=request.data,
            context={'athlete_id': athlete.id}
        )
        
        if serializer.is_valid():
            media = serializer.save()
            return Response(
                AthleteMediaSerializer(media).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def delete_media(self, request, pk=None):
        """Eliminar un medio del perfil"""
        athlete = self.get_object()
        
        if athlete.user != request.user:
            return Response(
                {'detail': 'No tienes permiso para modificar este perfil'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        media_id = request.data.get('media_id')
        try:
            media = AthleteMedia.objects.get(id=media_id, athlete=athlete)
            media.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AthleteMedia.DoesNotExist:
            return Response(
                {'detail': 'Medio no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def donations(self, request, pk=None):
        """Obtener donaciones de un deportista"""
        athlete = self.get_object()
        donations = athlete.donations.filter(status='completed').order_by('-created_at')
        
        # Paginar
        page = self.paginate_queryset(donations)
        if page is not None:
            serializer = DonationSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Obtener estadísticas del deportista"""
        athlete = self.get_object()
        
        donations = athlete.donations.filter(status='completed')
        
        return Response({
            'total_raised': athlete.raised_amount,
            'goal_amount': athlete.goal_amount,
            'progress_percentage': athlete.progress_percentage,
            'donors_count': athlete.donors_count,
            'donations_count': donations.count(),
            'average_donation': donations.aggregate(
                avg=Sum('amount') / donations.count() if donations.count() > 0 else 0
            )['avg'] or 0,
        })


class DonationViewSet(viewsets.ModelViewSet):
    """ViewSet para donaciones"""
    
    queryset = Donation.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DonationCreateSerializer
        return DonationSerializer
    
    def get_queryset(self):
        queryset = Donation.objects.all()
        
        # Filtrar por usuario si está autenticado
        if self.request.user.is_authenticated:
            if self.action == 'list':
                # Mostrar solo las donaciones del usuario
                queryset = queryset.filter(donor=self.request.user)
        
        return queryset.select_related('athlete', 'donor').order_by('-created_at')
    
    def perform_create(self, serializer):
        donation = serializer.save()
        
        # Simular procesamiento de pago (en producción integrar con pasarela)
        # Por ahora marcamos como completada directamente
        donation.status = 'completed'
        donation.completed_at = timezone.now()
        donation.save()
        
        # Actualizar estadísticas del deportista
        donation.athlete.update_stats()
    
    @action(detail=False, methods=['get'])
    def my_donations(self, request):
        """Obtener donaciones realizadas por el usuario"""
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Debes iniciar sesión'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        donations = Donation.objects.filter(
            donor=request.user
        ).select_related('athlete').order_by('-created_at')
        
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Obtener donaciones recientes (públicas)"""
        donations = Donation.objects.filter(
            status='completed',
            is_anonymous=False
        ).select_related('athlete', 'donor').order_by('-created_at')[:20]
        
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)

"""
Views para el sistema de publicidad
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.utils import timezone
from django.db.models import F, Q, Sum, Count
from django.db.models.functions import Random
from datetime import timedelta
import random

from .models import Advertisement, AdImpression, AdClick, AdVideoView
from .serializers import (
    AdvertisementSerializer, AdvertisementAdminSerializer,
    AdForFeedSerializer, AdImpressionSerializer, AdClickSerializer,
    AdVideoViewSerializer, AdStatsSerializer
)


class AdvertisementViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de anuncios"""
    queryset = Advertisement.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve'] and not self.request.user.is_staff:
            return AdvertisementSerializer
        return AdvertisementAdminSerializer
    
    def get_permissions(self):
        if self.action in ['get_feed_ads', 'record_impression', 'record_click', 'record_video_view']:
            return [AllowAny()]
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminUser()]
    
    def get_queryset(self):
        queryset = Advertisement.objects.all()
        
        # Filtros para admin
        if self.request.user.is_staff:
            status_filter = self.request.query_params.get('status')
            ad_type = self.request.query_params.get('ad_type')
            position = self.request.query_params.get('position')
            
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            if ad_type:
                queryset = queryset.filter(ad_type=ad_type)
            if position:
                queryset = queryset.filter(position=position)
        else:
            # Solo anuncios activos para usuarios normales
            queryset = queryset.filter(
                status='active',
                is_active=True,
                start_date__lte=timezone.now(),
                end_date__gte=timezone.now()
            )
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def get_feed_ads(self, request):
        """
        Obtener anuncios para mostrar en el feed.
        Parámetros:
        - position: posición en el feed (número de post actual)
        - count: cantidad de anuncios a obtener (default: 1)
        """
        position_in_feed = int(request.query_params.get('position', 0))
        count = int(request.query_params.get('count', 1))
        
        now = timezone.now()
        user = request.user if request.user.is_authenticated else None
        
        # Obtener anuncios activos para el feed
        ads = Advertisement.objects.filter(
            status='active',
            is_active=True,
            start_date__lte=now,
            end_date__gte=now,
            position__in=['feed', 'between_posts']
        )
        
        # Filtrar por presupuesto disponible
        ads = ads.filter(
            Q(budget=0) | Q(total_spent__lt=F('budget'))
        )
        
        # Filtrar por límites de impresiones
        ads = ads.filter(
            Q(max_impressions=0) | Q(impressions__lt=F('max_impressions'))
        )
        
        # Si hay usuario, filtrar por límites de usuario
        if user:
            # Obtener conteo de impresiones del usuario
            user_impressions = AdImpression.objects.filter(user=user)
            
            # Excluir anuncios que el usuario ya vio demasiadas veces
            for ad in list(ads):
                total_user_views = user_impressions.filter(ad=ad).count()
                today_views = user_impressions.filter(
                    ad=ad, 
                    viewed_at__date=now.date()
                ).count()
                
                if total_user_views >= ad.max_impressions_per_user:
                    ads = ads.exclude(id=ad.id)
                elif today_views >= ad.max_impressions_per_day:
                    ads = ads.exclude(id=ad.id)
        
        # Ordenar por prioridad y peso aleatorio
        ads = list(ads.order_by('-priority'))
        
        if ads:
            # Selección ponderada por peso
            weights = [ad.weight for ad in ads]
            total_weight = sum(weights)
            
            selected_ads = []
            for _ in range(min(count, len(ads))):
                if not ads:
                    break
                    
                # Selección ponderada
                r = random.uniform(0, total_weight)
                cumulative = 0
                for i, ad in enumerate(ads):
                    cumulative += ad.weight
                    if r <= cumulative:
                        selected_ads.append(ad)
                        total_weight -= ad.weight
                        ads.pop(i)
                        break
            
            serializer = AdForFeedSerializer(selected_ads, many=True, context={'request': request})
            return Response({
                'ads': serializer.data,
                'position': position_in_feed
            })
        
        return Response({'ads': [], 'position': position_in_feed})
    
    @action(detail=True, methods=['post'])
    def record_impression(self, request, pk=None):
        """Registrar una impresión de anuncio"""
        ad = self.get_object()
        user = request.user if request.user.is_authenticated else None
        
        # Crear registro de impresión
        impression = AdImpression.objects.create(
            ad=ad,
            user=user,
            session_id=request.session.session_key or '',
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            position_in_feed=request.data.get('position', 0)
        )
        
        # Actualizar contadores
        ad.impressions = F('impressions') + 1
        if user:
            # Verificar si es vista única
            existing = AdImpression.objects.filter(ad=ad, user=user).count()
            if existing == 1:  # Esta es la primera
                ad.unique_views = F('unique_views') + 1
        ad.save(update_fields=['impressions', 'unique_views'])
        
        # Calcular costo
        if ad.cost_per_impression > 0:
            cost = float(ad.cost_per_impression) / 1000  # CPM
            Advertisement.objects.filter(pk=ad.pk).update(
                total_spent=F('total_spent') + cost
            )
        
        return Response({
            'success': True,
            'impression_id': str(impression.id)
        })
    
    @action(detail=True, methods=['post'])
    def record_click(self, request, pk=None):
        """Registrar un click en anuncio"""
        ad = self.get_object()
        user = request.user if request.user.is_authenticated else None
        impression_id = request.data.get('impression_id')
        
        impression = None
        if impression_id:
            try:
                impression = AdImpression.objects.get(id=impression_id)
            except AdImpression.DoesNotExist:
                pass
        
        # Crear registro de click
        click = AdClick.objects.create(
            ad=ad,
            user=user,
            impression=impression,
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Actualizar contadores
        ad.clicks = F('clicks') + 1
        ad.save(update_fields=['clicks'])
        
        # Calcular costo CPC
        if ad.cost_per_click > 0:
            Advertisement.objects.filter(pk=ad.pk).update(
                total_spent=F('total_spent') + ad.cost_per_click
            )
        
        return Response({
            'success': True,
            'click_id': str(click.id),
            'redirect_url': ad.link_url
        })
    
    @action(detail=True, methods=['post'])
    def record_video_view(self, request, pk=None):
        """Registrar vista de video"""
        ad = self.get_object()
        user = request.user if request.user.is_authenticated else None
        
        watch_duration = request.data.get('watch_duration', 0)
        video_duration = request.data.get('video_duration', 0)
        completed = request.data.get('completed', False)
        
        video_view = AdVideoView.objects.create(
            ad=ad,
            user=user,
            watch_duration=watch_duration,
            video_duration=video_duration,
            completed=completed
        )
        
        # Actualizar contadores
        ad.video_views = F('video_views') + 1
        if completed:
            ad.video_completions = F('video_completions') + 1
        ad.save(update_fields=['video_views', 'video_completions'])
        
        return Response({
            'success': True,
            'view_id': str(video_view.id)
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtener estadísticas generales de publicidad"""
        if not request.user.is_staff:
            return Response({'error': 'No autorizado'}, status=403)
        
        ads = Advertisement.objects.all()
        active_ads = ads.filter(status='active', is_active=True)
        
        total_impressions = ads.aggregate(Sum('impressions'))['impressions__sum'] or 0
        total_clicks = ads.aggregate(Sum('clicks'))['clicks__sum'] or 0
        total_spent = ads.aggregate(Sum('total_spent'))['total_spent__sum'] or 0
        
        avg_ctr = 0
        if total_impressions > 0:
            avg_ctr = (total_clicks / total_impressions) * 100
        
        return Response({
            'total_ads': ads.count(),
            'active_ads': active_ads.count(),
            'total_impressions': total_impressions,
            'total_clicks': total_clicks,
            'total_spent': float(total_spent),
            'average_ctr': round(avg_ctr, 2)
        })
    
    def get_client_ip(self, request):
        """Obtener IP del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

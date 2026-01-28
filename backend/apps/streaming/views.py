from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.utils import timezone
from django.db.models import Q
from .models import (
    StreamSession, StreamGift, StreamViewer,
    StreamChatMessage, StreamReport, StreamEarnings
)
from .serializers import (
    StreamSessionSerializer, StreamGiftSerializer, StreamViewerSerializer,
    StreamChatMessageSerializer, StreamReportSerializer, StreamEarningsSerializer
)


class StreamSessionViewSet(viewsets.ModelViewSet):
    queryset = StreamSession.objects.all()
    serializer_class = StreamSessionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar streams baneados para usuarios normales
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_banned=False)
        
        # Filtrar por estado
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Solo streams en vivo
        if self.request.query_params.get('live_only', 'false').lower() == 'true':
            queryset = queryset.filter(status='live')
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(streamer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def end_stream(self, request, pk=None):
        """Finalizar un stream"""
        stream = self.get_object()
        
        if stream.streamer != request.user and not request.user.is_staff:
            return Response(
                {'error': 'No tienes permiso para finalizar este stream'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        stream.status = 'ended'
        stream.ended_at = timezone.now()
        stream.save()
        
        # Marcar todos los viewers como que salieron
        stream.viewers.filter(left_at__isnull=True).update(left_at=timezone.now())
        
        return Response({'message': 'Stream finalizado exitosamente'})
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Obtener estadísticas del stream"""
        stream = self.get_object()
        
        total_gifts = stream.gifts.count()
        total_viewers = stream.viewers.count()
        total_messages = stream.chat_messages.filter(is_deleted=False).count()
        
        return Response({
            'peak_viewers': stream.peak_viewers,
            'total_gifts': total_gifts,
            'total_gifts_amount': float(stream.total_gifts_received),
            'total_viewers': total_viewers,
            'total_messages': total_messages,
        })


class StreamGiftViewSet(viewsets.ModelViewSet):
    queryset = StreamGift.objects.all()
    serializer_class = StreamGiftSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por stream
        stream_id = self.request.query_params.get('stream_id', None)
        if stream_id:
            queryset = queryset.filter(stream_session_id=stream_id)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class StreamViewerViewSet(viewsets.ModelViewSet):
    queryset = StreamViewer.objects.all()
    serializer_class = StreamViewerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por stream
        stream_id = self.request.query_params.get('stream_id', None)
        if stream_id:
            queryset = queryset.filter(stream_session_id=stream_id)
        
        # Solo viewers activos
        if self.request.query_params.get('active_only', 'false').lower() == 'true':
            queryset = queryset.filter(left_at__isnull=True, is_banned=False)
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def join_stream(self, request):
        """Unirse a un stream"""
        stream_id = request.data.get('stream_id')
        
        if not stream_id:
            return Response(
                {'error': 'stream_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            stream = StreamSession.objects.get(id=stream_id, status='live', is_banned=False)
        except StreamSession.DoesNotExist:
            return Response(
                {'error': 'Stream no encontrado o no está en vivo'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar si el usuario está baneado
        existing_viewer = StreamViewer.objects.filter(
            stream_session=stream,
            user=request.user
        ).first()
        
        if existing_viewer and existing_viewer.is_banned:
            return Response(
                {'error': 'Has sido baneado de este stream'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Crear o actualizar viewer
        viewer, created = StreamViewer.objects.get_or_create(
            stream_session=stream,
            user=request.user,
            defaults={'joined_at': timezone.now()}
        )
        
        if not created:
            viewer.left_at = None
            viewer.save()
        
        # Actualizar peak viewers
        current_viewers = stream.viewers.filter(left_at__isnull=True, is_banned=False).count()
        if current_viewers > stream.peak_viewers:
            stream.peak_viewers = current_viewers
            stream.save()
        
        serializer = self.get_serializer(viewer)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def leave_stream(self, request):
        """Salir de un stream"""
        stream_id = request.data.get('stream_id')
        
        if not stream_id:
            return Response(
                {'error': 'stream_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            viewer = StreamViewer.objects.get(
                stream_session_id=stream_id,
                user=request.user,
                left_at__isnull=True
            )
            viewer.left_at = timezone.now()
            viewer.save()
            
            return Response({'message': 'Saliste del stream exitosamente'})
        except StreamViewer.DoesNotExist:
            return Response(
                {'error': 'No estás viendo este stream'},
                status=status.HTTP_404_NOT_FOUND
            )


class StreamChatMessageViewSet(viewsets.ModelViewSet):
    queryset = StreamChatMessage.objects.all()
    serializer_class = StreamChatMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset().filter(is_deleted=False)
        
        # Filtrar por stream
        stream_id = self.request.query_params.get('stream_id', None)
        if stream_id:
            queryset = queryset.filter(stream_session_id=stream_id)
        
        return queryset.order_by('sent_at')
    
    def perform_create(self, serializer):
        # Verificar que el usuario no esté baneado
        stream_id = self.request.data.get('stream_session')
        viewer = StreamViewer.objects.filter(
            stream_session_id=stream_id,
            user=self.request.user
        ).first()
        
        if viewer and viewer.is_banned:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Has sido baneado de este stream')
        
        serializer.save(user=self.request.user)


class StreamReportViewSet(viewsets.ModelViewSet):
    queryset = StreamReport.objects.all()
    serializer_class = StreamReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Staff puede ver todos los reportes
        if self.request.user.is_staff:
            return queryset
        
        # Usuarios normales solo ven sus propios reportes
        return queryset.filter(reported_by=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)


class StreamEarningsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StreamEarnings.objects.all()
    serializer_class = StreamEarningsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Staff puede ver todas las ganancias
        if self.request.user.is_staff:
            return queryset
        
        # Streamers solo ven sus propias ganancias
        return queryset.filter(streamer=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_earnings(self, request):
        """Obtener ganancias del usuario actual"""
        from django.db.models import Sum
        
        total_earnings = StreamEarnings.objects.filter(
            streamer=request.user
        ).aggregate(
            total=Sum('total_amount'),
            net=Sum('net_amount'),
            paid=Sum('net_amount', filter=Q(is_paid=True))
        )
        
        return Response({
            'total_earned': float(total_earnings['total'] or 0),
            'net_earned': float(total_earnings['net'] or 0),
            'paid': float(total_earnings['paid'] or 0),
            'pending': float((total_earnings['net'] or 0) - (total_earnings['paid'] or 0))
        })

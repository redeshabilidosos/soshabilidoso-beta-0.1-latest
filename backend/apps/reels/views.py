from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Reel, ReelComment
from .serializers import ReelSerializer, ReelCreateSerializer, ReelCommentSerializer

class ReelViewSet(viewsets.ModelViewSet):
    queryset = Reel.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReelCreateSerializer
        return ReelSerializer
    
    def get_queryset(self):
        queryset = Reel.objects.filter(is_active=True)
        
        # Filtrar por usuario
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(author_id=user_id)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Dar/quitar like a un reel"""
        reel = self.get_object()
        
        if reel.likes.filter(id=request.user.id).exists():
            reel.likes.remove(request.user)
            liked = False
        else:
            reel.likes.add(request.user)
            liked = True
        
        return Response({
            'liked': liked,
            'like_count': reel.like_count
        })
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        """Incrementar contador de vistas"""
        reel = self.get_object()
        reel.views_count += 1
        reel.save()
        
        return Response({'views_count': reel.views_count})
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Obtener comentarios de un reel"""
        reel = self.get_object()
        comments = reel.comments.filter(parent=None)
        serializer = ReelCommentSerializer(comments, many=True)
        return Response(serializer.data)

class ReelCommentViewSet(viewsets.ModelViewSet):
    serializer_class = ReelCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        reel_id = self.kwargs.get('reel_pk')
        return ReelComment.objects.filter(reel_id=reel_id)
    
    def perform_create(self, serializer):
        reel_id = self.kwargs.get('reel_pk')
        serializer.save(author=self.request.user, reel_id=reel_id)

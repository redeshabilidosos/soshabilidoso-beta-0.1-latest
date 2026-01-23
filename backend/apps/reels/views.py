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
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Incrementar contador de compartidos"""
        reel = self.get_object()
        reel.share_count += 1
        reel.save()
        
        return Response({
            'share_count': reel.share_count,
            'share_url': f"{request.build_absolute_uri('/reels')}?id={reel.id}"
        })
    
    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        """Obtener o crear comentarios de un reel"""
        reel = self.get_object()
        
        if request.method == 'GET':
            comments = reel.comments.filter(parent=None).order_by('-created_at')
            serializer = ReelCommentSerializer(comments, many=True, context={'request': request})
            return Response({'results': serializer.data})
        
        elif request.method == 'POST':
            serializer = ReelCommentSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(author=request.user, reel=reel)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='comments/(?P<comment_id>[^/.]+)/like')
    def like_comment(self, request, comment_id=None, pk=None):
        """Dar/quitar like a un comentario de reel"""
        try:
            reel = self.get_object()
            comment = ReelComment.objects.get(id=comment_id, reel=reel)
            
            if comment.likes.filter(id=request.user.id).exists():
                comment.likes.remove(request.user)
                liked = False
            else:
                comment.likes.add(request.user)
                liked = True
            
            return Response({
                'liked': liked,
                'likes_count': comment.likes_count
            })
        except ReelComment.DoesNotExist:
            return Response(
                {'error': 'Comentario no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class ReelCommentViewSet(viewsets.ModelViewSet):
    serializer_class = ReelCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        reel_id = self.kwargs.get('reel_pk')
        return ReelComment.objects.filter(reel_id=reel_id)
    
    def perform_create(self, serializer):
        reel_id = self.kwargs.get('reel_pk')
        serializer.save(author=self.request.user, reel_id=reel_id)

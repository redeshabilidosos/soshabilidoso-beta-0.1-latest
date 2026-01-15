"""
Views específicas para comentarios
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from django.db.models import F
from drf_spectacular.utils import extend_schema
from .models import Comment, CommentLike, Post
from .serializers import CommentSerializer, CommentCreateSerializer
from .permissions import IsCommentOwnerOrPostOwnerOrReadOnly


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet para comentarios"""
    
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCommentOwnerOrPostOwnerOrReadOnly]
    
    def get_queryset(self):
        """Obtener comentarios del post específico"""
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(
            post_id=post_id
        ).select_related('user', 'post').prefetch_related('replies', 'likes')
    
    def get_serializer_class(self):
        """Obtener serializer según la acción"""
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer
    
    def perform_create(self, serializer):
        """Crear comentario"""
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        
        if not post.allow_comments:
            raise ValidationError("Los comentarios están deshabilitados para este post")
        
        comment = serializer.save(
            user=self.request.user,
            post=post
        )
        
        # Incrementar contador de comentarios del post
        Post.objects.filter(id=post.id).update(comments_count=F('comments_count') + 1)
        
        # Si es una respuesta, incrementar contador del comentario padre
        if comment.parent:
            Comment.objects.filter(id=comment.parent.id).update(
                replies_count=F('replies_count') + 1
            )
    
    def perform_destroy(self, instance):
        """Eliminar comentario"""
        post = instance.post
        parent = instance.parent
        
        # Decrementar contador de comentarios del post
        Post.objects.filter(id=post.id).update(comments_count=F('comments_count') - 1)
        
        # Si es una respuesta, decrementar contador del comentario padre
        if parent:
            Comment.objects.filter(id=parent.id).update(
                replies_count=F('replies_count') - 1
            )
        
        instance.delete()
    
    @extend_schema(
        summary="Like a comentario",
        description="Dar o quitar like a un comentario"
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, post_id=None, pk=None):
        """Dar like a un comentario"""
        comment = self.get_object()
        
        like = CommentLike.objects.filter(
            user=request.user,
            comment=comment
        ).first()
        
        if like:
            # Si ya tiene like, quitarlo
            like.delete()
            Comment.objects.filter(id=comment.id).update(likes_count=F('likes_count') - 1)
            
            return Response({
                'message': 'Like removido',
                'liked': False
            }, status=status.HTTP_200_OK)
        else:
            # Agregar like
            CommentLike.objects.create(
                user=request.user,
                comment=comment
            )
            Comment.objects.filter(id=comment.id).update(likes_count=F('likes_count') + 1)
            
            return Response({
                'message': 'Like agregado',
                'liked': True
            }, status=status.HTTP_201_CREATED)
    
    @extend_schema(
        summary="Obtener respuestas",
        description="Obtener todas las respuestas de un comentario"
    )
    @action(detail=True, methods=['get'])
    def replies(self, request, post_id=None, pk=None):
        """Obtener respuestas del comentario"""
        comment = self.get_object()
        replies = comment.replies.all().select_related('user')
        
        serializer = CommentSerializer(
            replies,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    
    @extend_schema(
        summary="Responder comentario",
        description="Crear una respuesta a un comentario"
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reply(self, request, post_id=None, pk=None):
        """Responder a un comentario"""
        parent_comment = self.get_object()
        
        # No permitir respuestas a respuestas (máximo 2 niveles)
        if parent_comment.parent is not None:
            return Response({
                'error': 'No se pueden crear respuestas a respuestas'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CommentCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            reply = serializer.save(
                user=request.user,
                post=parent_comment.post,
                parent=parent_comment
            )
            
            # Incrementar contadores
            Post.objects.filter(id=parent_comment.post.id).update(
                comments_count=F('comments_count') + 1
            )
            Comment.objects.filter(id=parent_comment.id).update(
                replies_count=F('replies_count') + 1
            )
            
            response_serializer = CommentSerializer(
                reply,
                context={'request': request}
            )
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
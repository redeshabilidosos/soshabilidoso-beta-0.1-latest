"""
Vistas para posts y interacciones
"""
from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import get_user_model

from .models import Post, PostReaction, Comment, CommentLike, PostShare, PostBookmark
from .serializers import (
    PostSerializer, PostCreateSerializer, PostReactionSerializer,
    CommentSerializer, CommentCreateSerializer
)

User = get_user_model()


class PostListCreateView(generics.ListCreateAPIView):
    """Vista para listar y crear posts"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer
    
    def create(self, request, *args, **kwargs):
        """Crear post y devolver respuesta completa"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            post = serializer.save(user=request.user)
            
            # Devolver el post completo usando PostSerializer
            response_serializer = PostSerializer(post, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"❌ Error en create: {str(e)}")
            import traceback
            traceback.print_exc()
            raise
    
    def get_queryset(self):
        """Obtener posts del feed del usuario"""
        from apps.users.models import Friendship
        
        user = self.request.user
        
        # Verificar si se solicita filtro de amigos/seguidos
        friends_only = self.request.query_params.get('friends_only', 'true').lower() == 'true'
        
        if friends_only:
            # Obtener usuarios que sigue
            following_users = list(user.following_set.values_list('following', flat=True))
            
            # Obtener amigos (de ambas direcciones en la tabla Friendship)
            friends_as_user1 = Friendship.objects.filter(user1=user).values_list('user2', flat=True)
            friends_as_user2 = Friendship.objects.filter(user2=user).values_list('user1', flat=True)
            friend_ids = list(friends_as_user1) + list(friends_as_user2)
            
            # Combinar seguidos y amigos (sin duplicados)
            all_related_users = list(set(following_users + friend_ids))
            
            # Posts del usuario, de usuarios que sigue y de amigos
            queryset = Post.objects.filter(
                Q(user=user) | Q(user__in=all_related_users),
                is_public=True
            ).select_related('user').prefetch_related('reactions', 'comments')
        else:
            # Todos los posts públicos
            queryset = Post.objects.filter(
                is_public=True
            ).select_related('user').prefetch_related('reactions', 'comments')
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        post = serializer.save(user=self.request.user)
        return post


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vista para obtener, actualizar y eliminar un post específico"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Post.objects.select_related('user').prefetch_related('reactions', 'comments')
    
    def get_object(self):
        pk = self.kwargs['pk']
        
        # Intentar buscar por UUID primero, luego por short_id
        try:
            post = get_object_or_404(Post, id=pk)
        except:
            post = get_object_or_404(Post, short_id=pk)
        
        # Verificar permisos
        if post.user != self.request.user and not post.is_public:
            self.permission_denied(self.request)
        
        return post


class PostReactionView(APIView):
    """Vista para manejar reacciones a posts"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, post_id):
        """Agregar o cambiar reacción"""
        post = get_object_or_404(Post, id=post_id)
        reaction_type = request.data.get('reaction_type')
        
        # Mapear tipos del frontend a tipos del backend
        type_mapping = {
            'like': 'like',
            'laugh': 'celebration',  # Frontend usa 'laugh', backend usa 'celebration'
            'dislike': 'golazo',     # Frontend usa 'dislike', backend usa 'golazo'
            'celebration': 'celebration',
            'golazo': 'golazo',
        }
        
        reaction_type = type_mapping.get(reaction_type, reaction_type)
        
        if reaction_type not in ['like', 'celebration', 'golazo']:
            return Response({
                'error': 'Tipo de reacción inválido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si ya existe una reacción del usuario
        existing_reaction = PostReaction.objects.filter(
            user=request.user,
            post=post,
            reaction_type=reaction_type
        ).first()
        
        if existing_reaction:
            # Si ya existe la misma reacción, eliminarla (toggle)
            existing_reaction.delete()
            post.update_reaction_counts()
            return Response({
                'message': 'Reacción eliminada',
                'counts': {
                    'likes_count': post.likes_count,
                    'celebrations_count': post.celebrations_count,
                    'golazos_count': post.golazos_count,
                    'laughs_count': post.celebrations_count,  # Alias para frontend
                    'dislikes_count': post.golazos_count,     # Alias para frontend
                }
            }, status=status.HTTP_200_OK)
        
        # Eliminar otras reacciones del usuario en este post
        PostReaction.objects.filter(user=request.user, post=post).delete()
        
        # Crear nueva reacción
        reaction = PostReaction.objects.create(
            user=request.user,
            post=post,
            reaction_type=reaction_type
        )
        
        # Actualizar contadores
        post.update_reaction_counts()
        
        return Response({
            'message': 'Reacción agregada',
            'reaction': PostReactionSerializer(reaction).data,
            'counts': {
                'likes_count': post.likes_count,
                'celebrations_count': post.celebrations_count,
                'golazos_count': post.golazos_count,
                'laughs_count': post.celebrations_count,  # Alias para frontend
                'dislikes_count': post.golazos_count,     # Alias para frontend
            }
        }, status=status.HTTP_201_CREATED)
    
    def delete(self, request, post_id):
        """Eliminar reacción"""
        post = get_object_or_404(Post, id=post_id)
        
        reaction = PostReaction.objects.filter(
            user=request.user,
            post=post
        ).first()
        
        if not reaction:
            return Response({
                'error': 'No tienes reacciones en este post'
            }, status=status.HTTP_404_NOT_FOUND)
        
        reaction.delete()
        post.update_reaction_counts()
        
        return Response({
            'message': 'Reacción eliminada',
            'counts': {
                'likes_count': post.likes_count,
                'celebrations_count': post.celebrations_count,
                'golazos_count': post.golazos_count,
            }
        }, status=status.HTTP_200_OK)


class CommentListCreateView(generics.ListCreateAPIView):
    """Vista para listar y crear comentarios"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer
        return CommentSerializer
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(
            post_id=post_id,
            parent=None  # Solo comentarios principales
        ).select_related('user').prefetch_related('replies', 'likes').order_by('created_at')
    
    def create(self, request, *args, **kwargs):
        """Crear comentario y devolver respuesta completa"""
        post = get_object_or_404(Post, id=kwargs['post_id'])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(user=request.user, post=post)
        
        # Actualizar contador de comentarios del post
        post.update_comments_count()
        
        # Devolver el comentario completo
        response_serializer = CommentSerializer(comment, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vista para obtener, actualizar y eliminar comentarios"""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Comment.objects.select_related('user').prefetch_related('replies', 'likes')
    
    def get_object(self):
        comment = get_object_or_404(Comment, id=self.kwargs['pk'])
        
        # Solo el autor puede editar/eliminar
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if comment.user != self.request.user:
                self.permission_denied(self.request)
        
        return comment


class CommentLikeView(APIView):
    """Vista para dar like a comentarios"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, comment_id):
        """Dar like a comentario"""
        comment = get_object_or_404(Comment, id=comment_id)
        
        like, created = CommentLike.objects.get_or_create(
            user=request.user,
            comment=comment
        )
        
        if not created:
            return Response({
                'message': 'Ya has dado like a este comentario'
            }, status=status.HTTP_200_OK)
        
        # Actualizar contador
        comment.update_likes_count()
        
        return Response({
            'message': 'Like agregado',
            'likes_count': comment.likes_count
        }, status=status.HTTP_201_CREATED)
    
    def delete(self, request, comment_id):
        """Quitar like de comentario"""
        comment = get_object_or_404(Comment, id=comment_id)
        
        like = CommentLike.objects.filter(
            user=request.user,
            comment=comment
        ).first()
        
        if not like:
            return Response({
                'error': 'No has dado like a este comentario'
            }, status=status.HTTP_404_NOT_FOUND)
        
        like.delete()
        comment.update_likes_count()
        
        return Response({
            'message': 'Like eliminado',
            'likes_count': comment.likes_count
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def share_post(request, post_id):
    """Compartir un post"""
    post = get_object_or_404(Post, id=post_id)
    message = request.data.get('message', '')
    
    share, created = PostShare.objects.get_or_create(
        user=request.user,
        post=post,
        defaults={'message': message}
    )
    
    if not created:
        return Response({
            'message': 'Ya has compartido este post'
        }, status=status.HTTP_200_OK)
    
    # Actualizar contador
    post.update_shares_count()
    
    return Response({
        'message': 'Post compartido exitosamente',
        'shares_count': post.shares_count
    }, status=status.HTTP_201_CREATED)


@api_view(['POST', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def bookmark_post(request, post_id):
    """Guardar/quitar post de favoritos"""
    post = get_object_or_404(Post, id=post_id)
    
    if request.method == 'POST':
        bookmark, created = PostBookmark.objects.get_or_create(
            user=request.user,
            post=post
        )
        
        if not created:
            return Response({
                'message': 'Post ya está en favoritos'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'Post agregado a favoritos'
        }, status=status.HTTP_201_CREATED)
    
    else:  # DELETE
        bookmark = PostBookmark.objects.filter(
            user=request.user,
            post=post
        ).first()
        
        if not bookmark:
            return Response({
                'error': 'Post no está en favoritos'
            }, status=status.HTTP_404_NOT_FOUND)
        
        bookmark.delete()
        
        return Response({
            'message': 'Post eliminado de favoritos'
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def link_preview(request):
    """Obtener preview de un link"""
    import requests
    from bs4 import BeautifulSoup
    from urllib.parse import urlparse
    
    url = request.query_params.get('url')
    
    if not url:
        return Response({
            'error': 'URL requerida'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Validar que sea una URL válida
        result = urlparse(url)
        if not all([result.scheme, result.netloc]):
            return Response({
                'error': 'URL inválida'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Obtener el contenido de la página
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extraer metadatos
        preview = {
            'url': url,
            'title': None,
            'description': None,
            'image': None,
        }
        
        # Intentar obtener el título
        title_tag = soup.find('meta', property='og:title') or soup.find('meta', attrs={'name': 'title'})
        if title_tag:
            preview['title'] = title_tag.get('content')
        else:
            title_elem = soup.find('title')
            if title_elem:
                preview['title'] = title_elem.string
        
        # Intentar obtener la descripción
        desc_tag = soup.find('meta', property='og:description') or soup.find('meta', attrs={'name': 'description'})
        if desc_tag:
            preview['description'] = desc_tag.get('content')
        
        # Intentar obtener la imagen
        img_tag = soup.find('meta', property='og:image')
        if img_tag:
            preview['image'] = img_tag.get('content')
        
        return Response(preview, status=status.HTTP_200_OK)
    
    except requests.exceptions.RequestException as e:
        return Response({
            'error': f'Error al obtener el link: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Error procesando el link: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_reactions_count(request):
    """
    Obtener el conteo de reacciones que ha dado el usuario
    GET /api/posts/my-reactions-count/
    """
    try:
        user = request.user
        
        # Contar todas las reacciones que ha dado el usuario
        total_reactions = PostReaction.objects.filter(user=user).count()
        
        # Desglose por tipo
        likes = PostReaction.objects.filter(user=user, reaction_type='like').count()
        celebrations = PostReaction.objects.filter(user=user, reaction_type='celebration').count()
        golazos = PostReaction.objects.filter(user=user, reaction_type='golazo').count()
        
        return Response({
            'count': total_reactions,
            'breakdown': {
                'likes': likes,
                'celebrations': celebrations,
                'golazos': golazos,
            }
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

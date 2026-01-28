"""
Vistas para la app de usuarios
"""
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Follow, FriendRequest, Friendship
from .serializers import (
    UserSearchSerializer, UserProfileSerializer, FollowSerializer,
    FriendRequestSerializer, FriendshipSerializer
)

User = get_user_model()


class UserSearchPagination(PageNumberPagination):
    """Paginación para búsqueda de usuarios"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50


class UserListView(generics.ListAPIView):
    """Vista para listar todos los usuarios"""
    serializer_class = UserSearchSerializer
    pagination_class = UserSearchPagination
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(
            is_active=True
        ).exclude(
            id=self.request.user.id
        ).order_by('-followers_count', '-posts_count')


class SuggestedUsersView(generics.ListAPIView):
    """Vista para obtener usuarios sugeridos basados en amigos en común"""
    serializer_class = UserSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Obtener amigos del usuario actual
        user_friends = Friendship.objects.filter(
            Q(user1=user) | Q(user2=user)
        ).values_list('user1_id', 'user2_id')
        
        friend_ids = set()
        for user1_id, user2_id in user_friends:
            if user1_id != user.id:
                friend_ids.add(user1_id)
            if user2_id != user.id:
                friend_ids.add(user2_id)
        
        # Obtener usuarios que no son amigos pero tienen amigos en común
        # También incluir usuarios populares si no hay suficientes sugerencias
        suggested = User.objects.filter(
            is_active=True
        ).exclude(
            id=user.id
        ).exclude(
            id__in=friend_ids
        ).order_by('-followers_count', '-posts_count')[:10]
        
        return suggested


class UserSearchView(generics.ListAPIView):
    """Vista para buscar usuarios"""
    serializer_class = UserSearchSerializer
    pagination_class = UserSearchPagination
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        
        if not query:
            # Si no hay query, devolver usuarios sugeridos (más activos)
            return User.objects.filter(
                is_active=True
            ).exclude(
                id=self.request.user.id
            ).order_by('-followers_count', '-posts_count')[:50]
        
        # Búsqueda por username (@usuario), nombres, apellidos o email
        # Limpiar @ si el usuario lo incluye en la búsqueda
        clean_query = query.lstrip('@')
        
        return User.objects.filter(
            Q(username__icontains=clean_query) |
            Q(display_name__icontains=clean_query) |
            Q(first_name__icontains=clean_query) |
            Q(last_name__icontains=clean_query) |
            Q(email__icontains=clean_query),
            is_active=True
        ).exclude(
            id=self.request.user.id
        ).order_by('username')


class UserProfileView(generics.RetrieveAPIView):
    """Vista para obtener perfil de usuario"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'username'
    
    def get_queryset(self):
        return User.objects.filter(is_active=True)


class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    """Vista para obtener y actualizar el perfil del usuario actual"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        # Guardar el usuario actualizado
        user = serializer.save()
        
        # Si se actualizó el avatar, guardarlo en el álbum de fotos de perfil
        if 'avatar' in serializer.validated_data and serializer.validated_data['avatar']:
            self._save_to_album(user, serializer.validated_data['avatar'], 'Fotos de Perfil')
        
        # Si se actualizó el cover_photo, guardarlo en el álbum de fotos de portada
        if 'cover_photo' in serializer.validated_data and serializer.validated_data['cover_photo']:
            self._save_to_album(user, serializer.validated_data['cover_photo'], 'Fotos de Portada')
        
        user.save()
    
    def _save_to_album(self, user, image_field, album_name):
        """Guardar referencia de imagen en el álbum correspondiente"""
        try:
            from apps.media_storage.models import MediaFile, MediaAlbum
            from django.core.files.base import ContentFile
            import os
            
            # Obtener o crear el álbum
            album, created = MediaAlbum.objects.get_or_create(
                owner=user,
                name=album_name,
                defaults={
                    'description': f'{album_name} de {user.display_name}',
                    'is_public': True
                }
            )
            
            # Obtener la imagen guardada del usuario
            if album_name == 'Fotos de Perfil':
                saved_image = user.avatar
            else:
                saved_image = user.cover_photo
            
            if not saved_image:
                print(f"⚠️ No hay imagen guardada para {album_name}")
                return
            
            # Obtener información del archivo guardado
            original_name = os.path.basename(saved_image.name)
            try:
                file_size = saved_image.size
            except:
                file_size = 0
            
            # Determinar el tipo MIME
            ext = os.path.splitext(original_name)[1].lower()
            mime_types = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            }
            mime_type = mime_types.get(ext, 'image/jpeg')
            
            # Crear una copia del archivo para el MediaFile
            saved_image.seek(0)
            file_content = saved_image.read()
            saved_image.seek(0)
            
            # Crear el registro de MediaFile con una copia del archivo
            media_file = MediaFile.objects.create(
                file_type='image',
                original_name=original_name,
                file_size=len(file_content),
                mime_type=mime_type,
                uploaded_by=user,
                is_public=True
            )
            
            # Guardar el archivo
            media_file.file.save(original_name, ContentFile(file_content), save=True)
            
            # Agregar al álbum
            album.files.add(media_file)
            
            print(f"✅ Imagen guardada en álbum '{album_name}' para usuario {user.username}")
            
        except Exception as e:
            print(f"❌ Error guardando imagen en álbum: {e}")
            import traceback
            traceback.print_exc()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def follow_user(request, username):
    """Seguir a un usuario"""
    try:
        user_to_follow = User.objects.get(username=username, is_active=True)
        
        if user_to_follow == request.user:
            return Response(
                {'error': 'No puedes seguirte a ti mismo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=user_to_follow
        )
        
        if created:
            # Actualizar contador de seguidores
            user_to_follow.followers_count += 1
            user_to_follow.save(update_fields=['followers_count'])
            
            # Actualizar contador de siguiendo
            request.user.following_count += 1
            request.user.save(update_fields=['following_count'])
            
            return Response(
                {'message': f'Ahora sigues a {user_to_follow.display_name}'},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'message': 'Ya sigues a este usuario'},
                status=status.HTTP_200_OK
            )
            
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def unfollow_user(request, username):
    """Dejar de seguir a un usuario"""
    try:
        user_to_unfollow = User.objects.get(username=username, is_active=True)
        
        follow = Follow.objects.filter(
            follower=request.user,
            following=user_to_unfollow
        ).first()
        
        if follow:
            follow.delete()
            
            # Actualizar contadores
            user_to_unfollow.followers_count = max(0, user_to_unfollow.followers_count - 1)
            user_to_unfollow.save(update_fields=['followers_count'])
            
            request.user.following_count = max(0, request.user.following_count - 1)
            request.user.save(update_fields=['following_count'])
            
            return Response(
                {'message': f'Has dejado de seguir a {user_to_unfollow.display_name}'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'No sigues a este usuario'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_friend_request(request, username):
    """Enviar solicitud de amistad"""
    try:
        receiver = User.objects.get(username=username, is_active=True)
        
        if receiver == request.user:
            return Response(
                {'error': 'No puedes enviarte una solicitud de amistad a ti mismo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si ya son amigos
        friendship_exists = Friendship.objects.filter(
            Q(user1=request.user, user2=receiver) |
            Q(user1=receiver, user2=request.user)
        ).exists()
        
        if friendship_exists:
            return Response(
                {'error': 'Ya son amigos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si ya existe una solicitud pendiente
        existing_request = FriendRequest.objects.filter(
            Q(sender=request.user, receiver=receiver) |
            Q(sender=receiver, receiver=request.user),
            status='pending'
        ).first()
        
        if existing_request:
            return Response(
                {'error': 'Ya existe una solicitud de amistad pendiente'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear solicitud de amistad
        friend_request = FriendRequest.objects.create(
            sender=request.user,
            receiver=receiver,
            message=request.data.get('message', '')
        )
        
        serializer = FriendRequestSerializer(friend_request, context={'request': request})
        return Response(
            {
                'message': f'Solicitud de amistad enviada a {receiver.display_name}',
                'friend_request': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def respond_friend_request(request, request_id):
    """Responder a una solicitud de amistad"""
    try:
        friend_request = FriendRequest.objects.get(
            id=request_id,
            receiver=request.user,
            status='pending'
        )
        
        action = request.data.get('action')  # 'accept' o 'reject'
        
        if action == 'accept':
            # Crear amistad
            friendship = Friendship.objects.create(
                user1=friend_request.sender,
                user2=friend_request.receiver
            )
            
            # Actualizar estado de la solicitud
            friend_request.status = 'accepted'
            friend_request.save()
            
            return Response(
                {'message': f'Ahora eres amigo de {friend_request.sender.display_name}'},
                status=status.HTTP_200_OK
            )
            
        elif action == 'reject':
            friend_request.status = 'rejected'
            friend_request.save()
            
            return Response(
                {'message': 'Solicitud de amistad rechazada'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Acción no válida. Usa "accept" o "reject"'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except FriendRequest.DoesNotExist:
        return Response(
            {'error': 'Solicitud de amistad no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_friend_requests(request):
    """Obtener solicitudes de amistad recibidas"""
    friend_requests = FriendRequest.objects.filter(
        receiver=request.user,
        status='pending'
    ).order_by('-created_at')
    
    serializer = FriendRequestSerializer(
        friend_requests, 
        many=True, 
        context={'request': request}
    )
    
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_friends(request, username=None):
    """Obtener lista de amigos de un usuario"""
    try:
        if username:
            try:
                user = User.objects.get(username=username, is_active=True)
            except User.DoesNotExist:
                return Response(
                    {'error': 'Usuario no encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            user = request.user
        
        friendships = Friendship.objects.filter(
            Q(user1=user) | Q(user2=user)
        ).order_by('-created_at')
        
        friends = []
        for friendship in friendships:
            friend = friendship.user2 if friendship.user1 == user else friendship.user1
            friends.append(friend)
        
        serializer = UserSearchSerializer(
            friends, 
            many=True, 
            context={'request': request}
        )
        
        return Response(serializer.data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_followers(request, username):
    """Obtener seguidores de un usuario"""
    try:
        user = User.objects.get(username=username, is_active=True)
        
        follows = Follow.objects.filter(following=user).order_by('-created_at')
        followers = [follow.follower for follow in follows]
        
        serializer = UserSearchSerializer(
            followers, 
            many=True, 
            context={'request': request}
        )
        
        return Response(serializer.data)
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_following(request, username):
    """Obtener usuarios que sigue un usuario"""
    try:
        user = User.objects.get(username=username, is_active=True)
        
        follows = Follow.objects.filter(follower=user).order_by('-created_at')
        following = [follow.following for follow in follows]
        
        serializer = UserSearchSerializer(
            following, 
            many=True, 
            context={'request': request}
        )
        
        return Response(serializer.data)
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_or_get_chat(request, username):
    """Crear o obtener chat privado con un usuario"""
    try:
        other_user = User.objects.get(username=username, is_active=True)
        
        if other_user == request.user:
            return Response(
                {'error': 'No puedes crear un chat contigo mismo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Importar modelos de messaging
        from apps.messaging.models import ChatRoom, ChatParticipant
        
        # Buscar chat privado existente
        existing_chat = ChatRoom.objects.filter(
            chat_type='private',
            participants=request.user
        ).filter(
            participants=other_user
        ).first()
        
        if existing_chat:
            # Chat ya existe
            from apps.messaging.serializers import ChatRoomSerializer
            serializer = ChatRoomSerializer(existing_chat, context={'request': request})
            return Response({
                'chat': serializer.data,
                'created': False
            })
        
        # Crear nuevo chat privado
        chat_room = ChatRoom.objects.create(
            chat_type='private',
            created_by=request.user
        )
        
        # Agregar participantes
        ChatParticipant.objects.create(
            chat_room=chat_room,
            user=request.user,
            role='member'
        )
        
        ChatParticipant.objects.create(
            chat_room=chat_room,
            user=other_user,
            role='member'
        )
        
        from apps.messaging.serializers import ChatRoomSerializer
        serializer = ChatRoomSerializer(chat_room, context={'request': request})
        
        return Response({
            'chat': serializer.data,
            'created': True,
            'message': f'Chat creado con {other_user.display_name}'
        }, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_posts(request, username):
    """Obtener todas las publicaciones de un usuario"""
    try:
        user = User.objects.get(username=username, is_active=True)
        
        # Importar modelos de posts
        from apps.posts.models import Post
        from apps.posts.serializers import PostSerializer
        
        # Obtener posts del usuario
        posts = Post.objects.filter(
            user=user,
            is_archived=False
        ).select_related('user').prefetch_related(
            'reactions', 'comments', 'shares', 'bookmarks'
        ).order_by('-created_at')
        
        # Filtrar por tipo de post si se especifica
        post_type = request.query_params.get('type')
        if post_type:
            posts = posts.filter(post_type=post_type)
        
        # Paginación
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 12
        
        page = paginator.paginate_queryset(posts, request)
        if page is not None:
            serializer = PostSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_posts_stats(request, username):
    """Obtener estadísticas de publicaciones de un usuario"""
    try:
        user = User.objects.get(username=username, is_active=True)
        
        # Importar modelos de posts
        from apps.posts.models import Post
        from django.db.models import Count, Sum
        
        # Contar posts por tipo
        posts_by_type = Post.objects.filter(
            user=user,
            is_archived=False
        ).values('post_type').annotate(
            count=Count('id')
        ).order_by('post_type')
        
        # Estadísticas generales
        total_posts = Post.objects.filter(user=user, is_archived=False).count()
        total_reactions = Post.objects.filter(user=user, is_archived=False).aggregate(
            total_likes=Sum('likes_count'),
            total_celebrations=Sum('celebrations_count'),
            total_golazos=Sum('golazos_count'),
            total_comments=Sum('comments_count'),
            total_shares=Sum('shares_count'),
            total_views=Sum('views_count')
        )
        
        return Response({
            'user': {
                'username': user.username,
                'display_name': user.display_name,
                'avatar_url': user.get_avatar_url()
            },
            'stats': {
                'total_posts': total_posts,
                'posts_by_type': list(posts_by_type),
                'total_reactions': {
                    'likes': total_reactions['total_likes'] or 0,
                    'celebrations': total_reactions['total_celebrations'] or 0,
                    'golazos': total_reactions['total_golazos'] or 0,
                    'comments': total_reactions['total_comments'] or 0,
                    'shares': total_reactions['total_shares'] or 0,
                    'views': total_reactions['total_views'] or 0,
                }
            }
        })
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
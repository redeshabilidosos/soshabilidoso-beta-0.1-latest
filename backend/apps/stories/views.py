"""
Views para Stories
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from django.db.models import Q, Exists, OuterRef
from django.contrib.auth import get_user_model

from .models import Story, StoryView, StoryReaction, StoryReply
from .serializers import (
    StorySerializer, StoryCreateSerializer, UserStoriesSerializer,
    StoryReactionSerializer, StoryReplySerializer
)

User = get_user_model()


class StoryViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de historias"""
    
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_queryset(self):
        """Obtener historias no expiradas"""
        return Story.objects.filter(
            expires_at__gt=timezone.now()
        ).select_related('user')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StoryCreateSerializer
        return StorySerializer
    
    def create(self, request, *args, **kwargs):
        """Crear historia y devolver con serializer completo"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        story = serializer.save(user=request.user)
        
        # Devolver la historia con el serializer completo
        output_serializer = StorySerializer(story, context={'request': request})
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def friends(self, request):
        """
        GET /api/stories/friends/
        Obtener historias de amigos/contactos agrupadas por usuario
        """
        user = request.user
        now = timezone.now()
        
        # Obtener IDs de amigos
        friend_ids = self._get_friend_ids(user)
        
        # Incluir al usuario actual también
        all_user_ids = list(friend_ids) + [user.id]
        
        # Obtener historias no expiradas de amigos y del usuario actual
        stories = Story.objects.filter(
            user_id__in=all_user_ids,
            expires_at__gt=now
        ).select_related('user').order_by('user', '-created_at')
        
        # Agrupar por usuario
        user_stories_dict = {}
        for story in stories:
            user_id = str(story.user_id)
            if user_id not in user_stories_dict:
                user_stories_dict[user_id] = {
                    'user': story.user,
                    'stories': [],
                    'has_unviewed': False
                }
            
            # Verificar si el usuario actual ha visto esta historia
            viewed = StoryView.objects.filter(user=user, story=story).exists()
            if not viewed:
                user_stories_dict[user_id]['has_unviewed'] = True
            
            user_stories_dict[user_id]['stories'].append(story)
        
        # Convertir a lista y serializar
        result = []
        for user_id, data in user_stories_dict.items():
            stories_serialized = StorySerializer(
                data['stories'], 
                many=True, 
                context={'request': request}
            ).data
            
            result.append({
                'user': {
                    'id': str(data['user'].id),
                    'username': data['user'].username,
                    'display_name': getattr(data['user'], 'display_name', None) or data['user'].username,
                    'avatar_url': self._get_user_avatar(data['user'])
                },
                'stories': stories_serialized,
                'has_unviewed': data['has_unviewed']
            })
        
        # Ordenar: usuario actual primero, luego por historias no vistas
        result.sort(key=lambda x: (
            x['user']['id'] != str(user.id),  # Usuario actual primero
            not x['has_unviewed'],  # Luego los que tienen historias no vistas
        ))
        
        return Response({
            'count': len(result),
            'results': result
        })
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        GET /api/stories/me/
        Obtener mis propias historias
        """
        stories = Story.objects.filter(
            user=request.user,
            expires_at__gt=timezone.now()
        ).order_by('-created_at')
        
        serializer = StorySerializer(stories, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        """
        POST /api/stories/{id}/view/
        Marcar historia como vista
        """
        story = self.get_object()
        
        # No marcar como vista si es la propia historia
        if story.user == request.user:
            return Response({'detail': 'No puedes marcar tu propia historia como vista'})
        
        # Crear o actualizar visualización
        view, created = StoryView.objects.get_or_create(
            user=request.user,
            story=story
        )
        
        if created:
            story.update_views_count()
        
        return Response({'viewed': True, 'created': created})
    
    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        """
        POST /api/stories/{id}/react/
        Reaccionar a una historia
        """
        story = self.get_object()
        reaction_type = request.data.get('reaction_type')
        
        valid_types = ['like', 'fire', 'celebrate', 'thumbsup']
        if reaction_type not in valid_types:
            return Response(
                {'error': f'Tipo de reaccion invalido. Opciones: {valid_types}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear o actualizar reacción
        reaction, created = StoryReaction.objects.update_or_create(
            user=request.user,
            story=story,
            defaults={'reaction_type': reaction_type}
        )
        
        # Crear notificación si es una nueva reacción y no es la propia historia
        notification_created = False
        if created and story.user != request.user:
            try:
                from apps.notifications.models import Notification
                
                # Mapeo de emojis
                emoji_map = {
                    'like': 'corazon',
                    'fire': 'fuego',
                    'celebrate': 'celebracion',
                    'thumbsup': 'pulgar arriba'
                }
                
                Notification.objects.create(
                    recipient=story.user,
                    sender=request.user,
                    notification_type='story_reaction',
                    story_id=story.id,
                    message=f'{request.user.username} reacciono con {emoji_map.get(reaction_type, reaction_type)} a tu historia'
                )
                notification_created = True
                print(f'[OK] Notificacion creada para reaccion a historia de {story.user.username}')
            except Exception as e:
                print(f'[ERROR] No se pudo crear notificacion: {str(e)}')
        
        serializer = StoryReactionSerializer(reaction)
        return Response({
            'reaction': serializer.data,
            'created': created,
            'notification_created': notification_created
        })
    
    @action(detail=True, methods=['delete'])
    def unreact(self, request, pk=None):
        """
        DELETE /api/stories/{id}/unreact/
        Quitar reacción de una historia
        """
        story = self.get_object()
        
        deleted, _ = StoryReaction.objects.filter(
            user=request.user,
            story=story
        ).delete()
        
        return Response({'removed': deleted > 0})
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """
        POST /api/stories/{id}/reply/
        Responder a una historia con un mensaje
        """
        story = self.get_object()
        message = request.data.get('message', '').strip()
        
        if not message:
            return Response(
                {'error': 'El mensaje no puede estar vacio'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(message) > 500:
            return Response(
                {'error': 'El mensaje no puede superar los 500 caracteres'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear respuesta en la tabla de story replies
        reply = StoryReply.objects.create(
            user=request.user,
            story=story,
            message=message
        )
        
        # Crear o obtener chat privado con el dueño de la historia
        message_created = False
        notification_created = False
        
        if story.user != request.user:
            try:
                from apps.messaging.models import ChatRoom, ChatParticipant, Message
                from apps.notifications.models import Notification
                from django.db.models import Q
                
                # Buscar chat privado existente entre los dos usuarios
                chat_room = ChatRoom.objects.filter(
                    chat_type='private',
                    participants=request.user
                ).filter(
                    participants=story.user
                ).first()
                
                # Si no existe, crear nuevo chat
                if not chat_room:
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
                        user=story.user,
                        role='member'
                    )
                    print(f'[OK] Chat privado creado entre {request.user.username} y {story.user.username}')
                
                # Crear mensaje en el chat con referencia a la historia
                chat_message = Message.objects.create(
                    chat_room=chat_room,
                    sender=request.user,
                    content=message,
                    message_type='story_reply',
                    story_id=story.id
                )
                message_created = True
                print(f'[OK] Mensaje creado en chat {chat_room.id} con referencia a historia {story.id}')
                
                # Actualizar última actividad del chat
                from django.utils import timezone
                chat_room.last_activity = timezone.now()
                chat_room.save(update_fields=['last_activity'])
                
                # Crear notificación
                Notification.objects.create(
                    recipient=story.user,
                    sender=request.user,
                    notification_type='story_reply',
                    story_id=story.id,
                    message=f'{request.user.username} respondio a tu historia'
                )
                notification_created = True
                print(f'[OK] Notificacion creada para respuesta a historia de {story.user.username}')
                
            except Exception as e:
                print(f'[ERROR] Error al crear mensaje/notificacion: {str(e)}')
                import traceback
                traceback.print_exc()
        
        serializer = StoryReplySerializer(reply, context={'request': request})
        return Response({
            **serializer.data,
            'message_created': message_created,
            'notification_created': notification_created
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def replies(self, request, pk=None):
        """
        GET /api/stories/{id}/replies/
        Obtener respuestas de una historia (solo el dueño)
        """
        story = self.get_object()
        
        # Solo el dueño puede ver las respuestas
        if story.user != request.user:
            return Response(
                {'error': 'No tienes permiso para ver estas respuestas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        replies = story.replies.all().select_related('user')
        serializer = StoryReplySerializer(replies, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def viewers(self, request, pk=None):
        """
        GET /api/stories/{id}/viewers/
        Obtener lista de usuarios que vieron la historia (solo el dueño)
        """
        story = self.get_object()
        
        # Solo el dueño puede ver quién vio su historia
        if story.user != request.user:
            return Response(
                {'error': 'No tienes permiso para ver esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        views = story.views.all().select_related('user').order_by('-viewed_at')
        
        viewers = []
        for view in views:
            viewers.append({
                'user': {
                    'id': str(view.user.id),
                    'username': view.user.username,
                    'display_name': getattr(view.user, 'display_name', None) or view.user.username,
                    'avatar_url': self._get_user_avatar(view.user)
                },
                'viewed_at': view.viewed_at
            })
        
        return Response({
            'count': len(viewers),
            'viewers': viewers
        })
    
    def _get_friend_ids(self, user):
        """Obtener IDs de amigos del usuario"""
        friend_ids = set()
        
        # Intentar obtener amigos desde el modelo de amistad
        try:
            from apps.users.models import Friendship
            
            # Amistades aceptadas donde el usuario es user1 o user2
            friendships = Friendship.objects.filter(
                Q(user1=user) | Q(user2=user),
                status='accepted'
            )
            
            for friendship in friendships:
                if friendship.user1_id == user.id:
                    friend_ids.add(friendship.user2_id)
                else:
                    friend_ids.add(friendship.user1_id)
        except Exception:
            # Si no existe el modelo de amistad, obtener todos los usuarios
            # (para desarrollo/testing)
            pass
        
        # Si no hay amigos, incluir algunos usuarios para testing
        if not friend_ids:
            # Obtener los últimos 20 usuarios activos como "amigos" para testing
            recent_users = User.objects.exclude(id=user.id).order_by('-date_joined')[:20]
            friend_ids = set(u.id for u in recent_users)
        
        return friend_ids
    
    def _get_user_avatar(self, user):
        """Obtener URL del avatar del usuario"""
        if hasattr(user, 'avatar') and user.avatar:
            return user.avatar.url
        if hasattr(user, 'avatar_url') and user.avatar_url:
            return user.avatar_url
        return None

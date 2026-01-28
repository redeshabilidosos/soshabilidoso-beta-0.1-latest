"""
Views para sistema de mensajería
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F, Max
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import (
    ChatRoom, ChatParticipant, Message, MessageReaction,
    MessageRead, ChatInvitation
)
from .serializers import (
    ChatRoomSerializer, ChatRoomCreateSerializer, MessageSerializer,
    MessageCreateSerializer, ChatParticipantSerializer, ChatSettingsSerializer,
    ChatInvitationSerializer
)
from .permissions import IsChatParticipant, IsChatParticipantOrReadOnly


class ChatRoomViewSet(viewsets.ModelViewSet):
    """ViewSet para salas de chat"""
    
    permission_classes = [permissions.IsAuthenticated, IsChatParticipantOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['chat_type', 'is_active']
    
    def get_queryset(self):
        """Obtener chats del usuario"""
        return ChatRoom.objects.filter(
            participants=self.request.user,
            is_active=True
        ).select_related('created_by').prefetch_related(
            'participants', 'messages'
        ).annotate(
            last_message_time=Max('messages__created_at')
        ).order_by('-last_message_time')
    
    def get_serializer_class(self):
        """Obtener serializer según la acción"""
        if self.action == 'create':
            return ChatRoomCreateSerializer
        return ChatRoomSerializer
    
    def perform_create(self, serializer):
        """Crear chat room"""
        chat_room = serializer.save()
        
        # Si es chat privado, verificar si ya existe
        if chat_room.chat_type == 'private':
            participant_ids = serializer.validated_data.get('participant_ids', [])
            if participant_ids:
                other_user_id = participant_ids[0]
                
                # Buscar chat privado existente
                existing_chat = ChatRoom.objects.filter(
                    chat_type='private',
                    participants=self.request.user
                ).filter(
                    participants=other_user_id
                ).first()
                
                if existing_chat:
                    # Si existe, devolver el existente y eliminar el nuevo
                    chat_room.delete()
                    return existing_chat
        
        return chat_room
    
    @extend_schema(
        summary="Obtener mensajes del chat",
        description="Obtener mensajes paginados de un chat específico"
    )
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Obtener mensajes del chat"""
        chat_room = self.get_object()
        
        messages = Message.objects.filter(
            chat_room=chat_room,
            is_deleted=False
        ).select_related('sender', 'reply_to__sender').prefetch_related(
            'reactions__user', 'read_by__user'
        ).order_by('-created_at')
        
        # Paginación
        page = self.paginate_queryset(messages)
        if page is not None:
            serializer = MessageSerializer(
                page,
                many=True,
                context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
        
        serializer = MessageSerializer(
            messages,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    
    @extend_schema(
        summary="Enviar mensaje",
        description="Enviar un nuevo mensaje al chat"
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsChatParticipant])
    def send_message(self, request, pk=None):
        """Enviar mensaje al chat"""
        chat_room = self.get_object()
        
        serializer = MessageCreateSerializer(
            data=request.data,
            context={'request': request, 'view': self}
        )
        
        if serializer.is_valid():
            message = serializer.save(
                chat_room=chat_room,
                sender=request.user
            )
            
            # Actualizar última actividad del chat
            ChatRoom.objects.filter(id=chat_room.id).update(
                last_activity=timezone.now()
            )
            
            response_serializer = MessageSerializer(
                message,
                context={'request': request}
            )
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="Marcar mensajes como leídos",
        description="Marcar todos los mensajes del chat como leídos"
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsChatParticipant])
    def mark_as_read(self, request, pk=None):
        """Marcar mensajes como leídos"""
        chat_room = self.get_object()
        
        # Obtener participante
        participant = ChatParticipant.objects.get(
            chat_room=chat_room,
            user=request.user
        )
        
        # Marcar mensajes como leídos
        unread_messages = Message.objects.filter(
            chat_room=chat_room,
            created_at__gt=participant.last_read_at
        ).exclude(sender=request.user)
        
        # Crear registros de lectura
        message_reads = []
        for message in unread_messages:
            message_reads.append(
                MessageRead(message=message, user=request.user)
            )
        
        MessageRead.objects.bulk_create(
            message_reads,
            ignore_conflicts=True
        )
        
        # Actualizar última lectura del participante
        participant.last_read_at = timezone.now()
        participant.save()
        
        return Response({
            'message': 'Mensajes marcados como leídos',
            'count': len(message_reads)
        })
    
    @extend_schema(
        summary="Configurar chat",
        description="Actualizar configuraciones personalizadas del chat"
    )
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated, IsChatParticipant], url_path='chat-settings', url_name='chat-settings')
    def chat_settings(self, request, pk=None):
        """Configurar chat"""
        chat_room = self.get_object()
        
        participant = ChatParticipant.objects.get(
            chat_room=chat_room,
            user=request.user
        )
        
        serializer = ChatSettingsSerializer(
            participant,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Configuraciones actualizadas',
                'chat_settings': serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="Agregar participante",
        description="Agregar un nuevo participante al chat grupal"
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_participant(self, request, pk=None):
        """Agregar participante al chat"""
        chat_room = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({
                'error': 'user_id es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que sea chat grupal
        if chat_room.chat_type != 'group':
            return Response({
                'error': 'Solo se pueden agregar participantes a chats grupales'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar permisos (solo admin/owner)
        participant = ChatParticipant.objects.filter(
            chat_room=chat_room,
            user=request.user,
            role__in=['admin', 'owner']
        ).first()
        
        if not participant:
            return Response({
                'error': 'No tienes permisos para agregar participantes'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            new_user = User.objects.get(id=user_id)
            
            # Verificar que no sea ya participante
            if ChatParticipant.objects.filter(
                chat_room=chat_room,
                user=new_user
            ).exists():
                return Response({
                    'error': 'El usuario ya es participante del chat'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Agregar participante
            ChatParticipant.objects.create(
                chat_room=chat_room,
                user=new_user,
                role='member'
            )
            
            return Response({
                'message': f'{new_user.display_name} agregado al chat'
            })
            
        except User.DoesNotExist:
            return Response({
                'error': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @extend_schema(
        summary="Salir del chat",
        description="Salir de un chat grupal"
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsChatParticipant])
    def leave(self, request, pk=None):
        """Salir del chat"""
        chat_room = self.get_object()
        
        if chat_room.chat_type == 'private':
            return Response({
                'error': 'No puedes salir de un chat privado'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        participant = ChatParticipant.objects.get(
            chat_room=chat_room,
            user=request.user
        )
        
        # Si es el owner, transferir ownership
        if participant.role == 'owner':
            other_admin = ChatParticipant.objects.filter(
                chat_room=chat_room,
                role='admin'
            ).first()
            
            if other_admin:
                other_admin.role = 'owner'
                other_admin.save()
            else:
                # Si no hay admins, promover al primer miembro
                first_member = ChatParticipant.objects.filter(
                    chat_room=chat_room,
                    role='member'
                ).first()
                
                if first_member:
                    first_member.role = 'owner'
                    first_member.save()
        
        # Eliminar participante
        participant.delete()
        
        return Response({
            'message': 'Has salido del chat'
        })


class MessageViewSet(viewsets.ModelViewSet):
    """ViewSet para mensajes individuales"""
    
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsChatParticipant]
    
    def get_queryset(self):
        """Obtener mensajes del chat específico"""
        chat_room_id = self.kwargs.get('chat_room_pk') or self.kwargs.get('chat_room_id')
        return Message.objects.filter(
            chat_room_id=chat_room_id,
            is_deleted=False
        ).select_related('sender', 'reply_to__sender').prefetch_related(
            'reactions__user', 'read_by__user'
        )
    
    @extend_schema(
        summary="Reaccionar a mensaje",
        description="Agregar o quitar reacción a un mensaje"
    )
    @action(detail=True, methods=['post'])
    def react(self, request, chat_room_pk=None, pk=None):
        """Reaccionar a mensaje"""
        message = self.get_object()
        reaction_type = request.data.get('reaction_type')
        
        if not reaction_type:
            return Response({
                'error': 'reaction_type es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar tipo de reacción válido
        valid_reactions = [choice[0] for choice in MessageReaction.REACTION_TYPES]
        if reaction_type not in valid_reactions:
            return Response({
                'error': 'Tipo de reacción inválido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Toggle reacción
        reaction = MessageReaction.objects.filter(
            message=message,
            user=request.user,
            reaction_type=reaction_type
        ).first()
        
        if reaction:
            reaction.delete()
            return Response({
                'message': 'Reacción eliminada',
                'reacted': False
            })
        else:
            MessageReaction.objects.create(
                message=message,
                user=request.user,
                reaction_type=reaction_type
            )
            return Response({
                'message': 'Reacción agregada',
                'reacted': True,
                'reaction_type': reaction_type
            })
    
    def update(self, request, *args, **kwargs):
        """Editar mensaje"""
        message = self.get_object()
        
        # Solo el autor puede editar
        if message.sender != request.user:
            return Response({
                'error': 'Solo puedes editar tus propios mensajes'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Solo mensajes de texto pueden editarse
        if message.message_type != 'text':
            return Response({
                'error': 'Solo los mensajes de texto pueden editarse'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        response = super().update(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Marcar como editado
            message.is_edited = True
            message.save()
        
        return response
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar mensaje"""
        message = self.get_object()
        
        # Solo el autor puede eliminar
        if message.sender != request.user:
            return Response({
                'error': 'Solo puedes eliminar tus propios mensajes'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Marcar como eliminado en lugar de eliminar
        message.is_deleted = True
        message.deleted_at = timezone.now()
        message.save()
        
        return Response({
            'message': 'Mensaje eliminado'
        })
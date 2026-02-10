"""
WebSocket Consumers para chat en tiempo real
"""
import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import ChatRoom, ChatParticipant, Message, MessageRead
from .serializers import MessageSerializer

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """Consumer para chat en tiempo real"""
    
    async def connect(self):
        """Conectar al WebSocket"""
        self.chat_room_id = self.scope['url_route']['kwargs']['chat_room_id']
        self.chat_group_name = f'chat_{self.chat_room_id}'
        
        # 🚀 CAMBIO: Aceptar conexión PRIMERO
        await self.accept()
        
        # Luego autenticar
        try:
            # Obtener token de query string
            query_string = self.scope['query_string'].decode()
            token = None
            
            if 'token=' in query_string:
                token = query_string.split('token=')[1].split('&')[0]
            
            if not token:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Token no proporcionado'
                }))
                await self.close()
                return
            
            # Autenticar token
            self.user = await self.authenticate_token(token)
            
            if not self.user:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Token inválido'
                }))
                await self.close()
                return
            
            # Verificar que el usuario sea participante del chat
            is_participant = await self.check_participant()
            if not is_participant:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'No eres participante de este chat'
                }))
                await self.close()
                return
            
            # Unirse al grupo del chat
            await self.channel_layer.group_add(
                self.chat_group_name,
                self.channel_name
            )
            
            # Notificar conexión exitosa
            await self.send(text_data=json.dumps({
                'type': 'connection_success',
                'message': 'Conectado exitosamente al chat'
            }))
            
            # Notificar que el usuario se conectó
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    'type': 'user_status',
                    'user_id': str(self.user.id),
                    'username': self.user.username,
                    'status': 'online'
                }
            )
            
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error de autenticación: {str(e)}'
            }))
            await self.close()
    
    async def disconnect(self, close_code):
        """Desconectar del WebSocket"""
        if hasattr(self, 'chat_group_name'):
            # Notificar que el usuario se desconectó
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    'type': 'user_status',
                    'user_id': str(self.user.id),
                    'username': self.user.username,
                    'status': 'offline'
                }
            )
            
            # Salir del grupo del chat
            await self.channel_layer.group_discard(
                self.chat_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Recibir mensaje del WebSocket"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'chat_message':
                await self.handle_chat_message(data)
            elif message_type == 'typing':
                await self.handle_typing(data)
            elif message_type == 'read_message':
                await self.handle_read_message(data)
            elif message_type == 'react_message':
                await self.handle_message_reaction(data)
            elif message_type == 'edit_message':
                await self.handle_edit_message(data)
            elif message_type == 'delete_message':
                await self.handle_delete_message(data)
            
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Formato JSON inválido'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))
    
    async def handle_chat_message(self, data):
        """Manejar mensaje de chat"""
        content = data.get('content', '').strip()
        message_type = data.get('message_type', 'text')
        reply_to_id = data.get('reply_to')
        
        if not content and message_type == 'text':
            return
        
        # Crear mensaje en la base de datos
        message = await self.create_message(
            content=content,
            message_type=message_type,
            reply_to_id=reply_to_id
        )
        
        if message:
            # Serializar mensaje
            message_data = await self.serialize_message(message)
            
            # Enviar mensaje a todos los participantes del chat
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    'type': 'chat_message',
                    'message': message_data
                }
            )
            
            # Actualizar última actividad del chat
            await self.update_chat_activity()
    
    async def handle_typing(self, data):
        """Manejar indicador de escritura"""
        is_typing = data.get('is_typing', False)
        
        # Enviar estado de escritura a otros participantes
        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'typing_status',
                'user_id': str(self.user.id),
                'username': self.user.username,
                'is_typing': is_typing
            }
        )
    
    async def handle_read_message(self, data):
        """Manejar lectura de mensaje"""
        message_id = data.get('message_id')
        
        if message_id:
            await self.mark_message_as_read(message_id)
            
            # Notificar que el mensaje fue leído
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    'type': 'message_read',
                    'message_id': message_id,
                    'user_id': str(self.user.id),
                    'username': self.user.username
                }
            )
    
    async def handle_message_reaction(self, data):
        """Manejar reacción a mensaje"""
        message_id = data.get('message_id')
        reaction_type = data.get('reaction_type')
        
        if message_id and reaction_type:
            reaction = await self.toggle_message_reaction(message_id, reaction_type)
            
            # Notificar reacción
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    'type': 'message_reaction',
                    'message_id': message_id,
                    'user_id': str(self.user.id),
                    'username': self.user.username,
                    'reaction_type': reaction_type,
                    'added': reaction is not None
                }
            )
    
    async def handle_edit_message(self, data):
        """Manejar edición de mensaje"""
        message_id = data.get('message_id')
        new_content = data.get('content', '').strip()
        
        if message_id and new_content:
            message = await self.edit_message(message_id, new_content)
            
            if message:
                message_data = await self.serialize_message(message)
                
                # Notificar edición
                await self.channel_layer.group_send(
                    self.chat_group_name,
                    {
                        'type': 'message_edited',
                        'message': message_data
                    }
                )
    
    async def handle_delete_message(self, data):
        """Manejar eliminación de mensaje"""
        message_id = data.get('message_id')
        
        if message_id:
            success = await self.delete_message(message_id)
            
            if success:
                # Notificar eliminación
                await self.channel_layer.group_send(
                    self.chat_group_name,
                    {
                        'type': 'message_deleted',
                        'message_id': message_id,
                        'user_id': str(self.user.id)
                    }
                )
    
    # Métodos para enviar mensajes al WebSocket
    
    async def chat_message(self, event):
        """Enviar mensaje de chat"""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))
    
    async def user_status(self, event):
        """Enviar estado de usuario"""
        # No enviar el estado a uno mismo
        if event['user_id'] != str(self.user.id):
            await self.send(text_data=json.dumps({
                'type': 'user_status',
                'user_id': event['user_id'],
                'username': event['username'],
                'status': event['status']
            }))
    
    async def typing_status(self, event):
        """Enviar estado de escritura"""
        # No enviar el estado a uno mismo
        if event['user_id'] != str(self.user.id):
            await self.send(text_data=json.dumps({
                'type': 'typing_status',
                'user_id': event['user_id'],
                'username': event['username'],
                'is_typing': event['is_typing']
            }))
    
    async def message_read(self, event):
        """Enviar notificación de mensaje leído"""
        await self.send(text_data=json.dumps({
            'type': 'message_read',
            'message_id': event['message_id'],
            'user_id': event['user_id'],
            'username': event['username']
        }))
    
    async def message_reaction(self, event):
        """Enviar reacción a mensaje"""
        await self.send(text_data=json.dumps({
            'type': 'message_reaction',
            'message_id': event['message_id'],
            'user_id': event['user_id'],
            'username': event['username'],
            'reaction_type': event['reaction_type'],
            'added': event['added']
        }))
    
    async def message_edited(self, event):
        """Enviar mensaje editado"""
        await self.send(text_data=json.dumps({
            'type': 'message_edited',
            'message': event['message']
        }))
    
    async def message_deleted(self, event):
        """Enviar mensaje eliminado"""
        await self.send(text_data=json.dumps({
            'type': 'message_deleted',
            'message_id': event['message_id'],
            'user_id': event['user_id']
        }))
    
    # Métodos de base de datos (async)
    
    @database_sync_to_async
    def authenticate_token(self, token):
        """Autenticar token JWT"""
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            from django.contrib.auth import get_user_model
            
            User = get_user_model()
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            return user
        except Exception as e:
            print(f"Error autenticando token: {e}")
            return None
    
    @database_sync_to_async
    def check_participant(self):
        """Verificar si el usuario es participante del chat"""
        return ChatParticipant.objects.filter(
            chat_room_id=self.chat_room_id,
            user=self.user
        ).exists()
    
    @database_sync_to_async
    def create_message(self, content, message_type='text', reply_to_id=None):
        """Crear mensaje en la base de datos"""
        try:
            chat_room = ChatRoom.objects.get(id=self.chat_room_id)
            
            reply_to = None
            if reply_to_id:
                try:
                    reply_to = Message.objects.get(
                        id=reply_to_id,
                        chat_room=chat_room
                    )
                except Message.DoesNotExist:
                    pass
            
            message = Message.objects.create(
                chat_room=chat_room,
                sender=self.user,
                content=content,
                message_type=message_type,
                reply_to=reply_to
            )
            
            return message
        except Exception:
            return None
    
    @database_sync_to_async
    def serialize_message(self, message):
        """Serializar mensaje"""
        from django.http import HttpRequest
        
        # Crear request mock para el contexto
        request = HttpRequest()
        request.user = self.user
        
        serializer = MessageSerializer(message, context={'request': request})
        return serializer.data
    
    @database_sync_to_async
    def update_chat_activity(self):
        """Actualizar última actividad del chat"""
        ChatRoom.objects.filter(id=self.chat_room_id).update(
            last_activity=timezone.now()
        )
    
    @database_sync_to_async
    def mark_message_as_read(self, message_id):
        """Marcar mensaje como leído"""
        try:
            message = Message.objects.get(
                id=message_id,
                chat_room_id=self.chat_room_id
            )
            
            MessageRead.objects.get_or_create(
                message=message,
                user=self.user
            )
            
            # Actualizar última lectura del participante
            ChatParticipant.objects.filter(
                chat_room_id=self.chat_room_id,
                user=self.user
            ).update(last_read_at=timezone.now())
            
            return True
        except Exception:
            return False
    
    @database_sync_to_async
    def toggle_message_reaction(self, message_id, reaction_type):
        """Agregar o quitar reacción a mensaje"""
        try:
            from .models import MessageReaction
            
            message = Message.objects.get(
                id=message_id,
                chat_room_id=self.chat_room_id
            )
            
            reaction = MessageReaction.objects.filter(
                message=message,
                user=self.user,
                reaction_type=reaction_type
            ).first()
            
            if reaction:
                # Si existe, eliminarla
                reaction.delete()
                return None
            else:
                # Si no existe, crearla
                reaction = MessageReaction.objects.create(
                    message=message,
                    user=self.user,
                    reaction_type=reaction_type
                )
                return reaction
        except Exception:
            return None
    
    @database_sync_to_async
    def edit_message(self, message_id, new_content):
        """Editar mensaje"""
        try:
            message = Message.objects.get(
                id=message_id,
                chat_room_id=self.chat_room_id,
                sender=self.user
            )
            
            message.content = new_content
            message.is_edited = True
            message.save()
            
            return message
        except Exception:
            return None
    
    @database_sync_to_async
    def delete_message(self, message_id):
        """Eliminar mensaje"""
        try:
            message = Message.objects.get(
                id=message_id,
                chat_room_id=self.chat_room_id,
                sender=self.user
            )
            
            message.is_deleted = True
            message.deleted_at = timezone.now()
            message.save()
            
            return True
        except Exception:
            return False
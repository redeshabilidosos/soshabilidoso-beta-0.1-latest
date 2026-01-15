"""
Consumers para actualizaciones en tiempo real de posts
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Post
from .serializers import PostSerializer

User = get_user_model()


class FeedConsumer(AsyncWebsocketConsumer):
    """Consumer para actualizaciones del feed en tiempo real"""
    
    async def connect(self):
        """Conectar usuario al feed"""
        self.user = self.scope["user"]
        
        if self.user.is_anonymous:
            await self.close()
            return
        
        # Grupo personal del usuario para recibir posts de usuarios que sigue
        self.user_feed_group = f"feed_{self.user.id}"
        
        # Unirse al grupo del feed personal
        await self.channel_layer.group_add(
            self.user_feed_group,
            self.channel_name
        )
        
        await self.accept()
        
        # Enviar mensaje de confirmación
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Conectado al feed en tiempo real'
        }))
    
    async def disconnect(self, close_code):
        """Desconectar del feed"""
        if hasattr(self, 'user_feed_group'):
            await self.channel_layer.group_discard(
                self.user_feed_group,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Manejar mensajes del cliente"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                }))
        except json.JSONDecodeError:
            pass
    
    async def new_post(self, event):
        """Enviar nuevo post al cliente"""
        await self.send(text_data=json.dumps({
            'type': 'new_post',
            'post': event['post_data']
        }))
    
    async def post_updated(self, event):
        """Enviar actualización de post al cliente"""
        await self.send(text_data=json.dumps({
            'type': 'post_updated',
            'post': event['post_data']
        }))
    
    async def post_deleted(self, event):
        """Notificar eliminación de post"""
        await self.send(text_data=json.dumps({
            'type': 'post_deleted',
            'post_id': event['post_id']
        }))
    
    async def post_reaction(self, event):
        """Enviar actualización de reacciones"""
        await self.send(text_data=json.dumps({
            'type': 'post_reaction',
            'post_id': event['post_id'],
            'reaction_data': event['reaction_data']
        }))


class PostConsumer(AsyncWebsocketConsumer):
    """Consumer para actualizaciones de un post específico"""
    
    async def connect(self):
        """Conectar a un post específico"""
        self.user = self.scope["user"]
        self.post_id = self.scope['url_route']['kwargs']['post_id']
        
        if self.user.is_anonymous:
            await self.close()
            return
        
        # Verificar que el post existe y el usuario puede verlo
        post_exists = await self.check_post_access()
        if not post_exists:
            await self.close()
            return
        
        # Grupo del post específico
        self.post_group = f"post_{self.post_id}"
        
        # Unirse al grupo del post
        await self.channel_layer.group_add(
            self.post_group,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        """Desconectar del post"""
        if hasattr(self, 'post_group'):
            await self.channel_layer.group_discard(
                self.post_group,
                self.channel_name
            )
    
    @database_sync_to_async
    def check_post_access(self):
        """Verificar si el usuario puede acceder al post"""
        try:
            post = Post.objects.get(id=self.post_id)
            return post.is_public or post.user == self.user
        except Post.DoesNotExist:
            return False
    
    async def receive(self, text_data):
        """Manejar mensajes del cliente"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                }))
        except json.JSONDecodeError:
            pass
    
    async def new_comment(self, event):
        """Enviar nuevo comentario"""
        await self.send(text_data=json.dumps({
            'type': 'new_comment',
            'comment': event['comment_data']
        }))
    
    async def comment_updated(self, event):
        """Enviar actualización de comentario"""
        await self.send(text_data=json.dumps({
            'type': 'comment_updated',
            'comment': event['comment_data']
        }))
    
    async def comment_deleted(self, event):
        """Notificar eliminación de comentario"""
        await self.send(text_data=json.dumps({
            'type': 'comment_deleted',
            'comment_id': event['comment_id']
        }))
    
    async def post_reaction(self, event):
        """Enviar actualización de reacciones del post"""
        await self.send(text_data=json.dumps({
            'type': 'post_reaction',
            'reaction_data': event['reaction_data']
        }))
    
    async def comment_like(self, event):
        """Enviar actualización de likes de comentario"""
        await self.send(text_data=json.dumps({
            'type': 'comment_like',
            'comment_id': event['comment_id'],
            'likes_count': event['likes_count']
        }))
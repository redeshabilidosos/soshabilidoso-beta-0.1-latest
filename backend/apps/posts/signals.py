"""
Signals para actualizaciones en tiempo real de posts
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model

from .models import Post, PostReaction, Comment, CommentLike
from .serializers import PostSerializer, CommentSerializer

User = get_user_model()
channel_layer = get_channel_layer()


@receiver(post_save, sender=Post)
def post_created_or_updated(sender, instance, created, **kwargs):
    """Enviar notificación cuando se crea o actualiza un post"""
    if created:
        # Nuevo post - enviar a seguidores
        send_new_post_to_followers(instance)
    else:
        # Post actualizado - enviar a todos los que pueden verlo
        send_post_update(instance)


@receiver(post_delete, sender=Post)
def post_deleted(sender, instance, **kwargs):
    """Enviar notificación cuando se elimina un post"""
    send_post_deletion(instance)


@receiver(post_save, sender=PostReaction)
def post_reaction_created(sender, instance, created, **kwargs):
    """Enviar actualización de reacciones"""
    if created:
        send_post_reaction_update(instance)


@receiver(post_save, sender=Comment)
def comment_created_or_updated(sender, instance, created, **kwargs):
    """Enviar notificación de comentario nuevo o actualizado"""
    if created:
        send_new_comment(instance)
    else:
        send_comment_update(instance)


@receiver(post_delete, sender=Comment)
def comment_deleted(sender, instance, **kwargs):
    """Enviar notificación de comentario eliminado"""
    send_comment_deletion(instance)


@receiver(post_save, sender=CommentLike)
def comment_like_created(sender, instance, created, **kwargs):
    """Enviar actualización de likes de comentario"""
    if created:
        send_comment_like_update(instance)


def send_new_post_to_followers(post):
    """Enviar nuevo post a los feeds de los seguidores"""
    try:
        # Serializar el post
        post_data = PostSerializer(post).data
        
        # Obtener seguidores del autor
        from apps.users.models import Follow
        followers = Follow.objects.filter(following=post.user).values_list('follower', flat=True)
        
        # Enviar a cada seguidor
        for follower_id in followers:
            group_name = f"feed_{follower_id}"
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'new_post',
                    'post_data': post_data
                }
            )
        
        # También enviar al propio autor (para su feed)
        author_group = f"feed_{post.user.id}"
        async_to_sync(channel_layer.group_send)(
            author_group,
            {
                'type': 'new_post',
                'post_data': post_data
            }
        )
    except Exception as e:
        print(f"Error enviando nuevo post: {e}")


def send_post_update(post):
    """Enviar actualización de post"""
    try:
        post_data = PostSerializer(post).data
        
        # Enviar a seguidores y autor
        from apps.users.models import Follow
        followers = Follow.objects.filter(following=post.user).values_list('follower', flat=True)
        for follower_id in followers:
            group_name = f"feed_{follower_id}"
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'post_updated',
                    'post_data': post_data
                }
            )
        
        # Enviar al autor
        author_group = f"feed_{post.user.id}"
        async_to_sync(channel_layer.group_send)(
            author_group,
            {
                'type': 'post_updated',
                'post_data': post_data
            }
        )
        
        # Enviar al grupo específico del post
        post_group = f"post_{post.id}"
        async_to_sync(channel_layer.group_send)(
            post_group,
            {
                'type': 'post_updated',
                'post_data': post_data
            }
        )
    except Exception as e:
        print(f"Error enviando actualización de post: {e}")


def send_post_deletion(post):
    """Enviar notificación de eliminación de post"""
    try:
        # Enviar a seguidores y autor
        from apps.users.models import Follow
        followers = Follow.objects.filter(following=post.user).values_list('follower', flat=True)
        for follower_id in followers:
            group_name = f"feed_{follower_id}"
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'post_deleted',
                    'post_id': str(post.id)
                }
            )
        
        # Enviar al autor
        author_group = f"feed_{post.user.id}"
        async_to_sync(channel_layer.group_send)(
            author_group,
            {
                'type': 'post_deleted',
                'post_id': str(post.id)
            }
        )
    except Exception as e:
        print(f"Error enviando eliminación de post: {e}")


def send_post_reaction_update(reaction):
    """Enviar actualización de reacciones"""
    try:
        # Actualizar contadores del post
        post = reaction.post
        post.refresh_from_db()
        
        reaction_data = {
            'post_id': str(post.id),
            'likes_count': post.likes_count,
            'celebrations_count': post.celebrations_count,
            'golazos_count': post.golazos_count,
            'user_reaction': {
                'user_id': str(reaction.user.id),
                'reaction_type': reaction.reaction_type
            }
        }
        
        # Enviar a seguidores del autor del post
        from apps.users.models import Follow
        followers = Follow.objects.filter(following=post.user)
        for follow in followers:
            group_name = f"feed_{follow.follower.id}"
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'post_reaction',
                    'post_id': str(post.id),
                    'reaction_data': reaction_data
                }
            )
        
        # Enviar al autor del post
        author_group = f"feed_{post.user.id}"
        async_to_sync(channel_layer.group_send)(
            author_group,
            {
                'type': 'post_reaction',
                'post_id': str(post.id),
                'reaction_data': reaction_data
            }
        )
        
        # Enviar al grupo específico del post
        post_group = f"post_{post.id}"
        async_to_sync(channel_layer.group_send)(
            post_group,
            {
                'type': 'post_reaction',
                'post_id': str(post.id),
                'reaction_data': reaction_data
            }
        )
    except Exception as e:
        print(f"Error enviando reacción de post: {e}")


def send_new_comment(comment):
    """Enviar nuevo comentario"""
    try:
        comment_data = CommentSerializer(comment).data
        
        # Enviar al grupo específico del post
        post_group = f"post_{comment.post.id}"
        async_to_sync(channel_layer.group_send)(
            post_group,
            {
                'type': 'new_comment',
                'comment_data': comment_data
            }
        )
    except Exception as e:
        print(f"Error enviando nuevo comentario: {e}")


def send_comment_update(comment):
    """Enviar actualización de comentario"""
    try:
        comment_data = CommentSerializer(comment).data
        
        post_group = f"post_{comment.post.id}"
        async_to_sync(channel_layer.group_send)(
            post_group,
            {
                'type': 'comment_updated',
                'comment_data': comment_data
            }
        )
    except Exception as e:
        print(f"Error enviando actualización de comentario: {e}")


def send_comment_deletion(comment):
    """Enviar eliminación de comentario"""
    try:
        post_group = f"post_{comment.post.id}"
        async_to_sync(channel_layer.group_send)(
            post_group,
            {
                'type': 'comment_deleted',
                'comment_id': str(comment.id)
            }
        )
    except Exception as e:
        print(f"Error enviando eliminación de comentario: {e}")


def send_comment_like_update(comment_like):
    """Enviar actualización de likes de comentario"""
    try:
        comment = comment_like.comment
        comment.refresh_from_db()
        
        post_group = f"post_{comment.post.id}"
        async_to_sync(channel_layer.group_send)(
            post_group,
            {
                'type': 'comment_like',
                'comment_id': str(comment.id),
                'likes_count': comment.likes_count
            }
        )
    except Exception as e:
        print(f"Error enviando like de comentario: {e}")
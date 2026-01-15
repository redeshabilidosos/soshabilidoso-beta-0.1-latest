"""
Signals para crear notificaciones automáticamente
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.posts.models import PostReaction, Comment, PostShare
from apps.users.models import Follow, FriendRequest
from .models import Notification


@receiver(post_save, sender=PostReaction)
def create_reaction_notification(sender, instance, created, **kwargs):
    """Crear notificación cuando alguien reacciona a un post"""
    if created and instance.user != instance.post.user:
        # Mapear tipo de reacción a tipo de notificación
        reaction_map = {
            'like': 'like',
            'celebration': 'celebration',
            'golazo': 'golazo',
        }
        
        notification_type = reaction_map.get(instance.reaction_type, 'like')
        
        # Mensajes personalizados
        messages = {
            'like': f'{instance.user.display_name} le dio me gusta a tu publicación',
            'celebration': f'{instance.user.display_name} celebró tu publicación',
            'golazo': f'{instance.user.display_name} dijo ¡Golazo! a tu publicación',
        }
        
        Notification.objects.create(
            recipient=instance.post.user,
            sender=instance.user,
            notification_type=notification_type,
            post_id=instance.post.id,
            message=messages.get(instance.reaction_type, messages['like'])
        )


@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    """Crear notificación cuando alguien comenta un post"""
    if created and instance.user != instance.post.user:
        # Si es una respuesta a otro comentario
        if instance.parent and instance.user != instance.parent.user:
            Notification.objects.create(
                recipient=instance.parent.user,
                sender=instance.user,
                notification_type='reply',
                post_id=instance.post.id,
                comment_id=instance.id,
                message=f'{instance.user.display_name} respondió a tu comentario'
            )
        
        # Notificar al dueño del post
        Notification.objects.create(
            recipient=instance.post.user,
            sender=instance.user,
            notification_type='comment',
            post_id=instance.post.id,
            comment_id=instance.id,
            message=f'{instance.user.display_name} comentó tu publicación'
        )


@receiver(post_save, sender=PostShare)
def create_share_notification(sender, instance, created, **kwargs):
    """Crear notificación cuando alguien comparte un post"""
    if created and instance.user != instance.post.user:
        Notification.objects.create(
            recipient=instance.post.user,
            sender=instance.user,
            notification_type='share',
            post_id=instance.post.id,
            message=f'{instance.user.display_name} compartió tu publicación'
        )


@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    """Crear notificación cuando alguien te sigue"""
    if created:
        Notification.objects.create(
            recipient=instance.following,
            sender=instance.follower,
            notification_type='follow',
            message=f'{instance.follower.display_name} comenzó a seguirte'
        )


@receiver(post_save, sender=FriendRequest)
def create_friend_request_notification(sender, instance, created, **kwargs):
    """Crear notificación cuando alguien te envía solicitud de amistad"""
    if created:
        Notification.objects.create(
            recipient=instance.receiver,
            sender=instance.sender,
            notification_type='friend_request',
            friend_request_id=instance.id,  # Guardar el ID de la solicitud de amistad
            message=f'{instance.sender.display_name} te envió una solicitud de amistad'
        )
    elif instance.status == 'accepted':
        # Notificar al que envió la solicitud que fue aceptada
        Notification.objects.create(
            recipient=instance.sender,
            sender=instance.receiver,
            notification_type='friend_accept',
            friend_request_id=instance.id,  # Guardar el ID de la solicitud de amistad
            message=f'{instance.receiver.display_name} aceptó tu solicitud de amistad'
        )

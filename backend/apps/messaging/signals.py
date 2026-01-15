"""
Signals para sistema de mensajería
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import Message, ChatRoom, ChatParticipant


@receiver(post_save, sender=Message)
def update_chat_activity_on_message(sender, instance, created, **kwargs):
    """Actualizar última actividad del chat al crear mensaje"""
    if created:
        ChatRoom.objects.filter(id=instance.chat_room.id).update(
            last_activity=timezone.now()
        )


@receiver(post_save, sender=ChatParticipant)
def set_initial_last_read(sender, instance, created, **kwargs):
    """Establecer última lectura inicial al unirse al chat"""
    if created:
        instance.last_read_at = timezone.now()
        instance.save(update_fields=['last_read_at'])
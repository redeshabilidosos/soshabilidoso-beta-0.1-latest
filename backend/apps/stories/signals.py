"""
Signals para Stories
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import StoryView, StoryReaction


@receiver(post_save, sender=StoryView)
def update_story_views_on_view(sender, instance, created, **kwargs):
    """Actualizar contador de vistas cuando se crea una visualización"""
    if created:
        instance.story.update_views_count()


@receiver(post_delete, sender=StoryView)
def update_story_views_on_delete(sender, instance, **kwargs):
    """Actualizar contador de vistas cuando se elimina una visualización"""
    try:
        instance.story.update_views_count()
    except Exception:
        pass  # La historia puede haber sido eliminada

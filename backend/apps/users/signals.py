"""
Signals para la app de usuarios
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.core.files import File
from .models import Follow
import logging
import os

logger = logging.getLogger(__name__)

User = get_user_model()


@receiver(post_save, sender=User)
def setup_new_user(sender, instance, created, **kwargs):
    """
    Configura automáticamente los nuevos usuarios:
    1. Asigna foto de perfil y portada por defecto
    2. Hace que sigan a la cuenta @sos
    """
    if created:  # Solo para usuarios nuevos
        # 1. Asignar imágenes por defecto
        try:
            from django.conf import settings
            
            # Ruta de las imágenes por defecto
            default_avatar_path = os.path.join(settings.MEDIA_ROOT, 'defaults', 'default-avatar.png')
            default_cover_path = os.path.join(settings.MEDIA_ROOT, 'defaults', 'default-cover.png')
            
            # Asignar avatar si no tiene y existe el archivo
            if not instance.avatar and os.path.exists(default_avatar_path):
                with open(default_avatar_path, 'rb') as f:
                    instance.avatar.save(
                        f'avatars/{instance.username}_avatar.png',
                        File(f),
                        save=False
                    )
                logger.info(f"✅ Avatar por defecto asignado a {instance.username}")
            
            # Asignar cover si no tiene y existe el archivo
            if not instance.cover_photo and os.path.exists(default_cover_path):
                with open(default_cover_path, 'rb') as f:
                    instance.cover_photo.save(
                        f'covers/{instance.username}_cover.png',
                        File(f),
                        save=False
                    )
                logger.info(f"✅ Portada por defecto asignada a {instance.username}")
            
            # Guardar cambios si se asignaron imágenes
            if instance.avatar or instance.cover_photo:
                instance.save(update_fields=['avatar', 'cover_photo'])
                
        except Exception as e:
            logger.error(f"❌ Error asignando imágenes por defecto a {instance.username}: {e}")
        
        # 2. Auto-seguir a @sos
        try:
            # Buscar la cuenta @sos
            sos_account = User.objects.filter(username='sos').first()
            
            if sos_account and sos_account != instance:
                # Crear el seguimiento si no existe
                Follow.objects.get_or_create(
                    follower=instance,
                    following=sos_account
                )
                
                # Actualizar contadores
                instance.following_count += 1
                instance.save(update_fields=['following_count'])
                
                sos_account.followers_count += 1
                sos_account.save(update_fields=['followers_count'])
                
                logger.info(f"✅ Usuario {instance.username} ahora sigue a @sos automáticamente")
            else:
                if not sos_account:
                    logger.warning("⚠️ La cuenta @sos no existe. Crear cuenta @sos primero.")
                    
        except Exception as e:
            logger.error(f"❌ Error al hacer auto-follow a @sos: {e}")

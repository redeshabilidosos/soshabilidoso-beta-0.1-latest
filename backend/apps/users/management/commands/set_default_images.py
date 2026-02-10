"""
Comando para asignar imágenes por defecto a todos los usuarios
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files import File
from django.conf import settings
from django.db import transaction
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Asigna imágenes por defecto (avatar y portada) a todos los usuarios'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Forzar reemplazo de imágenes existentes'
        )

    def handle(self, *args, **options):
        force = options.get('force', False)
        
        self.stdout.write(self.style.SUCCESS('🖼️  Asignando imágenes por defecto a usuarios'))
        self.stdout.write('-' * 60)
        
        # Rutas de las imágenes por defecto
        default_avatar_path = os.path.join(settings.MEDIA_ROOT, 'defaults', 'default-avatar.png')
        default_cover_path = os.path.join(settings.MEDIA_ROOT, 'defaults', 'default-cover.png')
        
        # Verificar que existan los archivos
        if not os.path.exists(default_avatar_path):
            self.stdout.write(self.style.ERROR(f'❌ No se encontró: {default_avatar_path}'))
            return
        
        if not os.path.exists(default_cover_path):
            self.stdout.write(self.style.ERROR(f'❌ No se encontró: {default_cover_path}'))
            return
        
        self.stdout.write(f'📁 Avatar: {default_avatar_path}')
        self.stdout.write(f'📁 Portada: {default_cover_path}')
        self.stdout.write('-' * 60)
        
        # Obtener todos los usuarios
        all_users = User.objects.all()
        total_users = all_users.count()
        
        avatars_assigned = 0
        covers_assigned = 0
        avatars_skipped = 0
        covers_skipped = 0
        errors = 0
        
        for user in all_users:
            try:
                with transaction.atomic():
                    updated = False
                    
                    # Asignar avatar
                    if not user.avatar or force:
                        try:
                            with open(default_avatar_path, 'rb') as f:
                                user.avatar.save(
                                    f'avatars/{user.username}_avatar.png',
                                    File(f),
                                    save=False
                                )
                            avatars_assigned += 1
                            updated = True
                            self.stdout.write(f"  ✓ Avatar asignado a @{user.username}")
                        except Exception as e:
                            self.stdout.write(self.style.WARNING(f"  ⚠ Error avatar @{user.username}: {e}"))
                    else:
                        avatars_skipped += 1
                    
                    # Asignar portada
                    if not user.cover_photo or force:
                        try:
                            with open(default_cover_path, 'rb') as f:
                                user.cover_photo.save(
                                    f'covers/{user.username}_cover.png',
                                    File(f),
                                    save=False
                                )
                            covers_assigned += 1
                            updated = True
                            self.stdout.write(f"  ✓ Portada asignada a @{user.username}")
                        except Exception as e:
                            self.stdout.write(self.style.WARNING(f"  ⚠ Error portada @{user.username}: {e}"))
                    else:
                        covers_skipped += 1
                    
                    # Guardar cambios
                    if updated:
                        user.save()
                        
            except Exception as e:
                errors += 1
                self.stdout.write(self.style.ERROR(f"  ✗ Error con @{user.username}: {e}"))
        
        # Resumen
        self.stdout.write('-' * 60)
        self.stdout.write(self.style.SUCCESS('✅ Proceso completado'))
        self.stdout.write(f'📊 Estadísticas:')
        self.stdout.write(f'   - Total de usuarios: {total_users}')
        self.stdout.write(f'   - Avatares asignados: {avatars_assigned}')
        self.stdout.write(f'   - Avatares omitidos: {avatars_skipped}')
        self.stdout.write(f'   - Portadas asignadas: {covers_assigned}')
        self.stdout.write(f'   - Portadas omitidas: {covers_skipped}')
        self.stdout.write(f'   - Errores: {errors}')
        
        if force:
            self.stdout.write(self.style.WARNING('\n⚠️  Modo --force activado: Se reemplazaron imágenes existentes'))

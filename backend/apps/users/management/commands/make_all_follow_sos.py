"""
Comando para hacer que todos los usuarios existentes sigan a @sos
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import Follow
from django.db import transaction

User = get_user_model()


class Command(BaseCommand):
    help = 'Hace que todos los usuarios existentes sigan a @sos'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('👥 Haciendo que todos los usuarios sigan a @sos'))
        self.stdout.write('-' * 60)
        
        # Buscar cuenta @sos
        try:
            sos_account = User.objects.get(username='sos')
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('❌ La cuenta @sos no existe'))
            self.stdout.write('   Ejecuta: python manage.py create_sos_account')
            return
        
        # Obtener todos los usuarios excepto @sos
        all_users = User.objects.exclude(username='sos')
        total_users = all_users.count()
        
        self.stdout.write(f'📊 Total de usuarios: {total_users}')
        self.stdout.write(f'🎯 Cuenta objetivo: @{sos_account.username}')
        self.stdout.write('-' * 60)
        
        follows_created = 0
        already_following = 0
        errors = 0
        
        for user in all_users:
            try:
                with transaction.atomic():
                    # Intentar crear el seguimiento
                    follow, created = Follow.objects.get_or_create(
                        follower=user,
                        following=sos_account
                    )
                    
                    if created:
                        follows_created += 1
                        self.stdout.write(f"  ✓ @{user.username} ahora sigue a @sos")
                    else:
                        already_following += 1
                        
            except Exception as e:
                errors += 1
                self.stdout.write(self.style.ERROR(f"  ✗ Error con @{user.username}: {e}"))
        
        # Actualizar contadores de @sos
        sos_account.followers_count = Follow.objects.filter(following=sos_account).count()
        sos_account.save(update_fields=['followers_count'])
        
        # Actualizar contadores de todos los usuarios
        for user in all_users:
            user.following_count = Follow.objects.filter(follower=user).count()
            user.save(update_fields=['following_count'])
        
        # Resumen
        self.stdout.write('-' * 60)
        self.stdout.write(self.style.SUCCESS('✅ Proceso completado'))
        self.stdout.write(f'📊 Estadísticas:')
        self.stdout.write(f'   - Nuevos seguidores: {follows_created}')
        self.stdout.write(f'   - Ya seguían: {already_following}')
        self.stdout.write(f'   - Errores: {errors}')
        self.stdout.write(f'   - Total procesado: {total_users}')
        self.stdout.write(f'\n🎉 @sos ahora tiene {sos_account.followers_count} seguidores')

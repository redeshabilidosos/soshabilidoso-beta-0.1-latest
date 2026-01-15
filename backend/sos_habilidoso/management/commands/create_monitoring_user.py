"""
Comando para crear usuarios de monitoreo con permisos limitados
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission

User = get_user_model()


class Command(BaseCommand):
    help = 'Crear un usuario de monitoreo con permisos limitados'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Nombre de usuario')
        parser.add_argument('email', type=str, help='Email del usuario')
        parser.add_argument('password', type=str, help='Contraseña')
        parser.add_argument(
            '--admin',
            action='store_true',
            help='Crear como administrador (todos los permisos)'
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        is_admin = options['admin']

        try:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'is_staff': True,
                    'is_superuser': is_admin,
                }
            )

            if not created:
                user.email = email
                user.is_staff = True
                user.is_superuser = is_admin
                user.save()

            user.set_password(password)
            user.save()

            if is_admin:
                # Dar todos los permisos
                user.user_permissions.set(Permission.objects.all())
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Usuario administrador "{username}" creado/actualizado con todos los permisos'
                    )
                )
            else:
                # Dar permisos de lectura y cambio (monitoreo)
                monitoring_permissions = Permission.objects.filter(
                    codename__in=[
                        'view_user', 'view_community', 'view_communitypost',
                        'view_advertisement', 'view_transaction', 'view_platformrevenue',
                        'view_reel', 'view_post', 'change_user', 'change_community',
                        'change_communitypost', 'change_advertisement', 'change_transaction',
                        'change_reel', 'change_post', 'delete_communitypost',
                        'delete_advertisement', 'delete_reel', 'delete_post'
                    ]
                )
                user.user_permissions.set(monitoring_permissions)
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Usuario de monitoreo "{username}" creado/actualizado con permisos limitados'
                    )
                )

            self.stdout.write(f'📧 Email: {email}')
            self.stdout.write(f'🔐 Contraseña: {password}')
            self.stdout.write(f'👤 Tipo: {"Administrador" if is_admin else "Monitoreo"}')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)}'))

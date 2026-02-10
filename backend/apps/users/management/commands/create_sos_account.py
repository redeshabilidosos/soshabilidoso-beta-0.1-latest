"""
Comando para crear la cuenta oficial @sos
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Crea la cuenta oficial @sos si no existe'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🎯 Creando cuenta oficial @sos'))
        self.stdout.write('-' * 60)
        
        # Verificar si ya existe
        if User.objects.filter(username='sos').exists():
            user = User.objects.get(username='sos')
            self.stdout.write(self.style.WARNING(f'⚠️  La cuenta @sos ya existe'))
            self.stdout.write(f'   - Email: {user.email}')
            self.stdout.write(f'   - Nombre: {user.display_name}')
            self.stdout.write(f'   - Seguidores: {user.followers_count}')
            return
        
        # Crear cuenta @sos
        try:
            user = User.objects.create_user(
                username='sos',
                email='info@soshabilidoso.com',
                password='SosHabilidoso2024!',  # Contraseña segura
                display_name='SOS Habilidoso',
                first_name='SOS',
                last_name='Habilidoso',
                bio='Cuenta oficial de SOS Habilidoso - Red social deportiva y cultural 🏆⚽',
                is_active=True,
                is_verified=True,
                email_verified=True,
            )
            
            self.stdout.write(self.style.SUCCESS('✅ Cuenta @sos creada exitosamente'))
            self.stdout.write(f'   - Username: @{user.username}')
            self.stdout.write(f'   - Email: {user.email}')
            self.stdout.write(f'   - Nombre: {user.display_name}')
            self.stdout.write(f'   - Contraseña: SosHabilidoso2024!')
            self.stdout.write('-' * 60)
            self.stdout.write(self.style.SUCCESS('🎉 ¡Listo! Ahora todos los nuevos usuarios seguirán automáticamente a @sos'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error creando cuenta @sos: {e}'))

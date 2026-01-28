"""
Comando para poblar rutas del menú iniciales
"""
from django.core.management.base import BaseCommand
from apps.site_settings.models import MenuRoute


class Command(BaseCommand):
    help = 'Poblar rutas del menú con valores iniciales'
    
    def handle(self, *args, **options):
        routes_data = [
            {
                'route_key': 'feed',
                'label': 'Inicio',
                'path': '/feed',
                'icon': 'Home',
                'order': 1,
                'is_enabled': True,
            },
            {
                'route_key': 'profile',
                'label': 'Perfil',
                'path': '/profile',
                'icon': 'User',
                'order': 2,
                'is_enabled': True,
            },
            {
                'route_key': 'users',
                'label': 'Buscar',
                'path': '/users',
                'icon': 'Users',
                'order': 3,
                'is_enabled': True,
            },
            {
                'route_key': 'notifications',
                'label': 'Notificaciones',
                'path': '/notifications',
                'icon': 'Bell',
                'order': 4,
                'is_enabled': True,
            },
            {
                'route_key': 'reels',
                'label': 'Clips',
                'path': '/clips',
                'icon': 'Film',
                'order': 5,
                'is_enabled': True,
            },
            {
                'route_key': 'live',
                'label': 'En Vivo',
                'path': '/live',
                'icon': 'Radio',
                'order': 6,
                'is_enabled': True,
            },
            {
                'route_key': 'communities',
                'label': 'Comunidades',
                'path': '/communities',
                'icon': 'Users',
                'order': 7,
                'is_enabled': True,
            },
            {
                'route_key': 'classifieds',
                'label': 'Clasificados',
                'path': '/classifieds',
                'icon': 'ShoppingBag',
                'order': 8,
                'is_enabled': True,
            },
            {
                'route_key': 'donations',
                'label': 'Donaciones',
                'path': '/donations',
                'icon': 'Heart',
                'order': 9,
                'is_enabled': True,
            },
            {
                'route_key': 'habil-news',
                'label': 'Hábil News',
                'path': '/habil-news',
                'icon': 'Newspaper',
                'order': 10,
                'is_enabled': True,
            },
            {
                'route_key': 'messages',
                'label': 'Mensajes',
                'path': '/messages',
                'icon': 'MessageSquare',
                'order': 11,
                'is_enabled': True,
            },
            {
                'route_key': 'settings',
                'label': 'Configuración',
                'path': '/settings',
                'icon': 'Settings',
                'order': 12,
                'is_enabled': True,
            },
        ]
        
        created_count = 0
        updated_count = 0
        
        for route_data in routes_data:
            route, created = MenuRoute.objects.update_or_create(
                route_key=route_data['route_key'],
                defaults=route_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Creada: {route.label}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'↻ Actualizada: {route.label}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Proceso completado: {created_count} creadas, '
                f'{updated_count} actualizadas'
            )
        )

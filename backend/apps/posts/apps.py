"""
Configuración de la app Posts
"""
from django.apps import AppConfig


class PostsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.posts'
    verbose_name = 'Posts'
    
    def ready(self):
        """Importar signals cuando la app esté lista"""
        try:
            import apps.posts.signals
        except ImportError:
            # Ignorar si channels no está instalado
            pass
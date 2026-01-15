"""
Configuración de la app Messaging
"""
from django.apps import AppConfig


class MessagingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.messaging'
    verbose_name = 'Mensajería'
    
    def ready(self):
        """Importar signals cuando la app esté lista"""
        import apps.messaging.signals
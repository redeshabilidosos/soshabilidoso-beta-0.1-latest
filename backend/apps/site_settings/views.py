from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import SiteSettings


class SiteSettingsView(APIView):
    """
    API para obtener las configuraciones del sitio
    Endpoint público para que el frontend pueda consultar la configuración
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        GET /api/site-settings/
        Retorna las configuraciones actuales del sitio
        """
        settings = SiteSettings.get_settings()
        
        return Response({
            'show_register_habilidosos_button': settings.show_register_habilidosos_button,
            'reality_form_enabled': settings.reality_form_enabled,
            'updated_at': settings.updated_at
        }, status=status.HTTP_200_OK)

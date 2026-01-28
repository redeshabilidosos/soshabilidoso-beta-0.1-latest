"""
Views para configuración del sitio
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.cache import cache
from .models import SiteSettings, MenuRoute
from .serializers import SiteSettingsSerializer, MenuRouteSerializer


class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para configuración del sitio"""
    
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # No requiere autenticación
    pagination_class = None  # Deshabilitar paginación
    
    def list(self, request, *args, **kwargs):
        """Retornar el primer objeto directamente sin paginación"""
        settings_obj = SiteSettings.objects.first()
        if settings_obj:
            serializer = self.get_serializer(settings_obj)
            return Response(serializer.data)
        else:
            # Retornar configuración por defecto
            default_settings = {
                'site_name': 'SOS Habilidoso',
                'site_description': '',
                'logo_url': '',
                'primary_color': '#00ff88',
                'maintenance_mode': False,
                'maintenance_message': '',
                'show_register_habilidosos_button': True,
                'reality_form_enabled': True,
                'updated_at': None
            }
            return Response(default_settings)
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Obtener configuración actual del sitio"""
        settings = cache.get('site_settings')
        
        if settings is None:
            settings_obj = SiteSettings.objects.first()
            if settings_obj:
                serializer = self.get_serializer(settings_obj)
                settings = serializer.data
                cache.set('site_settings', settings, 300)  # Cache 5 min
            else:
                settings = {
                    'site_name': 'SOS Habilidoso',
                    'site_description': '',
                    'logo_url': '',
                    'primary_color': '#00ff88',
                    'maintenance_mode': False,
                    'maintenance_message': '',
                    'show_register_habilidosos_button': True,
                    'reality_form_enabled': True,
                    'updated_at': None
                }
        
        return Response(settings)


class MenuRouteViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para rutas del menú"""
    
    queryset = MenuRoute.objects.all()
    serializer_class = MenuRouteSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """Obtener solo rutas habilitadas por defecto"""
        queryset = super().get_queryset()
        
        # Si el usuario es admin, mostrar todas
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return queryset
        
        # Para usuarios normales, solo habilitadas
        return queryset.filter(is_enabled=True)
    
    @action(detail=False, methods=['get'])
    def enabled(self, request):
        """Obtener solo rutas habilitadas"""
        routes = cache.get('menu_routes')
        
        if routes is None:
            queryset = MenuRoute.objects.filter(is_enabled=True).order_by('order')
            serializer = self.get_serializer(queryset, many=True)
            routes = serializer.data
            cache.set('menu_routes', routes, 300)  # Cache 5 min
        
        return Response(routes)
    
    @action(detail=False, methods=['post'])
    def check_access(self, request):
        """Verificar si una ruta está habilitada"""
        path = request.data.get('path', '')
        
        if not path:
            return Response(
                {'error': 'Path is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_enabled = MenuRoute.is_route_enabled(path)
        
        return Response({
            'path': path,
            'is_enabled': is_enabled,
            'has_access': is_enabled
        })

"""
Middleware para control de rutas
"""
from django.http import JsonResponse
from django.urls import resolve
from .models import MenuRoute


class RouteAccessMiddleware:
    """Middleware para controlar acceso a rutas deshabilitadas"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # Rutas que siempre deben estar disponibles
        self.exempt_paths = [
            '/api/',
            '/admin/',
            '/static/',
            '/media/',
            '/_next/',
            '/favicon.ico',
        ]
    
    def __call__(self, request):
        # Verificar si la ruta debe ser verificada
        path = request.path
        
        # Permitir rutas exentas
        if any(path.startswith(exempt) for exempt in self.exempt_paths):
            return self.get_response(request)
        
        # Permitir a administradores
        if request.user.is_authenticated and request.user.is_staff:
            return self.get_response(request)
        
        # Verificar si la ruta está habilitada
        # Extraer la ruta base (ej: /communities/123 -> /communities)
        path_parts = path.strip('/').split('/')
        if path_parts:
            base_path = f'/{path_parts[0]}'
            
            # Verificar si la ruta está deshabilitada
            if not MenuRoute.is_route_enabled(base_path):
                # Si es una petición API, retornar JSON
                if path.startswith('/api/'):
                    return JsonResponse({
                        'error': 'Esta funcionalidad no está disponible',
                        'code': 'ROUTE_DISABLED'
                    }, status=403)
                
                # Para rutas del frontend, dejar que Next.js maneje el 404
                # El middleware solo bloquea APIs
        
        response = self.get_response(request)
        return response

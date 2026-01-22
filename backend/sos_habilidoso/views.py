"""
Vistas principales del proyecto
"""
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

@require_http_methods(["GET"])
def api_root(request):
    """Vista raíz de la API"""
    return JsonResponse({
        'message': 'Bienvenido a SOS-HABILIDOSO API',
        'version': '1.0.0',
        'status': 'active',
        'server_time': '2026-01-21T13:15:00Z',
        'endpoints': {
            'authentication': '/api/auth/',
            'users': '/api/users/',
            'posts': '/api/posts/',
            'communities': '/api/communities/',
            'messaging': '/api/messaging/',
            'notifications': '/api/notifications/',
            'reels': '/api/reels/',
            'advertising': '/api/advertising/',
            'classifieds': '/api/classifieds/',
            'learning': '/api/learning/',
            'media': '/api/media/',
            'stories': '/api/stories/',
            'donations': '/api/donations/',
            'enterprises': '/api/enterprises/',
            'payments': '/api/payments/',
            'site_settings': '/api/site-settings/',
            'reality': '/api/reality/',
        },
        'admin': '/admin/',
        'health_check': '/health/',
        'debug_routes': '/debug/routes/',
        'docs': 'API Documentation temporalmente deshabilitada'
    })

@require_http_methods(["GET"])
def health_check(request):
    """Vista para verificar el estado del servidor"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'SOS-HABILIDOSO API está funcionando correctamente'
    })

@require_http_methods(["GET"])
def debug_routes(request):
    """Vista para debuggear las rutas disponibles"""
    from django.urls import get_resolver
    resolver = get_resolver()
    routes = []
    
    for pattern in resolver.url_patterns:
        routes.append(str(pattern.pattern))
    
    return JsonResponse({
        'routes': routes
    })

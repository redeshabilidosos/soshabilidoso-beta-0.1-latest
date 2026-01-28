"""
URLs principales del proyecto SOS-HABILIDOSO
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from decouple import config
from . import views
from .admin import custom_admin_site

# Verificar si drf-spectacular está habilitado
ENABLE_API_DOCS = config('ENABLE_API_DOCS', default=False, cast=bool)

# Importar vistas de documentación solo si está habilitado
if ENABLE_API_DOCS:
    try:
        from drf_spectacular.views import (
            SpectacularAPIView,
            SpectacularSwaggerView,
            SpectacularRedocView
        )
        SPECTACULAR_AVAILABLE = True
    except ImportError:
        SPECTACULAR_AVAILABLE = False
        print("Warning: drf-spectacular está habilitado pero no se pudo importar")
else:
    SPECTACULAR_AVAILABLE = False

urlpatterns = [
    # Vista raíz de la API
    path('', views.api_root, name='api_root'),
    path('health/', views.health_check, name='health_check'),
    path('debug/routes/', views.debug_routes, name='debug_routes'),
    
    # Admin
    path('admin/', custom_admin_site.urls),
    
    # API Root - Vista específica para /api/
    path('api/', views.api_root, name='api_root_specific'),
    
    # API Endpoints
    path('api/reality/', include('apps.reality.urls')),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/posts/', include('apps.posts.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/messaging/', include('apps.messaging.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/communities/', include('apps.communities.urls')),
    path('api/reels/', include('apps.reels.urls')),
    path('api/advertising/', include('apps.advertising.urls')),
    path('api/classifieds/', include('apps.classifieds.urls')),
    path('api/learning/', include('apps.learning.urls')),
    path('api/media/', include('apps.media_storage.urls')),
    path('api/stories/', include('apps.stories.urls')),
    path('api/donations/', include('apps.donations.urls')),
    path('api/enterprises/', include('apps.enterprises.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/site-settings/', include('apps.site_settings.urls')),
    path('api/streaming/', include('apps.streaming.urls')),
]

# Agregar URLs de documentación si está habilitado y disponible
if ENABLE_API_DOCS and SPECTACULAR_AVAILABLE:
    urlpatterns += [
        # API Documentation
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
        path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    ]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar URLs (si está habilitado)
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
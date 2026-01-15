"""
Configuración de desarrollo para SOS-HABILIDOSO
"""
from .base import *
import os

# Backend URL for building absolute URLs
BACKEND_URL = 'http://localhost:8000'

# Usar PostgreSQL como está configurado en base.py
# Las configuraciones de DATABASES se heredan de base.py

# Debug toolbar para desarrollo - DESHABILITADO temporalmente
# if DEBUG:
#     INSTALLED_APPS += ['debug_toolbar']
#     MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE
#     
#     # Configuración de debug toolbar
#     INTERNAL_IPS = [
#         '127.0.0.1',
#         'localhost',
#     ]

# CORS más permisivo en desarrollo
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Configuración de archivos estáticos para desarrollo
STATICFILES_DIRS = [
    BASE_DIR / 'static_dev',
]

# Email backend para desarrollo
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Cache simple para desarrollo
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Logging más detallado para desarrollo
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'development.log',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'apps': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# Configuración de archivos media para desarrollo
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Configuración JWT más relajada para desarrollo
SIMPLE_JWT.update({
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),  # 1 hora en desarrollo
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),  # 30 días en desarrollo
})

# Configuración de seguridad relajada para desarrollo
SECURE_SSL_REDIRECT = False
SECURE_BROWSER_XSS_FILTER = False
SECURE_CONTENT_TYPE_NOSNIFF = False
X_FRAME_OPTIONS = 'SAMEORIGIN'

# Configuración de CORS específica para desarrollo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://localhost:\d+$",
    r"^http://127\.0\.0\.1:\d+$",
]

# Permitir todos los headers en desarrollo
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Configuración de archivos de desarrollo
FILE_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024  # 50MB para desarrollo
DATA_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024  # 50MB para desarrollo

# Google Sheets Webhook URL para respaldo de datos
# Reemplaza con la URL de tu implementación de Google Apps Script
GOOGLE_SHEETS_WEBHOOK_URL = config(
    'GOOGLE_SHEETS_WEBHOOK_URL',
    default=None  # Configurar en .env cuando esté lista la URL
)

print("Configuracion de desarrollo cargada - usando MySQL")
print("Backend Django corriendo en: http://127.0.0.1:8000")
print("Admin Django disponible en: http://127.0.0.1:8000/admin/")
print("API endpoints en: http://127.0.0.1:8000/api/")
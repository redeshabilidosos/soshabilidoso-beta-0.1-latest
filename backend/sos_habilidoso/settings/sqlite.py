"""
Configuración temporal con SQLite para desarrollo
"""
from .base import *
import os

# Sobrescribir configuración de base de datos para usar SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

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

print("Configuracion SQLite cargada para desarrollo")
print("Backend Django corriendo en: http://127.0.0.1:8000")
print("Admin Django disponible en: http://127.0.0.1:8000/admin/")
print("API endpoints en: http://127.0.0.1:8000/api/")
print("Usando SQLite: db.sqlite3")
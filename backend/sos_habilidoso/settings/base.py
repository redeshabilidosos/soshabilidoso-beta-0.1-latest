"""
Configuración base de Django para SOS-HABILIDOSO
"""
import os
from pathlib import Path
from decouple import config
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-me-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1,testserver').split(',')

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'channels',
]

# Habilitar drf-spectacular de manera condicional
ENABLE_API_DOCS = config('ENABLE_API_DOCS', default=False, cast=bool)
if ENABLE_API_DOCS:
    THIRD_PARTY_APPS += [
        'drf_spectacular',
        'drf_spectacular_sidecar',
    ]

LOCAL_APPS = [
    'apps.authentication',
    'apps.users',
    'apps.posts',
    'apps.messaging',
    'apps.communities',
    'apps.reels',
    'apps.media_storage',
    'apps.classifieds',
    'apps.advertising',
    'apps.finance',
    'apps.notifications',
    'apps.reality',
    'apps.learning',
    'apps.stories',
    'apps.donations',
    'apps.enterprises',
    'apps.payments',
    'apps.site_settings',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'sos_habilidoso.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sos_habilidoso.wsgi.application'
ASGI_APPLICATION = 'sos_habilidoso.asgi.application'

# Channels Layer Configuration (In-memory for development)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

# Database (MySQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DATABASE_NAME', default='habilidosos_db'),
        'USER': config('DATABASE_USER', default='root'),
        'PASSWORD': config('DATABASE_PASSWORD', default=''),
        'HOST': config('DATABASE_HOST', default='localhost'),
        'PORT': config('DATABASE_PORT', default='3307'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    },
    'habilidosos_clean': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'habilidosos_clean',
        'USER': config('DATABASE_USER', default='root'),
        'PASSWORD': config('DATABASE_PASSWORD', default=''),
        'HOST': config('DATABASE_HOST', default='localhost'),
        'PORT': config('DATABASE_PORT', default='3307'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}

# Database Router
DATABASE_ROUTERS = ['sos_habilidoso.db_router.RealityDatabaseRouter']

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'es-es'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = False  # Desactivado temporalmente - MariaDB no tiene timezone tables instaladas

# Static files (CSS, JavaScript, Images)
STATIC_URL = config('STATIC_URL', default='/static/')
STATIC_ROOT = BASE_DIR / 'static'

# Media files
MEDIA_URL = config('MEDIA_URL', default='/media/')
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],

    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
}

# Configurar drf-spectacular solo si está habilitado
if ENABLE_API_DOCS:
    REST_FRAMEWORK['DEFAULT_SCHEMA_CLASS'] = 'drf_spectacular.openapi.AutoSchema'

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=config('JWT_ACCESS_TOKEN_LIFETIME', default=60, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=config('JWT_REFRESH_TOKEN_LIFETIME', default=7, cast=int)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': config('JWT_ALGORITHM', default='HS256'),
    'SIGNING_KEY': config('JWT_SECRET_KEY', default=SECRET_KEY),
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'TOKEN_OBTAIN_SERIALIZER': 'apps.authentication.serializers.CustomTokenObtainPairSerializer',
}

# CORS Settings
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000'
).split(',')

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Solo en desarrollo

# File Storage (Local para desarrollo)
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

# Cache (Simplificado para desarrollo)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Email Settings (Development)
EMAIL_BACKEND = config(
    'EMAIL_BACKEND',
    default='django.core.mail.backends.console.EmailBackend'
)

# Security Settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# File Upload Settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB

# Configuración simplificada para desarrollo

# Logging
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
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ================================================================================
# DRF-SPECTACULAR CONFIGURATION - API DOCUMENTATION
# ================================================================================

# Solo configurar drf-spectacular si está habilitado
if ENABLE_API_DOCS:
    SPECTACULAR_SETTINGS = {
        'TITLE': 'SOS-HABILIDOSO API',
        'DESCRIPTION': '''
        API REST completa para la plataforma social SOS-HABILIDOSO.
        
        Esta API proporciona endpoints para:
        - 🔐 Autenticación y gestión de usuarios
        - 📱 Feed social y publicaciones
        - 🎥 Reels y contenido multimedia
        - 🏛️ Eventos culturales
        - 📢 Clasificados y anuncios
        - 🎓 Sistema de aprendizaje
        - 👥 Comunidades y grupos
        - 💬 Mensajería y notificaciones
        - 💰 Donaciones y pagos
        - 🏢 Perfiles empresariales
        - ⚙️ Configuración del sitio
        
        ## Autenticación
        La API utiliza JWT (JSON Web Tokens) para la autenticación.
        
        ### Obtener token:
        ```
        POST /api/auth/login/
        {
            "username": "tu_usuario",
            "password": "tu_contraseña"
        }
        ```
        
        ### Usar token:
        ```
        Authorization: Bearer <tu_access_token>
        ```
        
        ## Códigos de respuesta
        - 200: Éxito
        - 201: Creado exitosamente
        - 400: Error en los datos enviados
        - 401: No autenticado
        - 403: Sin permisos
        - 404: No encontrado
        - 500: Error del servidor
        ''',
        'VERSION': '1.0.0',
        'SERVE_INCLUDE_SCHEMA': False,
        
        # Usar sidecar para servir archivos estáticos
        'SWAGGER_UI_DIST': 'SIDECAR',
        'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
        'REDOC_DIST': 'SIDECAR',
        
        # Configuración de la interfaz
        'SWAGGER_UI_SETTINGS': {
            'deepLinking': True,
            'persistAuthorization': True,
            'displayOperationId': True,
            'displayRequestDuration': True,
            'filter': True,
            'tryItOutEnabled': True,
            'supportedSubmitMethods': ['get', 'post', 'put', 'patch', 'delete'],
        },
        
        # Configuración de ReDoc
        'REDOC_UI_SETTINGS': {
            'nativeScrollbars': True,
            'theme': {
                'colors': {
                    'primary': {
                        'main': '#00ff88'  # Color verde de SOS-HABILIDOSO
                    }
                }
            }
        },
        
        # Configuración del esquema
        'SCHEMA_PATH_PREFIX': '/api/',
        'COMPONENT_SPLIT_REQUEST': True,
        'SORT_OPERATIONS': False,
        
        # Configuración de autenticación en la documentación
        'AUTHENTICATION_WHITELIST': [
            'rest_framework_simplejwt.authentication.JWTAuthentication',
        ],
        
        # Configuración de tags
        'TAGS': [
            {'name': 'Authentication', 'description': 'Endpoints de autenticación y registro'},
            {'name': 'Users', 'description': 'Gestión de usuarios y perfiles'},
            {'name': 'Posts', 'description': 'Publicaciones del feed social'},
            {'name': 'Reels', 'description': 'Videos cortos y contenido multimedia'},
            {'name': 'Cultural Events', 'description': 'Eventos culturales y actividades'},
            {'name': 'Classifieds', 'description': 'Clasificados y anuncios'},
            {'name': 'Learning', 'description': 'Sistema de aprendizaje y cursos'},
            {'name': 'Communities', 'description': 'Comunidades y grupos'},
            {'name': 'Messaging', 'description': 'Mensajería y chat'},
            {'name': 'Notifications', 'description': 'Sistema de notificaciones'},
            {'name': 'Donations', 'description': 'Donaciones y crowdfunding'},
            {'name': 'Enterprises', 'description': 'Perfiles empresariales'},
            {'name': 'Payments', 'description': 'Procesamiento de pagos'},
            {'name': 'Media', 'description': 'Gestión de archivos multimedia'},
            {'name': 'Stories', 'description': 'Historias temporales'},
            {'name': 'Site Settings', 'description': 'Configuración del sitio'},
            {'name': 'Reality', 'description': 'Datos de realidad aumentada'},
        ],
        
        # Configuración de servidores
        'SERVERS': [
            {
                'url': 'http://127.0.0.1:8000',
                'description': 'Servidor de desarrollo local'
            },
            {
                'url': 'https://api.soshabilidoso.com',
                'description': 'Servidor de producción'
            }
        ],
        
        # Configuración de contacto
        'CONTACT': {
            'name': 'Equipo SOS-HABILIDOSO',
            'email': 'api@soshabilidoso.com',
            'url': 'https://soshabilidoso.com'
        },
        
        # Licencia
        'LICENSE': {
            'name': 'Propietario',
            'url': 'https://soshabilidoso.com/license'
        },
        
        # Configuración adicional
        'EXTERNAL_DOCS': {
            'description': 'Documentación completa',
            'url': 'https://docs.soshabilidoso.com'
        },
        
        # Configuración de ejemplos
        'ENUM_NAME_OVERRIDES': {
            'ValidationErrorEnum': 'django.core.exceptions.ValidationError',
        },
        
        # Configuración de componentes
        'COMPONENT_NO_READ_ONLY_REQUIRED': True,
        'PREPROCESSING_HOOKS': [
            'drf_spectacular.hooks.preprocess_exclude_path_format',
        ],
        'POSTPROCESSING_HOOKS': [
            'drf_spectacular.hooks.postprocess_schema_enums',
        ],
    }
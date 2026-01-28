"""
Configuración básica de Django para SOS-HABILIDOSO
"""
from pathlib import Path
import os
import pymysql

# Configurar PyMySQL como driver de MySQL
pymysql.install_as_MySQLdb()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-tu-secret-key-aqui-cambiar-en-produccion'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Backend URL for building absolute URLs (puede ser sobrescrito por variable de entorno)
BACKEND_URL = os.getenv('BACKEND_URL', 'http://127.0.0.1:8000')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework.authtoken',  # Token Authentication
    'corsheaders',
    'channels',  # WebSocket support
    'drf_spectacular',  # API Documentation
    'drf_spectacular_sidecar',  # Archivos estáticos para Swagger/ReDoc
    
    # Local apps
    'apps.reality',
    'apps.authentication',
    'apps.users',
    'apps.posts',
    'apps.messaging',
    'apps.notifications',
    'apps.communities',
    'apps.reels',
    'apps.advertising',
    'apps.classifieds',
    'apps.learning',
    'apps.media_storage',
    'apps.stories',
    'apps.donations',
    'apps.enterprises',
    'apps.payments',
    'apps.site_settings',
    'apps.streaming',  # Sistema de streaming en vivo
    'apps.common',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'apps.site_settings.middleware.RouteAccessMiddleware',  # DESACTIVADO TEMPORALMENTE
]

ROOT_URLCONF = 'sos_habilidoso.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

# Database - Usar MySQL como base de datos principal
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'habilidosos_db',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3307',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    },
    'sqlite_backup': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

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
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files (User uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configurar modelo de usuario personalizado
AUTH_USER_MODEL = 'users.User'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',  # Para compatibilidad con Token
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    # Configuración para drf-spectacular
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# JWT Configuration
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
}

# CORS Settings - Permitir Next.js
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # Solo para desarrollo

# Channel Layers - Para WebSockets
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

# Database Router - Solo para la app reality
DATABASE_ROUTERS = []  # Deshabilitado temporalmente para usar MySQL como default
# =
===============================================================================
# DRF-SPECTACULAR CONFIGURATION - API DOCUMENTATION
# ================================================================================

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
        'docExpansion': 'list',  # Expandir las operaciones automáticamente ('none', 'list', 'full')
        'defaultModelsExpandDepth': 3,  # Expandir modelos
        'defaultModelExpandDepth': 3,
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
    
    # Configuración de componentes
    'COMPONENT_NO_READ_ONLY_REQUIRED': True,
    'PREPROCESSING_HOOKS': [
        'drf_spectacular.hooks.preprocess_exclude_path_format',
    ],
    'POSTPROCESSING_HOOKS': [],  # Deshabilitamos el hook de enums que causa problemas
    
    # Deshabilitar enum name overrides completamente
    'ENUM_NAME_OVERRIDES': {},
    'ENUM_GENERATE_CHOICE_DESCRIPTION': False,  # Deshabilitar generación de descripciones de choices
}
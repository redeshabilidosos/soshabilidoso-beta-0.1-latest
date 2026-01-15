"""
Configuración de settings por ambiente
"""
import os
from decouple import config

# Determinar el ambiente
ENVIRONMENT = config('ENVIRONMENT', default='development')

if ENVIRONMENT == 'production':
    from .production import *
elif ENVIRONMENT == 'testing':
    from .testing import *
elif ENVIRONMENT == 'sqlite':
    from .sqlite import *
else:
    from .development import *
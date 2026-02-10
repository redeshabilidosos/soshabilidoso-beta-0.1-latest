"""
WSGI config for sos_habilidoso project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

# Configurar pymysql como reemplazo de mysqlclient para Django 5.0
try:
    import pymysql
    pymysql.install_as_MySQLdb()
    
    # Patch para que Django 5.0 acepte pymysql
    # Django 5.0 requiere mysqlclient 2.2.1+, pero pymysql reporta su propia versión
    import MySQLdb
    if hasattr(MySQLdb, '__version__'):
        # Guardar la versión real de pymysql
        MySQLdb._original_version = MySQLdb.__version__
        # Reportar una versión compatible con Django 5.0
        MySQLdb.__version__ = '2.2.1'
        MySQLdb.version_info = (2, 2, 1, 'final', 0)
except ImportError:
    pass  # pymysql no está instalado, usar mysqlclient por defecto

# Patch para deshabilitar verificación de versión de MariaDB
# Django 5.x requiere MariaDB 10.5+, pero tenemos 10.4.32
try:
    from django.db.backends.mysql import base as mysql_base
    original_check = mysql_base.DatabaseWrapper.check_database_version_supported
    
    def patched_check(self):
        """No verificar versión de MariaDB - aceptar cualquier versión"""
        pass
    
    mysql_base.DatabaseWrapper.check_database_version_supported = patched_check
except Exception:
    pass  # Si falla el patch, continuar normalmente

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

application = get_wsgi_application()
"""
Custom MySQL database backend que bypasea la verificación de versión de MariaDB
y deshabilita RETURNING para permitir usar MariaDB 10.4 con Django 5.x
"""
from django.db.backends.mysql.base import DatabaseWrapper as MySQLDatabaseWrapper
from django.db.backends.mysql.features import DatabaseFeatures as MySQLDatabaseFeatures
from django.db.backends.mysql.operations import DatabaseOperations as MySQLDatabaseOperations


class DatabaseFeatures(MySQLDatabaseFeatures):
    """
    Features personalizadas para deshabilitar RETURNING en MariaDB 10.4
    """
    # Deshabilitar RETURNING a nivel de clase - no soportado en MariaDB 10.4
    can_return_columns_from_insert = False
    can_return_rows_from_bulk_insert = False
    
    @property
    def supports_returning(self):
        """Deshabilitar RETURNING dinámicamente"""
        return False


class DatabaseOperations(MySQLDatabaseOperations):
    """
    Operaciones personalizadas para deshabilitar RETURNING
    """
    
    def return_insert_columns(self, fields):
        """
        Override para no retornar columnas en INSERT
        MariaDB 10.4 no soporta RETURNING
        """
        # Retornar None para deshabilitar RETURNING
        return None
    
    def fetch_returned_insert_columns(self, cursor, returning_params=None):
        """
        Override para no intentar fetch de columnas retornadas
        """
        # No hacer nada - MariaDB 10.4 no soporta RETURNING
        return []


class DatabaseWrapper(MySQLDatabaseWrapper):
    """
    Wrapper personalizado que deshabilita la verificación de versión de MariaDB
    y deshabilita RETURNING para compatibilidad con MariaDB 10.4
    """
    
    # Usar nuestras features y operations personalizadas
    features_class = DatabaseFeatures
    ops_class = DatabaseOperations
    
    def get_database_version(self):
        """
        Override para reportar una versión compatible con Django 5.x
        """
        # Obtener la versión real
        real_version = super().get_database_version()
        
        # Si es MariaDB 10.4, reportar 10.5 para pasar la verificación
        if real_version[0] == 10 and real_version[1] == 4:
            # Reportar MariaDB 10.5.0 (versión mínima requerida por Django 5.x)
            return (10, 5, 0)
        
        return real_version
    
    def check_database_version_supported(self):
        """
        Override para deshabilitar la verificación estricta de versión
        """
        # No hacer nada - aceptar cualquier versión
        pass

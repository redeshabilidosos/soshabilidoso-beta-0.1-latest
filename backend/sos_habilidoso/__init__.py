"""
Inicialización del proyecto SOS Habilidoso
Patch global para deshabilitar RETURNING en MariaDB 10.4
"""

# Patch para deshabilitar RETURNING globalmente
def patch_mysql_returning():
    """
    Patch global para deshabilitar RETURNING en todas las conexiones MySQL
    """
    try:
        from django.db.backends.mysql import features, operations
        
        # Guardar métodos originales
        original_return_insert = operations.DatabaseOperations.return_insert_columns
        
        # Patch para DatabaseFeatures
        original_can_return_columns = features.DatabaseFeatures.can_return_columns_from_insert
        original_can_return_rows = features.DatabaseFeatures.can_return_rows_from_bulk_insert
        
        # Reemplazar con propiedades que siempre retornan False
        features.DatabaseFeatures.can_return_columns_from_insert = property(lambda self: False)
        features.DatabaseFeatures.can_return_rows_from_bulk_insert = property(lambda self: False)
        
        def patched_return_insert(self, fields):
            """Return insert patcheado que siempre retorna None"""
            return None
        
        # Aplicar patch a operations
        operations.DatabaseOperations.return_insert_columns = patched_return_insert
        
    except ImportError:
        pass  # Django no está instalado aún

# Aplicar patch al importar el módulo
patch_mysql_returning()

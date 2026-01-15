"""
Router de base de datos para manejar múltiples bases de datos
"""


class RealityDatabaseRouter:
    """
    Router para dirigir las operaciones de la app reality a la base de datos habilidosos_clean
    """
    
    def db_for_read(self, model, **hints):
        """Dirigir lecturas de la app reality a habilidosos_clean"""
        if model._meta.app_label == 'reality':
            return 'habilidosos_clean'
        return None
    
    def db_for_write(self, model, **hints):
        """Dirigir escrituras de la app reality a habilidosos_clean"""
        if model._meta.app_label == 'reality':
            return 'habilidosos_clean'
        return None
    
    def allow_relation(self, obj1, obj2, **hints):
        """Permitir relaciones si ambos modelos están en la misma base de datos"""
        if obj1._meta.app_label == 'reality' or obj2._meta.app_label == 'reality':
            return obj1._meta.app_label == obj2._meta.app_label
        return None
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """No permitir migraciones para la app reality"""
        if app_label == 'reality':
            return False
        return None

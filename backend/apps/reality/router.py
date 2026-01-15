"""
Database router para dirigir las operaciones de Participante a habilidosos_clean
"""


class RealityDatabaseRouter:
    """
    Router para dirigir todas las operaciones del modelo Participante
    a la base de datos habilidosos_clean
    """
    
    def db_for_read(self, model, **hints):
        """
        Dirigir lecturas de Participante a habilidosos_clean
        """
        if model._meta.app_label == 'reality':
            return 'habilidosos_clean'
        return None
    
    def db_for_write(self, model, **hints):
        """
        Dirigir escrituras de Participante a habilidosos_clean
        """
        if model._meta.app_label == 'reality':
            return 'habilidosos_clean'
        return None
    
    def allow_relation(self, obj1, obj2, **hints):
        """
        Permitir relaciones si ambos modelos están en reality
        """
        if obj1._meta.app_label == 'reality' or obj2._meta.app_label == 'reality':
            return True
        return None
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        No permitir migraciones para reality (managed=False)
        """
        if app_label == 'reality':
            return False
        return None

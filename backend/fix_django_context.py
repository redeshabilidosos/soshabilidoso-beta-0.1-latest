"""
Parche temporal para solucionar el problema de contexto de Django con Python 3.14
Este script debe ejecutarse ANTES de iniciar el servidor
"""
import django
from django.template import context

# Guardar el método original
_original_copy = context.BaseContext.__copy__

def patched_copy(self):
    """Versión parcheada del método __copy__ que funciona con Python 3.14"""
    try:
        return _original_copy(self)
    except AttributeError:
        # Fallback para Python 3.14
        duplicate = self.__class__()
        if hasattr(self, 'dicts'):
            duplicate.dicts = self.dicts[:]
        elif hasattr(self, '_dict'):
            duplicate._dict = self._dict.copy()
        return duplicate

# Aplicar el parche
context.BaseContext.__copy__ = patched_copy

print("✅ Parche de Django aplicado para Python 3.14")

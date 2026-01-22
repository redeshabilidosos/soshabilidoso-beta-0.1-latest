"""
Parche para drf-spectacular para Python 3.12+
Soluciona el problema con ValidationError y enum processing
"""
import sys


def apply_spectacular_patch():
    """Aplicar parche a drf-spectacular para Python 3.12+"""
    
    # Solo aplicar en Python 3.12+
    if sys.version_info < (3, 12):
        return
    
    try:
        from drf_spectacular import plumbing
        
        # Guardar la función original
        _original_load_enum_name_overrides = plumbing._load_enum_name_overrides
        
        # Crear versión parcheada que maneja el error
        def _load_enum_name_overrides_patched(language):
            """Versión parcheada que evita el error con ValidationError"""
            try:
                return _original_load_enum_name_overrides(language)
            except TypeError as e:
                if "ValidationError" in str(e):
                    # Si el error es con ValidationError, retornar diccionario vacío
                    return {}
                raise
        
        # Reemplazar la función
        plumbing._load_enum_name_overrides = _load_enum_name_overrides_patched
        
        print("✅ Parche de drf-spectacular aplicado para Python 3.12+")
        
    except Exception as e:
        print(f"⚠️  No se pudo aplicar el parche de drf-spectacular: {e}")


# Aplicar el parche automáticamente al importar
apply_spectacular_patch()

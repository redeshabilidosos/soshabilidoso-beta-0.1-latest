"""
Parche para drf-spectacular con Python 3.14
"""
import sys

if sys.version_info >= (3, 14):
    try:
        from drf_spectacular import plumbing
        
        # Guardar la función original
        _original_load_enum_name_overrides = plumbing.load_enum_name_overrides
        
        def patched_load_enum_name_overrides():
            """Versión parcheada que maneja correctamente los tipos en Python 3.14"""
            try:
                return _original_load_enum_name_overrides()
            except TypeError as e:
                if "'type' object is not iterable" in str(e):
                    # Retornar un diccionario vacío si hay error
                    return {}
                raise
        
        # Aplicar el parche
        plumbing.load_enum_name_overrides = patched_load_enum_name_overrides
        
        print("✅ Parche de drf-spectacular aplicado para Python 3.14")
    except Exception as e:
        print(f"⚠️ No se pudo aplicar el parche de drf-spectacular: {e}")

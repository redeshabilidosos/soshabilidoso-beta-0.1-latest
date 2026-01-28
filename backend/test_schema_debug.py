import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from drf_spectacular.generators import SchemaGenerator
from drf_spectacular.plumbing import load_enum_name_overrides

print("Intentando cargar enum overrides...")

try:
    overrides = load_enum_name_overrides()
    print("[OK] Enum overrides cargados correctamente")
except Exception as e:
    print(f"[ERROR] Error al cargar enum overrides: {e}")
    traceback.print_exc()
    
    # Intentar identificar el problema
    print("\n[DEBUG] Buscando el modelo problematico...")
    
    from django.apps import apps
    for app_config in apps.get_app_configs():
        if app_config.name.startswith('apps.'):
            print(f"\nRevisando app: {app_config.name}")
            for model in app_config.get_models():
                print(f"  Modelo: {model.__name__}")
                for field in model._meta.get_fields():
                    if hasattr(field, 'choices') and field.choices:
                        print(f"    Campo con choices: {field.name}")
                        print(f"      Tipo de choices: {type(field.choices)}")
                        if not isinstance(field.choices, (list, tuple)):
                            print(f"      [WARNING] PROBLEMA: choices no es list/tuple!")

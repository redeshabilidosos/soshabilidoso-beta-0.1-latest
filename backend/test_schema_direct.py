import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
sys.path.insert(0, os.path.dirname(__file__))

try:
    django.setup()
    print("✅ Django setup exitoso")
    
    from drf_spectacular.generators import SchemaGenerator
    print("✅ SchemaGenerator importado")
    
    generator = SchemaGenerator()
    print("✅ Generator creado")
    
    schema = generator.get_schema()
    print("✅ Schema generado exitosamente!")
    print(f"Paths: {len(schema.get('paths', {}))}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

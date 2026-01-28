import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from drf_spectacular.generators import SchemaGenerator

print("Generando schema completo...")
generator = SchemaGenerator()
schema = generator.get_schema()

print("[OK] Schema generado exitosamente")
print(f"Paths: {len(schema.get('paths', {}))} endpoints")
print(f"Components: {len(schema.get('components', {}).get('schemas', {}))} schemas")

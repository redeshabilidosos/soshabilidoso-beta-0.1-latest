#!/usr/bin/env python
"""
Script para diagnosticar el error 500 en /api/schema/
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
sys.path.insert(0, os.path.dirname(__file__))
django.setup()

print("=" * 60)
print("DIAGNÓSTICO DE GENERACIÓN DE SCHEMA")
print("=" * 60)

try:
    from drf_spectacular.generators import SchemaGenerator
    print("✅ Importación de SchemaGenerator exitosa")
    
    # Intentar generar el schema
    print("\n🔄 Generando schema...")
    generator = SchemaGenerator()
    schema = generator.get_schema()
    
    print("✅ Schema generado exitosamente!")
    print(f"\n📊 Información del schema:")
    print(f"   - Versión OpenAPI: {schema.get('openapi', 'N/A')}")
    print(f"   - Título: {schema.get('info', {}).get('title', 'N/A')}")
    print(f"   - Versión: {schema.get('info', {}).get('version', 'N/A')}")
    print(f"   - Número de paths: {len(schema.get('paths', {}))}")
    print(f"   - Número de componentes: {len(schema.get('components', {}).get('schemas', {}))}")
    
except Exception as e:
    print(f"❌ Error al generar schema:")
    print(f"   Tipo: {type(e).__name__}")
    print(f"   Mensaje: {str(e)}")
    
    import traceback
    print("\n📋 Traceback completo:")
    traceback.print_exc()
    
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ DIAGNÓSTICO COMPLETADO")
print("=" * 60)

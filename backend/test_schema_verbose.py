import os
import sys
import django
import signal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
sys.path.insert(0, os.path.dirname(__file__))

# Timeout handler
def timeout_handler(signum, frame):
    print("\n❌ TIMEOUT: El schema se está colgando")
    print("Esto indica un problema con referencias circulares o bucles infinitos")
    sys.exit(1)

# Set timeout de 10 segundos
signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(10)

try:
    print("1. Configurando Django...")
    django.setup()
    print("✅ Django configurado")
    
    print("\n2. Importando SchemaGenerator...")
    from drf_spectacular.generators import SchemaGenerator
    print("✅ SchemaGenerator importado")
    
    print("\n3. Creando generador...")
    generator = SchemaGenerator()
    print("✅ Generador creado")
    
    print("\n4. Generando schema (esto puede tardar)...")
    print("   Si se cuelga aquí, hay un problema con los serializers")
    
    schema = generator.get_schema()
    
    # Cancelar timeout
    signal.alarm(0)
    
    print("\n✅ ¡Schema generado exitosamente!")
    print(f"\n📊 Estadísticas:")
    print(f"   - Paths: {len(schema.get('paths', {}))}")
    print(f"   - Components: {len(schema.get('components', {}).get('schemas', {}))}")
    
except KeyboardInterrupt:
    print("\n⚠️  Interrumpido por el usuario")
    sys.exit(1)
except Exception as e:
    signal.alarm(0)
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

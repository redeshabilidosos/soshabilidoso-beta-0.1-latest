#!/usr/bin/env python3
"""
Script para iniciar el servidor Django de SOS-HABILIDOSO
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    # Obtener el directorio del backend
    backend_dir = Path(__file__).parent.parent
    os.chdir(backend_dir)
    
    print("🚀 Iniciando servidor Django de SOS-HABILIDOSO...")
    print()
    
    # Verificar configuración
    env_file = backend_dir / '.env'
    if not env_file.exists():
        print("⚠️  Archivo .env no encontrado. Creando desde .env.example...")
        example_file = backend_dir / '.env.example'
        if example_file.exists():
            import shutil
            shutil.copy(example_file, env_file)
            print("✅ Archivo .env creado. Revisa la configuración antes de continuar.")
        else:
            print("❌ Archivo .env.example no encontrado.")
            return
    
    # Verificar estado de la documentación API
    try:
        from decouple import config
        enable_docs = config('ENABLE_API_DOCS', default=False, cast=bool)
        if enable_docs:
            print("📚 Documentación API: HABILITADA")
            print("   • Swagger UI: http://127.0.0.1:8000/api/docs/")
            print("   • ReDoc:     http://127.0.0.1:8000/api/redoc/")
        else:
            print("📚 Documentación API: DESHABILITADA")
            print("   • Para habilitar: python scripts/toggle_api_docs.py enable")
    except:
        print("📚 Documentación API: Estado desconocido")
    
    print()
    print("🔗 URLs disponibles:")
    print("   • API Root:    http://127.0.0.1:8000/")
    print("   • Health:      http://127.0.0.1:8000/health/")
    print("   • Admin:       http://127.0.0.1:8000/admin/")
    print("   • API:         http://127.0.0.1:8000/api/")
    print()
    print("📊 Bases de datos configuradas:")
    print("   • habilidosos_db    - Base de datos principal")
    print("   • habilidosos_clean - Solo para formularios reality")
    print()
    print("🔄 Iniciando servidor en http://127.0.0.1:8000...")
    print("   Presiona Ctrl+C para detener")
    print()
    
    try:
        # Iniciar el servidor
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'
        ], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido por el usuario")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error al iniciar el servidor: {e}")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
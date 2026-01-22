#!/usr/bin/env python3
"""
Script para habilitar/deshabilitar la documentación API (drf-spectacular)
"""
import os
import sys
from pathlib import Path

def main():
    # Obtener el directorio del backend
    backend_dir = Path(__file__).parent.parent
    env_file = backend_dir / '.env'
    
    if len(sys.argv) != 2 or sys.argv[1] not in ['enable', 'disable']:
        print("Uso: python toggle_api_docs.py [enable|disable]")
        print()
        print("enable  - Habilita la documentación API (drf-spectacular)")
        print("disable - Deshabilita la documentación API")
        sys.exit(1)
    
    action = sys.argv[1]
    enable_docs = action == 'enable'
    
    # Leer el archivo .env actual
    env_lines = []
    if env_file.exists():
        with open(env_file, 'r', encoding='utf-8') as f:
            env_lines = f.readlines()
    
    # Buscar y actualizar la línea ENABLE_API_DOCS
    found = False
    for i, line in enumerate(env_lines):
        if line.strip().startswith('ENABLE_API_DOCS='):
            env_lines[i] = f'ENABLE_API_DOCS={str(enable_docs).lower()}\n'
            found = True
            break
    
    # Si no se encontró, agregar la línea
    if not found:
        env_lines.append(f'ENABLE_API_DOCS={str(enable_docs).lower()}\n')
    
    # Escribir el archivo .env actualizado
    with open(env_file, 'w', encoding='utf-8') as f:
        f.writelines(env_lines)
    
    if enable_docs:
        print("✅ Documentación API HABILITADA")
        print()
        print("La documentación estará disponible en:")
        print("  • Swagger UI: http://127.0.0.1:8000/api/docs/")
        print("  • ReDoc:     http://127.0.0.1:8000/api/redoc/")
        print("  • Schema:    http://127.0.0.1:8000/api/schema/")
        print()
        print("⚠️  Reinicia el servidor Django para aplicar los cambios:")
        print("   python manage.py runserver")
    else:
        print("❌ Documentación API DESHABILITADA")
        print()
        print("La documentación no estará disponible hasta que la habilites nuevamente.")
        print()
        print("⚠️  Reinicia el servidor Django para aplicar los cambios:")
        print("   python manage.py runserver")

if __name__ == '__main__':
    main()
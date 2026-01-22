#!/usr/bin/env python
"""
Script para configurar la documentación automática de la API con drf-spectacular
"""
import subprocess
import sys
import os

def install_requirements():
    """Instala las dependencias necesarias"""
    print("🚀 Instalando drf-spectacular...")
    
    try:
        # Instalar drf-spectacular
        subprocess.check_call([
            sys.executable, '-m', 'pip', 'install', 
            'drf-spectacular==0.27.0'
        ])
        
        # Instalar sidecar para interfaces estáticas
        subprocess.check_call([
            sys.executable, '-m', 'pip', 'install', 
            'drf-spectacular[sidecar]==0.27.0'
        ])
        
        print("✅ Dependencias instaladas correctamente")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando dependencias: {e}")
        return False

def run_migrations():
    """Ejecuta las migraciones de Django"""
    print("🔄 Ejecutando migraciones...")
    
    try:
        subprocess.check_call([sys.executable, 'manage.py', 'migrate'])
        print("✅ Migraciones ejecutadas correctamente")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error ejecutando migraciones: {e}")
        return False

def collect_static():
    """Recolecta archivos estáticos"""
    print("📦 Recolectando archivos estáticos...")
    
    try:
        subprocess.check_call([
            sys.executable, 'manage.py', 'collectstatic', '--noinput'
        ])
        print("✅ Archivos estáticos recolectados")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error recolectando estáticos: {e}")
        return False

def generate_schema():
    """Genera el esquema OpenAPI"""
    print("📋 Generando esquema OpenAPI...")
    
    try:
        # Generar esquema en formato YAML
        with open('api_schema.yaml', 'w') as f:
            subprocess.check_call([
                sys.executable, 'manage.py', 'spectacular', 
                '--color', '--file', 'api_schema.yaml'
            ])
        
        print("✅ Esquema generado: api_schema.yaml")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error generando esquema: {e}")
        return False

def main():
    """Función principal"""
    print("🎯 Configurando documentación automática de API")
    print("=" * 50)
    
    # Cambiar al directorio del script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    steps = [
        ("Instalando dependencias", install_requirements),
        ("Ejecutando migraciones", run_migrations),
        ("Recolectando archivos estáticos", collect_static),
        ("Generando esquema OpenAPI", generate_schema),
    ]
    
    success_count = 0
    
    for step_name, step_func in steps:
        print(f"\n📌 {step_name}...")
        if step_func():
            success_count += 1
        else:
            print(f"⚠️  Falló: {step_name}")
    
    print("\n" + "=" * 50)
    print(f"✅ Completado: {success_count}/{len(steps)} pasos exitosos")
    
    if success_count == len(steps):
        print("\n🎉 ¡Documentación configurada exitosamente!")
        print("\n📖 URLs disponibles:")
        print("   • Swagger UI: http://127.0.0.1:8000/api/docs/")
        print("   • ReDoc:     http://127.0.0.1:8000/api/redoc/")
        print("   • Esquema:   http://127.0.0.1:8000/api/schema/")
        print("\n🚀 Para iniciar el servidor:")
        print("   python manage.py runserver")
    else:
        print("\n⚠️  Algunos pasos fallaron. Revisa los errores arriba.")

if __name__ == "__main__":
    main()
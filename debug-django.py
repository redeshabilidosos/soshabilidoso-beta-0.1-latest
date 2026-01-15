#!/usr/bin/env python3
"""
Script de diagnóstico para Django
"""
import os
import sys
import subprocess

def check_file(filepath, description):
    """Verifica si un archivo existe"""
    if os.path.exists(filepath):
        print(f"✓ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} (NO ENCONTRADO)")
        return False

def run_command(command, cwd=None):
    """Ejecuta un comando y muestra el resultado"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        print(f"\n🔍 Comando: {command}")
        print(f"Código de salida: {result.returncode}")
        if result.stdout:
            print(f"Salida: {result.stdout}")
        if result.stderr:
            print(f"Error: {result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"Error ejecutando comando: {e}")
        return False

def main():
    print("🔍 Diagnóstico del proyecto Django...")
    
    # Verificar estructura de directorios
    print("\n📁 Verificando estructura de directorios:")
    check_file("backend", "Directorio backend")
    check_file("backend/manage.py", "Archivo manage.py")
    check_file("backend/.env", "Archivo .env")
    check_file("backend/sos_habilidoso", "Directorio del proyecto")
    check_file("backend/apps", "Directorio de apps")
    
    # Verificar apps
    print("\n📱 Verificando apps:")
    check_file("backend/apps/authentication", "App authentication")
    check_file("backend/apps/users", "App users")
    check_file("backend/apps/posts", "App posts")
    check_file("backend/apps/chat", "App chat")
    
    # Verificar archivos de configuración
    print("\n⚙️ Verificando configuración:")
    check_file("backend/sos_habilidoso/settings", "Directorio settings")
    check_file("backend/sos_habilidoso/settings/__init__.py", "Settings __init__.py")
    check_file("backend/sos_habilidoso/settings/base.py", "Settings base.py")
    check_file("backend/sos_habilidoso/settings/development.py", "Settings development.py")
    
    # Verificar requirements
    print("\n📦 Verificando requirements:")
    check_file("backend/requirements", "Directorio requirements")
    check_file("backend/requirements/base.txt", "Requirements base.txt")
    check_file("backend/requirements/development.txt", "Requirements development.txt")
    
    backend_dir = os.path.join(os.getcwd(), 'backend')
    
    # Verificar entorno virtual
    print("\n🐍 Verificando Python y entorno virtual:")
    run_command("python --version", backend_dir)
    run_command("pip --version", backend_dir)
    
    # Intentar importar Django
    print("\n🔧 Verificando Django:")
    run_command("python -c \"import django; print(f'Django version: {django.get_version()}')\"", backend_dir)
    
    # Verificar configuración de Django
    print("\n⚙️ Verificando configuración de Django:")
    run_command("python manage.py check", backend_dir)
    
    # Verificar migraciones
    print("\n🗄️ Verificando migraciones:")
    run_command("python manage.py showmigrations", backend_dir)
    
    print("\n✅ Diagnóstico completado!")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Script de inicio rápido para el proyecto SOS Habilidoso
"""
import os
import sys
import subprocess

def run_command(command, cwd=None):
    """Ejecuta un comando y maneja errores"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error ejecutando: {command}")
            print(f"Error: {result.stderr}")
            return False
        print(f"✓ {command}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print("🚀 Iniciando configuración rápida del proyecto...")
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists('backend'):
        print("❌ No se encontró el directorio backend. Ejecuta desde la raíz del proyecto.")
        return
    
    # Cambiar al directorio backend
    backend_dir = os.path.join(os.getcwd(), 'backend')
    
    print("\n📦 Instalando dependencias de Python...")
    if not run_command("pip install -r requirements/development.txt", backend_dir):
        print("❌ Error instalando dependencias")
        return
    
    print("\n🗄️ Configurando base de datos...")
    if not run_command("python manage.py makemigrations", backend_dir):
        print("❌ Error creando migraciones")
        return
    
    if not run_command("python manage.py migrate", backend_dir):
        print("❌ Error aplicando migraciones")
        return
    
    print("\n👤 Creando usuario de prueba...")
    if not run_command("python create_molo_user.py", backend_dir):
        print("⚠️ No se pudo crear el usuario de prueba")
    
    print("\n✅ Configuración completada!")
    print("\nPara iniciar el servidor:")
    print("cd backend")
    print("python manage.py runserver 8000")

if __name__ == "__main__":
    main()
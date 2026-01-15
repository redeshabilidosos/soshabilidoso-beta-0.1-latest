#!/usr/bin/env python3
"""
Script para reparar problemas comunes de Django
"""
import os
import sys
import subprocess
import shutil

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

def fix_env_file():
    """Repara el archivo .env con codificación correcta"""
    env_path = os.path.join('backend', '.env')
    env_example_path = os.path.join('backend', '.env.example')
    
    if os.path.exists(env_path):
        print("🔧 Reparando archivo .env...")
        # Hacer backup
        shutil.copy(env_path, env_path + '.backup')
        
        # Leer y reescribir con codificación UTF-8
        try:
            with open(env_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            with open(env_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✓ Archivo .env reparado")
        except Exception as e:
            print(f"❌ Error reparando .env: {e}")
            # Usar el ejemplo como fallback
            if os.path.exists(env_example_path):
                shutil.copy(env_example_path, env_path)
                print("✓ Usando .env.example como base")

def main():
    print("🔧 Reparando configuración de Django...")
    
    # Verificar directorio
    if not os.path.exists('backend'):
        print("❌ No se encontró el directorio backend")
        return
    
    backend_dir = os.path.join(os.getcwd(), 'backend')
    
    # Reparar archivo .env
    fix_env_file()
    
    print("\n🧹 Limpiando archivos temporales...")
    # Limpiar migraciones
    migrations_dirs = [
        'backend/apps/authentication/migrations',
        'backend/apps/posts/migrations', 
        'backend/apps/chat/migrations',
        'backend/apps/users/migrations'
    ]
    
    for migrations_dir in migrations_dirs:
        if os.path.exists(migrations_dir):
            for file in os.listdir(migrations_dir):
                if file.endswith('.py') and file != '__init__.py':
                    os.remove(os.path.join(migrations_dir, file))
                    print(f"✓ Eliminado {file}")
    
    # Limpiar base de datos SQLite si existe
    db_file = os.path.join(backend_dir, 'db.sqlite3')
    if os.path.exists(db_file):
        os.remove(db_file)
        print("✓ Base de datos SQLite eliminada")
    
    print("\n🗄️ Recreando migraciones...")
    if not run_command("python manage.py makemigrations authentication", backend_dir):
        print("⚠️ Error creando migraciones de authentication")
    
    if not run_command("python manage.py makemigrations users", backend_dir):
        print("⚠️ Error creando migraciones de users")
    
    if not run_command("python manage.py makemigrations posts", backend_dir):
        print("⚠️ Error creando migraciones de posts")
    
    if not run_command("python manage.py makemigrations chat", backend_dir):
        print("⚠️ Error creando migraciones de chat")
    
    if not run_command("python manage.py migrate", backend_dir):
        print("❌ Error aplicando migraciones")
        return
    
    print("\n✅ Reparación completada!")
    print("\nPrueba iniciar el servidor:")
    print("cd backend")
    print("python manage.py runserver 8000")

if __name__ == "__main__":
    main()
#!/usr/bin/env python
"""
Script para diagnosticar problemas del servidor Django
"""
import os
import sys
import subprocess
import socket
from pathlib import Path

def check_port(port, host='127.0.0.1'):
    """Verificar si un puerto está en uso"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

def check_python_env():
    """Verificar entorno Python"""
    print("🐍 Verificando entorno Python...")
    print(f"   Python version: {sys.version}")
    print(f"   Python executable: {sys.executable}")
    
    # Verificar si estamos en el entorno virtual correcto
    venv_path = Path(__file__).parent / 'venv312'
    if venv_path.exists():
        print(f"   ✅ Entorno virtual encontrado: {venv_path}")
        
        # Verificar si el Python actual es del venv
        if 'venv312' in sys.executable:
            print("   ✅ Usando entorno virtual venv312")
        else:
            print("   ⚠️  No estás usando el entorno virtual venv312")
            print(f"   💡 Activa el entorno: {venv_path / 'Scripts' / 'activate.bat'}")
    else:
        print("   ❌ Entorno virtual venv312 no encontrado")

def check_django_config():
    """Verificar configuración de Django"""
    print("\n⚙️  Verificando configuración Django...")
    
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
        import django
        django.setup()
        
        from django.conf import settings
        print("   ✅ Django configurado correctamente")
        print(f"   ✅ Settings module: {settings.SETTINGS_MODULE}")
        print(f"   ✅ Debug mode: {settings.DEBUG}")
        print(f"   ✅ Allowed hosts: {settings.ALLOWED_HOSTS}")
        
        # Verificar apps instaladas críticas
        critical_apps = ['django.contrib.admin', 'drf_spectacular']
        for app in critical_apps:
            if app in settings.INSTALLED_APPS:
                print(f"   ✅ {app} instalado")
            else:
                print(f"   ❌ {app} NO instalado")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error configurando Django: {str(e)}")
        return False

def check_database():
    """Verificar conexión a base de datos"""
    print("\n🗄️  Verificando base de datos...")
    
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        print("   ✅ Conexión a base de datos exitosa")
        
        # Verificar tablas críticas
        cursor.execute("SHOW TABLES LIKE 'auth_user'")
        if cursor.fetchone():
            print("   ✅ Tabla auth_user existe")
        else:
            print("   ⚠️  Tabla auth_user no existe - ejecuta migraciones")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error de base de datos: {str(e)}")
        return False

def check_ports():
    """Verificar puertos"""
    print("\n🌐 Verificando puertos...")
    
    ports_to_check = [
        (8000, 'Django Backend'),
        (4000, 'Next.js Frontend'),
        (3307, 'MySQL Database')
    ]
    
    for port, service in ports_to_check:
        if check_port(port):
            print(f"   ✅ Puerto {port} ({service}) está en uso")
        else:
            print(f"   ❌ Puerto {port} ({service}) está libre")

def check_manage_py():
    """Verificar manage.py"""
    print("\n📋 Verificando manage.py...")
    
    manage_py = Path(__file__).parent / 'manage.py'
    if manage_py.exists():
        print(f"   ✅ manage.py encontrado: {manage_py}")
        
        # Probar comando básico
        try:
            result = subprocess.run([
                sys.executable, str(manage_py), 'check', '--deploy'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("   ✅ Django check pasó correctamente")
            else:
                print("   ⚠️  Django check encontró problemas:")
                print(f"      {result.stderr}")
                
        except subprocess.TimeoutExpired:
            print("   ⚠️  Django check tardó demasiado")
        except Exception as e:
            print(f"   ❌ Error ejecutando Django check: {str(e)}")
    else:
        print("   ❌ manage.py no encontrado")

def suggest_solutions():
    """Sugerir soluciones"""
    print("\n💡 SOLUCIONES SUGERIDAS:")
    print("=" * 50)
    
    print("\n1. 🔄 Reiniciar completamente:")
    print("   • Detén todos los procesos (Ctrl+C)")
    print("   • Ejecuta: npm run soshabilidoso")
    
    print("\n2. 🐍 Verificar entorno Python:")
    print("   • cd backend")
    print("   • venv312\\Scripts\\activate.bat")
    print("   • python manage.py runserver")
    
    print("\n3. 🗄️  Verificar MySQL:")
    print("   • Asegúrate de que MariaDB esté corriendo")
    print("   • Puerto 3307 debe estar activo")
    
    print("\n4. 🔧 Reinstalar dependencias:")
    print("   • cd backend")
    print("   • pip install -r requirements.txt")
    
    print("\n5. 📊 Verificar migraciones:")
    print("   • python manage.py migrate")
    
    print("\n6. 👤 Crear superusuario:")
    print("   • python manage.py createsuperuser")

def main():
    """Función principal"""
    print("🔍 DIAGNÓSTICO DEL SERVIDOR DJANGO")
    print("=" * 50)
    
    # Cambiar al directorio del backend
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Ejecutar verificaciones
    check_python_env()
    
    django_ok = check_django_config()
    if django_ok:
        check_database()
    
    check_ports()
    check_manage_py()
    
    suggest_solutions()
    
    print("\n" + "=" * 50)
    print("✅ Diagnóstico completado")

if __name__ == "__main__":
    main()
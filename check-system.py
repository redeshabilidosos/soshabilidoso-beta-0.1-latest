#!/usr/bin/env python3
"""
Script rápido para verificar el estado del sistema
"""
import os
import sys
import subprocess
from pathlib import Path

def check_python():
    """Verificar versión de Python"""
    print("🐍 Verificando Python...")
    version = sys.version_info
    print(f"   Versión: {version.major}.{version.minor}.{version.micro}")
    
    if version.major >= 3 and version.minor >= 8:
        print("✅ Versión de Python compatible")
        return True
    else:
        print("❌ Se requiere Python 3.8 o superior")
        return False

def check_backend_dependencies():
    """Verificar dependencias del backend"""
    print("\n📦 Verificando dependencias del backend...")
    
    try:
        import django
        print(f"✅ Django {django.get_version()}")
    except ImportError:
        print("❌ Django no instalado")
        return False
    
    try:
        import rest_framework
        print("✅ Django REST Framework")
    except ImportError:
        print("❌ Django REST Framework no instalado")
        return False
    
    try:
        import psycopg2
        print("✅ psycopg2 (PostgreSQL)")
    except ImportError:
        print("⚠️  psycopg2 no instalado (opcional para PostgreSQL)")
    
    return True

def check_database_config():
    """Verificar configuración de la base de datos"""
    print("\n🗄️  Verificando configuración de base de datos...")
    
    env_file = Path('backend/.env')
    if env_file.exists():
        print("✅ Archivo .env encontrado")
        
        # Leer configuración básica
        with open(env_file, 'r') as f:
            content = f.read()
            
        if 'DATABASE_NAME' in content:
            print("✅ DATABASE_NAME configurado")
        if 'DATABASE_USER' in content:
            print("✅ DATABASE_USER configurado")
        if 'DATABASE_PASSWORD' in content:
            print("✅ DATABASE_PASSWORD configurado")
            
        return True
    else:
        print("❌ Archivo .env no encontrado en backend/")
        return False

def check_django_setup():
    """Verificar configuración de Django"""
    print("\n⚙️  Verificando Django...")
    
    try:
        # Cambiar al directorio backend
        backend_dir = Path('backend')
        if not backend_dir.exists():
            print("❌ Directorio backend/ no encontrado")
            return False
        
        os.chdir(backend_dir)
        
        # Verificar manage.py
        if Path('manage.py').exists():
            print("✅ manage.py encontrado")
        else:
            print("❌ manage.py no encontrado")
            return False
        
        # Intentar importar settings
        sys.path.append(str(Path.cwd()))
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
        
        try:
            import django
            django.setup()
            print("✅ Django configurado correctamente")
            
            # Probar conexión a la base de datos
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
            
            if result[0] == 1:
                print("✅ Conexión a la base de datos exitosa")
                
                # Contar usuarios
                from django.contrib.auth import get_user_model
                User = get_user_model()
                user_count = User.objects.count()
                print(f"👥 Usuarios en la base de datos: {user_count}")
                
                return True
            else:
                print("❌ Error en consulta de prueba")
                return False
                
        except Exception as e:
            print(f"❌ Error configurando Django: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Error verificando Django: {e}")
        return False

def check_frontend():
    """Verificar frontend (básico)"""
    print("\n🌐 Verificando frontend...")
    
    # Verificar si existe package.json
    if Path('package.json').exists():
        print("✅ package.json encontrado")
        
        # Verificar node_modules
        if Path('node_modules').exists():
            print("✅ node_modules existe")
        else:
            print("⚠️  node_modules no encontrado - ejecuta 'npm install'")
        
        return True
    else:
        print("❌ package.json no encontrado")
        return False

def main():
    """Función principal"""
    print("🔍 Verificación Rápida del Sistema SOS-HABILIDOSO")
    print("=" * 60)
    
    checks = []
    
    # Verificaciones
    checks.append(("Python", check_python()))
    checks.append(("Dependencias Backend", check_backend_dependencies()))
    checks.append(("Configuración DB", check_database_config()))
    checks.append(("Django", check_django_setup()))
    checks.append(("Frontend", check_frontend()))
    
    # Resumen
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE VERIFICACIONES")
    print("=" * 60)
    
    passed = 0
    total = len(checks)
    
    for name, result in checks:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name:20} {status}")
        if result:
            passed += 1
    
    print(f"\n📈 Resultado: {passed}/{total} verificaciones pasaron")
    
    if passed == total:
        print("🎉 ¡Sistema completamente funcional!")
        print("\n🚀 Próximos pasos:")
        print("1. cd backend && python manage.py runserver")
        print("2. npm run dev (en otra terminal)")
        print("3. Visita http://localhost:3000")
    elif passed >= total - 1:
        print("⚠️  Sistema casi listo - revisa las advertencias")
    else:
        print("❌ Sistema necesita configuración adicional")
        print("\n🔧 Sugerencias:")
        print("1. Instala dependencias: cd backend && pip install -r requirements.txt")
        print("2. Configura la base de datos")
        print("3. Ejecuta migraciones: python manage.py migrate")
        print("4. Crea usuario: python create_molo_user.py")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️  Verificación cancelada")
    except Exception as e:
        print(f"\n❌ Error durante la verificación: {e}")
        import traceback
        traceback.print_exc()
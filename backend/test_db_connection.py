#!/usr/bin/env python
"""
Script para probar la conexión a la base de datos MySQL
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.db import connection
from django.contrib.auth import get_user_model

User = get_user_model()

def test_connection():
    """Probar conexión a la base de datos"""
    try:
        print("🔍 Probando conexión a la base de datos...")
        
        # Probar conexión básica
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            print(f"✅ Conexión exitosa: {result}")
        
        # Verificar tabla de usuarios
        print(f"\n👥 Verificando usuarios en la base de datos...")
        users_count = User.objects.count()
        print(f"📊 Total de usuarios: {users_count}")
        
        if users_count > 0:
            print("\n📋 Primeros 5 usuarios:")
            for user in User.objects.all()[:5]:
                print(f"  - {user.username} ({user.email}) - Activo: {user.is_active}")
        
        # Verificar si existe el usuario de prueba
        test_email = "camilogomezdeveloper@gmail.com"
        try:
            test_user = User.objects.get(email=test_email)
            print(f"\n✅ Usuario de prueba encontrado: {test_user.username}")
            print(f"   Email: {test_user.email}")
            print(f"   Activo: {test_user.is_active}")
            print(f"   Verificado: {test_user.email_verified}")
        except User.DoesNotExist:
            print(f"\n❌ Usuario de prueba no encontrado: {test_email}")
            print("   Puede que necesites crear el usuario o migrar los datos")
        
        return True
        
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        print("\n🔧 Posibles soluciones:")
        print("   1. Verificar que MariaDB esté corriendo en puerto 3307")
        print("   2. Verificar que la base de datos 'habilidosos_clean' exista")
        print("   3. Verificar credenciales de acceso")
        print("   4. Ejecutar migraciones: python manage.py migrate")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("  PRUEBA DE CONEXIÓN A BASE DE DATOS")
    print("  SOS-HABILIDOSO")
    print("=" * 60)
    
    success = test_connection()
    
    if not success:
        sys.exit(1)
    
    print("\n✅ Prueba completada exitosamente")
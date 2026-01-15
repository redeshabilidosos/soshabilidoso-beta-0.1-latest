#!/usr/bin/env python3
"""
Script rápido para verificar la conexión a la base de datos
"""
import os
import sys
import django
from pathlib import Path

# Configurar Django
sys.path.append(str(Path(__file__).parent / 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

print("🔧 Configurando Django...")
try:
    django.setup()
    print("✅ Django configurado")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)

from django.db import connection
from django.contrib.auth import get_user_model

User = get_user_model()

def main():
    print("\n🔌 Probando conexión a la base de datos...")
    
    try:
        # Test básico de conexión
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        
        print("✅ Conexión exitosa")
        
        # Contar usuarios
        user_count = User.objects.count()
        print(f"👥 Usuarios en la base de datos: {user_count}")
        
        # Verificar usuario molo
        try:
            molo = User.objects.get(email='molo@molo.com')
            print(f"✅ Usuario molo existe: {molo.display_name} (@{molo.username})")
        except User.DoesNotExist:
            print("⚠️  Usuario molo no existe - ejecuta create_molo_user.py")
        
        # Mostrar algunos usuarios
        if user_count > 0:
            print("\n📋 Usuarios existentes:")
            for user in User.objects.all()[:3]:
                print(f"   - {user.display_name} (@{user.username}) - {user.email}")
        
        print("\n✅ Base de datos funcionando correctamente")
        
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        print("\n🔧 Posibles soluciones:")
        print("1. Verifica que el servidor de base de datos esté ejecutándose")
        print("2. Revisa la configuración en settings/development.py")
        print("3. Ejecuta las migraciones: python manage.py migrate")

if __name__ == "__main__":
    main()
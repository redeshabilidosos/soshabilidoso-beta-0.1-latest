#!/usr/bin/env python
"""
Script para limpiar tablespaces huérfanos de MySQL y recrear la base de datos
"""
import subprocess
import sys

try:
    import pymysql
except ImportError:
    subprocess.run([sys.executable, "-m", "pip", "install", "pymysql"], check=True)
    import pymysql

config = {
    'host': '127.0.0.1',
    'port': 3307,
    'user': 'root',
    'password': '',
}

print("=" * 60)
print("LIMPIANDO TABLESPACES Y RECREANDO BASE DE DATOS")
print("=" * 60)

conn = pymysql.connect(**config)
cursor = conn.cursor()

# Lista de tablas que probablemente tienen tablespaces huérfanos
tables_to_clean = [
    'django_migrations', 'django_content_type', 'django_session', 'django_admin_log',
    'auth_permission', 'auth_group', 'auth_group_permissions',
    'users', 'users_groups', 'users_user_permissions', 'user_follows',
    'posts', 'post_reactions', 'post_bookmarks', 'post_shares', 'post_views', 'post_reports',
    'reels_reel', 'reels_reelcomment', 'reels_reel_likes',
    'communities', 'community_members', 'community_posts',
    'messages', 'message_reactions', 'message_reads',
    'notifications',
    'friendships', 'friend_requests',
    'media_storage_mediaalbum', 'media_storage_mediaalbum_files', 'media_storage_mediafile',
    'finance_platformrevenue', 'finance_subscription', 'finance_transaction', 'finance_userwallet',
    'advertising',
]

print("\n[1/3] Intentando eliminar base de datos...")
try:
    # Primero intentar usar la base de datos
    cursor.execute("USE habilidosos_db")
    
    # Desactivar foreign keys
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    
    # Obtener todas las tablas existentes
    cursor.execute("SHOW TABLES")
    existing_tables = [row[0] for row in cursor.fetchall()]
    
    # Eliminar cada tabla
    for table in existing_tables:
        try:
            cursor.execute(f"DROP TABLE IF EXISTS `{table}`")
            print(f"  Eliminada tabla: {table}")
        except Exception as e:
            print(f"  Error con {table}: {e}")
    
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    conn.commit()
    
except Exception as e:
    print(f"  Info: {e}")

# Ahora eliminar la base de datos
print("\n[2/3] Eliminando y recreando base de datos...")
try:
    cursor.execute("DROP DATABASE IF EXISTS habilidosos_db")
    print("  Base de datos eliminada")
except Exception as e:
    print(f"  No se pudo eliminar: {e}")
    print("\n  *** ACCIÓN MANUAL REQUERIDA ***")
    print("  Necesitas eliminar manualmente la carpeta 'habilidosos_db' del directorio de datos de MySQL.")
    print("  Normalmente está en: C:\\xampp\\mysql\\data\\habilidosos_db")
    print("  O en: C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Data\\habilidosos_db")
    print("\n  1. Detén el servicio MySQL")
    print("  2. Elimina la carpeta habilidosos_db")
    print("  3. Inicia el servicio MySQL")
    print("  4. Ejecuta este script de nuevo")
    cursor.close()
    conn.close()
    sys.exit(1)

# Crear base de datos nueva
try:
    cursor.execute("CREATE DATABASE habilidosos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    conn.commit()
    print("  Base de datos creada exitosamente")
except Exception as e:
    print(f"  Error creando: {e}")
    sys.exit(1)

cursor.close()
conn.close()

print("\n[3/3] Ejecutando migraciones de Django...")
result = subprocess.run(
    ["C:\\Python314\\python.exe", "manage.py", "migrate"],
    cwd="backend",
    capture_output=True,
    text=True
)
print(result.stdout)
if result.returncode != 0:
    print(f"Error: {result.stderr}")
    sys.exit(1)

# Crear usuarios
print("\n[4/4] Creando usuarios...")
create_users = '''
import os, sys
sys.path.insert(0, ".")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sos_habilidoso.settings.development")
import django
django.setup()
from apps.users.models import User

if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser(username="admin", email="admin@habilidosos.com", password="admin123", first_name="Admin", last_name="Sistema")
    print("admin creado")

if not User.objects.filter(username="usuario1").exists():
    User.objects.create_user(username="usuario1", email="usuario1@test.com", password="test123", first_name="Usuario", last_name="Prueba")
    print("usuario1 creado")

print(f"Total: {User.objects.count()} usuarios")
'''

result = subprocess.run(["C:\\Python314\\python.exe", "-c", create_users], cwd="backend", capture_output=True, text=True)
print(result.stdout)

print("\n" + "=" * 60)
print("¡COMPLETADO!")
print("Usuarios: admin/admin123, usuario1/test123")
print("=" * 60)

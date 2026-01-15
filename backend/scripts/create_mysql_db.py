#!/usr/bin/env python3
"""
Crear base de datos MySQL si no existe, usando variables del entorno (.env)
"""
import os
import sys
from pathlib import Path

try:
    import pymysql
except ImportError:
    print("PyMySQL no está instalado. Instálalo con: py -m pip install PyMySQL")
    sys.exit(1)

def get_env(key: str, default: str = "") -> str:
    return os.environ.get(key, default)

def load_dotenv():
    # Cargar .env si python-decouple o dotenv no están en uso
    env_path = Path(__file__).resolve().parents[1] / '.env'
    if env_path.exists():
        for line in env_path.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                k, v = line.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip())

def create_database():
    load_dotenv()

    db_name = get_env('DATABASE_NAME', 'sos_habilidososdb')
    user = get_env('DATABASE_USER', 'root')
    password = get_env('DATABASE_PASSWORD', '')
    host = get_env('DATABASE_HOST', 'localhost')
    port = int(get_env('DATABASE_PORT', '3306'))

    print(f"🔌 Conectando a MySQL en {host}:{port} como '{user}'...")
    try:
        conn = pymysql.connect(host=host, port=port, user=user, password=password, database=None)
        cursor = conn.cursor()
        cursor.execute("SELECT VERSION();")
        version = cursor.fetchone()[0]
        print(f"✅ Conexión MySQL OK. Versión: {version}")

        # Crear base de datos si no existe
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        print(f"✅ Base de datos '{db_name}' verificada/creada")

        cursor.close()
        conn.close()
        return True
    except pymysql.err.OperationalError as e:
        print(f"❌ Error de conexión MySQL: {e}")
        print("👉 Verifica usuario/contraseña y que el servicio MySQL esté activo.")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

if __name__ == '__main__':
    if create_database():
        print("🎉 Base de datos lista. Ahora puedes ejecutar migraciones.")
        sys.exit(0)
    else:
        sys.exit(1)
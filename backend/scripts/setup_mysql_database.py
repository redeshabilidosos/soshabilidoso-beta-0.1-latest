"""
Script para configurar la base de datos MySQL para SOS-HABILIDOSO
Ejecuta el script SQL y configura Django
"""
import os
import sys
import mysql.connector
from pathlib import Path

# Agregar el directorio backend al path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',  # Cambiar según tu configuración
    'password': '',  # Cambiar según tu configuración
    'database': 'habilidosos_db',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

def create_database():
    """Crear la base de datos si no existe"""
    try:
        # Conectar sin especificar base de datos
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        cursor = conn.cursor()
        
        # Crear base de datos
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']} "
                      f"CHARACTER SET {DB_CONFIG['charset']} "
                      f"COLLATE {DB_CONFIG['collation']}")
        
        print(f"✓ Base de datos '{DB_CONFIG['database']}' creada/verificada")
        
        cursor.close()
        conn.close()
        return True
    except mysql.connector.Error as err:
        print(f"✗ Error al crear base de datos: {err}")
        return False

def execute_sql_script():
    """Ejecutar el script SQL"""
    try:
        # Leer el script SQL
        sql_file = backend_dir / 'scripts' / 'create_habilidosos_db.sql'
        
        if not sql_file.exists():
            print(f"✗ Archivo SQL no encontrado: {sql_file}")
            return False
        
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_script = f.read()
        
        # Conectar a la base de datos
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Ejecutar el script (dividir por punto y coma)
        statements = sql_script.split(';')
        
        print(f"\n📝 Ejecutando script SQL...")
        for i, statement in enumerate(statements, 1):
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                    if i % 10 == 0:
                        print(f"   Ejecutadas {i} sentencias...")
                except mysql.connector.Error as err:
                    # Ignorar errores de objetos que ya existen
                    if 'already exists' not in str(err).lower():
                        print(f"   Advertencia en sentencia {i}: {err}")
        
        conn.commit()
        print(f"✓ Script SQL ejecutado exitosamente ({len(statements)} sentencias)")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"✗ Error al ejecutar script SQL: {e}")
        return False

def verify_tables():
    """Verificar que las tablas se crearon correctamente"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print(f"\n📊 Tablas creadas ({len(tables)}):")
        for table in tables:
            print(f"   - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
    except mysql.connector.Error as err:
        print(f"✗ Error al verificar tablas: {err}")
        return False


def update_django_settings():
    """Actualizar configuración de Django para usar MySQL"""
    settings_file = backend_dir / 'sos_habilidoso' / 'settings.py'
    
    database_config = f"""
# Configuración de MySQL
DATABASES = {{
    'default': {{
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '{DB_CONFIG['database']}',
        'USER': '{DB_CONFIG['user']}',
        'PASSWORD': '{DB_CONFIG['password']}',
        'HOST': '{DB_CONFIG['host']}',
        'PORT': '3306',
        'OPTIONS': {{
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }},
    }}
}}
"""
    
    print(f"\n⚙️  Configuración de Django:")
    print(database_config)
    print("\n💡 Copia esta configuración en tu archivo settings.py")
    print(f"   Ubicación: {settings_file}")
    
    return True

def main():
    """Función principal"""
    print("=" * 60)
    print("🚀 CONFIGURACIÓN DE BASE DE DATOS SOS-HABILIDOSO")
    print("=" * 60)
    
    # Paso 1: Crear base de datos
    print("\n[1/4] Creando base de datos...")
    if not create_database():
        print("\n❌ Error al crear la base de datos")
        return
    
    # Paso 2: Ejecutar script SQL
    print("\n[2/4] Ejecutando script SQL...")
    if not execute_sql_script():
        print("\n❌ Error al ejecutar el script SQL")
        return
    
    # Paso 3: Verificar tablas
    print("\n[3/4] Verificando tablas...")
    if not verify_tables():
        print("\n❌ Error al verificar las tablas")
        return
    
    # Paso 4: Mostrar configuración de Django
    print("\n[4/4] Configuración de Django...")
    update_django_settings()
    
    print("\n" + "=" * 60)
    print("✅ CONFIGURACIÓN COMPLETADA EXITOSAMENTE")
    print("=" * 60)
    print("\n📋 Próximos pasos:")
    print("   1. Actualiza settings.py con la configuración de MySQL")
    print("   2. Instala mysqlclient: pip install mysqlclient")
    print("   3. Ejecuta: python manage.py migrate")
    print("   4. Crea un superusuario: python manage.py createsuperuser")
    print("\n")

if __name__ == '__main__':
    main()

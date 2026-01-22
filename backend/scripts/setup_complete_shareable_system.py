import mysql.connector
import os

# Configuración de base de datos (ajusta estos valores según tu configuración)
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Cambia esto por tu contraseña de MySQL
    'database': 'habilidosos_db',
    'charset': 'utf8mb4',
    'auth_plugin': 'mysql_native_password'
}

def execute_sql_script():
    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**DB_CONFIG)
        
        cursor = conn.cursor()
        
        print("🚀 Iniciando creación del sistema completo...")
        
        # Leer el archivo SQL
        sql_file_path = os.path.join(os.path.dirname(__file__), 'create_complete_shareable_system.sql')
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Dividir en comandos individuales
        commands = []
        current_command = ""
        
        for line in sql_content.split('\n'):
            line = line.strip()
            if line and not line.startswith('--'):
                current_command += line + " "
                if line.endswith(';'):
                    commands.append(current_command.strip())
                    current_command = ""
        
        # Ejecutar comandos
        success_count = 0
        error_count = 0
        
        for i, command in enumerate(commands):
            if command.strip():
                try:
                    cursor.execute(command)
                    success_count += 1
                    if 'CREATE TABLE' in command:
                        table_name = command.split('CREATE TABLE')[1].split('(')[0].strip()
                        print(f"✅ Tabla creada: {table_name}")
                    elif 'INSERT INTO' in command:
                        table_name = command.split('INSERT INTO')[1].split('(')[0].strip()
                        print(f"📝 Datos insertados en: {table_name}")
                except Exception as e:
                    error_count += 1
                    print(f"⚠️  Error en comando {i+1}: {str(e)}")
        
        conn.commit()
        
        print(f"\n🎉 Proceso completado!")
        print(f"✅ Comandos exitosos: {success_count}")
        print(f"❌ Comandos con error: {error_count}")
        
        # Verificar las tablas creadas
        print("\n📊 Verificando tablas creadas:")
        
        tables_to_check = [
            'shareable_content',
            'cultural_event_categories', 
            'cultural_events',
            'feed_posts',
            'reels',
            'news_articles',
            'classifieds',
            'learning_seccion',
            'learning_tema'
        ]
        
        for table in tables_to_check:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"  📋 {table}: {count} registros")
            except Exception as e:
                print(f"  ❌ {table}: Error - {str(e)}")
        
        print("\n🌟 Sistema de contenido compartible instalado exitosamente!")
        
    except Exception as e:
        print(f"❌ Error general: {str(e)}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    execute_sql_script()
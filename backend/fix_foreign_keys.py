import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

try:
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'habilidosos_db'),
        charset='utf8mb4'
    )
    
    cursor = conn.cursor()
    
    # Leer y ejecutar el script de corrección
    with open('scripts/fix_foreign_keys.sql', 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Dividir en comandos individuales
    commands = [cmd.strip() for cmd in sql_content.split(';') if cmd.strip() and not cmd.strip().startswith('--')]
    
    for command in commands:
        if command.strip():
            try:
                cursor.execute(command)
                print(f'✓ Ejecutado: {command[:50]}...')
            except Exception as e:
                print(f'✗ Error en comando: {str(e)}')
    
    conn.commit()
    print('\n✅ Script de corrección ejecutado exitosamente')
    
    # Verificar las tablas
    cursor.execute('SELECT COUNT(*) FROM cultural_event_categories')
    categorias = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM cultural_events')
    eventos = cursor.fetchone()[0]
    
    print(f'📊 Categorías creadas: {categorias}')
    print(f'📊 Eventos creados: {eventos}')
    
except Exception as e:
    print(f'❌ Error: {str(e)}')
finally:
    if 'conn' in locals():
        conn.close()
"""
Script para ejecutar el SQL en MySQL/MariaDB
"""
import pymysql
from pathlib import Path

# Configuración de la base de datos
DB_CONFIG = {
    'host': '127.0.0.1',
    'port': 3307,
    'user': 'root',
    'password': '',
    'database': 'habilidosos_db',
    'charset': 'utf8mb4'
}

def ejecutar_sql():
    """Ejecutar el script SQL"""
    try:
        # Leer el archivo SQL
        sql_file = Path(__file__).parent / 'create_habilidosos_db.sql'
        
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Conectar a MySQL
        print("🔌 Conectando a MySQL...")
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        # Dividir el SQL en sentencias individuales
        statements = []
        current_statement = []
        in_delimiter = False
        
        for line in sql_content.split('\n'):
            line = line.strip()
            
            # Ignorar comentarios y líneas vacías
            if not line or line.startswith('--'):
                continue
            
            # Manejar DELIMITER
            if line.startswith('DELIMITER'):
                in_delimiter = not in_delimiter
                continue
            
            current_statement.append(line)
            
            # Si encontramos un punto y coma y no estamos en un bloque DELIMITER
            if ';' in line and not in_delimiter:
                statement = ' '.join(current_statement)
                if statement.strip():
                    statements.append(statement)
                current_statement = []
        
        # Ejecutar cada sentencia
        print(f"\n📝 Ejecutando {len(statements)} sentencias SQL...")
        success_count = 0
        error_count = 0
        
        for i, statement in enumerate(statements, 1):
            try:
                # Limpiar la sentencia
                statement = statement.strip().rstrip(';')
                if not statement:
                    continue
                
                cursor.execute(statement)
                success_count += 1
                
                if i % 5 == 0:
                    print(f"   ✓ Ejecutadas {i}/{len(statements)} sentencias...")
                    
            except pymysql.Error as e:
                # Ignorar errores de "ya existe"
                if 'already exists' in str(e).lower() or 'duplicate' in str(e).lower():
                    success_count += 1
                else:
                    error_count += 1
                    print(f"   ⚠️  Error en sentencia {i}: {e}")
        
        connection.commit()
        
        print(f"\n✅ Script ejecutado exitosamente!")
        print(f"   ✓ Sentencias exitosas: {success_count}")
        if error_count > 0:
            print(f"   ⚠️  Errores: {error_count}")
        
        # Verificar tablas creadas
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print(f"\n📊 Tablas en habilidosos_db ({len(tables)}):")
        for table in tables:
            print(f"   - {table[0]}")
        
        cursor.close()
        connection.close()
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 EJECUTANDO SCRIPT SQL EN MYSQL")
    print("=" * 60)
    print(f"Base de datos: {DB_CONFIG['database']}")
    print(f"Puerto: {DB_CONFIG['port']}")
    print("=" * 60)
    
    if ejecutar_sql():
        print("\n🎉 ¡Tablas creadas exitosamente en habilidosos_db!")
    else:
        print("\n❌ Error al crear las tablas")

#!/usr/bin/env python
"""
Script para verificar y actualizar la tabla participantes
en la base de datos habilidosos_clean
"""
import pymysql
import sys

# Configuración de la base de datos
DB_CONFIG = {
    'host': '127.0.0.1',
    'port': 3307,
    'user': 'root',
    'password': '',
    'database': 'habilidosos_clean',
    'charset': 'utf8mb4'
}

def get_existing_columns():
    """Obtener columnas existentes de la tabla participantes"""
    try:
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'habilidosos_clean'
            AND TABLE_NAME = 'participantes'
            ORDER BY ORDINAL_POSITION
        """)
        
        columns = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return columns
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")
        return None

def print_table_structure(columns):
    """Imprimir estructura actual de la tabla"""
    print("\n" + "="*80)
    print("  ESTRUCTURA ACTUAL DE LA TABLA 'participantes'")
    print("="*80 + "\n")
    
    for col in columns:
        name, type_, nullable, default, comment = col
        null_str = "NULL" if nullable == "YES" else "NOT NULL"
        default_str = f"DEFAULT {default}" if default else ""
        print(f"  ✅ {name:<30} {type_:<25} {null_str:<10} {default_str}")
    
    print(f"\n  Total de columnas: {len(columns)}")

def get_missing_columns(existing_columns):
    """Determinar qué columnas faltan"""
    existing_names = [col[0] for col in existing_columns]
    
    # Campos que debería tener la tabla según el formulario
    required_fields = {
        # Campos existentes (no modificar)
        'id': 'INT AUTO_INCREMENT PRIMARY KEY',
        'nombre_completo': 'VARCHAR(200) NOT NULL',
        'fecha_nacimiento': 'DATE NOT NULL',
        'edad': 'INT NOT NULL',
        'genero': "ENUM('masculino', 'femenino', 'otro') NOT NULL",
        'documento_identidad': 'VARCHAR(50) UNIQUE NOT NULL',
        'email': 'VARCHAR(255) UNIQUE NOT NULL',
        'telefono': 'VARCHAR(20) NOT NULL',
        'telefono_emergencia': 'VARCHAR(20)',
        'ciudad': 'VARCHAR(100) NOT NULL',
        'departamento': 'VARCHAR(100) NOT NULL',
        'direccion': 'TEXT',
        'posicion_futbol': 'VARCHAR(50) NOT NULL',
        'equipo_actual': 'VARCHAR(100)',
        'anos_experiencia': 'INT',
        'logros_deportivos': 'TEXT',
        'foto_perfil': 'VARCHAR(500)',
        'video_presentacion': 'VARCHAR(500)',
        'documento_identidad_archivo': 'VARCHAR(500)',
        'estado': "ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado', 'finalista') DEFAULT 'pendiente'",
        'notas_evaluacion': 'TEXT',
        'puntaje_evaluacion': 'DECIMAL(5,2)',
        'fecha_registro': 'DATETIME DEFAULT CURRENT_TIMESTAMP',
        'fecha_actualizacion': 'DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        
        # Nuevos campos que pueden faltar
        'apellidos': 'VARCHAR(200)',
        'tipo_documento': "ENUM('CC', 'TI', 'CE', 'Pasaporte', 'Otro')",
        'numero_documento': 'VARCHAR(50)',
        'rh': "ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')",
        'eps': 'VARCHAR(200)',
        'certificado_eps': 'VARCHAR(500)',
        'tipo_sangre': "ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')",
        'sisben': "ENUM('A', 'B', 'C', 'D', 'No aplica')",
        'estrato': 'INT',
        'nivel_educativo': "ENUM('Primaria', 'Bachillerato', 'Técnico', 'Tecnólogo', 'Universitario', 'Postgrado')",
        'ocupacion': 'VARCHAR(200)',
        'nombre_acudiente': 'VARCHAR(200)',
        'telefono_acudiente': 'VARCHAR(20)',
        'parentesco_acudiente': 'VARCHAR(100)',
        'autorizacion_datos': 'BOOLEAN DEFAULT FALSE',
        'autorizacion_imagen': 'BOOLEAN DEFAULT FALSE',
        'terminos_condiciones': 'BOOLEAN DEFAULT FALSE',
    }
    
    missing = {}
    for field, definition in required_fields.items():
        if field not in existing_names:
            missing[field] = definition
    
    return missing

def generate_alter_statements(missing_columns):
    """Generar statements ALTER TABLE para agregar columnas faltantes"""
    if not missing_columns:
        return []
    
    statements = []
    for column_name, definition in missing_columns.items():
        # Determinar después de qué columna insertar
        after_column = determine_insert_position(column_name)
        
        if after_column:
            stmt = f"ALTER TABLE participantes ADD COLUMN {column_name} {definition} AFTER {after_column};"
        else:
            stmt = f"ALTER TABLE participantes ADD COLUMN {column_name} {definition};"
        
        statements.append(stmt)
    
    return statements

def determine_insert_position(column_name):
    """Determinar después de qué columna insertar el nuevo campo"""
    positions = {
        'apellidos': 'nombre_completo',
        'tipo_documento': 'genero',
        'numero_documento': 'tipo_documento',
        'rh': 'edad',
        'eps': 'rh',
        'certificado_eps': 'eps',
        'tipo_sangre': 'rh',
        'sisben': 'eps',
        'estrato': 'direccion',
        'nivel_educativo': 'anos_experiencia',
        'ocupacion': 'nivel_educativo',
        'nombre_acudiente': 'telefono_emergencia',
        'telefono_acudiente': 'nombre_acudiente',
        'parentesco_acudiente': 'telefono_acudiente',
        'autorizacion_datos': 'terminos_condiciones',
        'autorizacion_imagen': 'autorizacion_datos',
        'terminos_condiciones': 'documento_identidad_archivo',
    }
    
    return positions.get(column_name)

def apply_changes(statements, dry_run=True):
    """Aplicar los cambios a la base de datos"""
    if not statements:
        print("\n✅ No hay columnas faltantes. La tabla está completa.")
        return True
    
    print("\n" + "="*80)
    print("  COLUMNAS FALTANTES DETECTADAS")
    print("="*80 + "\n")
    
    for i, stmt in enumerate(statements, 1):
        print(f"{i}. {stmt}")
    
    if dry_run:
        print("\n⚠️  MODO DRY-RUN: No se aplicaron cambios")
        print("   Para aplicar los cambios, ejecuta:")
        print("   python scripts/check_and_update_participantes.py --apply")
        return True
    
    # Aplicar cambios
    try:
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        print("\n" + "="*80)
        print("  APLICANDO CAMBIOS")
        print("="*80 + "\n")
        
        for i, stmt in enumerate(statements, 1):
            try:
                cursor.execute(stmt)
                print(f"✅ {i}. Columna agregada exitosamente")
            except Exception as e:
                print(f"❌ {i}. Error: {e}")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print("\n✅ Todos los cambios aplicados exitosamente")
        return True
        
    except Exception as e:
        print(f"\n❌ Error aplicando cambios: {e}")
        return False

def main():
    """Función principal"""
    print("\n" + "="*80)
    print("  VERIFICACIÓN Y ACTUALIZACIÓN DE TABLA 'participantes'")
    print("  Base de datos: habilidosos_clean")
    print("="*80)
    
    # Verificar si se debe aplicar cambios
    apply = '--apply' in sys.argv
    
    # Obtener columnas existentes
    existing_columns = get_existing_columns()
    
    if existing_columns is None:
        print("\n❌ No se pudo conectar a la base de datos")
        print("   Verifica que:")
        print("   - MariaDB esté corriendo en el puerto 3307")
        print("   - La base de datos 'habilidosos_clean' exista")
        print("   - Las credenciales sean correctas")
        return
    
    # Mostrar estructura actual
    print_table_structure(existing_columns)
    
    # Determinar columnas faltantes
    missing = get_missing_columns(existing_columns)
    
    # Generar statements
    statements = generate_alter_statements(missing)
    
    # Aplicar o mostrar cambios
    apply_changes(statements, dry_run=not apply)
    
    print("\n" + "="*80)
    print("  VERIFICACIÓN COMPLETADA")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()

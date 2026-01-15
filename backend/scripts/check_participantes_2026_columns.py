"""
Script para verificar las columnas de la tabla participantes_2026_1 
en la base de datos habilidosos_clean
"""
import mysql.connector
from mysql.connector import Error

# Configuración de conexión a habilidosos_clean
DB_CONFIG = {
    'host': 'localhost',
    'port': 3307,
    'user': 'root',
    'password': '',  # Ajusta si tienes contraseña
    'database': 'habilidosos_clean'
}

def check_table_columns():
    """Verificar las columnas de la tabla participantes_2026_1"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Verificar si la tabla existe
            cursor.execute("""
                SELECT TABLE_NAME 
                FROM information_schema.TABLES 
                WHERE TABLE_SCHEMA = 'habilidosos_clean' 
                AND TABLE_NAME = 'participantes_2026_1'
            """)
            
            table_exists = cursor.fetchone()
            
            if not table_exists:
                print("❌ La tabla 'participantes_2026_1' NO existe en habilidosos_clean")
                print("\n📋 Tablas disponibles en habilidosos_clean:")
                cursor.execute("""
                    SELECT TABLE_NAME 
                    FROM information_schema.TABLES 
                    WHERE TABLE_SCHEMA = 'habilidosos_clean'
                """)
                tables = cursor.fetchall()
                for table in tables:
                    print(f"   - {table[0]}")
                return
            
            print("✅ La tabla 'participantes_2026_1' existe en habilidosos_clean")
            print("\n📋 Columnas de la tabla participantes_2026_1:")
            print("-" * 80)
            
            # Obtener información detallada de las columnas
            cursor.execute("""
                SELECT 
                    COLUMN_NAME,
                    DATA_TYPE,
                    CHARACTER_MAXIMUM_LENGTH,
                    IS_NULLABLE,
                    COLUMN_DEFAULT,
                    COLUMN_KEY,
                    EXTRA
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = 'habilidosos_clean' 
                AND TABLE_NAME = 'participantes_2026_1'
                ORDER BY ORDINAL_POSITION
            """)
            
            columns = cursor.fetchall()
            
            print(f"{'Columna':<30} {'Tipo':<20} {'Nullable':<10} {'Key':<10} {'Extra':<20}")
            print("-" * 80)
            
            column_names = []
            for col in columns:
                col_name, data_type, max_length, nullable, default, key, extra = col
                column_names.append(col_name)
                
                type_str = data_type
                if max_length:
                    type_str = f"{data_type}({max_length})"
                
                print(f"{col_name:<30} {type_str:<20} {nullable:<10} {key or '-':<10} {extra or '-':<20}")
            
            print("-" * 80)
            print(f"\nTotal de columnas: {len(columns)}")
            
            # Generar mapeo sugerido para el formulario
            print("\n\n📝 MAPEO SUGERIDO PARA EL FORMULARIO:")
            print("=" * 80)
            
            form_fields = {
                'names': 'nombres',
                'lastnames': 'apellidos', 
                'gender': 'genero',
                'playingPosition': 'posicion_juego',
                'documentType': 'tipo_documento',
                'documentNumber': 'numero_documento',
                'birthDate': 'fecha_nacimiento',
                'bloodType': 'tipo_sangre',
                'rh': 'rh',
                'epsSisben': 'eps_sisben',
                'epsCertificate': 'certificado_eps',
                'subregion': 'subregion',
                'municipality': 'municipio',
                'contactNumber': 'telefono_contacto',
                'email': 'email',
                'educationLevel': 'nivel_educacion',
                'institutionName': 'institucion_educativa',
                'guardianName': 'nombre_acudiente',
                'guardianDocumentType': 'tipo_documento_acudiente',
                'guardianDocumentNumber': 'numero_documento_acudiente',
                'guardianContactNumber': 'telefono_acudiente',
                'guardianEmail': 'email_acudiente',
                'residenceMunicipality': 'municipio_residencia_acudiente',
                'avatar_url': 'avatar_url'  # Nuevo campo para foto de perfil
            }
            
            print("\nColumnas en la tabla vs campos del formulario:")
            for form_field, expected_col in form_fields.items():
                exists = '✅' if expected_col in column_names else '❌'
                print(f"  {form_field:<30} -> {expected_col:<30} {exists}")
            
            # Verificar columnas que existen pero no están mapeadas
            print("\n\nColumnas en la tabla NO mapeadas:")
            mapped_cols = list(form_fields.values())
            for col in column_names:
                if col not in mapped_cols and col not in ['id', 'created_at', 'updated_at']:
                    print(f"  - {col}")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"❌ Error de conexión: {e}")

if __name__ == "__main__":
    check_table_columns()

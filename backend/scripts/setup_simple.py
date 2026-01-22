import os
import subprocess
import sys

def run_mysql_script():
    """Ejecuta el script SQL usando el cliente MySQL desde línea de comandos"""
    
    # Configuración de la base de datos
    db_host = "localhost"
    db_user = "root"
    db_password = ""  # Cambia esto si tienes contraseña
    db_name = "habilidosos_db"
    
    # Ruta al archivo SQL
    sql_file = os.path.join(os.path.dirname(__file__), 'create_complete_shareable_system.sql')
    
    print("🚀 Ejecutando script SQL completo...")
    print(f"📁 Archivo: {sql_file}")
    
    try:
        # Construir el comando MySQL
        if db_password:
            cmd = f'mysql -h {db_host} -u {db_user} -p{db_password} {db_name} < "{sql_file}"'
        else:
            cmd = f'mysql -h {db_host} -u {db_user} {db_name} < "{sql_file}"'
        
        print(f"🔧 Ejecutando: {cmd}")
        
        # Ejecutar el comando
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Script ejecutado exitosamente!")
            print("🎉 Sistema de contenido compartible instalado!")
        else:
            print(f"❌ Error al ejecutar el script:")
            print(f"Error: {result.stderr}")
            
            # Si hay error, intentar con phpMyAdmin o sugerir alternativa
            print("\n💡 Alternativas:")
            print("1. Abre phpMyAdmin en tu navegador")
            print("2. Selecciona la base de datos 'habilidosos_db'")
            print("3. Ve a la pestaña 'SQL'")
            print(f"4. Copia y pega el contenido del archivo: {sql_file}")
            print("5. Ejecuta el script")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\n💡 Solución alternativa:")
        print("1. Abre phpMyAdmin")
        print("2. Importa el archivo SQL manualmente")
        print(f"3. Archivo ubicado en: {sql_file}")

if __name__ == "__main__":
    run_mysql_script()
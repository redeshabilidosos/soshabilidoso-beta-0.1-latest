"""
Script para configurar el sistema de streaming completo
Crea las migraciones y tablas necesarias
"""
import os
import sys
import subprocess

def run_command(command, description):
    """Ejecutar un comando y mostrar el resultado"""
    print(f"\n{'='*80}")
    print(f"🔧 {description}")
    print(f"{'='*80}")
    print(f"Ejecutando: {command}")
    print()
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.stderr:
            print("Advertencias:")
            print(result.stderr)
        print(f"✅ {description} - COMPLETADO")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}")
        print(f"Código de salida: {e.returncode}")
        print(f"Salida: {e.stdout}")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Función principal"""
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 18 + "CONFIGURACIÓN DEL SISTEMA DE STREAMING" + " " * 19 + "║")
    print("╚" + "=" * 78 + "╝")
    print("\n")
    
    # Cambiar al directorio backend si no estamos ahí
    if not os.path.exists('manage.py'):
        if os.path.exists('backend/manage.py'):
            os.chdir('backend')
            print("📁 Cambiando al directorio backend/")
        else:
            print("❌ No se encontró manage.py. Asegúrate de estar en el directorio correcto.")
            return
    
    steps = [
        {
            'command': 'python manage.py makemigrations streaming',
            'description': 'Crear migraciones para la app streaming',
        },
        {
            'command': 'python manage.py migrate streaming',
            'description': 'Aplicar migraciones de streaming',
        },
        {
            'command': 'python manage.py migrate',
            'description': 'Aplicar todas las migraciones pendientes',
        },
    ]
    
    success_count = 0
    total_steps = len(steps)
    
    for step in steps:
        if run_command(step['command'], step['description']):
            success_count += 1
        else:
            print(f"\n⚠️  Paso fallido, pero continuando...")
    
    # Verificar el sistema
    print("\n")
    print("=" * 80)
    print("🔍 VERIFICANDO CONFIGURACIÓN")
    print("=" * 80)
    
    run_command('python verify_streaming_admin.py', 'Verificar panel de administración')
    
    # Resumen final
    print("\n")
    print("=" * 80)
    print("📊 RESUMEN DE CONFIGURACIÓN")
    print("=" * 80)
    print()
    print(f"Pasos completados: {success_count}/{total_steps}")
    print()
    
    if success_count == total_steps:
        print("🎉 ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE!")
        print()
        print("📋 PRÓXIMOS PASOS:")
        print("   1. Inicia el servidor: python manage.py runserver")
        print("   2. Accede al admin: http://localhost:8000/admin/")
        print("   3. Ve a la sección 'Streaming' en el panel de administración")
        print()
        print("📚 DOCUMENTACIÓN:")
        print("   Ver: backend/ADMIN_STREAMING_MONITOREO_COMPLETO.md")
        print()
        print("🎯 ENDPOINTS API:")
        print("   - GET  /api/streaming/sessions/")
        print("   - POST /api/streaming/sessions/")
        print("   - GET  /api/streaming/gifts/")
        print("   - POST /api/streaming/gifts/")
        print("   - GET  /api/streaming/viewers/")
        print("   - GET  /api/streaming/chat/")
        print("   - POST /api/streaming/chat/")
        print("   - GET  /api/streaming/reports/")
        print("   - POST /api/streaming/reports/")
        print("   - GET  /api/streaming/earnings/")
    else:
        print("⚠️  CONFIGURACIÓN INCOMPLETA")
        print()
        print("Algunos pasos fallaron. Revisa los errores arriba.")
        print("Puedes intentar ejecutar los comandos manualmente:")
        print()
        for step in steps:
            print(f"   {step['command']}")
    
    print()

if __name__ == '__main__':
    main()

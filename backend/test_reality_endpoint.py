#!/usr/bin/env python
"""
Script para probar el endpoint de registro de participantes
"""
import os
import django
import sys

# Configurar Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.reality.models import Participante


def test_database_connection():
    """Probar conexión a la base de datos"""
    print("\n" + "="*80)
    print("  PRUEBA DE CONEXIÓN A BASE DE DATOS")
    print("="*80 + "\n")
    
    try:
        # Intentar contar participantes
        count = Participante.objects.using('habilidosos_clean').count()
        print(f"✓ Conexión exitosa a habilidosos_clean")
        print(f"✓ Total de participantes registrados: {count}")
        
        # Mostrar últimos 5 participantes
        if count > 0:
            print("\n  Últimos 5 participantes:")
            print("  " + "-"*76)
            participantes = Participante.objects.using('habilidosos_clean').order_by('-id')[:5]
            for p in participantes:
                print(f"  ID: {p.id:4d} | {p.nombres} {p.apellidos} | {p.email}")
        
        return True
        
    except Exception as e:
        print(f"✗ Error al conectar con la base de datos:")
        print(f"  {str(e)}")
        return False


def test_model_fields():
    """Verificar que todos los campos del modelo existan en la BD"""
    print("\n" + "="*80)
    print("  VERIFICACIÓN DE CAMPOS DEL MODELO")
    print("="*80 + "\n")
    
    try:
        from django.db import connection
        
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = 'habilidosos_clean'
                AND TABLE_NAME = 'participantes'
                ORDER BY ORDINAL_POSITION
            """)
            
            db_columns = [row[0] for row in cursor.fetchall()]
            
        print(f"✓ Columnas en la base de datos: {len(db_columns)}")
        
        # Campos requeridos por el formulario
        required_fields = [
            'nombres', 'apellidos', 'genero', 'position',
            'tipo_documento_participante', 'documento_participante',
            'fecha_nacimiento', 'tipo_sangre', 'rh', 'eps_sisben',
            'certificado_eps', 'subregion', 'municipio',
            'telefono_contacto', 'email', 'confirm_email',
            'nivel_educacion', 'nombre_ie_educativa',
            'nombre_acudiente', 'tipo_documento_acudiente',
            'numero_documento_acudiente', 'telefono_acudiente',
            'email_acudiente', 'municipio_residencia',
            'sensitive_data', 'habeas_data'
        ]
        
        print("\n  Verificando campos requeridos:")
        print("  " + "-"*76)
        
        missing_fields = []
        for field in required_fields:
            if field in db_columns:
                print(f"  ✓ {field}")
            else:
                print(f"  ✗ {field} - FALTA")
                missing_fields.append(field)
        
        if missing_fields:
            print(f"\n  ⚠️  Faltan {len(missing_fields)} campos en la base de datos")
            return False
        else:
            print("\n  ✓ Todos los campos requeridos existen")
            return True
            
    except Exception as e:
        print(f"✗ Error al verificar campos:")
        print(f"  {str(e)}")
        return False


if __name__ == '__main__':
    print("\n" + "="*80)
    print("  PRUEBA DE ENDPOINT DE REALITY SHOW")
    print("  Base de datos: habilidosos_clean (Puerto 3307)")
    print("="*80)
    
    # Ejecutar pruebas
    db_ok = test_database_connection()
    fields_ok = test_model_fields()
    
    print("\n" + "="*80)
    print("  RESUMEN")
    print("="*80)
    print(f"  Conexión a BD: {'✓ OK' if db_ok else '✗ ERROR'}")
    print(f"  Campos del modelo: {'✓ OK' if fields_ok else '✗ ERROR'}")
    
    if db_ok and fields_ok:
        print("\n  ✓ Todo listo para recibir registros del formulario")
        print("  Endpoint: http://localhost:8000/api/reality/register/")
    else:
        print("\n  ⚠️  Hay problemas que deben resolverse")
    
    print("="*80 + "\n")

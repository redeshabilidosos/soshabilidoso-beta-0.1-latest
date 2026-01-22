#!/usr/bin/env python
import os
import sys
import django
import requests

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.learning.models import Tema
from django.contrib.auth import get_user_model

User = get_user_model()

def test_completion_endpoint():
    print("🧪 Probando endpoint de completar tema...")
    
    # Obtener primer tema
    tema = Tema.objects.first()
    if not tema:
        print("❌ No hay temas en la base de datos")
        return
    
    print(f"📖 Tema de prueba: {tema.titulo} (slug: {tema.slug})")
    
    # Obtener usuario
    user = User.objects.first()
    if not user:
        print("❌ No hay usuarios en la base de datos")
        return
    
    print(f"👤 Usuario: {user.username}")
    
    # Intentar obtener token (simulado)
    print("\n🔑 Probando endpoint sin autenticación...")
    
    try:
        response = requests.post(
            f"http://127.0.0.1:8000/api/learning/temas/{tema.slug}/marcar_completado/",
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print("✅ Endpoint requiere autenticación (correcto)")
        elif response.status_code == 200:
            print("✅ Endpoint funcionó")
        else:
            print(f"❌ Error inesperado: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor Django")
        print("   Asegúrate de que esté corriendo en http://127.0.0.1:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def create_test_progress():
    """Crear progreso de prueba directamente en la base de datos"""
    print("\n🔧 Creando progreso de prueba...")
    
    from apps.learning.models import ProgresoUsuario
    from django.utils import timezone
    
    user = User.objects.first()
    tema = Tema.objects.first()
    
    if not user or not tema:
        print("❌ Faltan datos para crear progreso")
        return
    
    progreso, created = ProgresoUsuario.objects.get_or_create(
        usuario=user,
        tema=tema,
        defaults={
            'estado': 'completado',
            'fecha_inicio': timezone.now(),
            'fecha_completado': timezone.now()
        }
    )
    
    if created:
        print(f"✅ Progreso creado: {user.username} completó {tema.titulo}")
    else:
        print(f"ℹ️ Progreso ya existía: {progreso.estado}")

if __name__ == '__main__':
    test_completion_endpoint()
    create_test_progress()
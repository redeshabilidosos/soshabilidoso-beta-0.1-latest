#!/usr/bin/env python
import os
import sys
import django
import requests
from datetime import datetime, timedelta

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def create_test_token():
    """Crear un token de prueba para el usuario"""
    print("🔑 Creando token de prueba...")
    
    user = User.objects.first()
    if not user:
        print("❌ No hay usuarios en la base de datos")
        return None
    
    print(f"👤 Usuario: {user.username}")
    
    # Crear token JWT
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    
    print(f"✅ Token creado: {access_token[:50]}...")
    return access_token

def test_authenticated_completion():
    """Probar el endpoint con autenticación"""
    print("\n🧪 Probando endpoint con autenticación...")
    
    token = create_test_token()
    if not token:
        return
    
    from apps.learning.models import Tema
    tema = Tema.objects.filter(seccion__slug='reglamentos-fifa').first()
    if not tema:
        print("❌ No hay temas de Reglamentos FIFA")
        return
    
    print(f"📖 Probando con tema: {tema.titulo} (slug: {tema.slug})")
    
    try:
        response = requests.post(
            f"http://127.0.0.1:8000/api/learning/temas/{tema.slug}/marcar_completado/",
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ ¡Tema marcado como completado exitosamente!")
            
            # Verificar en la base de datos
            from apps.learning.models import ProgresoUsuario
            progreso = ProgresoUsuario.objects.filter(
                usuario__username='molo',
                tema=tema
            ).first()
            
            if progreso:
                print(f"✅ Progreso guardado en BD: {progreso.estado}")
            else:
                print("❌ No se encontró progreso en BD")
                
        else:
            print(f"❌ Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor Django")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def show_token_info():
    """Mostrar información sobre cómo usar el token en el frontend"""
    token = create_test_token()
    if token:
        print(f"\n📋 Para probar en el frontend, ejecuta en la consola del navegador:")
        print(f"localStorage.setItem('access_token', '{token}');")
        print(f"console.log('Token guardado:', localStorage.getItem('access_token'));")

if __name__ == '__main__':
    test_authenticated_completion()
    show_token_info()
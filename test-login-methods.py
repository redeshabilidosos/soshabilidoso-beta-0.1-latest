#!/usr/bin/env python3
"""
Script para probar el login con email y username
"""
import os
import sys
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
sys.path.append('backend')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def test_login_api():
    """Probar el API de login con diferentes métodos"""
    base_url = 'http://localhost:8000/api'
    
    # Crear usuario de prueba si no existe
    try:
        user = User.objects.get(username='test_login')
        print(f"✅ Usuario existente: {user.username} ({user.email})")
    except User.DoesNotExist:
        user = User.objects.create_user(
            username='test_login',
            email='test@login.com',
            password='testpass123',
            display_name='Usuario Test Login'
        )
        print(f"✅ Usuario creado: {user.username} ({user.email})")
    
    print("\n🧪 Probando métodos de login...")
    print("=" * 50)
    
    # Test 1: Login con email
    print("\n1. 📧 Probando login con EMAIL...")
    try:
        response = requests.post(f'{base_url}/auth/login/', {
            'login': user.email,
            'password': 'testpass123'
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login con email exitoso")
            print(f"   Usuario: {data['user']['display_name']}")
            print(f"   Token: {data['access'][:50]}...")
        else:
            print(f"❌ Error login con email: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Excepción login con email: {e}")
    
    # Test 2: Login con username
    print("\n2. 👤 Probando login con USERNAME...")
    try:
        response = requests.post(f'{base_url}/auth/login/', {
            'login': user.username,
            'password': 'testpass123'
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login con username exitoso")
            print(f"   Usuario: {data['user']['display_name']}")
            print(f"   Token: {data['access'][:50]}...")
        else:
            print(f"❌ Error login con username: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Excepción login con username: {e}")
    
    # Test 3: Login con credenciales incorrectas
    print("\n3. ❌ Probando login con credenciales INCORRECTAS...")
    try:
        response = requests.post(f'{base_url}/auth/login/', {
            'login': 'usuario_inexistente',
            'password': 'password_incorrecto'
        })
        
        if response.status_code == 400:
            print(f"✅ Error esperado para credenciales incorrectas")
            print(f"   Mensaje: {response.json()}")
        else:
            print(f"⚠️  Respuesta inesperada: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Excepción login incorrecto: {e}")
    
    # Test 4: Login con email en mayúsculas
    print("\n4. 🔤 Probando login con EMAIL EN MAYÚSCULAS...")
    try:
        response = requests.post(f'{base_url}/auth/login/', {
            'login': user.email.upper(),
            'password': 'testpass123'
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login con email en mayúsculas exitoso")
            print(f"   Usuario: {data['user']['display_name']}")
        else:
            print(f"❌ Error login con email mayúsculas: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Excepción login email mayúsculas: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Resumen de pruebas completado")
    print("\n📋 Instrucciones para prueba manual:")
    print(f"1. Ve a http://localhost:3000")
    print(f"2. En el login, prueba con:")
    print(f"   - Email: {user.email}")
    print(f"   - Username: {user.username}")
    print(f"   - Contraseña: testpass123")
    print(f"3. Ambos métodos deberían funcionar")


if __name__ == "__main__":
    test_login_api()
#!/usr/bin/env python
"""
Script para generar un token JWT fresco para pruebas
"""
import os
import sys
import pymysql

pymysql.install_as_MySQLdb()

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta

User = get_user_model()

def generate_token():
    """Generar token fresco"""
    print("\n" + "="*60)
    print("🔑 GENERADOR DE TOKEN JWT")
    print("="*60 + "\n")
    
    try:
        # Buscar usuario molo
        user = User.objects.get(username='molo')
        print(f"✅ Usuario encontrado: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   ID: {user.id}")
        print()
        
        # Generar token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        print("🎫 TOKEN GENERADO:")
        print("-" * 60)
        print(access_token)
        print("-" * 60)
        print()
        
        print("📋 INFORMACIÓN DEL TOKEN:")
        print(f"   • Usuario ID: {user.id}")
        print(f"   • Username: {user.username}")
        print(f"   • Válido por: 1 hora")
        print()
        
        print("🔗 URL DE PRUEBA WEBSOCKET:")
        chat_id = "f787a7a5-ef29-4e6d-bf3b-d2913923a843"  # ID de ejemplo
        ws_url = f"ws://127.0.0.1:8000/ws/chat/{chat_id}/?token={access_token}"
        print(f"   {ws_url[:100]}...")
        print()
        
        print("💡 CÓMO USAR:")
        print("   1. Copia el token de arriba")
        print("   2. Abre la consola del navegador (F12)")
        print("   3. Ejecuta: localStorage.setItem('access_token', 'TOKEN_AQUI')")
        print("   4. Refresca la página")
        print("   5. Prueba enviar un mensaje")
        print()
        
        return access_token
        
    except User.DoesNotExist:
        print("❌ ERROR: Usuario 'molo' no encontrado")
        print("\n🔧 Solución:")
        print("   Crea el usuario con: python backend/create_molo_user.py")
        return None
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return None

if __name__ == '__main__':
    token = generate_token()
    sys.exit(0 if token else 1)

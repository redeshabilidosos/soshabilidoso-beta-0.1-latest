#!/usr/bin/env python3
"""
Script para probar la funcionalidad de posts en tiempo real
"""
import os
import sys
import django
import asyncio
import websockets
import json
from datetime import datetime

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
sys.path.append('backend')
django.setup()

from django.contrib.auth import get_user_model
from apps.posts.models import Post
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


def create_test_user():
    """Crear usuario de prueba"""
    try:
        user = User.objects.get(username='test_realtime')
        print(f"✅ Usuario existente: {user.username}")
    except User.DoesNotExist:
        user = User.objects.create_user(
            username='test_realtime',
            email='test@realtime.com',
            password='testpass123',
            display_name='Usuario Tiempo Real'
        )
        print(f"✅ Usuario creado: {user.username}")
    
    return user


def get_jwt_token(user):
    """Obtener token JWT para el usuario"""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


def create_test_post(user):
    """Crear post de prueba"""
    post = Post.objects.create(
        user=user,
        content=f"🚀 Post de prueba en tiempo real - {datetime.now().strftime('%H:%M:%S')}",
        post_type='text',
        category='football',
        is_public=True
    )
    print(f"✅ Post creado: {post.id}")
    return post


async def test_websocket_connection(token):
    """Probar conexión WebSocket"""
    uri = f"ws://localhost:8000/ws/feed/?token={token}"
    
    try:
        print(f"🔌 Conectando a WebSocket: {uri}")
        
        async with websockets.connect(uri) as websocket:
            print("✅ WebSocket conectado")
            
            # Enviar ping
            ping_message = {
                "type": "ping",
                "timestamp": datetime.now().timestamp()
            }
            await websocket.send(json.dumps(ping_message))
            print("📤 Ping enviado")
            
            # Escuchar mensajes por 10 segundos
            try:
                async with asyncio.timeout(10):
                    while True:
                        message = await websocket.recv()
                        data = json.loads(message)
                        print(f"📨 Mensaje recibido: {data.get('type', 'unknown')}")
                        print(f"   Contenido: {json.dumps(data, indent=2)}")
                        
                        if data.get('type') == 'pong':
                            print("🏓 Pong recibido - conexión OK")
                            
            except asyncio.TimeoutError:
                print("⏰ Timeout - cerrando conexión")
                
    except Exception as e:
        print(f"❌ Error en WebSocket: {e}")


async def main():
    """Función principal"""
    print("🚀 Iniciando prueba de posts en tiempo real")
    print("=" * 50)
    
    # 1. Crear usuario de prueba
    user = create_test_user()
    
    # 2. Obtener token JWT
    token = get_jwt_token(user)
    print(f"🔑 Token JWT generado: {token[:50]}...")
    
    # 3. Probar conexión WebSocket
    await test_websocket_connection(token)
    
    # 4. Crear post de prueba (esto debería activar el signal)
    print("\n📝 Creando post de prueba...")
    post = create_test_post(user)
    
    # 5. Esperar un poco para ver si llegan notificaciones
    print("⏳ Esperando notificaciones...")
    await asyncio.sleep(3)
    
    print("\n✅ Prueba completada")
    print("\n📋 Instrucciones para prueba manual:")
    print(f"1. Abre test-websocket.html en tu navegador")
    print(f"2. Usa este token: {token}")
    print(f"3. Conecta al WebSocket")
    print(f"4. Crea posts desde la aplicación web")
    print(f"5. Observa las actualizaciones en tiempo real")


if __name__ == "__main__":
    asyncio.run(main())
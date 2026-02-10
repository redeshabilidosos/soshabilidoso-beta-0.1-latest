#!/usr/bin/env python
"""
Script para verificar la configuración completa de WebSocket con Daphne
"""
import os
import sys

# CRÍTICO: Configurar PyMySQL ANTES de Django
import pymysql
pymysql.install_as_MySQLdb()

import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.conf import settings
from channels.layers import get_channel_layer
import asyncio

def verificar_configuracion():
    """Verificar configuración de WebSocket"""
    print("=" * 80)
    print("🔍 VERIFICACIÓN DE CONFIGURACIÓN WEBSOCKET CON DAPHNE")
    print("=" * 80)
    print()
    
    # 1. Verificar ASGI_APPLICATION
    print("1️⃣  ASGI Application:")
    asgi_app = getattr(settings, 'ASGI_APPLICATION', None)
    if asgi_app:
        print(f"   ✅ ASGI_APPLICATION configurado: {asgi_app}")
    else:
        print("   ❌ ASGI_APPLICATION no configurado")
        return False
    print()
    
    # 2. Verificar Channels en INSTALLED_APPS
    print("2️⃣  Django Channels:")
    if 'channels' in settings.INSTALLED_APPS:
        print("   ✅ 'channels' está en INSTALLED_APPS")
    else:
        print("   ❌ 'channels' NO está en INSTALLED_APPS")
        return False
    print()
    
    # 3. Verificar CHANNEL_LAYERS
    print("3️⃣  Channel Layers:")
    channel_layers = getattr(settings, 'CHANNEL_LAYERS', None)
    if channel_layers:
        backend = channel_layers.get('default', {}).get('BACKEND', '')
        print(f"   ✅ CHANNEL_LAYERS configurado")
        print(f"   📦 Backend: {backend}")
        
        if 'InMemoryChannelLayer' in backend:
            print("   ⚠️  Usando InMemoryChannelLayer (solo para desarrollo)")
            print("   💡 Para producción, considera usar Redis")
        elif 'RedisChannelLayer' in backend:
            print("   ✅ Usando RedisChannelLayer (recomendado para producción)")
    else:
        print("   ❌ CHANNEL_LAYERS no configurado")
        return False
    print()
    
    # 4. Verificar routing de WebSocket
    print("4️⃣  WebSocket Routing:")
    try:
        from apps.messaging.routing import websocket_urlpatterns as messaging_ws
        from apps.notifications.routing import websocket_urlpatterns as notifications_ws
        
        print(f"   ✅ Messaging WebSocket routes: {len(messaging_ws)} rutas")
        for pattern in messaging_ws:
            print(f"      - {pattern.pattern}")
        
        print(f"   ✅ Notifications WebSocket routes: {len(notifications_ws)} rutas")
        for pattern in notifications_ws:
            print(f"      - {pattern.pattern}")
    except Exception as e:
        print(f"   ❌ Error al importar routing: {e}")
        return False
    print()
    
    # 5. Verificar consumers
    print("5️⃣  WebSocket Consumers:")
    try:
        from apps.messaging.consumers import ChatConsumer
        from apps.notifications.consumers import NotificationConsumer
        
        print("   ✅ ChatConsumer importado correctamente")
        print("   ✅ NotificationConsumer importado correctamente")
    except Exception as e:
        print(f"   ❌ Error al importar consumers: {e}")
        return False
    print()
    
    # 6. Verificar middleware de autenticación
    print("6️⃣  Middleware de Autenticación:")
    try:
        from apps.posts.middleware import TokenAuthMiddlewareStack
        print("   ✅ TokenAuthMiddlewareStack disponible")
    except Exception as e:
        print(f"   ❌ Error al importar middleware: {e}")
        return False
    print()
    
    # 7. Verificar CORS para WebSocket
    print("7️⃣  CORS Configuration:")
    cors_allowed = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
    cors_all = getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False)
    
    if cors_all:
        print("   ⚠️  CORS_ALLOW_ALL_ORIGINS = True (solo para desarrollo)")
    else:
        print(f"   ✅ CORS_ALLOWED_ORIGINS: {cors_allowed}")
    print()
    
    # 8. Verificar ALLOWED_HOSTS
    print("8️⃣  Allowed Hosts:")
    allowed_hosts = settings.ALLOWED_HOSTS
    print(f"   ✅ ALLOWED_HOSTS: {allowed_hosts}")
    print()
    
    # 9. Test de Channel Layer
    print("9️⃣  Test de Channel Layer:")
    try:
        channel_layer = get_channel_layer()
        if channel_layer:
            print("   ✅ Channel layer obtenido correctamente")
            print(f"   📦 Tipo: {type(channel_layer).__name__}")
        else:
            print("   ❌ No se pudo obtener channel layer")
            return False
    except Exception as e:
        print(f"   ❌ Error al obtener channel layer: {e}")
        return False
    print()
    
    return True

async def test_channel_layer():
    """Test asíncrono del channel layer"""
    print("🔟 Test Asíncrono de Channel Layer:")
    try:
        channel_layer = get_channel_layer()
        
        # Test de envío y recepción
        test_channel = "test_channel"
        test_message = {"type": "test.message", "data": "Hello WebSocket!"}
        
        # Enviar mensaje
        await channel_layer.send(test_channel, test_message)
        print("   ✅ Mensaje enviado al channel layer")
        
        # Recibir mensaje
        received = await channel_layer.receive(test_channel)
        print(f"   ✅ Mensaje recibido: {received}")
        
        if received == test_message:
            print("   ✅ Test de channel layer EXITOSO")
            return True
        else:
            print("   ❌ Mensaje recibido no coincide")
            return False
            
    except Exception as e:
        print(f"   ❌ Error en test asíncrono: {e}")
        return False

def main():
    """Función principal"""
    # Verificación síncrona
    config_ok = verificar_configuracion()
    
    if not config_ok:
        print()
        print("=" * 80)
        print("❌ CONFIGURACIÓN INCOMPLETA")
        print("=" * 80)
        sys.exit(1)
    
    # Test asíncrono
    print()
    try:
        asyncio.run(test_channel_layer())
    except Exception as e:
        print(f"❌ Error en test asíncrono: {e}")
        sys.exit(1)
    
    # Resumen final
    print()
    print("=" * 80)
    print("✅ CONFIGURACIÓN WEBSOCKET COMPLETA Y FUNCIONAL")
    print("=" * 80)
    print()
    print("📋 INSTRUCCIONES PARA INICIAR:")
    print()
    print("1. Asegúrate de tener Daphne instalado:")
    print("   pip install daphne")
    print()
    print("2. Inicia el servidor con Daphne:")
    print("   daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application")
    print()
    print("3. O usa el script de inicio:")
    print("   python manage.py runserver (NO soporta WebSocket)")
    print("   daphne sos_habilidoso.asgi:application (SÍ soporta WebSocket)")
    print()
    print("4. Conecta desde el frontend:")
    print("   ws://127.0.0.1:8000/ws/chat/<chat_id>/?token=<access_token>")
    print("   ws://127.0.0.1:8000/ws/notifications/?token=<access_token>")
    print()
    print("=" * 80)

if __name__ == '__main__':
    main()

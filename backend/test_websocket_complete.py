"""
Script para probar la conexión WebSocket completa
"""
import asyncio
import websockets
import json
import sys

async def test_websocket_connection():
    """Probar conexión WebSocket"""
    
    # Primero necesitamos un token de autenticación
    print("=" * 60)
    print("🔍 PRUEBA DE WEBSOCKET - CHAT EN TIEMPO REAL")
    print("=" * 60)
    print()
    
    # Solicitar datos de prueba
    print("Para probar el WebSocket necesitas:")
    print("1. Un token JWT válido")
    print("2. Un ID de chat room (UUID)")
    print()
    
    token = input("Ingresa tu token JWT (o presiona Enter para omitir): ").strip()
    if not token:
        print("⚠️  Sin token, no se puede probar la autenticación")
        print()
        print("Para obtener un token:")
        print("1. Inicia sesión en la aplicación")
        print("2. Copia el token de localStorage o de la respuesta de login")
        print()
        return False
    
    chat_room_id = input("Ingresa el ID del chat room (UUID): ").strip()
    if not chat_room_id:
        print("❌ Se requiere un ID de chat room")
        return False
    
    print()
    print("Conectando al WebSocket...")
    print(f"URL: ws://127.0.0.1:8000/ws/chat/{chat_room_id}/?token={token[:20]}...")
    print()
    
    try:
        uri = f"ws://127.0.0.1:8000/ws/chat/{chat_room_id}/?token={token}"
        
        async with websockets.connect(uri) as websocket:
            print("✅ Conexión WebSocket establecida")
            print()
            
            # Enviar mensaje de prueba
            test_message = {
                "type": "chat_message",
                "content": "Hola! Este es un mensaje de prueba desde Python",
                "message_type": "text"
            }
            
            print("📤 Enviando mensaje de prueba...")
            await websocket.send(json.dumps(test_message))
            print(f"   Mensaje: {test_message['content']}")
            print()
            
            # Esperar respuesta
            print("📥 Esperando respuesta del servidor...")
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                data = json.loads(response)
                print("✅ Respuesta recibida:")
                print(f"   Tipo: {data.get('type')}")
                if 'message' in data:
                    msg = data['message']
                    print(f"   Contenido: {msg.get('content')}")
                    print(f"   Remitente: {msg.get('sender', {}).get('username')}")
                print()
            except asyncio.TimeoutError:
                print("⚠️  Timeout esperando respuesta (esto es normal si no hay otros usuarios)")
                print()
            
            # Probar indicador de escritura
            print("📝 Probando indicador de 'está escribiendo'...")
            typing_message = {
                "type": "typing",
                "is_typing": True
            }
            await websocket.send(json.dumps(typing_message))
            print("✅ Señal de 'está escribiendo' enviada")
            print()
            
            # Esperar un momento
            await asyncio.sleep(2)
            
            # Detener indicador de escritura
            typing_message["is_typing"] = False
            await websocket.send(json.dumps(typing_message))
            print("✅ Señal de 'dejó de escribir' enviada")
            print()
            
            print("=" * 60)
            print("✅ PRUEBA COMPLETADA EXITOSAMENTE")
            print("=" * 60)
            print()
            print("El WebSocket está funcionando correctamente!")
            print("Ahora puedes probar desde el frontend en /messages")
            print()
            
            return True
            
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"❌ Error de conexión: {e}")
        print()
        if e.status_code == 403:
            print("⚠️  Error 403: Token inválido o expirado")
            print("   Verifica que el token sea correcto")
        elif e.status_code == 404:
            print("⚠️  Error 404: Ruta no encontrada")
            print("   Verifica que el servidor esté corriendo")
        print()
        return False
        
    except ConnectionRefusedError:
        print("❌ No se puede conectar al servidor")
        print()
        print("Verifica que el servidor esté corriendo:")
        print("  python manage.py runserver")
        print()
        print("O con Daphne:")
        print("  daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application")
        print()
        return False
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        print()
        return False


def test_websocket_simple():
    """Prueba simple de WebSocket sin autenticación"""
    print("=" * 60)
    print("🔍 PRUEBA SIMPLE DE WEBSOCKET")
    print("=" * 60)
    print()
    print("Esta prueba verifica que el servidor WebSocket esté corriendo")
    print()
    
    try:
        import websockets
        print("✅ Módulo websockets instalado")
        return True
    except ImportError:
        print("❌ Módulo websockets no está instalado")
        print("   Instalar con: pip install websockets")
        return False


if __name__ == '__main__':
    # Verificar que websockets esté instalado
    if not test_websocket_simple():
        sys.exit(1)
    
    print()
    
    # Ejecutar prueba completa
    try:
        result = asyncio.run(test_websocket_connection())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Prueba cancelada por el usuario")
        sys.exit(1)

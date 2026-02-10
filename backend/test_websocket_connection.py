#!/usr/bin/env python
"""
Script para probar la conexión WebSocket del chat
"""
import asyncio
import websockets
import json
import sys

async def test_websocket():
    """Probar conexión WebSocket"""
    
    # Token de prueba (reemplazar con uno válido)
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwMzMwMDgwLCJpYXQiOjE3NzAzMjY0ODAsImp0aSI6ImIwNTljZThjOTk1MzQxOWFhNTZkZTVmMDBkODlhMzQzIiwidXNlcl9pZCI6ImJkMjJlYzFjLTRkYmUtNDhmMy1hMDE4LWU5NmIyY2Q2MTMwNCJ9.Kgm2JCGIoC4WGotRz5OYREllG0ll660YOdJZoAcitxE"
    
    # ID del chat de prueba
    chat_id = "f787a7a5-ef29-4e6d-bf3b-d2913923a843"
    
    # URL del WebSocket
    ws_url = f"ws://127.0.0.1:8000/ws/chat/{chat_id}/?token={token}"
    
    print(f"\n{'='*60}")
    print("🔍 PRUEBA DE CONEXIÓN WEBSOCKET")
    print(f"{'='*60}\n")
    print(f"URL: {ws_url}\n")
    
    try:
        print("📡 Intentando conectar...")
        async with websockets.connect(ws_url) as websocket:
            print("✅ CONEXIÓN EXITOSA!\n")
            
            # Enviar mensaje de prueba
            test_message = {
                "type": "chat_message",
                "content": "Mensaje de prueba desde Python",
                "message_type": "text"
            }
            
            print(f"📤 Enviando mensaje: {test_message['content']}")
            await websocket.send(json.dumps(test_message))
            print("✅ Mensaje enviado\n")
            
            # Esperar respuesta
            print("📥 Esperando respuesta...")
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            print(f"✅ Respuesta recibida:")
            print(f"   {response}\n")
            
            print(f"{'='*60}")
            print("✅ PRUEBA EXITOSA - WebSocket funciona correctamente")
            print(f"{'='*60}\n")
            return True
            
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"❌ ERROR DE CONEXIÓN: {e}")
        print(f"   Código de estado: {e.status_code}")
        if e.status_code == 404:
            print("\n🔍 DIAGNÓSTICO:")
            print("   La ruta WebSocket NO está registrada en el backend")
            print("   Posibles causas:")
            print("   1. El archivo routing.py tiene errores de sintaxis")
            print("   2. El backend no se reinició después de corregir routing.py")
            print("   3. ASGI no está cargando las rutas correctamente")
        return False
        
    except asyncio.TimeoutError:
        print("⏱️  TIMEOUT: No se recibió respuesta en 5 segundos")
        print("   La conexión se estableció pero el backend no respondió")
        return False
        
    except ConnectionRefusedError:
        print("❌ ERROR: Conexión rechazada")
        print("   El backend no está corriendo en el puerto 8000")
        return False
        
    except Exception as e:
        print(f"❌ ERROR INESPERADO: {type(e).__name__}: {e}")
        return False

if __name__ == "__main__":
    try:
        result = asyncio.run(test_websocket())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Prueba interrumpida por el usuario")
        sys.exit(1)

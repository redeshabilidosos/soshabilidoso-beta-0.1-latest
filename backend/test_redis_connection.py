"""
Script para verificar la conexión a Redis
"""
import sys

def test_redis_connection():
    """Verificar conexión a Redis"""
    try:
        import redis
        print("✅ Módulo redis instalado correctamente")
        
        # Intentar conectar a Redis
        r = redis.Redis(host='127.0.0.1', port=6379, db=0)
        
        # Hacer ping
        response = r.ping()
        if response:
            print("✅ Redis está corriendo y responde correctamente")
            
            # Probar set/get
            r.set('test_key', 'test_value')
            value = r.get('test_key')
            if value == b'test_value':
                print("✅ Redis puede almacenar y recuperar datos")
                r.delete('test_key')
            
            return True
        else:
            print("❌ Redis no responde al ping")
            return False
            
    except ImportError:
        print("❌ Módulo redis no está instalado")
        print("   Instalar con: pip install redis")
        return False
    except redis.ConnectionError as e:
        print("❌ No se puede conectar a Redis")
        print(f"   Error: {e}")
        print("\n📝 Soluciones:")
        print("   1. Instalar Redis:")
        print("      - Windows: Descargar desde https://github.com/microsoftarchive/redis/releases")
        print("      - O usar WSL: sudo apt-get install redis-server")
        print("   2. Iniciar Redis:")
        print("      - Windows: redis-server.exe")
        print("      - Linux/WSL: sudo service redis-server start")
        print("   3. Verificar que Redis esté corriendo en el puerto 6379")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False


def test_channels_redis():
    """Verificar que channels-redis esté instalado"""
    try:
        import channels_redis
        print("✅ Módulo channels-redis instalado correctamente")
        return True
    except ImportError:
        print("❌ Módulo channels-redis no está instalado")
        print("   Instalar con: pip install channels-redis")
        return False


if __name__ == '__main__':
    print("=" * 60)
    print("🔍 VERIFICACIÓN DE REDIS PARA WEBSOCKETS")
    print("=" * 60)
    print()
    
    redis_ok = test_redis_connection()
    print()
    channels_redis_ok = test_channels_redis()
    print()
    
    print("=" * 60)
    if redis_ok and channels_redis_ok:
        print("✅ TODO LISTO - Redis está configurado correctamente")
        print()
        print("Puedes iniciar el servidor con:")
        print("  python manage.py runserver")
        print()
        print("O con Daphne (recomendado para WebSockets):")
        print("  daphne -b 0.0.0.0 -p 8000 sos_habilidoso.asgi:application")
    else:
        print("❌ CONFIGURACIÓN INCOMPLETA")
        print()
        if not redis_ok:
            print("⚠️  Redis no está disponible")
            print("   Puedes usar InMemoryChannelLayer para desarrollo:")
            print("   (Editar settings.py y cambiar CHANNEL_LAYERS)")
        if not channels_redis_ok:
            print("⚠️  channels-redis no está instalado")
    print("=" * 60)
    
    sys.exit(0 if (redis_ok and channels_redis_ok) else 1)

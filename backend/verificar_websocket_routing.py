#!/usr/bin/env python
"""
Script para verificar que el routing de WebSocket esté configurado correctamente
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

def verificar_routing():
    """Verificar configuración de routing de WebSocket"""
    print("\n" + "="*60)
    print("🔍 VERIFICACIÓN DE ROUTING DE WEBSOCKET")
    print("="*60 + "\n")
    
    errores = []
    warnings = []
    
    # 1. Verificar archivo de routing de messaging
    print("📁 1. Verificando archivo de routing...")
    try:
        from apps.messaging import routing as messaging_routing
        
        if hasattr(messaging_routing, 'websocket_urlpatterns'):
            patterns = messaging_routing.websocket_urlpatterns
            print(f"   ✅ websocket_urlpatterns encontrado ({len(patterns)} rutas)")
            
            # Verificar cada patrón
            for i, pattern in enumerate(patterns, 1):
                print(f"   📍 Ruta {i}: {pattern.pattern}")
                
                # Verificar que el patrón sea válido
                if 'chat' in str(pattern.pattern):
                    print(f"      ✅ Patrón de chat encontrado")
                else:
                    warnings.append(f"Patrón {i} no parece ser de chat")
        else:
            errores.append("websocket_urlpatterns no encontrado en messaging/routing.py")
    except ImportError as e:
        errores.append(f"Error importando messaging.routing: {e}")
    except Exception as e:
        errores.append(f"Error verificando routing: {e}")
    
    print()
    
    # 2. Verificar ASGI
    print("⚙️  2. Verificando configuración ASGI...")
    try:
        from sos_habilidoso import asgi
        
        if hasattr(asgi, 'application'):
            print("   ✅ ASGI application encontrada")
            
            # Verificar que sea ProtocolTypeRouter
            app_type = type(asgi.application).__name__
            print(f"   📦 Tipo: {app_type}")
            
            if app_type == 'ProtocolTypeRouter':
                print("   ✅ ProtocolTypeRouter configurado correctamente")
            else:
                warnings.append(f"ASGI application es {app_type}, esperado ProtocolTypeRouter")
        else:
            errores.append("ASGI application no encontrada")
    except ImportError as e:
        errores.append(f"Error importando asgi: {e}")
    except Exception as e:
        errores.append(f"Error verificando ASGI: {e}")
    
    print()
    
    # 3. Verificar Consumer
    print("🔌 3. Verificando Consumer...")
    try:
        from apps.messaging.consumers import ChatConsumer
        
        print("   ✅ ChatConsumer encontrado")
        
        # Verificar métodos importantes
        metodos_requeridos = ['connect', 'disconnect', 'receive', 'handle_chat_message']
        for metodo in metodos_requeridos:
            if hasattr(ChatConsumer, metodo):
                print(f"   ✅ Método {metodo} encontrado")
            else:
                errores.append(f"Método {metodo} no encontrado en ChatConsumer")
    except ImportError as e:
        errores.append(f"Error importando ChatConsumer: {e}")
    except Exception as e:
        errores.append(f"Error verificando Consumer: {e}")
    
    print()
    
    # 4. Verificar Channels en INSTALLED_APPS
    print("📦 4. Verificando Channels en INSTALLED_APPS...")
    try:
        from django.conf import settings
        
        if 'channels' in settings.INSTALLED_APPS:
            print("   ✅ 'channels' está en INSTALLED_APPS")
        else:
            errores.append("'channels' no está en INSTALLED_APPS")
        
        if 'daphne' in settings.INSTALLED_APPS:
            print("   ✅ 'daphne' está en INSTALLED_APPS")
        else:
            warnings.append("'daphne' no está en INSTALLED_APPS (opcional)")
        
        # Verificar ASGI_APPLICATION
        if hasattr(settings, 'ASGI_APPLICATION'):
            print(f"   ✅ ASGI_APPLICATION: {settings.ASGI_APPLICATION}")
        else:
            errores.append("ASGI_APPLICATION no configurado en settings")
        
        # Verificar CHANNEL_LAYERS
        if hasattr(settings, 'CHANNEL_LAYERS'):
            backend = settings.CHANNEL_LAYERS.get('default', {}).get('BACKEND', 'No configurado')
            print(f"   ✅ CHANNEL_LAYERS backend: {backend}")
        else:
            warnings.append("CHANNEL_LAYERS no configurado (se usará InMemoryChannelLayer)")
    except Exception as e:
        errores.append(f"Error verificando settings: {e}")
    
    print()
    
    # 5. Verificar sintaxis del archivo routing.py
    print("📝 5. Verificando sintaxis del archivo routing.py...")
    try:
        routing_file = 'apps/messaging/routing.py'
        with open(routing_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Verificar que no haya saltos de línea en el regex
        if 'r\'ws/chat/' in content and '\n' in content[content.find('r\'ws/chat/'):content.find('r\'ws/chat/') + 100]:
            # Buscar si hay salto de línea dentro del regex
            regex_start = content.find('r\'ws/chat/')
            regex_section = content[regex_start:regex_start + 150]
            
            if '\n' in regex_section and regex_section.find('\n') < regex_section.find('\'', 10):
                errores.append("⚠️  REGEX CORTADO: El regex tiene un salto de línea antes de cerrarse")
                print("   ❌ Regex parece estar cortado en múltiples líneas")
            else:
                print("   ✅ Sintaxis del regex parece correcta")
        else:
            print("   ✅ Sintaxis del archivo parece correcta")
            
        # Verificar que el archivo no tenga caracteres extraños
        if '</content>' in content or '</file>' in content:
            errores.append("⚠️  ARCHIVO CORRUPTO: Contiene etiquetas XML extrañas")
            print("   ❌ Archivo contiene etiquetas XML (posible corrupción)")
        else:
            print("   ✅ No se detectaron caracteres extraños")
            
    except FileNotFoundError:
        errores.append(f"Archivo {routing_file} no encontrado")
    except Exception as e:
        errores.append(f"Error leyendo archivo: {e}")
    
    print()
    
    # Resumen
    print("="*60)
    print("📊 RESUMEN")
    print("="*60)
    
    if not errores and not warnings:
        print("\n✅ TODO CORRECTO - WebSocket configurado correctamente\n")
        print("🚀 Puedes iniciar el servidor con:")
        print("   npm run soshabilidoso")
        print()
        return 0
    
    if warnings:
        print(f"\n⚠️  {len(warnings)} ADVERTENCIAS:")
        for warning in warnings:
            print(f"   • {warning}")
        print()
    
    if errores:
        print(f"\n❌ {len(errores)} ERRORES ENCONTRADOS:")
        for error in errores:
            print(f"   • {error}")
        print()
        print("🔧 SOLUCIÓN:")
        print("   1. Corrige los errores listados arriba")
        print("   2. Ejecuta este script nuevamente")
        print("   3. Reinicia el servidor")
        print()
        return 1
    
    return 0

if __name__ == '__main__':
    try:
        exit_code = verificar_routing()
        sys.exit(exit_code)
    except Exception as e:
        print(f"\n❌ ERROR CRÍTICO: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

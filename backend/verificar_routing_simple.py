#!/usr/bin/env python
"""
Script simple para verificar el archivo routing.py sin inicializar Django
"""
import os
import re

def verificar_routing():
    """Verificar sintaxis del archivo routing.py"""
    print("\n" + "="*60)
    print("🔍 VERIFICACIÓN SIMPLE DE ROUTING")
    print("="*60 + "\n")
    
    routing_file = 'apps/messaging/routing.py'
    
    if not os.path.exists(routing_file):
        print(f"❌ ERROR: Archivo {routing_file} no encontrado")
        return 1
    
    print(f"📁 Leyendo archivo: {routing_file}\n")
    
    with open(routing_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("📄 Contenido del archivo:")
    print("-" * 60)
    print(content)
    print("-" * 60)
    print()
    
    errores = []
    warnings = []
    
    # 1. Verificar que no tenga etiquetas XML
    if '</content>' in content or '</file>' in content:
        errores.append("⚠️  Archivo contiene etiquetas XML (corrupto)")
    
    # 2. Verificar que tenga websocket_urlpatterns
    if 'websocket_urlpatterns' not in content:
        errores.append("⚠️  No se encontró 'websocket_urlpatterns'")
    
    # 3. Verificar que tenga el import de consumers
    if 'from . import consumers' not in content and 'from apps.messaging import consumers' not in content:
        errores.append("⚠️  No se encontró import de consumers")
    
    # 4. Verificar que tenga re_path
    if 're_path' not in content:
        errores.append("⚠️  No se encontró 're_path'")
    
    # 5. Verificar que el regex esté en una sola línea
    # Buscar el patrón r'ws/chat/...
    regex_pattern = r"r'ws/chat/\([^']+\)"
    matches = re.findall(regex_pattern, content)
    
    if matches:
        print(f"✅ Encontrado {len(matches)} patrón(es) de regex")
        for i, match in enumerate(matches, 1):
            print(f"   {i}. {match}")
    else:
        # Buscar si hay un regex cortado
        if "r'ws/chat/" in content:
            # Encontrar la posición
            pos = content.find("r'ws/chat/")
            snippet = content[pos:pos+150]
            
            # Verificar si hay salto de línea antes del cierre
            if '\n' in snippet:
                newline_pos = snippet.find('\n')
                close_quote_pos = snippet.find("'", 10)  # Buscar el cierre después del inicio
                
                if newline_pos < close_quote_pos or close_quote_pos == -1:
                    errores.append("⚠️  REGEX CORTADO: El regex tiene un salto de línea antes de cerrarse")
                    print(f"\n❌ Regex cortado detectado:")
                    print(f"   {snippet[:100]}...")
    
    # 6. Verificar que tenga ChatConsumer.as_asgi()
    if 'ChatConsumer.as_asgi()' not in content and 'consumers.ChatConsumer.as_asgi()' not in content:
        errores.append("⚠️  No se encontró 'ChatConsumer.as_asgi()'")
    
    # 7. Verificar sintaxis básica de Python
    try:
        compile(content, routing_file, 'exec')
        print("\n✅ Sintaxis de Python válida")
    except SyntaxError as e:
        errores.append(f"⚠️  ERROR DE SINTAXIS: {e}")
        print(f"\n❌ Error de sintaxis en línea {e.lineno}: {e.msg}")
    
    print()
    print("="*60)
    print("📊 RESUMEN")
    print("="*60)
    
    if errores:
        print(f"\n❌ {len(errores)} ERRORES ENCONTRADOS:\n")
        for error in errores:
            print(f"   • {error}")
        print()
        print("🔧 SOLUCIÓN:")
        print("   El archivo routing.py debe verse así:")
        print()
        print("   " + "-"*56)
        print('''   """
   Routing para WebSockets de mensajería
   """
   from django.urls import re_path
   from . import consumers

   websocket_urlpatterns = [
       re_path(r'ws/chat/(?P<chat_room_id>[0-9a-f-]+)/$', consumers.ChatConsumer.as_asgi()),
   ]''')
        print("   " + "-"*56)
        print()
        return 1
    
    if warnings:
        print(f"\n⚠️  {len(warnings)} ADVERTENCIAS:\n")
        for warning in warnings:
            print(f"   • {warning}")
        print()
    
    if not errores and not warnings:
        print("\n✅ TODO CORRECTO - Archivo routing.py válido\n")
        print("🚀 Siguiente paso:")
        print("   Reinicia el servidor con: npm run soshabilidoso")
        print()
        return 0
    
    return 0

if __name__ == '__main__':
    import sys
    try:
        exit_code = verificar_routing()
        sys.exit(exit_code)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

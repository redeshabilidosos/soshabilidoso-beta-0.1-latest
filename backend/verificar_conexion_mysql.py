#!/usr/bin/env python
"""
Script para verificar la conexión a MySQL y los datos
"""
import os
import sys
import pymysql

# Configurar PyMySQL
pymysql.install_as_MySQLdb()

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.db import connection
from django.contrib.auth import get_user_model
from apps.messaging.models import ChatRoom, Message

User = get_user_model()

def verificar_conexion():
    """Verificar conexión a MySQL"""
    print("\n" + "="*60)
    print("🔍 VERIFICACIÓN DE CONEXIÓN MYSQL")
    print("="*60 + "\n")
    
    try:
        # 1. Verificar conexión básica
        print("📡 1. Probando conexión a MySQL...")
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()[0]
            print(f"   ✅ Conectado a MySQL/MariaDB versión: {version}")
            
            cursor.execute("SELECT DATABASE()")
            db_name = cursor.fetchone()[0]
            print(f"   ✅ Base de datos actual: {db_name}")
            
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print(f"   ✅ Número de tablas: {len(tables)}")
        
        print()
        
        # 2. Verificar usuarios
        print("👥 2. Verificando usuarios...")
        users_count = User.objects.count()
        print(f"   ✅ Total de usuarios: {users_count}")
        
        if users_count > 0:
            print("\n   Primeros 5 usuarios:")
            for user in User.objects.all()[:5]:
                print(f"      • {user.username} ({user.email})")
        
        print()
        
        # 3. Verificar chats
        print("💬 3. Verificando chats...")
        chats_count = ChatRoom.objects.count()
        print(f"   ✅ Total de chats: {chats_count}")
        
        if chats_count > 0:
            print("\n   Primeros 5 chats:")
            for chat in ChatRoom.objects.all()[:5]:
                chat_type = "Privado" if chat.chat_type == 'private' else "Grupo"
                print(f"      • {chat.name or 'Sin nombre'} ({chat_type}) - ID: {chat.id}")
        
        print()
        
        # 4. Verificar mensajes
        print("📨 4. Verificando mensajes...")
        messages_count = Message.objects.count()
        print(f"   ✅ Total de mensajes: {messages_count}")
        
        if messages_count > 0:
            print("\n   Últimos 5 mensajes:")
            for msg in Message.objects.order_by('-created_at')[:5]:
                content_preview = msg.content[:50] + "..." if len(msg.content) > 50 else msg.content
                print(f"      • {msg.sender.username}: {content_preview}")
                print(f"        Chat: {msg.chat_room.id} | {msg.created_at.strftime('%Y-%m-%d %H:%M')}")
        
        print()
        
        # 5. Verificar configuración de la BD
        print("⚙️  5. Configuración de la base de datos:")
        from django.conf import settings
        db_config = settings.DATABASES['default']
        print(f"   • Engine: {db_config['ENGINE']}")
        print(f"   • Name: {db_config['NAME']}")
        print(f"   • Host: {db_config['HOST']}")
        print(f"   • Port: {db_config['PORT']}")
        print(f"   • User: {db_config['USER']}")
        
        print()
        print("="*60)
        print("✅ VERIFICACIÓN COMPLETADA - MySQL funcionando correctamente")
        print("="*60)
        print()
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\n🔧 Posibles soluciones:")
        print("   1. Verifica que MySQL/MariaDB esté corriendo")
        print("   2. Verifica el puerto 3307")
        print("   3. Verifica las credenciales en settings.py")
        print("   4. Ejecuta: mysql -u root -P 3307 -e 'SHOW DATABASES;'")
        print()
        return False

if __name__ == '__main__':
    try:
        success = verificar_conexion()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Verificación interrumpida")
        sys.exit(1)

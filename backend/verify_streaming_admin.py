"""
Script para verificar que el panel de administración de streaming está configurado correctamente
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib import admin
from apps.streaming.models import (
    StreamSession, StreamGift, StreamViewer,
    StreamChatMessage, StreamReport, StreamEarnings
)
from apps.streaming.admin import (
    StreamSessionAdmin, StreamGiftAdmin, StreamViewerAdmin,
    StreamChatMessageAdmin, StreamReportAdmin, StreamEarningsAdmin
)

def verify_admin_registration():
    """Verificar que todos los modelos están registrados en el admin"""
    print("=" * 80)
    print("🔍 VERIFICACIÓN DEL PANEL DE ADMINISTRACIÓN DE STREAMING")
    print("=" * 80)
    print()
    
    models_to_check = [
        (StreamSession, StreamSessionAdmin, 'StreamSession'),
        (StreamGift, StreamGiftAdmin, 'StreamGift'),
        (StreamViewer, StreamViewerAdmin, 'StreamViewer'),
        (StreamChatMessage, StreamChatMessageAdmin, 'StreamChatMessage'),
        (StreamReport, StreamReportAdmin, 'StreamReport'),
        (StreamEarnings, StreamEarningsAdmin, 'StreamEarnings'),
    ]
    
    all_registered = True
    
    for model, admin_class, name in models_to_check:
        is_registered = model in admin.site._registry
        status = "✅ REGISTRADO" if is_registered else "❌ NO REGISTRADO"
        print(f"{status} - {name}")
        
        if is_registered:
            registered_admin = admin.site._registry[model]
            correct_class = isinstance(registered_admin, admin_class.__class__) or registered_admin.__class__ == admin_class
            if correct_class:
                print(f"   └─ Admin class: {admin_class.__name__}")
            else:
                print(f"   └─ ⚠️  Admin class incorrecta: {registered_admin.__class__.__name__}")
        
        if not is_registered:
            all_registered = False
        
        print()
    
    return all_registered

def check_admin_features():
    """Verificar características específicas del admin"""
    print("=" * 80)
    print("📊 VERIFICACIÓN DE CARACTERÍSTICAS DEL ADMIN")
    print("=" * 80)
    print()
    
    # Verificar StreamSessionAdmin
    print("🎯 StreamSessionAdmin:")
    admin_instance = admin.site._registry.get(StreamSession)
    if admin_instance:
        features = {
            'list_display': len(admin_instance.list_display) > 0,
            'list_filter': len(admin_instance.list_filter) > 0,
            'search_fields': len(admin_instance.search_fields) > 0,
            'actions': len(admin_instance.actions) > 0,
            'readonly_fields': len(admin_instance.readonly_fields) > 0,
            'fieldsets': admin_instance.fieldsets is not None,
        }
        
        for feature, enabled in features.items():
            status = "✅" if enabled else "❌"
            print(f"   {status} {feature}")
        
        # Verificar métodos personalizados
        custom_methods = [
            'status_badge', 'duration_display', 'total_viewers_count',
            'total_messages_count', 'get_statistics', 'get_viewer_analytics',
            'get_earnings_summary', 'ban_stream', 'unban_stream'
        ]
        
        print("\n   Métodos personalizados:")
        for method in custom_methods:
            has_method = hasattr(admin_instance, method)
            status = "✅" if has_method else "❌"
            print(f"   {status} {method}")
    else:
        print("   ❌ Admin no encontrado")
    
    print()

def check_models():
    """Verificar que los modelos tienen los campos necesarios"""
    print("=" * 80)
    print("🗄️  VERIFICACIÓN DE MODELOS")
    print("=" * 80)
    print()
    
    # Verificar StreamSession
    print("📋 StreamSession:")
    required_fields = [
        'streamer', 'title', 'description', 'stream_key', 'status',
        'started_at', 'ended_at', 'peak_viewers', 'total_gifts_received',
        'is_banned', 'ban_reason', 'banned_by', 'banned_at'
    ]
    
    for field in required_fields:
        has_field = hasattr(StreamSession, field)
        status = "✅" if has_field else "❌"
        print(f"   {status} {field}")
    
    print()
    
    # Verificar relaciones
    print("🔗 Relaciones:")
    relations = {
        'StreamSession': ['gifts', 'viewers', 'chat_messages', 'reports', 'earnings'],
        'StreamGift': ['stream_session', 'sender'],
        'StreamViewer': ['stream_session', 'user'],
        'StreamChatMessage': ['stream_session', 'user'],
        'StreamReport': ['stream_session', 'reported_by', 'reported_user'],
        'StreamEarnings': ['streamer', 'stream_session'],
    }
    
    models_map = {
        'StreamSession': StreamSession,
        'StreamGift': StreamGift,
        'StreamViewer': StreamViewer,
        'StreamChatMessage': StreamChatMessage,
        'StreamReport': StreamReport,
        'StreamEarnings': StreamEarnings,
    }
    
    for model_name, related_fields in relations.items():
        model = models_map[model_name]
        print(f"\n   {model_name}:")
        for field in related_fields:
            has_relation = hasattr(model, field)
            status = "✅" if has_relation else "❌"
            print(f"      {status} {field}")
    
    print()

def check_database_tables():
    """Verificar que las tablas existen en la base de datos"""
    print("=" * 80)
    print("💾 VERIFICACIÓN DE TABLAS EN BASE DE DATOS")
    print("=" * 80)
    print()
    
    from django.db import connection
    
    tables = [
        'streaming_sessions',
        'streaming_gifts',
        'streaming_viewers',
        'streaming_chat_messages',
        'streaming_reports',
        'streaming_earnings',
    ]
    
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        existing_tables = [row[0] for row in cursor.fetchall()]
    
    for table in tables:
        exists = table in existing_tables
        status = "✅ EXISTE" if exists else "❌ NO EXISTE"
        print(f"{status} - {table}")
    
    print()
    
    return all(table in existing_tables for table in tables)

def main():
    """Función principal"""
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 20 + "VERIFICACIÓN DEL SISTEMA DE STREAMING" + " " * 20 + "║")
    print("╚" + "=" * 78 + "╝")
    print("\n")
    
    # Verificar registro en admin
    admin_ok = verify_admin_registration()
    
    # Verificar características del admin
    check_admin_features()
    
    # Verificar modelos
    check_models()
    
    # Verificar tablas en base de datos
    try:
        tables_ok = check_database_tables()
    except Exception as e:
        print(f"⚠️  No se pudo verificar las tablas: {e}")
        print("   Ejecuta: python manage.py makemigrations streaming")
        print("   Luego: python manage.py migrate streaming")
        tables_ok = False
    
    # Resumen final
    print("=" * 80)
    print("📊 RESUMEN FINAL")
    print("=" * 80)
    print()
    
    if admin_ok:
        print("✅ Todos los modelos están registrados en el admin")
    else:
        print("❌ Algunos modelos no están registrados")
    
    if tables_ok:
        print("✅ Todas las tablas existen en la base de datos")
    else:
        print("❌ Faltan tablas en la base de datos")
        print("\n🔧 SOLUCIÓN:")
        print("   1. cd backend")
        print("   2. python manage.py makemigrations streaming")
        print("   3. python manage.py migrate streaming")
    
    print()
    print("🌐 ACCESO AL PANEL:")
    print("   URL: http://localhost:8000/admin/streaming/")
    print()
    print("📚 DOCUMENTACIÓN:")
    print("   Ver: backend/ADMIN_STREAMING_MONITOREO_COMPLETO.md")
    print()
    
    if admin_ok and tables_ok:
        print("🎉 ¡SISTEMA DE STREAMING COMPLETAMENTE CONFIGURADO!")
    else:
        print("⚠️  Se requieren acciones adicionales (ver arriba)")
    
    print()

if __name__ == '__main__':
    main()

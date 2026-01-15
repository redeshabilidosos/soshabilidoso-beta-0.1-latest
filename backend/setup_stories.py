#!/usr/bin/env python
"""
Script para configurar la app de Stories
Ejecutar: python setup_stories.py
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model

User = get_user_model()


def main():
    print("=" * 50)
    print("Configurando app de Stories")
    print("=" * 50)
    
    # 1. Crear migraciones
    print("\n1. Creando migraciones...")
    try:
        call_command('makemigrations', 'stories', verbosity=1)
        print("✅ Migraciones creadas")
    except Exception as e:
        print(f"⚠️ Error creando migraciones: {e}")
    
    # 2. Aplicar migraciones
    print("\n2. Aplicando migraciones...")
    try:
        call_command('migrate', verbosity=1)
        print("✅ Migraciones aplicadas")
    except Exception as e:
        print(f"❌ Error aplicando migraciones: {e}")
        return
    
    # 3. Crear algunas historias de ejemplo
    print("\n3. Creando historias de ejemplo...")
    try:
        from apps.stories.models import Story
        from datetime import timedelta
        from django.utils import timezone
        
        # Obtener algunos usuarios
        users = User.objects.all()[:5]
        
        if not users:
            print("⚠️ No hay usuarios para crear historias de ejemplo")
        else:
            stories_created = 0
            for user in users:
                # Verificar si el usuario ya tiene historias
                if not Story.objects.filter(user=user).exists():
                    # Crear una historia de ejemplo (sin archivo real)
                    # En producción, las historias se crean con archivos reales
                    print(f"   Usuario {user.username} listo para crear historias")
                    stories_created += 1
            
            print(f"✅ {stories_created} usuarios listos para historias")
    except Exception as e:
        print(f"⚠️ Error con historias de ejemplo: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Configuración de Stories completada")
    print("=" * 50)
    print("\nEndpoints disponibles:")
    print("  GET  /api/stories/friends/     - Historias de amigos")
    print("  GET  /api/stories/me/          - Mis historias")
    print("  POST /api/stories/             - Crear historia")
    print("  POST /api/stories/{id}/view/   - Marcar como vista")
    print("  POST /api/stories/{id}/react/  - Reaccionar")
    print("  POST /api/stories/{id}/reply/  - Responder")
    print("  GET  /api/stories/{id}/viewers/ - Ver quién vio (solo dueño)")


if __name__ == '__main__':
    main()

#!/usr/bin/env python
"""
Script para configurar la base de datos de comunidades
"""
import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.sqlite')
django.setup()

from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model
from apps.communities.models import Community, CommunitySocialLink, CommunityPost
from apps.users.models import User

def setup_database():
    """Configurar la base de datos"""
    print("🔧 Configurando base de datos de comunidades...")
    
    try:
        # Crear migraciones
        print("📝 Creando migraciones...")
        execute_from_command_line(['manage.py', 'makemigrations', 'communities'])
        execute_from_command_line(['manage.py', 'makemigrations', 'users'])
        
        # Aplicar migraciones
        print("🚀 Aplicando migraciones...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("✅ Base de datos configurada correctamente")
        
        # Crear datos de ejemplo
        create_sample_data()
        
    except Exception as e:
        print(f"❌ Error al configurar la base de datos: {e}")
        return False
    
    return True

def create_sample_data():
    """Crear datos de ejemplo"""
    print("📊 Creando datos de ejemplo...")
    
    try:
        # Obtener o crear usuario de ejemplo
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@sos-habilidoso.com',
                'display_name': 'Administrador',
                'first_name': 'Admin',
                'last_name': 'SOS',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        
        if created:
            user.set_password('admin123')
            user.save()
            print(f"✅ Usuario administrador creado: {user.username}")
        
        # Crear comunidad de ejemplo
        community, created = Community.objects.get_or_create(
            name='Fútbol Profesional Colombia',
            defaults={
                'description': 'Comunidad para discutir sobre fútbol profesional, ligas y torneos en Colombia.',
                'category': 'deportes',
                'type': 'public',
                'owner': user,
                'location': 'Colombia',
            }
        )
        
        if created:
            print(f"✅ Comunidad creada: {community.name}")
            
            # Agregar enlaces sociales
            CommunitySocialLink.objects.create(
                community=community,
                platform='instagram',
                url='https://instagram.com/futbolprocol',
                username='futbolprocol'
            )
            
            CommunitySocialLink.objects.create(
                community=community,
                platform='twitter',
                url='https://twitter.com/futbolprocol',
                username='futbolprocol'
            )
        
        # Crear página de ejemplo
        page, created = Community.objects.get_or_create(
            name='molo',
            defaults={
                'description': 'Página sobre desarrollo de software y tecnología.',
                'category': 'tecnologia',
                'type': 'page',
                'owner': user,
            }
        )
        
        if created:
            print(f"✅ Página creada: {page.name}")
        
        # Crear publicación de ejemplo
        if not CommunityPost.objects.filter(community=community).exists():
            post = CommunityPost.objects.create(
                community=community,
                author=user,
                content='¡Bienvenidos a la comunidad de Fútbol Profesional Colombia! 🏈⚽',
                post_type='text'
            )
            print(f"✅ Publicación creada en {community.name}")
        
        print("✅ Datos de ejemplo creados correctamente")
        
    except Exception as e:
        print(f"❌ Error al crear datos de ejemplo: {e}")

def main():
    """Función principal"""
    print("🚀 Iniciando configuración de comunidades...")
    
    if setup_database():
        print("\n🎉 ¡Configuración completada exitosamente!")
        print("\n📋 Resumen:")
        print("- Base de datos configurada")
        print("- Modelos de comunidades creados")
        print("- Datos de ejemplo agregados")
        print("\n🔗 Endpoints disponibles:")
        print("- GET /api/communities/ - Listar comunidades")
        print("- POST /api/communities/ - Crear comunidad")
        print("- GET /api/communities/{id}/ - Obtener comunidad")
        print("- POST /api/communities/{id}/join/ - Unirse/seguir")
        print("- GET /api/communities/{id}/posts/ - Posts de comunidad")
        print("- PUT /api/users/profile/ - Actualizar perfil (con imágenes)")
        
    else:
        print("\n❌ Error en la configuración")
        sys.exit(1)

if __name__ == '__main__':
    main()
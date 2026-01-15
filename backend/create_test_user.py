#!/usr/bin/env python
"""
Script para crear usuario de prueba
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from apps.users.models import Follow, FriendRequest, Friendship

User = get_user_model()

def create_test_users():
    """Crear usuarios de prueba"""
    
    print("🚀 Creando usuarios de prueba...")
    
    # Usuario principal
    user1, created = User.objects.get_or_create(
        username='molo_user',
        email='molo@example.com',
        defaults={
            'display_name': 'Molo Habilidoso',
            'first_name': 'Molo',
            'last_name': 'Habilidoso',
            'bio': '¡Hola! Soy Molo, el usuario principal de SOS-HABILIDOSO. Me encanta el fútbol y conectar con otros jugadores.',
            'position': 'Delantero',
            'team': 'Los Habilidosos FC',
            'is_verified': True,
        }
    )
    
    if created:
        user1.set_password('password123')
        user1.save()
        print(f"✅ Usuario creado: {user1.username}")
    else:
        print(f"ℹ️  Usuario ya existe: {user1.username}")
    
    # Usuario 2
    user2, created = User.objects.get_or_create(
        username='carlos_gol',
        email='carlos@example.com',
        defaults={
            'display_name': 'Carlos Goleador',
            'first_name': 'Carlos',
            'last_name': 'Gómez',
            'bio': 'Portero profesional con 10 años de experiencia. Siempre listo para una buena jugada.',
            'position': 'Portero',
            'team': 'Águilas Doradas',
            'is_verified': True,
        }
    )
    
    if created:
        user2.set_password('password123')
        user2.save()
        print(f"✅ Usuario creado: {user2.username}")
    else:
        print(f"ℹ️  Usuario ya existe: {user2.username}")
    
    # Usuario 3
    user3, created = User.objects.get_or_create(
        username='ana_futbol',
        email='ana@example.com',
        defaults={
            'display_name': 'Ana Fútbol',
            'first_name': 'Ana',
            'last_name': 'Rodríguez',
            'bio': 'Mediocampista creativa. Me gusta organizar partidos y eventos deportivos.',
            'position': 'Mediocampista',
            'team': 'Estrellas FC',
        }
    )
    
    if created:
        user3.set_password('password123')
        user3.save()
        print(f"✅ Usuario creado: {user3.username}")
    else:
        print(f"ℹ️  Usuario ya existe: {user3.username}")
    
    # Usuario 4
    user4, created = User.objects.get_or_create(
        username='diego_defensa',
        email='diego@example.com',
        defaults={
            'display_name': 'Diego Defensor',
            'first_name': 'Diego',
            'last_name': 'Martínez',
            'bio': 'Defensa central sólido. Nunca dejo pasar un balón.',
            'position': 'Defensa',
            'team': 'Titanes FC',
        }
    )
    
    if created:
        user4.set_password('password123')
        user4.save()
        print(f"✅ Usuario creado: {user4.username}")
    else:
        print(f"ℹ️  Usuario ya existe: {user4.username}")
    
    print("\n📋 Usuarios de prueba:")
    print("Username: molo_user | Password: password123")
    print("Username: carlos_gol | Password: password123")
    print("Username: ana_futbol | Password: password123")
    print("Username: diego_defensa | Password: password123")
    
    return [user1, user2, user3, user4]

def create_relationships(users):
    """Crear relaciones entre usuarios"""
    
    print("\n🤝 Creando relaciones entre usuarios...")
    
    user1, user2, user3, user4 = users
    
    # Seguimientos
    Follow.objects.get_or_create(follower=user1, following=user2)
    Follow.objects.get_or_create(follower=user1, following=user3)
    Follow.objects.get_or_create(follower=user2, following=user1)
    Follow.objects.get_or_create(follower=user3, following=user1)
    Follow.objects.get_or_create(follower=user4, following=user1)
    
    # Amistades
    Friendship.objects.get_or_create(user1=user1, user2=user2)
    Friendship.objects.get_or_create(user1=user1, user2=user3)
    
    # Solicitud de amistad pendiente
    FriendRequest.objects.get_or_create(
        sender=user4,
        receiver=user1,
        defaults={'message': '¡Hola! Me gustaría ser tu amigo en SOS-HABILIDOSO.'}
    )
    
    print("✅ Relaciones creadas exitosamente")

def create_sample_posts(users):
    """Crear publicaciones de ejemplo"""
    
    print("\n📝 Creando publicaciones de ejemplo...")
    
    from apps.posts.models import Post
    
    user1, user2, user3, user4 = users
    
    # Posts de Molo
    posts_data = [
        {
            'user': user1,
            'content': '¡Qué golazo el de ayer! 🔥⚽ Increíble jugada en equipo. #SosHabilidoso #Golazo',
            'post_type': 'text',
            'category': 'football'
        },
        {
            'user': user1,
            'content': 'Entrenando duro para el próximo partido. La disciplina es clave para el éxito. 💪',
            'post_type': 'image',
            'category': 'football',
            'images': ['https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg']
        },
        {
            'user': user2,
            'content': 'Nueva técnica de atajada que estoy perfeccionando. ¡Los porteros nunca paramos de aprender!',
            'post_type': 'video',
            'category': 'football'
        },
        {
            'user': user2,
            'content': 'Podcast sobre técnicas de portería - Episodio 1: Posicionamiento básico',
            'post_type': 'podcast',
            'category': 'football',
            'podcast_url': 'https://example.com/podcast1'
        },
        {
            'user': user3,
            'content': 'Organizando un torneo femenino para el próximo mes. ¡Todas invitadas! 🏆👩‍⚽',
            'post_type': 'text',
            'category': 'football'
        },
        {
            'user': user3,
            'content': 'Streaming en vivo: Análisis táctico del último partido de la selección',
            'post_type': 'streaming',
            'category': 'football',
            'streaming_url': 'https://example.com/stream1'
        },
        {
            'user': user4,
            'content': 'La defensa es un arte. Cada jugada cuenta, cada posición importa. 🛡️',
            'post_type': 'text',
            'category': 'football'
        },
        {
            'user': user4,
            'content': 'Galería de fotos del entrenamiento de hoy. ¡Qué buen ambiente!',
            'post_type': 'image',
            'category': 'football',
            'images': [
                'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
                'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg'
            ]
        }
    ]
    
    for post_data in posts_data:
        Post.objects.get_or_create(
            user=post_data['user'],
            content=post_data['content'],
            defaults=post_data
        )
    
    print("✅ Publicaciones de ejemplo creadas")

if __name__ == "__main__":
    try:
        users = create_test_users()
        create_relationships(users)
        create_sample_posts(users)
        print("\n🎉 ¡Usuarios de prueba creados exitosamente!")
        print("\n🌐 Ahora puedes:")
        print("1. Iniciar sesión en http://localhost:3001")
        print("2. Usar cualquiera de los usuarios creados")
        print("3. Probar las funcionalidades de búsqueda, mensajería y amistad")
        print("4. Ver las publicaciones en los perfiles de usuario")
        print("\n📝 Publicaciones creadas para cada usuario")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
#!/usr/bin/env python
"""
Script para poblar la base de datos con datos de prueba
Ejecutar desde la carpeta backend: python scripts/seed_data.py
"""
import os
import sys
import random
from datetime import timedelta

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sos_habilidoso.settings.development")

import django
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.posts.models import Post, PostReaction
from apps.communities.models import Community, CommunityMembership, CommunityPost
from apps.users.models import Friendship, FriendRequest

User = get_user_model()

print("=" * 60)
print("POBLANDO BASE DE DATOS CON DATOS DE PRUEBA")
print("=" * 60)

# ============================================================
# 1. CREAR USUARIOS
# ============================================================
print("\n[1/6] Creando usuarios...")

users_data = [
    {
        "username": "maria_garcia",
        "email": "maria@test.com",
        "password": "test123",
        "first_name": "María",
        "last_name": "García",
        "display_name": "María García",
        "bio": "Amante del fútbol y la música 🎵⚽ | Bogotá, Colombia",
        "position": "Mediocampista",
        "team": "Millonarios FC",
    },
    {
        "username": "carlos_lopez",
        "email": "carlos@test.com",
        "password": "test123",
        "first_name": "Carlos",
        "last_name": "López",
        "display_name": "Carlos López",
        "bio": "Jugador de fútbol amateur | Entrenador juvenil | Medellín",
        "position": "Delantero",
        "team": "Atlético Nacional",
    },
    {
        "username": "ana_martinez",
        "email": "ana@test.com",
        "password": "test123",
        "first_name": "Ana",
        "last_name": "Martínez",
        "display_name": "Ana Martínez",
        "bio": "Fotógrafa deportiva 📸 | Viajera | Cali",
        "position": "",
        "team": "",
    },
    {
        "username": "pedro_sanchez",
        "email": "pedro@test.com",
        "password": "test123",
        "first_name": "Pedro",
        "last_name": "Sánchez",
        "display_name": "Pedro Sánchez",
        "bio": "Gamer y streamer | FIFA enthusiast 🎮 | Barranquilla",
        "position": "Portero",
        "team": "Junior FC",
    },
]

created_users = []
for user_data in users_data:
    user, created = User.objects.get_or_create(
        username=user_data["username"],
        defaults={
            "email": user_data["email"],
            "first_name": user_data["first_name"],
            "last_name": user_data["last_name"],
            "display_name": user_data["display_name"],
            "bio": user_data.get("bio", ""),
            "position": user_data.get("position", ""),
            "team": user_data.get("team", ""),
        }
    )
    if created:
        user.set_password(user_data["password"])
        user.save()
        print(f"  ✓ Usuario creado: {user.username}")
    else:
        print(f"  - Usuario existente: {user.username}")
    created_users.append(user)

# Obtener todos los usuarios incluyendo admin y usuario1
all_users = list(User.objects.all())
print(f"  Total usuarios: {len(all_users)}")

# ============================================================
# 2. CREAR AMISTADES
# ============================================================
print("\n[2/6] Creando amistades...")

friendships_created = 0
for i, user1 in enumerate(all_users):
    for user2 in all_users[i+1:]:
        if random.random() > 0.3:  # 70% probabilidad de amistad
            friendship, created = Friendship.objects.get_or_create(
                user1=user1 if user1.id < user2.id else user2,
                user2=user2 if user1.id < user2.id else user1,
            )
            if created:
                friendships_created += 1

print(f"  ✓ {friendships_created} amistades creadas")

# ============================================================
# 3. CREAR COMUNIDADES
# ============================================================
print("\n[3/6] Creando comunidades...")

communities_data = [
    {
        "name": "Fútbol Colombia",
        "description": "La comunidad más grande de fútbol colombiano. Comparte noticias, análisis y pasión por el deporte rey. 🇨🇴⚽",
        "category": "deportes",
        "type": "public",
        "location": "Colombia",
    },
    {
        "name": "Gamers Unidos",
        "description": "Comunidad para gamers de todas las plataformas. FIFA, PES, y más. Torneos semanales y streams. 🎮",
        "category": "gaming",
        "type": "public",
        "location": "Latinoamérica",
    },
    {
        "name": "Música Urbana",
        "description": "Reggaeton, trap, hip-hop y más. Comparte tus artistas favoritos y descubre nueva música. 🎵",
        "category": "musica",
        "type": "public",
        "location": "Colombia",
    },
    {
        "name": "Fotografía Deportiva",
        "description": "Para los amantes de capturar momentos deportivos. Tips, equipos y las mejores fotos. 📸",
        "category": "arte",
        "type": "public",
        "location": "Internacional",
    },
    {
        "name": "Emprendedores Deportivos",
        "description": "Negocios relacionados con el deporte. Networking, ideas y oportunidades. 💼",
        "category": "negocios",
        "type": "private",
        "location": "Colombia",
    },
]

created_communities = []
for i, comm_data in enumerate(communities_data):
    owner = all_users[i % len(all_users)]
    community, created = Community.objects.get_or_create(
        name=comm_data["name"],
        defaults={
            "description": comm_data["description"],
            "category": comm_data["category"],
            "type": comm_data["type"],
            "location": comm_data.get("location", ""),
            "owner": owner,
            "is_active": True,
            "is_verified": random.choice([True, False]),
        }
    )
    if created:
        print(f"  ✓ Comunidad creada: {community.name}")
    else:
        print(f"  - Comunidad existente: {community.name}")
    created_communities.append(community)

# ============================================================
# 4. AGREGAR MIEMBROS A COMUNIDADES
# ============================================================
print("\n[4/6] Agregando miembros a comunidades...")

memberships_created = 0
for community in created_communities:
    for user in all_users:
        if user != community.owner and random.random() > 0.4:
            membership, created = CommunityMembership.objects.get_or_create(
                community=community,
                user=user,
                defaults={"role": "member", "is_active": True}
            )
            if created:
                memberships_created += 1

print(f"  ✓ {memberships_created} membresías creadas")

# ============================================================
# 5. CREAR POSTS EN COMUNIDADES
# ============================================================
print("\n[5/6] Creando publicaciones en comunidades...")

community_posts_content = [
    # Fútbol
    "¡Qué partidazo el de anoche! La selección lo dio todo 🔥⚽",
    "Alguien sabe dónde puedo ver el partido de hoy?",
    "Mi análisis del último partido: el mediocampo fue clave 📊",
    "Nuevo fichaje confirmado! Qué opinan? 🤔",
    "Entrenamiento de hoy completado 💪 #NuncaParar",
    # Gaming
    "Torneo de FIFA este sábado! Quién se apunta? 🎮",
    "Acabo de conseguir el logro más difícil del juego 🏆",
    "Tips para mejorar en los penales? Los necesito 😅",
    "Stream en vivo a las 8pm, no se lo pierdan!",
    "Mi setup gaming actualizado, qué les parece? 🖥️",
    # Música
    "Nueva canción de mi artista favorito, está brutal 🔥",
    "Playlist para entrenar, compartan las suyas! 🎵",
    "Concierto el próximo mes, alguien va?",
    "Produciendo mi primer beat, consejos? 🎹",
    "Top 5 canciones de la semana, cuáles son las tuyas?",
    # Fotografía
    "Foto del partido de ayer, qué tal quedó? 📸",
    "Nuevo lente adquirido, a probarlo!",
    "Tips para fotografía nocturna en estadios?",
    "Mi mejor captura del mes 🏆",
    "Workshop de fotografía deportiva, interesados?",
    # Negocios
    "Oportunidad de inversión en academia deportiva 💼",
    "Buscando socios para proyecto de app deportiva",
    "Webinar sobre marketing deportivo mañana",
    "Caso de éxito: cómo moneticé mi pasión por el deporte",
    "Networking event este viernes, confirmen asistencia",
]

posts_created = 0
for community in created_communities:
    members = list(community.members.all()) + [community.owner]
    num_posts = random.randint(3, 6)
    
    for _ in range(num_posts):
        author = random.choice(members)
        content = random.choice(community_posts_content)
        
        post = CommunityPost.objects.create(
            community=community,
            author=author,
            content=content,
            post_type=random.choice(["text", "text", "text", "image", "video"]),
            is_approved=True,
            is_active=True,
            created_at=timezone.now() - timedelta(days=random.randint(0, 30)),
        )
        
        # Agregar likes aleatorios
        likers = random.sample(members, k=min(len(members), random.randint(0, 5)))
        post.likes.set(likers)
        posts_created += 1

print(f"  ✓ {posts_created} publicaciones en comunidades creadas")

# ============================================================
# 6. CREAR POSTS PERSONALES (ESTADOS)
# ============================================================
print("\n[6/6] Creando posts personales...")

personal_posts_content = [
    "Hoy fue un gran día! 🌟",
    "Entrenando duro para el próximo partido 💪⚽",
    "Fin de semana con amigos, lo mejor! 🎉",
    "Nueva meta cumplida ✅ #Motivación",
    "Disfrutando del momento 🙏",
    "Lunes productivo, arrancamos la semana con todo! 🚀",
    "Gracias por el apoyo siempre 🙌",
    "Preparándome para lo que viene 🔥",
    "Momento de reflexión... a veces hay que parar y agradecer",
    "Nuevo proyecto en camino, pronto les cuento! 👀",
    "Partido increíble hoy, dejamos todo en la cancha",
    "Celebrando pequeñas victorias 🏆",
    "La constancia es la clave del éxito 💯",
    "Agradecido por esta comunidad increíble ❤️",
    "Vamos por más! 2025 será nuestro año 🎯",
]

personal_posts_created = 0
for user in all_users:
    num_posts = random.randint(2, 5)
    
    for _ in range(num_posts):
        content = random.choice(personal_posts_content)
        
        post = Post.objects.create(
            user=user,
            content=content,
            post_type=random.choice(["text", "text", "image"]),
            category=random.choice(["football", "general_sport", "culture", "music"]),
            is_public=random.choice([True, True, False]),
        )
        
        # Agregar reacciones aleatorias
        other_users = [u for u in all_users if u != user]
        reactors = random.sample(other_users, k=min(len(other_users), random.randint(0, 4)))
        for reactor in reactors:
            PostReaction.objects.get_or_create(
                post=post,
                user=reactor,
                defaults={"reaction_type": random.choice(["like", "celebration", "golazo"])}
            )
        
        personal_posts_created += 1

print(f"  ✓ {personal_posts_created} posts personales creados")

# ============================================================
# RESUMEN
# ============================================================
print("\n" + "=" * 60)
print("¡DATOS DE PRUEBA INSERTADOS EXITOSAMENTE!")
print("=" * 60)
print(f"""
Resumen:
  - Usuarios: {User.objects.count()}
  - Amistades: {Friendship.objects.count()}
  - Comunidades: {Community.objects.count()}
  - Membresías: {CommunityMembership.objects.count()}
  - Posts en comunidades: {CommunityPost.objects.count()}
  - Posts personales: {Post.objects.count()}

Usuarios disponibles (contraseña: test123):
""")
for user in User.objects.all():
    print(f"  - {user.username} ({user.email})")

print("\n" + "=" * 60)

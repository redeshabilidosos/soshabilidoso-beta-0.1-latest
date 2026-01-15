"""
Script para configurar datos iniciales del sistema de donaciones
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.donations.models import SportCategory, AthleteProfile
from apps.users.models import User
from django.utils.text import slugify


def create_sport_categories():
    """Crear categorías de deportes"""
    sports = [
        {'name': 'Fútbol', 'icon': '⚽', 'description': 'El deporte rey'},
        {'name': 'Baloncesto', 'icon': '🏀', 'description': 'Basketball'},
        {'name': 'Natación', 'icon': '🏊', 'description': 'Deportes acuáticos'},
        {'name': 'Atletismo', 'icon': '🏃', 'description': 'Carreras y saltos'},
        {'name': 'Gimnasia', 'icon': '🤸', 'description': 'Gimnasia artística y rítmica'},
        {'name': 'Tenis', 'icon': '🎾', 'description': 'Tenis de campo'},
        {'name': 'Voleibol', 'icon': '🏐', 'description': 'Voleibol de cancha y playa'},
        {'name': 'Ciclismo', 'icon': '🚴', 'description': 'Ciclismo de ruta y montaña'},
        {'name': 'Boxeo', 'icon': '🥊', 'description': 'Deportes de combate'},
        {'name': 'Artes Marciales', 'icon': '🥋', 'description': 'Taekwondo, Judo, Karate'},
        {'name': 'Patinaje', 'icon': '⛸️', 'description': 'Patinaje artístico y velocidad'},
        {'name': 'Levantamiento de Pesas', 'icon': '🏋️', 'description': 'Halterofilia'},
        {'name': 'Esgrima', 'icon': '🤺', 'description': 'Esgrima deportiva'},
        {'name': 'Béisbol', 'icon': '⚾', 'description': 'Béisbol y softbol'},
        {'name': 'Golf', 'icon': '⛳', 'description': 'Golf'},
        {'name': 'Surf', 'icon': '🏄', 'description': 'Surf y deportes de tabla'},
        {'name': 'Skateboarding', 'icon': '🛹', 'description': 'Skateboarding'},
        {'name': 'Escalada', 'icon': '🧗', 'description': 'Escalada deportiva'},
        {'name': 'Otro', 'icon': '🏅', 'description': 'Otros deportes'},
    ]
    
    created_count = 0
    for sport_data in sports:
        sport, created = SportCategory.objects.get_or_create(
            slug=slugify(sport_data['name']),
            defaults={
                'name': sport_data['name'],
                'icon': sport_data['icon'],
                'description': sport_data['description'],
            }
        )
        if created:
            created_count += 1
            print(f"✅ Creada categoría: {sport.name}")
        else:
            print(f"ℹ️ Ya existe: {sport.name}")
    
    print(f"\n📊 Total: {created_count} categorías creadas")
    return created_count


def create_sample_athletes():
    """Crear deportistas de ejemplo"""
    # Obtener o crear usuarios de prueba
    users_data = [
        {
            'username': 'juanperez_athlete',
            'email': 'juan.athlete@example.com',
            'display_name': 'Juan Carlos Pérez',
        },
        {
            'username': 'maria_swimmer',
            'email': 'maria.swimmer@example.com',
            'display_name': 'María Fernanda López',
        },
        {
            'username': 'andres_basket',
            'email': 'andres.basket@example.com',
            'display_name': 'Andrés Felipe Gómez',
        },
        {
            'username': 'valentina_gym',
            'email': 'valentina.gym@example.com',
            'display_name': 'Valentina Rodríguez',
        },
    ]
    
    athletes_data = [
        {
            'user_index': 0,
            'full_name': 'Juan Carlos Pérez',
            'age': 17,
            'height': '1.78m',
            'weight': '72kg',
            'city': 'Bogotá',
            'sport_slug': 'futbol',
            'position': 'Delantero',
            'team': 'Academia Millonarios',
            'experience_years': 8,
            'achievements': 'Campeón torneo juvenil 2023, Goleador del año 2022',
            'description': 'Joven promesa del fútbol colombiano. Sueño con llegar a la selección nacional y necesito apoyo para costear mis entrenamientos y equipamiento profesional.',
            'goal_description': 'Necesito recursos para entrenamientos especializados, nutrición deportiva y participar en torneos internacionales juveniles.',
            'goal_amount': 5000000,
            'is_featured': True,
            'is_verified': True,
        },
        {
            'user_index': 1,
            'full_name': 'María Fernanda López',
            'age': 15,
            'height': '1.65m',
            'weight': '55kg',
            'city': 'Medellín',
            'sport_slug': 'natacion',
            'position': 'Estilo Libre',
            'team': 'Club Natación Antioquia',
            'experience_years': 6,
            'achievements': 'Campeona departamental 100m libre, Récord regional juvenil',
            'description': 'Campeona departamental de natación. Busco apoyo para participar en competencias nacionales e internacionales.',
            'goal_description': 'Necesito financiar mi participación en el campeonato nacional y adquirir equipamiento de competencia.',
            'goal_amount': 3000000,
            'is_featured': False,
            'is_verified': True,
        },
        {
            'user_index': 2,
            'full_name': 'Andrés Felipe Gómez',
            'age': 19,
            'height': '1.85m',
            'weight': '80kg',
            'city': 'Cali',
            'sport_slug': 'baloncesto',
            'position': 'Alero',
            'team': 'Piratas de Bogotá Sub-21',
            'experience_years': 7,
            'achievements': 'MVP torneo universitario 2023, Selección Valle del Cauca',
            'description': 'Jugador de baloncesto con proyección internacional. Necesito recursos para entrenamientos especializados y nutrición deportiva.',
            'goal_description': 'Busco financiar mi preparación para las pruebas de la liga profesional y mejorar mi rendimiento físico.',
            'goal_amount': 4500000,
            'is_featured': False,
            'is_verified': False,
        },
        {
            'user_index': 3,
            'full_name': 'Valentina Rodríguez',
            'age': 16,
            'height': '1.60m',
            'weight': '48kg',
            'city': 'Barranquilla',
            'sport_slug': 'gimnasia',
            'position': 'Gimnasia Artística',
            'team': 'Selección Atlántico',
            'experience_years': 10,
            'achievements': 'Medalla de oro Juegos Nacionales, Campeona regional 3 años consecutivos',
            'description': 'Gimnasta con múltiples medallas regionales. Mi meta es representar a Colombia en competencias sudamericanas.',
            'goal_description': 'Necesito apoyo para entrenamientos en el exterior y participar en competencias internacionales.',
            'goal_amount': 6000000,
            'is_featured': True,
            'is_verified': True,
        },
    ]
    
    created_count = 0
    
    for i, user_data in enumerate(users_data):
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'display_name': user_data['display_name'],
            }
        )
        if created:
            user.set_password('Test123!')
            user.save()
            print(f"✅ Usuario creado: {user.username}")
    
    for athlete_data in athletes_data:
        user = User.objects.get(username=users_data[athlete_data['user_index']]['username'])
        sport = SportCategory.objects.filter(slug=athlete_data['sport_slug']).first()
        
        if not sport:
            print(f"⚠️ Deporte no encontrado: {athlete_data['sport_slug']}")
            continue
        
        athlete, created = AthleteProfile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': athlete_data['full_name'],
                'age': athlete_data['age'],
                'height': athlete_data['height'],
                'weight': athlete_data['weight'],
                'city': athlete_data['city'],
                'sport': sport,
                'position': athlete_data['position'],
                'team': athlete_data['team'],
                'experience_years': athlete_data['experience_years'],
                'achievements': athlete_data['achievements'],
                'description': athlete_data['description'],
                'goal_description': athlete_data['goal_description'],
                'goal_amount': athlete_data['goal_amount'],
                'is_featured': athlete_data['is_featured'],
                'is_verified': athlete_data['is_verified'],
                'status': 'approved',
            }
        )
        
        if created:
            created_count += 1
            print(f"✅ Deportista creado: {athlete.full_name}")
        else:
            print(f"ℹ️ Ya existe: {athlete.full_name}")
    
    print(f"\n📊 Total: {created_count} deportistas creados")
    return created_count


if __name__ == '__main__':
    print("=" * 60)
    print("🏆 CONFIGURACIÓN DEL SISTEMA DE DONACIONES")
    print("=" * 60)
    
    print("\n📁 Creando categorías de deportes...")
    create_sport_categories()
    
    print("\n👤 Creando deportistas de ejemplo...")
    create_sample_athletes()
    
    print("\n" + "=" * 60)
    print("✅ Configuración completada!")
    print("=" * 60)
    print("\nEndpoints disponibles:")
    print("  - GET  /api/donations/sports/       - Lista de deportes")
    print("  - GET  /api/donations/athletes/     - Lista de deportistas")
    print("  - GET  /api/donations/athletes/{id}/ - Detalle de deportista")
    print("  - POST /api/donations/donations/    - Crear donación")
    print("  - GET  /api/donations/donations/my_donations/ - Mis donaciones")

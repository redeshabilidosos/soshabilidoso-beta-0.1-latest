"""
Script para crear categorías y subcomunidades de ejemplo
Ejecutar: python setup_categories.py
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.communities.models import CommunityCategory, Community
from apps.users.models import User

def create_categories():
    print("🏷️ Creando categorías principales...")
    
    categories_data = [
        {
            'name': 'Deportes',
            'slug': 'deportes',
            'description': 'Comunidades dedicadas a todos los deportes',
            'icon': '⚽',
            'color': '#00ff88',
            'order': 1,
            'subcommunities': [
                ('Fútbol', 'La pasión del fútbol mundial', '⚽'),
                ('Basketball', 'NBA, FIBA y más', '🏀'),
                ('Voleibol', 'Voleibol de playa y sala', '🏐'),
                ('Tenis', 'ATP, WTA y Grand Slams', '🎾'),
                ('Natación', 'Deportes acuáticos', '🏊'),
                ('Atletismo', 'Carreras y competencias', '🏃'),
                ('Boxeo', 'El arte del pugilismo', '🥊'),
                ('Ciclismo', 'Rutas y competencias', '🚴'),
            ]
        },
        {
            'name': 'Música',
            'slug': 'musica',
            'description': 'Géneros musicales y artistas',
            'icon': '🎵',
            'color': '#ff6b6b',
            'order': 2,
            'subcommunities': [
                ('Trap', 'Trap latino y urbano', '🔥'),
                ('Reggaetón', 'El género urbano por excelencia', '🎤'),
                ('Reggae', 'Roots, dub y dancehall', '🇯🇲'),
                ('Dancehall', 'Ritmos jamaiquinos', '💃'),
                ('Hip Hop', 'Rap y cultura hip hop', '🎧'),
                ('Rock', 'Rock clásico y alternativo', '🎸'),
                ('Electrónica', 'EDM, house, techno', '🎹'),
                ('Pop', 'Música pop internacional', '⭐'),
                ('Salsa', 'Ritmos latinos', '💃'),
            ]
        },
        {
            'name': 'Tecnología',
            'slug': 'tecnologia',
            'description': 'Innovación y desarrollo tecnológico',
            'icon': '💻',
            'color': '#4ecdc4',
            'order': 3,
            'subcommunities': [
                ('Desarrollo Web', 'Frontend, backend y fullstack', '🌐'),
                ('Desarrollo Móvil', 'iOS, Android y multiplataforma', '📱'),
                ('Inteligencia Artificial', 'ML, Deep Learning y AI', '🤖'),
                ('Ciberseguridad', 'Seguridad informática', '🔒'),
                ('DevOps', 'CI/CD y cloud computing', '☁️'),
                ('Blockchain', 'Crypto y Web3', '⛓️'),
                ('Gaming Dev', 'Desarrollo de videojuegos', '🎮'),
                ('Data Science', 'Análisis de datos', '📊'),
            ]
        },
        {
            'name': 'Gaming',
            'slug': 'gaming',
            'description': 'Videojuegos y esports',
            'icon': '🎮',
            'color': '#9b59b6',
            'order': 4,
            'subcommunities': [
                ('FIFA / EA FC', 'Fútbol virtual', '⚽'),
                ('Call of Duty', 'FPS competitivo', '🔫'),
                ('Fortnite', 'Battle Royale', '🏝️'),
                ('League of Legends', 'MOBA competitivo', '⚔️'),
                ('Valorant', 'Shooter táctico', '🎯'),
                ('Minecraft', 'Construcción y supervivencia', '⛏️'),
                ('GTA', 'Grand Theft Auto', '🚗'),
                ('Esports', 'Competencias profesionales', '🏆'),
            ]
        },
        {
            'name': 'Educación',
            'slug': 'educacion',
            'description': 'Aprendizaje y cursos',
            'icon': '📚',
            'color': '#f39c12',
            'order': 5,
            'subcommunities': [
                ('Cursos Online', 'Plataformas de aprendizaje', '💻'),
                ('Idiomas', 'Aprende nuevos idiomas', '🌍'),
                ('Matemáticas', 'Números y lógica', '🔢'),
                ('Ciencias', 'Física, química y biología', '🔬'),
                ('Historia', 'Conoce el pasado', '📜'),
                ('Finanzas Personales', 'Educación financiera', '💰'),
                ('Preparación Exámenes', 'SAT, TOEFL, etc.', '📝'),
            ]
        },
        {
            'name': 'Arte y Creatividad',
            'slug': 'arte',
            'description': 'Expresión artística y diseño',
            'icon': '🎨',
            'color': '#e74c3c',
            'order': 6,
            'subcommunities': [
                ('Diseño Gráfico', 'Creatividad visual', '🖼️'),
                ('Fotografía', 'Captura momentos', '📷'),
                ('Ilustración', 'Arte digital y tradicional', '✏️'),
                ('Video y Cine', 'Producción audiovisual', '🎬'),
                ('Animación', '2D, 3D y motion graphics', '🎞️'),
                ('Música Producción', 'Beats y producción', '🎛️'),
            ]
        },
        {
            'name': 'Lifestyle',
            'slug': 'lifestyle',
            'description': 'Estilo de vida y bienestar',
            'icon': '✨',
            'color': '#1abc9c',
            'order': 7,
            'subcommunities': [
                ('Fitness', 'Ejercicio y entrenamiento', '💪'),
                ('Nutrición', 'Alimentación saludable', '🥗'),
                ('Moda', 'Tendencias y estilo', '👗'),
                ('Viajes', 'Explora el mundo', '✈️'),
                ('Cocina', 'Recetas y gastronomía', '👨‍🍳'),
                ('Meditación', 'Mindfulness y paz', '🧘'),
            ]
        },
        {
            'name': 'Negocios',
            'slug': 'negocios',
            'description': 'Emprendimiento y finanzas',
            'icon': '💼',
            'color': '#3498db',
            'order': 8,
            'subcommunities': [
                ('Emprendimiento', 'Startups y nuevos negocios', '🚀'),
                ('Marketing Digital', 'Estrategias online', '📈'),
                ('Inversiones', 'Bolsa y trading', '📊'),
                ('E-commerce', 'Ventas online', '🛒'),
                ('Freelance', 'Trabajo independiente', '💻'),
                ('Networking', 'Conexiones profesionales', '🤝'),
            ]
        },
    ]
    
    # Obtener un usuario admin para ser owner de las comunidades
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        admin_user = User.objects.first()
    
    if not admin_user:
        print("❌ No hay usuarios en la base de datos. Crea uno primero.")
        return
    
    for cat_data in categories_data:
        # Crear categoría
        category, created = CommunityCategory.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={
                'name': cat_data['name'],
                'description': cat_data['description'],
                'icon': cat_data['icon'],
                'color': cat_data['color'],
                'order': cat_data['order'],
            }
        )
        
        if created:
            print(f"  ✅ Categoría '{category.name}' creada")
        else:
            print(f"  ℹ️ Categoría '{category.name}' ya existe")
        
        # Crear comunidad principal para la categoría
        main_community, mc_created = Community.objects.get_or_create(
            slug=f"comunidad-{cat_data['slug']}",
            defaults={
                'name': f"Comunidad {cat_data['name']}",
                'description': cat_data['description'],
                'category_obj': category,
                'category': cat_data['slug'][:20],
                'owner': admin_user,
                'type': 'public',
            }
        )
        
        if mc_created:
            print(f"    📁 Comunidad principal '{main_community.name}' creada")
        
        # Crear subcomunidades
        for sub_name, sub_desc, sub_icon in cat_data.get('subcommunities', []):
            sub_slug = slugify(f"{cat_data['slug']}-{sub_name}")
            
            subcommunity, sub_created = Community.objects.get_or_create(
                slug=sub_slug,
                defaults={
                    'name': sub_name,
                    'description': f"{sub_icon} {sub_desc}",
                    'category_obj': category,
                    'category': cat_data['slug'][:20],
                    'parent': main_community,
                    'owner': admin_user,
                    'type': 'public',
                }
            )
            
            if sub_created:
                print(f"      └─ Subcomunidad '{sub_name}' creada")
    
    print("\n✅ Categorías y subcomunidades creadas exitosamente!")
    print(f"\n📊 Resumen:")
    print(f"   • Categorías: {CommunityCategory.objects.count()}")
    print(f"   • Comunidades principales: {Community.objects.filter(parent__isnull=True).count()}")
    print(f"   • Subcomunidades: {Community.objects.filter(parent__isnull=False).count()}")

if __name__ == '__main__':
    from django.utils.text import slugify
    create_categories()

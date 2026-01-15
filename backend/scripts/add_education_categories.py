"""
Script para agregar las categorías de Universidades y Colegios
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.communities.models import CommunityCategory, Community
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("AGREGANDO CATEGORÍAS DE UNIVERSIDADES Y COLEGIOS")
print("=" * 60)

# Obtener el primer usuario como owner para las comunidades de ejemplo
owner = User.objects.first()
if not owner:
    print("⚠ No hay usuarios en la base de datos. Creando usuario admin...")
    owner = User.objects.create_superuser(
        username='admin',
        email='admin@soshabilidoso.com',
        password='admin123'
    )

# Crear categoría de Universidades
print("\n--- Creando categoría: Universidades ---")
universities_cat, created = CommunityCategory.objects.get_or_create(
    slug='universidades',
    defaults={
        'name': 'Universidades',
        'description': 'Comunidades de universidades, facultades y grupos estudiantiles universitarios',
        'icon': '🎓',
        'color': '#3B82F6',  # Azul
        'order': 10,
        'is_active': True
    }
)
if created:
    print(f"✓ Categoría creada: {universities_cat.name}")
else:
    print(f"• Categoría ya existe: {universities_cat.name}")

# Crear categoría de Colegios
print("\n--- Creando categoría: Colegios ---")
schools_cat, created = CommunityCategory.objects.get_or_create(
    slug='colegios',
    defaults={
        'name': 'Colegios',
        'description': 'Comunidades de colegios, escuelas y grupos estudiantiles de secundaria y primaria',
        'icon': '🏫',
        'color': '#F59E0B',  # Naranja/Amarillo
        'order': 11,
        'is_active': True
    }
)
if created:
    print(f"✓ Categoría creada: {schools_cat.name}")
else:
    print(f"• Categoría ya existe: {schools_cat.name}")

# Crear comunidades principales de ejemplo para Universidades
print("\n--- Creando comunidades de ejemplo para Universidades ---")

university_communities = [
    {
        'name': 'Universidad Nacional de Colombia',
        'description': 'Comunidad oficial de estudiantes, egresados y profesores de la Universidad Nacional de Colombia. Comparte experiencias, eventos y oportunidades.',
        'location': 'Bogotá, Colombia'
    },
    {
        'name': 'Universidad de los Andes',
        'description': 'Espacio para la comunidad Uniandina. Conecta con estudiantes, profesores y egresados de todas las facultades.',
        'location': 'Bogotá, Colombia'
    },
    {
        'name': 'Universidad de Antioquia',
        'description': 'Comunidad de la UdeA. Comparte información académica, eventos culturales y deportivos.',
        'location': 'Medellín, Colombia'
    },
]

for uni_data in university_communities:
    community, created = Community.objects.get_or_create(
        name=uni_data['name'],
        defaults={
            'description': uni_data['description'],
            'category_obj': universities_cat,
            'category': 'educacion',
            'type': 'public',
            'owner': owner,
            'location': uni_data['location'],
            'is_active': True
        }
    )
    if created:
        print(f"  ✓ Comunidad creada: {community.name}")
        # Agregar al owner como miembro
        community.members.add(owner)
    else:
        print(f"  • Comunidad ya existe: {community.name}")

# Crear subcomunidades para Universidad Nacional
print("\n--- Creando subcomunidades para Universidad Nacional ---")
unal = Community.objects.filter(name='Universidad Nacional de Colombia').first()
if unal:
    subcommunities_unal = [
        {'name': 'Ingeniería UNAL', 'description': 'Facultad de Ingeniería - Todas las carreras de ingeniería'},
        {'name': 'Medicina UNAL', 'description': 'Facultad de Medicina - Estudiantes y profesionales de la salud'},
        {'name': 'Ciencias UNAL', 'description': 'Facultad de Ciencias - Matemáticas, Física, Química, Biología'},
        {'name': 'Deportes UNAL', 'description': 'Grupos deportivos y actividades físicas de la universidad'},
    ]
    
    for sub_data in subcommunities_unal:
        sub, created = Community.objects.get_or_create(
            name=sub_data['name'],
            parent=unal,
            defaults={
                'description': sub_data['description'],
                'category_obj': universities_cat,
                'category': 'educacion',
                'type': 'public',
                'owner': owner,
                'location': 'Bogotá, Colombia',
                'is_active': True
            }
        )
        if created:
            print(f"    ✓ Subcomunidad creada: {sub.name}")
            sub.members.add(owner)
        else:
            print(f"    • Subcomunidad ya existe: {sub.name}")

# Crear comunidades principales de ejemplo para Colegios
print("\n--- Creando comunidades de ejemplo para Colegios ---")

school_communities = [
    {
        'name': 'Colegio San Bartolomé La Merced',
        'description': 'Comunidad del Colegio San Bartolomé La Merced. Estudiantes, padres y egresados.',
        'location': 'Bogotá, Colombia'
    },
    {
        'name': 'Colegio Gimnasio Moderno',
        'description': 'Espacio para la comunidad del Gimnasio Moderno. Tradición y excelencia educativa.',
        'location': 'Bogotá, Colombia'
    },
    {
        'name': 'Colegio San José de La Salle',
        'description': 'Comunidad Lasallista. Conecta con estudiantes actuales y egresados.',
        'location': 'Medellín, Colombia'
    },
]

for school_data in school_communities:
    community, created = Community.objects.get_or_create(
        name=school_data['name'],
        defaults={
            'description': school_data['description'],
            'category_obj': schools_cat,
            'category': 'educacion',
            'type': 'public',
            'owner': owner,
            'location': school_data['location'],
            'is_active': True
        }
    )
    if created:
        print(f"  ✓ Comunidad creada: {community.name}")
        community.members.add(owner)
    else:
        print(f"  • Comunidad ya existe: {community.name}")

# Crear subcomunidades para Colegio San Bartolomé
print("\n--- Creando subcomunidades para Colegio San Bartolomé ---")
san_bartolome = Community.objects.filter(name='Colegio San Bartolomé La Merced').first()
if san_bartolome:
    subcommunities_sb = [
        {'name': 'Deportes San Bartolomé', 'description': 'Equipos deportivos y actividades físicas del colegio'},
        {'name': 'Arte y Cultura San Bartolomé', 'description': 'Grupos de teatro, música, danza y expresión artística'},
        {'name': 'Egresados San Bartolomé', 'description': 'Red de egresados del colegio'},
    ]
    
    for sub_data in subcommunities_sb:
        sub, created = Community.objects.get_or_create(
            name=sub_data['name'],
            parent=san_bartolome,
            defaults={
                'description': sub_data['description'],
                'category_obj': schools_cat,
                'category': 'educacion',
                'type': 'public',
                'owner': owner,
                'location': 'Bogotá, Colombia',
                'is_active': True
            }
        )
        if created:
            print(f"    ✓ Subcomunidad creada: {sub.name}")
            sub.members.add(owner)
        else:
            print(f"    • Subcomunidad ya existe: {sub.name}")

# Resumen
print("\n" + "=" * 60)
print("RESUMEN")
print("=" * 60)
print(f"Total de categorías: {CommunityCategory.objects.filter(is_active=True).count()}")
print(f"  - Universidades: {universities_cat.community_count} comunidades")
print(f"  - Colegios: {schools_cat.community_count} comunidades")
print(f"\nTotal de comunidades: {Community.objects.filter(is_active=True, parent__isnull=True).count()}")
print(f"Total de subcomunidades: {Community.objects.filter(is_active=True, parent__isnull=False).count()}")
print("\n✓ Categorías de Universidades y Colegios agregadas correctamente!")

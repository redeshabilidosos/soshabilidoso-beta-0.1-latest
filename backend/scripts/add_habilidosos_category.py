"""
Script para agregar la categoría principal Habilidosos con subcomunidades
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.db.models import F
from apps.communities.models import CommunityCategory, Community
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("AGREGANDO CATEGORÍA PRINCIPAL: HABILIDOSOS")
print("=" * 60)

# Obtener el primer usuario como owner
owner = User.objects.first()
if not owner:
    print("⚠ No hay usuarios. Creando admin...")
    owner = User.objects.create_superuser(
        username='admin',
        email='admin@soshabilidoso.com',
        password='admin123'
    )

# Primero, actualizar el orden de todas las categorías existentes para hacer espacio
print("\n--- Reordenando categorías existentes ---")
CommunityCategory.objects.all().update(order=F('order') + 10)
print("✓ Categorías reordenadas")

# Crear categoría principal Habilidosos con orden 0 (primera)
print("\n--- Creando categoría: Habilidosos ---")
habilidosos_cat, created = CommunityCategory.objects.update_or_create(
    slug='habilidosos',
    defaults={
        'name': 'Habilidosos',
        'description': 'La comunidad oficial del Reality SOS-HABILIDOSO. Conecta con participantes, sigue las competencias y forma parte de esta gran familia de talentos.',
        'icon': '⭐',  # Estrella como icono principal
        'color': '#00ff88',  # Verde neón de la marca
        'order': 0,  # Primera categoría
        'is_active': True
    }
)
if created:
    print(f"✓ Categoría creada: {habilidosos_cat.name}")
else:
    print(f"✓ Categoría actualizada: {habilidosos_cat.name}")

# Crear comunidad principal de Habilidosos
print("\n--- Creando comunidad principal: Habilidosos Reality ---")
habilidosos_main, created = Community.objects.get_or_create(
    name='Habilidosos Reality',
    parent__isnull=True,
    defaults={
        'description': '🌟 Bienvenido a la comunidad oficial del Reality SOS-HABILIDOSO. Aquí encontrarás todo sobre el programa: participantes, competencias, eventos en vivo, y mucho más. ¡Un golazo a tus sueños!',
        'category_obj': habilidosos_cat,
        'category': 'deportes',
        'type': 'public',
        'owner': owner,
        'location': 'Colombia',
        'is_active': True,
        'is_verified': True  # Comunidad verificada oficial
    }
)
if created:
    print(f"✓ Comunidad principal creada: {habilidosos_main.name}")
    habilidosos_main.members.add(owner)
else:
    print(f"• Comunidad ya existe: {habilidosos_main.name}")
    # Actualizar para asegurar que tenga la categoría correcta
    habilidosos_main.category_obj = habilidosos_cat
    habilidosos_main.is_verified = True
    habilidosos_main.save()

# Crear subcomunidades deportivas
print("\n--- Creando subcomunidades DEPORTIVAS ---")
deportivas = [
    {
        'name': 'Fútbol Habilidosos',
        'description': '⚽ Comunidad de fútbol del Reality. Técnicas, partidos, entrenamientos y todo sobre el deporte rey.',
        'icon': '⚽'
    },
    {
        'name': 'Baloncesto Habilidosos',
        'description': '🏀 Comunidad de baloncesto. Jugadas, torneos y el mejor contenido de basketball.',
        'icon': '🏀'
    },
    {
        'name': 'Voleibol Habilidosos',
        'description': '🏐 Comunidad de voleibol. Técnicas, competencias y pasión por este deporte.',
        'icon': '🏐'
    },
    {
        'name': 'Atletismo Habilidosos',
        'description': '🏃 Comunidad de atletismo. Carreras, saltos, lanzamientos y más.',
        'icon': '🏃'
    },
    {
        'name': 'Natación Habilidosos',
        'description': '🏊 Comunidad de natación y deportes acuáticos.',
        'icon': '🏊'
    },
    {
        'name': 'Deportes Extremos Habilidosos',
        'description': '🛹 Skateboarding, BMX, parkour y deportes de adrenalina.',
        'icon': '🛹'
    },
]

for dep in deportivas:
    sub, created = Community.objects.get_or_create(
        name=dep['name'],
        parent=habilidosos_main,
        defaults={
            'description': dep['description'],
            'category_obj': habilidosos_cat,
            'category': 'deportes',
            'type': 'public',
            'owner': owner,
            'location': 'Colombia',
            'is_active': True
        }
    )
    if created:
        print(f"  ✓ {dep['icon']} {sub.name}")
        sub.members.add(owner)
    else:
        print(f"  • {dep['icon']} {sub.name} (ya existe)")

# Crear subcomunidades culturales
print("\n--- Creando subcomunidades CULTURALES ---")
culturales = [
    {
        'name': 'Música Habilidosos',
        'description': '🎵 Comunidad musical. Canto, instrumentos, composición y todo el talento musical.',
        'icon': '🎵'
    },
    {
        'name': 'Danza Habilidosos',
        'description': '💃 Comunidad de danza. Baile urbano, folclórico, contemporáneo y más estilos.',
        'icon': '💃'
    },
    {
        'name': 'Teatro Habilidosos',
        'description': '🎭 Comunidad de artes escénicas. Actuación, improvisación y expresión dramática.',
        'icon': '🎭'
    },
    {
        'name': 'Arte Visual Habilidosos',
        'description': '🎨 Comunidad de artes visuales. Pintura, dibujo, escultura y diseño.',
        'icon': '🎨'
    },
    {
        'name': 'Literatura Habilidosos',
        'description': '📚 Comunidad literaria. Escritura, poesía, cuentos y expresión escrita.',
        'icon': '📚'
    },
    {
        'name': 'Fotografía y Video Habilidosos',
        'description': '📸 Comunidad audiovisual. Fotografía, videografía y producción de contenido.',
        'icon': '📸'
    },
]

for cul in culturales:
    sub, created = Community.objects.get_or_create(
        name=cul['name'],
        parent=habilidosos_main,
        defaults={
            'description': cul['description'],
            'category_obj': habilidosos_cat,
            'category': 'arte',
            'type': 'public',
            'owner': owner,
            'location': 'Colombia',
            'is_active': True
        }
    )
    if created:
        print(f"  ✓ {cul['icon']} {sub.name}")
        sub.members.add(owner)
    else:
        print(f"  • {cul['icon']} {sub.name} (ya existe)")

# Crear subcomunidades psicosociales
print("\n--- Creando subcomunidades PSICOSOCIALES ---")
psicosociales = [
    {
        'name': 'Bienestar Emocional Habilidosos',
        'description': '💚 Espacio seguro para hablar sobre salud mental, emociones y bienestar psicológico.',
        'icon': '💚'
    },
    {
        'name': 'Liderazgo Habilidosos',
        'description': '👑 Desarrollo de habilidades de liderazgo, trabajo en equipo y comunicación.',
        'icon': '👑'
    },
    {
        'name': 'Emprendimiento Habilidosos',
        'description': '💡 Comunidad de emprendedores. Ideas, proyectos y desarrollo de negocios.',
        'icon': '💡'
    },
    {
        'name': 'Voluntariado Habilidosos',
        'description': '🤝 Acciones sociales, voluntariado y proyectos de impacto comunitario.',
        'icon': '🤝'
    },
    {
        'name': 'Orientación Vocacional Habilidosos',
        'description': '🎯 Guía para descubrir tu vocación, carreras y oportunidades de estudio.',
        'icon': '🎯'
    },
    {
        'name': 'Familia Habilidosos',
        'description': '👨‍👩‍👧‍👦 Espacio para padres, familiares y apoyo en el proceso de los participantes.',
        'icon': '👨‍👩‍👧‍👦'
    },
    {
        'name': 'Inclusión y Diversidad Habilidosos',
        'description': '🌈 Comunidad inclusiva que celebra la diversidad y promueve el respeto.',
        'icon': '🌈'
    },
]

for psi in psicosociales:
    sub, created = Community.objects.get_or_create(
        name=psi['name'],
        parent=habilidosos_main,
        defaults={
            'description': psi['description'],
            'category_obj': habilidosos_cat,
            'category': 'lifestyle',
            'type': 'public',
            'owner': owner,
            'location': 'Colombia',
            'is_active': True
        }
    )
    if created:
        print(f"  ✓ {psi['icon']} {sub.name}")
        sub.members.add(owner)
    else:
        print(f"  • {psi['icon']} {sub.name} (ya existe)")

# Resumen final
print("\n" + "=" * 60)
print("RESUMEN")
print("=" * 60)

# Mostrar todas las categorías en orden
print("\nCategorías (en orden):")
for cat in CommunityCategory.objects.filter(is_active=True).order_by('order'):
    print(f"  {cat.order}. {cat.icon} {cat.name} ({cat.community_count} comunidades)")

# Contar subcomunidades de Habilidosos
habilidosos_subs = Community.objects.filter(parent=habilidosos_main, is_active=True).count()
print(f"\nSubcomunidades de Habilidosos Reality: {habilidosos_subs}")
print(f"  - Deportivas: {len(deportivas)}")
print(f"  - Culturales: {len(culturales)}")
print(f"  - Psicosociales: {len(psicosociales)}")

print("\n✓ Categoría Habilidosos creada como PRIMERA categoría!")
print("✓ Logo: ⭐ (estrella) - Color: #00ff88 (verde neón)")

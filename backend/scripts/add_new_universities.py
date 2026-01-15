"""
Script para agregar las nuevas universidades:
- Politécnico Colombiano Jaime Isaza Cadavid
- Universidad Católica Luis Amigó
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
print("AGREGANDO NUEVAS UNIVERSIDADES")
print("=" * 60)

# Obtener el primer usuario como owner
owner = User.objects.first()
if not owner:
    print("⚠ No hay usuarios en la base de datos.")
    sys.exit(1)

# Obtener la categoría de Universidades
universities_cat = CommunityCategory.objects.filter(slug='universidades').first()
if not universities_cat:
    print("⚠ No existe la categoría de Universidades. Ejecuta primero add_education_categories.py")
    sys.exit(1)

print(f"✓ Categoría encontrada: {universities_cat.name}")

# Nuevas universidades a agregar
new_universities = [
    {
        'name': 'Politécnico Colombiano Jaime Isaza Cadavid',
        'description': 'Comunidad oficial del Politécnico Colombiano Jaime Isaza Cadavid. Espacio para estudiantes, egresados y docentes. Comparte experiencias académicas, eventos deportivos, culturales y oportunidades laborales. Web: https://www.politecnicojic.edu.co/',
        'location': 'Medellín, Colombia',
    },
    {
        'name': 'Universidad Católica Luis Amigó',
        'description': 'Comunidad de la Universidad Católica Luis Amigó (FUNLAM). Conecta con estudiantes, profesores y egresados. Comparte información académica, eventos y actividades de la comunidad Amigoniana. Web: https://www.funlam.edu.co/',
        'location': 'Medellín, Colombia',
    },
]

print("\n--- Creando nuevas comunidades universitarias ---")

for uni_data in new_universities:
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

# Resumen
print("\n" + "=" * 60)
print("RESUMEN DE UNIVERSIDADES")
print("=" * 60)

universities = Community.objects.filter(
    category_obj=universities_cat,
    parent__isnull=True,
    is_active=True
)

print(f"\nTotal de universidades: {universities.count()}")
print("\nListado:")
for i, uni in enumerate(universities, 1):
    print(f"  {i}. {uni.name}")

print("\n✓ Nuevas universidades agregadas correctamente!")

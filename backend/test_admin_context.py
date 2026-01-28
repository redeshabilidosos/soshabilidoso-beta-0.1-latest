import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import RequestFactory
from django.contrib.admin.sites import site

User = get_user_model()

# Crear un request falso
factory = RequestFactory()
request = factory.get('/admin/')

# Crear un usuario admin falso
try:
    user = User.objects.filter(is_superuser=True).first()
    if not user:
        print("⚠️  No hay usuarios superusuarios en la base de datos")
        user = User(username='test_admin', is_superuser=True, is_staff=True)
except:
    user = User(username='test_admin', is_superuser=True, is_staff=True)

request.user = user

# Obtener el contexto del admin
app_list = site.get_app_list(request)

print("=" * 60)
print("APPS DISPONIBLES EN EL ADMIN")
print("=" * 60)

for app in app_list:
    print(f"\n📦 {app['name']} ({app['app_label']})")
    print(f"   URL: {app.get('app_url', 'N/A')}")
    print(f"   Modelos ({len(app['models'])}):")
    for model in app['models']:
        print(f"      - {model['name']}")
        print(f"        Add URL: {model.get('add_url', 'N/A')}")
        print(f"        Admin URL: {model.get('admin_url', 'N/A')}")

# Buscar específicamente streaming
streaming_app = next((app for app in app_list if app['app_label'] == 'streaming'), None)
if streaming_app:
    print("\n" + "=" * 60)
    print("✅ STREAMING APP ENCONTRADA EN EL CONTEXTO")
    print("=" * 60)
    print(f"Nombre: {streaming_app['name']}")
    print(f"Label: {streaming_app['app_label']}")
    print(f"Modelos: {len(streaming_app['models'])}")
else:
    print("\n" + "=" * 60)
    print("❌ STREAMING APP NO ENCONTRADA EN EL CONTEXTO")
    print("=" * 60)
    print("Esto significa que el usuario no tiene permisos o hay un problema con el registro")

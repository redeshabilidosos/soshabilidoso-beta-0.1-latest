import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.conf import settings
from django.apps import apps

print("INSTALLED_APPS:")
for app in settings.INSTALLED_APPS:
    print(f"  - {app}")

print("\n\nApps configuradas:")
for app_config in apps.get_app_configs():
    print(f"  - {app_config.label}: {app_config.name}")
    
print("\n\n¿Está 'streaming' instalada?")
try:
    app = apps.get_app_config('streaming')
    print(f"  ✅ SÍ: {app.name} ({app.verbose_name})")
except LookupError:
    print("  ❌ NO")

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib import admin
from django.apps import apps

print("=" * 60)
print("VERIFICACIÓN DE REGISTRO EN ADMIN")
print("=" * 60)

# Obtener la app de streaming
streaming_app = apps.get_app_config('streaming')
print(f"\n✅ App encontrada: {streaming_app.verbose_name}")
print(f"   Label: {streaming_app.label}")
print(f"   Name: {streaming_app.name}")

# Obtener todos los modelos de streaming
streaming_models = list(streaming_app.get_models())
print(f"\n📦 Modelos en la app ({len(streaming_models)}):")
for model in streaming_models:
    print(f"   - {model.__name__}")

# Verificar cuáles están registrados en el admin
print(f"\n🔍 Estado de registro en Admin:")
for model in streaming_models:
    is_registered = model in admin.site._registry
    status = "✅ REGISTRADO" if is_registered else "❌ NO REGISTRADO"
    print(f"   {status}: {model.__name__}")
    
    if is_registered:
        admin_class = admin.site._registry[model]
        print(f"      Admin class: {admin_class.__class__.__name__}")

# Verificar todos los modelos registrados en el admin
print(f"\n📋 Todos los modelos registrados en Admin:")
all_registered = admin.site._registry
streaming_registered = [model for model in all_registered if model._meta.app_label == 'streaming']
print(f"   Total de modelos de streaming registrados: {len(streaming_registered)}")
for model in streaming_registered:
    admin_class = all_registered[model]
    print(f"   - {model._meta.verbose_name or model.__name__} ({admin_class.__class__.__name__})")

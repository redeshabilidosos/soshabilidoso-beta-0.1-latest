import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

print("✅ Django setup complete")

try:
    from apps.streaming.models import StreamSession
    print("✅ StreamSession model imported successfully")
    print(f"   App label: {StreamSession._meta.app_label}")
    print(f"   Model name: {StreamSession._meta.model_name}")
except Exception as e:
    print(f"❌ Error importing StreamSession: {e}")
    sys.exit(1)

try:
    from apps.streaming.admin import StreamSessionAdmin
    print("✅ StreamSessionAdmin imported successfully")
except Exception as e:
    print(f"❌ Error importing StreamSessionAdmin: {e}")
    sys.exit(1)

print("\n🎉 All imports successful!")

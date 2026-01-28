import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.db import connection

cursor = connection.cursor()
cursor.execute("SHOW TABLES LIKE 'streaming_%'")
tables = cursor.fetchall()

print("Tablas de streaming encontradas:")
if tables:
    for table in tables:
        print(f"  ✅ {table[0]}")
else:
    print("  ❌ No se encontraron tablas de streaming")
    print("\n🔧 Necesitas ejecutar: python manage.py migrate")

#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.users.models import Follow

User = get_user_model()

# Obtener todos los usuarios
users = User.objects.all()

print(f"Total de usuarios: {users.count()}\n")

# Crear relaciones de seguimiento bidireccionales entre todos los usuarios
# (excepto seguirse a sí mismos)
created_count = 0
already_exists = 0

for user in users:
    for other_user in users:
        if user.id != other_user.id:
            # Verificar si ya existe la relación
            follow_exists = Follow.objects.filter(
                follower=user,
                following=other_user
            ).exists()
            
            if not follow_exists:
                Follow.objects.create(follower=user, following=other_user)
                created_count += 1
                print(f"OK: {user.username} ahora sigue a {other_user.username}")
            else:
                already_exists += 1

print(f"\n=== Resumen ===")
print(f"Relaciones creadas: {created_count}")
print(f"Relaciones que ya existían: {already_exists}")

# Verificar el feed de cada usuario
print(f"\n=== Feed de cada usuario ===")
for user in users:
    following_users = user.following_set.values_list('following', flat=True)
    print(f"\n{user.username} sigue a {following_users.count()} usuarios:")
    for follow in user.following_set.all():
        print(f"  - {follow.following.username}")

"""
Script para crear amistades entre molo y todos los demás usuarios
"""
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.users.models import User, Friendship, FriendRequest

def create_friendships_for_molo():
    """Crear amistades entre molo y todos los demás usuarios"""
    
    try:
        # Obtener el usuario molo
        molo = User.objects.get(username='molo')
        print(f"✓ Usuario encontrado: {molo.username} ({molo.display_name})")
        
        # Obtener todos los demás usuarios activos
        other_users = User.objects.filter(is_active=True).exclude(id=molo.id)
        print(f"✓ Usuarios encontrados: {other_users.count()}")
        
        created_count = 0
        already_friends_count = 0
        
        for user in other_users:
            # Verificar si ya son amigos
            existing_friendship = Friendship.objects.filter(
                models.Q(user1=molo, user2=user) |
                models.Q(user1=user, user2=molo)
            ).first()
            
            if existing_friendship:
                print(f"  - Ya son amigos: {user.username}")
                already_friends_count += 1
                continue
            
            # Crear la amistad
            friendship = Friendship.objects.create(
                user1=molo,
                user2=user
            )
            print(f"  ✓ Amistad creada con: {user.username} ({user.display_name})")
            created_count += 1
            
            # Eliminar solicitudes de amistad pendientes si existen
            FriendRequest.objects.filter(
                models.Q(sender=molo, receiver=user) |
                models.Q(sender=user, receiver=molo),
                status='pending'
            ).update(status='accepted')
        
        print(f"\n{'='*50}")
        print(f"✓ Proceso completado:")
        print(f"  - Amistades creadas: {created_count}")
        print(f"  - Ya eran amigos: {already_friends_count}")
        print(f"  - Total amigos de molo: {created_count + already_friends_count}")
        print(f"{'='*50}")
        
    except User.DoesNotExist:
        print("✗ Error: Usuario 'molo' no encontrado")
        return
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    from django.db import models
    create_friendships_for_molo()

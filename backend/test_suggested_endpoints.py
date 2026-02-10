"""
Script para probar los endpoints de sugerencias
"""
import os
import django
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.users.models import User, Follow, Friendship
from apps.communities.models import Community, CommunityMembership
from django.db.models import Q

def test_suggested_users():
    print("=" * 60)
    print("PRUEBA DE USUARIOS SUGERIDOS")
    print("=" * 60)
    
    # Obtener un usuario de prueba
    user = User.objects.filter(is_active=True).first()
    
    if not user:
        print("❌ No hay usuarios activos")
        return
    
    print(f"\n👤 Usuario de prueba: {user.username} (ID: {user.id})")
    
    # Obtener amigos
    user_friends = Friendship.objects.filter(
        Q(user1=user) | Q(user2=user)
    ).values_list('user1_id', 'user2_id')
    
    friend_ids = set()
    for user1_id, user2_id in user_friends:
        if user1_id != user.id:
            friend_ids.add(user1_id)
        if user2_id != user.id:
            friend_ids.add(user2_id)
    
    print(f"👥 Amigos: {len(friend_ids)}")
    
    # Obtener usuarios que ya sigue
    following_ids = Follow.objects.filter(
        follower=user
    ).values_list('following_id', flat=True)
    
    print(f"➡️  Siguiendo: {following_ids.count()}")
    
    # Obtener usuarios sugeridos
    suggested = User.objects.filter(
        is_active=True
    ).exclude(
        id=user.id
    ).exclude(
        id__in=friend_ids
    ).exclude(
        id__in=following_ids
    ).order_by('-followers_count', '-posts_count')[:10]
    
    print(f"\n💡 Usuarios sugeridos: {suggested.count()}")
    
    for u in suggested[:5]:
        print(f"   - {u.username} ({u.display_name}) - Seguidores: {u.followers_count}")
    
    print("\n" + "=" * 60)

def test_suggested_communities():
    print("\n" + "=" * 60)
    print("PRUEBA DE COMUNIDADES SUGERIDAS")
    print("=" * 60)
    
    # Obtener un usuario de prueba
    user = User.objects.filter(is_active=True).first()
    
    if not user:
        print("❌ No hay usuarios activos")
        return
    
    print(f"\n👤 Usuario de prueba: {user.username} (ID: {user.id})")
    
    # Obtener comunidades a las que está suscrito
    subscribed_ids = CommunityMembership.objects.filter(
        user=user,
        is_active=True
    ).values_list('community_id', flat=True)
    
    print(f"🏘️  Suscrito a: {subscribed_ids.count()} comunidades")
    
    # Obtener comunidades sugeridas
    from django.db.models import Count
    
    suggested = Community.objects.filter(
        is_active=True
    ).exclude(
        id__in=subscribed_ids
    ).annotate(
        members_count=Count('members', filter=Q(members__is_active=True))
    ).order_by('-members_count', '-created_at')[:10]
    
    print(f"\n💡 Comunidades sugeridas: {suggested.count()}")
    
    for c in suggested[:5]:
        members = c.members.filter(is_active=True).count()
        print(f"   - {c.name} - Miembros: {members}")
    
    # Verificar total de comunidades
    total_communities = Community.objects.filter(is_active=True).count()
    print(f"\n📊 Total de comunidades activas: {total_communities}")
    
    print("\n" + "=" * 60)

if __name__ == '__main__':
    test_suggested_users()
    test_suggested_communities()

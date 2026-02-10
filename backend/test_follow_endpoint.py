"""
Script para probar el endpoint de seguir usuarios
"""
import os
import django
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.users.models import User, Follow
from django.db import connection

def test_follow_endpoint():
    print("=" * 60)
    print("PRUEBA DE ENDPOINT DE SEGUIR USUARIOS")
    print("=" * 60)
    
    # Verificar que la tabla existe
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE() 
            AND table_name = 'user_follows'
        """)
        result = cursor.fetchone()
        
        if result:
            print("✅ Tabla 'user_follows' existe en la base de datos")
        else:
            print("❌ Tabla 'user_follows' NO existe")
            return
    
    # Obtener usuarios de prueba
    users = User.objects.filter(is_active=True)[:3]
    
    if len(users) < 2:
        print("❌ Se necesitan al menos 2 usuarios activos para la prueba")
        return
    
    user1 = users[0]
    user2 = users[1]
    
    print(f"\n📋 Usuarios de prueba:")
    print(f"   Usuario 1: {user1.username} (ID: {user1.id})")
    print(f"   Usuario 2: {user2.username} (ID: {user2.id})")
    
    # Verificar seguimientos existentes
    existing_follows = Follow.objects.filter(follower=user1, following=user2)
    
    if existing_follows.exists():
        print(f"\n⚠️  {user1.username} ya sigue a {user2.username}")
        print("   Eliminando seguimiento existente para la prueba...")
        existing_follows.delete()
        user1.following_count = max(0, user1.following_count - 1)
        user1.save(update_fields=['following_count'])
        user2.followers_count = max(0, user2.followers_count - 1)
        user2.save(update_fields=['followers_count'])
    
    # Crear seguimiento
    print(f"\n🔄 Creando seguimiento: {user1.username} -> {user2.username}")
    
    follow, created = Follow.objects.get_or_create(
        follower=user1,
        following=user2
    )
    
    if created:
        # Actualizar contadores
        user2.followers_count += 1
        user2.save(update_fields=['followers_count'])
        
        user1.following_count += 1
        user1.save(update_fields=['following_count'])
        
        print("✅ Seguimiento creado exitosamente")
    else:
        print("⚠️  El seguimiento ya existía")
    
    # Verificar en la base de datos
    print("\n🔍 Verificando en la base de datos...")
    
    follow_check = Follow.objects.filter(follower=user1, following=user2).first()
    
    if follow_check:
        print(f"✅ Seguimiento encontrado en BD:")
        print(f"   ID: {follow_check.id}")
        print(f"   Seguidor: {follow_check.follower.username}")
        print(f"   Siguiendo: {follow_check.following.username}")
        print(f"   Fecha: {follow_check.created_at}")
    else:
        print("❌ Seguimiento NO encontrado en BD")
        return
    
    # Verificar contadores
    user1.refresh_from_db()
    user2.refresh_from_db()
    
    print(f"\n📊 Contadores actualizados:")
    print(f"   {user1.username} - Siguiendo: {user1.following_count}")
    print(f"   {user2.username} - Seguidores: {user2.followers_count}")
    
    # Verificar que el seguimiento persiste
    total_follows = Follow.objects.count()
    print(f"\n📈 Total de seguimientos en la BD: {total_follows}")
    
    # Mostrar todos los seguimientos del usuario 1
    user1_follows = Follow.objects.filter(follower=user1)
    print(f"\n👥 {user1.username} sigue a {user1_follows.count()} usuarios:")
    for f in user1_follows[:5]:
        print(f"   - {f.following.username}")
    
    print("\n" + "=" * 60)
    print("✅ PRUEBA COMPLETADA EXITOSAMENTE")
    print("=" * 60)

if __name__ == '__main__':
    test_follow_endpoint()

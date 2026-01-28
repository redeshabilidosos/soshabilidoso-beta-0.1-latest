"""
Script para resetear contraseñas de todos los usuarios
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def reset_all_passwords():
    """Resetear contraseñas de todos los usuarios a 'password123'"""
    print("\n" + "="*80)
    print("🔄 RESETEAR CONTRASEÑAS DE TODOS LOS USUARIOS")
    print("="*80 + "\n")
    
    new_password = 'password123'
    users = User.objects.all()
    
    if not users:
        print("❌ No hay usuarios en la base de datos")
        return
    
    print(f"📊 Total de usuarios: {users.count()}\n")
    print(f"🔑 Nueva contraseña para todos: {new_password}\n")
    
    updated_count = 0
    
    for user in users:
        try:
            user.set_password(new_password)
            user.save()
            print(f"✅ {user.username:20} - Contraseña actualizada")
            updated_count += 1
        except Exception as e:
            print(f"❌ {user.username:20} - Error: {e}")
    
    print("\n" + "="*80)
    print(f"✅ {updated_count} contraseñas actualizadas exitosamente")
    print("="*80 + "\n")
    
    # Mostrar algunos usuarios de ejemplo
    print("📝 Usuarios disponibles para login:\n")
    
    example_users = users[:10]
    for user in example_users:
        print(f"   Username: {user.username:20} | Email: {user.email}")
    
    print(f"\n🔑 Contraseña para todos: {new_password}")
    print("\n💡 Puedes usar cualquier username o email con la contraseña 'password123'")
    print("\n🌐 Frontend: http://localhost:4000/login")
    print()

if __name__ == '__main__':
    reset_all_passwords()

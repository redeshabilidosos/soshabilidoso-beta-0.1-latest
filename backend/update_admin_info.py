"""
Script para actualizar información del usuario admin
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def update_admin():
    print("🔧 Actualizando información del administrador...\n")
    
    try:
        user = User.objects.get(username='admin')
        
        # Actualizar información
        user.display_name = 'Administrador'
        user.email = 'admin@soshabilidoso.com'
        user.bio = 'Administrador del sistema SOS Habilidoso'
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.save()
        
        print("✅ Información actualizada exitosamente\n")
        
        # Mostrar información
        print("="*60)
        print("🎉 USUARIO ADMINISTRADOR ACTUALIZADO")
        print("="*60)
        print(f"\n📋 Credenciales de acceso:")
        print(f"   URL Admin:  http://127.0.0.1:8000/admin/")
        print(f"   Username:   admin")
        print(f"   Email:      {user.email}")
        print(f"   Password:   admin123")
        print(f"\n🔐 Permisos:")
        print(f"   Superusuario: {user.is_superuser}")
        print(f"   Staff:        {user.is_staff}")
        print(f"   Activo:       {user.is_active}")
        print(f"\n👤 Información del usuario:")
        print(f"   ID:           {user.id}")
        print(f"   Display Name: {user.display_name}")
        print(f"   Email:        {user.email}")
        print(f"   Bio:          {user.bio}")
        print("\n" + "="*60)
        print("\n💡 Accede al panel de administración:")
        print("   http://127.0.0.1:8000/admin/")
        print("\n")
        
    except User.DoesNotExist:
        print("❌ El usuario 'admin' no existe")
        print("💡 Ejecuta: python create_django_admin.py")

if __name__ == '__main__':
    update_admin()

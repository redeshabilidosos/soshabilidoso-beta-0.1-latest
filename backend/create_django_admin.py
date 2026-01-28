"""
Script para crear un usuario administrador de Django
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_admin_user():
    print("🔧 Creando usuario administrador de Django...\n")
    
    # Datos del admin
    username = 'admin'
    email = 'admin@soshabilidoso.com'
    password = 'admin123'
    display_name = 'Administrador'
    
    # Verificar si ya existe
    if User.objects.filter(username=username).exists():
        print(f"⚠️  El usuario '{username}' ya existe.")
        user = User.objects.get(username=username)
        
        # Actualizar a superusuario si no lo es
        if not user.is_superuser or not user.is_staff:
            user.is_superuser = True
            user.is_staff = True
            user.save()
            print(f"✅ Usuario '{username}' actualizado a superusuario")
        else:
            print(f"ℹ️  El usuario '{username}' ya es superusuario")
    else:
        # Crear nuevo superusuario
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        
        # Actualizar campos adicionales
        user.display_name = display_name
        user.bio = 'Administrador del sistema SOS Habilidoso'
        user.save()
        
        print(f"✅ Superusuario '{username}' creado exitosamente")
    
    # Mostrar información
    print("\n" + "="*60)
    print("🎉 USUARIO ADMINISTRADOR LISTO")
    print("="*60)
    print(f"\n📋 Credenciales de acceso:")
    print(f"   URL Admin:  http://127.0.0.1:8000/admin/")
    print(f"   Username:   {username}")
    print(f"   Email:      {email}")
    print(f"   Password:   {password}")
    print(f"\n🔐 Permisos:")
    print(f"   Superusuario: {user.is_superuser}")
    print(f"   Staff:        {user.is_staff}")
    print(f"   Activo:       {user.is_active}")
    print(f"\n👤 Información del usuario:")
    print(f"   ID:           {user.id}")
    print(f"   Display Name: {user.display_name}")
    print(f"   Email:        {user.email}")
    print("\n" + "="*60)
    print("\n💡 Puedes acceder al panel de administración en:")
    print("   http://127.0.0.1:8000/admin/")
    print("\n")

if __name__ == '__main__':
    create_admin_user()

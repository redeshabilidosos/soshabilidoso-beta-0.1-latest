#!/usr/bin/env python
"""
Script para probar el login del admin
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

def test_admin_login():
    """Probar login del admin"""
    
    credentials = [
        ('admin', 'admin123'),
        ('superadmin', 'admin123'),
        ('admin2', 'admin123'),
        ('admin3', 'admin123'),
    ]
    
    print("🔐 Probando credenciales de admin...")
    print("=" * 60)
    
    for username, password in credentials:
        print(f"\n🔑 Probando: {username} / {password}")
        
        # Verificar que el usuario existe
        try:
            user = User.objects.get(username=username)
            print(f"   ✅ Usuario existe: {user.email}")
            print(f"   ✅ Es superusuario: {user.is_superuser}")
            print(f"   ✅ Es staff: {user.is_staff}")
            print(f"   ✅ Activo: {user.is_active}")
            
            # Probar autenticación
            auth_user = authenticate(username=username, password=password)
            if auth_user:
                print(f"   ✅ AUTENTICACIÓN EXITOSA")
            else:
                print(f"   ❌ AUTENTICACIÓN FALLÓ")
                
        except User.DoesNotExist:
            print(f"   ❌ Usuario no existe")
    
    print("\n" + "=" * 60)
    print("\n🌐 Ahora puedes acceder al admin en:")
    print("http://127.0.0.1:8000/admin/")
    print("\n💡 Usa cualquiera de estas credenciales:")
    print("   Username: admin (o superadmin, admin2, admin3)")
    print("   Password: admin123")

if __name__ == "__main__":
    test_admin_login()

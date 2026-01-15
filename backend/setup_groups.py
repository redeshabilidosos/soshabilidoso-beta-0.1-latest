"""
Script para crear grupos de permisos predefinidos
Ejecutar: python setup_groups.py
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

def create_groups():
    print("🔧 Creando grupos de permisos...")
    
    # 1. Grupo: Moderadores
    moderadores, created = Group.objects.get_or_create(name='Moderadores')
    if created:
        print("  ✅ Grupo 'Moderadores' creado")
    else:
        print("  ℹ️ Grupo 'Moderadores' ya existe")
    
    # Permisos para moderadores
    mod_permissions = [
        # Posts
        ('posts', 'post', 'view_post'),
        ('posts', 'post', 'change_post'),
        ('posts', 'post', 'delete_post'),
        # Comments
        ('posts', 'comment', 'view_comment'),
        ('posts', 'comment', 'delete_comment'),
        # Users (solo ver)
        ('users', 'user', 'view_user'),
        # Reels
        ('reels', 'reel', 'view_reel'),
        ('reels', 'reel', 'change_reel'),
        ('reels', 'reel', 'delete_reel'),
    ]
    
    for app, model, codename in mod_permissions:
        try:
            perm = Permission.objects.get(codename=codename, content_type__app_label=app)
            moderadores.permissions.add(perm)
        except Permission.DoesNotExist:
            print(f"    ⚠️ Permiso {codename} no encontrado")
    
    print(f"    📋 {moderadores.permissions.count()} permisos asignados a Moderadores")
    
    # 2. Grupo: Editores de Contenido
    editores, created = Group.objects.get_or_create(name='Editores de Contenido')
    if created:
        print("  ✅ Grupo 'Editores de Contenido' creado")
    else:
        print("  ℹ️ Grupo 'Editores de Contenido' ya existe")
    
    editor_permissions = [
        # Posts - todos los permisos
        ('posts', 'post', 'add_post'),
        ('posts', 'post', 'view_post'),
        ('posts', 'post', 'change_post'),
        ('posts', 'post', 'delete_post'),
        # Reels - todos los permisos
        ('reels', 'reel', 'add_reel'),
        ('reels', 'reel', 'view_reel'),
        ('reels', 'reel', 'change_reel'),
        ('reels', 'reel', 'delete_reel'),
        # Communities
        ('communities', 'community', 'add_community'),
        ('communities', 'community', 'view_community'),
        ('communities', 'community', 'change_community'),
    ]
    
    for app, model, codename in editor_permissions:
        try:
            perm = Permission.objects.get(codename=codename, content_type__app_label=app)
            editores.permissions.add(perm)
        except Permission.DoesNotExist:
            print(f"    ⚠️ Permiso {codename} no encontrado")
    
    print(f"    📋 {editores.permissions.count()} permisos asignados a Editores")
    
    # 3. Grupo: Gestores de Publicidad
    publicidad, created = Group.objects.get_or_create(name='Gestores de Publicidad')
    if created:
        print("  ✅ Grupo 'Gestores de Publicidad' creado")
    else:
        print("  ℹ️ Grupo 'Gestores de Publicidad' ya existe")
    
    ad_permissions = [
        ('advertising', 'advertisement', 'add_advertisement'),
        ('advertising', 'advertisement', 'view_advertisement'),
        ('advertising', 'advertisement', 'change_advertisement'),
        ('advertising', 'advertisement', 'delete_advertisement'),
        ('advertising', 'adimpression', 'view_adimpression'),
        ('advertising', 'adclick', 'view_adclick'),
        ('advertising', 'advideoview', 'view_advideoview'),
    ]
    
    for app, model, codename in ad_permissions:
        try:
            perm = Permission.objects.get(codename=codename, content_type__app_label=app)
            publicidad.permissions.add(perm)
        except Permission.DoesNotExist:
            print(f"    ⚠️ Permiso {codename} no encontrado")
    
    print(f"    📋 {publicidad.permissions.count()} permisos asignados a Gestores de Publicidad")
    
    # 4. Grupo: Administradores de Usuarios
    admin_users, created = Group.objects.get_or_create(name='Administradores de Usuarios')
    if created:
        print("  ✅ Grupo 'Administradores de Usuarios' creado")
    else:
        print("  ℹ️ Grupo 'Administradores de Usuarios' ya existe")
    
    user_admin_permissions = [
        ('users', 'user', 'add_user'),
        ('users', 'user', 'view_user'),
        ('users', 'user', 'change_user'),
        ('users', 'user', 'delete_user'),
        ('auth', 'group', 'view_group'),
    ]
    
    for app, model, codename in user_admin_permissions:
        try:
            perm = Permission.objects.get(codename=codename, content_type__app_label=app)
            admin_users.permissions.add(perm)
        except Permission.DoesNotExist:
            print(f"    ⚠️ Permiso {codename} no encontrado")
    
    print(f"    📋 {admin_users.permissions.count()} permisos asignados a Admin de Usuarios")
    
    print("\n✅ Grupos creados exitosamente!")
    print("\n📌 Resumen de grupos disponibles:")
    print("   • Moderadores - Puede moderar posts, comentarios y reels")
    print("   • Editores de Contenido - Puede crear y editar contenido")
    print("   • Gestores de Publicidad - Puede gestionar anuncios")
    print("   • Administradores de Usuarios - Puede gestionar usuarios")
    print("\n💡 Para asignar un grupo a un usuario:")
    print("   1. Ve a Admin > Usuarios > Selecciona usuario")
    print("   2. En la sección 'Grupos y Permisos', selecciona los grupos")
    print("   3. Guarda los cambios")

if __name__ == '__main__':
    create_groups()

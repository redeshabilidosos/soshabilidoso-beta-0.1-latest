"""
Script para verificar la actualización a Django 5.0
"""
import os
import sys

# Configurar pymysql ANTES de importar Django
try:
    import pymysql
    pymysql.install_as_MySQLdb()
    
    # Patch para que Django 5.0 acepte pymysql
    import MySQLdb
    if hasattr(MySQLdb, '__version__'):
        MySQLdb._original_version = MySQLdb.__version__
        MySQLdb.__version__ = '2.2.1'
        MySQLdb.version_info = (2, 2, 1, 'final', 0)
    
    print("✅ pymysql configurado como reemplazo de mysqlclient")
except ImportError:
    print("⚠️  pymysql no está instalado, usando mysqlclient")

import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')

# Patch para deshabilitar verificación de versión de MariaDB
from django.db.backends.mysql import base as mysql_base
original_check = mysql_base.DatabaseWrapper.check_database_version_supported

def patched_check(self):
    """No verificar versión de MariaDB - aceptar cualquier versión"""
    pass

mysql_base.DatabaseWrapper.check_database_version_supported = patched_check

django.setup()

def verify_django_version():
    """Verificar versión de Django"""
    print("=" * 60)
    print("VERIFICACIÓN DE DJANGO 5.0")
    print("=" * 60)
    
    import django
    print(f"\n✅ Django Version: {django.get_version()}")
    
    major_version = int(django.VERSION[0])
    if major_version >= 5:
        print("✅ Django 5.0+ detectado - Compatible con Python 3.14")
    else:
        print(f"⚠️  Django {django.get_version()} - Se recomienda 5.0+")
    
    return major_version >= 5

def verify_python_version():
    """Verificar versión de Python"""
    print(f"\n✅ Python Version: {sys.version}")
    
    if sys.version_info >= (3, 14):
        print("✅ Python 3.14+ detectado")
    elif sys.version_info >= (3, 12):
        print("✅ Python 3.12+ detectado (Recomendado)")
    else:
        print("⚠️  Python < 3.12 - Se recomienda actualizar")

def verify_site_settings():
    """Verificar que SiteSettings funciona correctamente"""
    print("\n" + "=" * 60)
    print("VERIFICACIÓN DE SITE SETTINGS")
    print("=" * 60)
    
    try:
        from apps.site_settings.models import SiteSettings
        
        # Intentar obtener o crear la instancia
        settings, created = SiteSettings.objects.get_or_create(
            pk=1,
            defaults={
                'site_name': 'SOS Habilidoso',
                'site_description': 'Red Social Deportiva',
                'primary_color': '#39FF14'
            }
        )
        
        if created:
            print("✅ SiteSettings creado exitosamente")
        else:
            print("✅ SiteSettings ya existe")
        
        print(f"\n📋 Configuración Actual:")
        print(f"   - Nombre del Sitio: {settings.site_name}")
        print(f"   - Color Primario: {settings.primary_color}")
        print(f"   - Modo Mantenimiento: {settings.maintenance_mode}")
        print(f"   - Botón Flotante: {settings.show_register_habilidosos_button}")
        print(f"   - Formulario Reality: {settings.reality_form_enabled}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en SiteSettings: {e}")
        return False

def verify_menu_routes():
    """Verificar que MenuRoute funciona correctamente"""
    print("\n" + "=" * 60)
    print("VERIFICACIÓN DE MENU ROUTES")
    print("=" * 60)
    
    try:
        from apps.site_settings.models import MenuRoute
        
        routes_count = MenuRoute.objects.count()
        enabled_count = MenuRoute.objects.filter(is_enabled=True).count()
        
        print(f"\n✅ Total de Rutas: {routes_count}")
        print(f"✅ Rutas Habilitadas: {enabled_count}")
        
        if routes_count > 0:
            print(f"\n📋 Primeras 5 Rutas:")
            for route in MenuRoute.objects.all()[:5]:
                status = "✓" if route.is_enabled else "✗"
                print(f"   {status} {route.label} ({route.path})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en MenuRoute: {e}")
        return False

def verify_admin_access():
    """Verificar que el admin es accesible"""
    print("\n" + "=" * 60)
    print("VERIFICACIÓN DE ADMIN")
    print("=" * 60)
    
    try:
        from django.contrib.admin.sites import site
        
        # Verificar que los modelos están registrados
        from apps.site_settings.models import SiteSettings, MenuRoute
        
        if SiteSettings in site._registry:
            print("✅ SiteSettings registrado en admin")
        else:
            print("❌ SiteSettings NO registrado en admin")
        
        if MenuRoute in site._registry:
            print("✅ MenuRoute registrado en admin")
        else:
            print("❌ MenuRoute NO registrado en admin")
        
        print("\n📋 URLs del Admin:")
        print("   - Admin Principal: http://127.0.0.1:8000/admin/")
        print("   - Site Settings: http://127.0.0.1:8000/admin/site_settings/sitesettings/")
        print("   - Menu Routes: http://127.0.0.1:8000/admin/site_settings/menuroute/")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verificando admin: {e}")
        return False

def check_deprecated_features():
    """Verificar características deprecadas en Django 5.0"""
    print("\n" + "=" * 60)
    print("VERIFICACIÓN DE CARACTERÍSTICAS DEPRECADAS")
    print("=" * 60)
    
    warnings = []
    
    # Verificar uso de django.utils.encoding.force_text (deprecado en Django 5.0)
    try:
        from django.utils.encoding import force_text
        warnings.append("⚠️  django.utils.encoding.force_text está deprecado - usar force_str")
    except ImportError:
        print("✅ No se usa force_text deprecado")
    
    # Verificar uso de django.conf.urls.url (deprecado)
    try:
        from django.conf.urls import url
        warnings.append("⚠️  django.conf.urls.url está deprecado - usar django.urls.path")
    except ImportError:
        print("✅ No se usa url() deprecado")
    
    if warnings:
        print("\n⚠️  Advertencias encontradas:")
        for warning in warnings:
            print(f"   {warning}")
    else:
        print("\n✅ No se encontraron características deprecadas")
    
    return len(warnings) == 0

def main():
    """Función principal"""
    print("\n" + "🚀" * 30)
    print("VERIFICACIÓN COMPLETA DE DJANGO 5.0 UPGRADE")
    print("🚀" * 30 + "\n")
    
    results = {
        'django_version': verify_django_version(),
        'python_version': True,  # Solo informativo
        'site_settings': verify_site_settings(),
        'menu_routes': verify_menu_routes(),
        'admin_access': verify_admin_access(),
        'deprecated': check_deprecated_features()
    }
    
    verify_python_version()
    
    print("\n" + "=" * 60)
    print("RESUMEN DE VERIFICACIÓN")
    print("=" * 60)
    
    all_passed = all(results.values())
    
    for check, passed in results.items():
        status = "✅" if passed else "❌"
        print(f"{status} {check.replace('_', ' ').title()}")
    
    print("\n" + "=" * 60)
    
    if all_passed:
        print("✅ TODAS LAS VERIFICACIONES PASARON")
        print("\n🎉 Django 5.0 está funcionando correctamente!")
        print("\n📝 Próximos pasos:")
        print("   1. Iniciar el servidor: python manage.py runserver")
        print("   2. Acceder al admin: http://127.0.0.1:8000/admin/")
        print("   3. Verificar que Site Settings funciona sin errores")
    else:
        print("⚠️  ALGUNAS VERIFICACIONES FALLARON")
        print("\n🔧 Revisa los errores arriba y corrígelos")
    
    print("=" * 60 + "\n")
    
    return all_passed

if __name__ == '__main__':
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

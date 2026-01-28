"""
Script para actualizar el menú: eliminar Clips y cambiar Reels a Clips
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.site_settings.models import MenuRoute

def update_menu():
    print("🔄 Actualizando menú...")
    
    # 1. Eliminar la entrada de 'clips'
    try:
        clips_route = MenuRoute.objects.get(route_key='clips')
        clips_route.delete()
        print("✅ Eliminada entrada 'clips'")
    except MenuRoute.DoesNotExist:
        print("ℹ️  No existe entrada 'clips' para eliminar")
    
    # 2. Actualizar 'reels' para que se llame 'Clips' y apunte a /clips
    try:
        reels_route = MenuRoute.objects.get(route_key='reels')
        reels_route.label = 'Clips'
        reels_route.path = '/clips'  # Cambiar la ruta a /clips
        reels_route.order = 5  # Ajustar el orden
        reels_route.save()
        print(f"✅ Actualizada entrada 'reels' a label='Clips', path='/clips' (order={reels_route.order})")
    except MenuRoute.DoesNotExist:
        print("❌ No existe entrada 'reels' para actualizar")
        return
    
    # 3. Ajustar el orden de las demás rutas
    routes_to_update = [
        ('live', 6),
        ('communities', 7),
        ('classifieds', 8),
        ('donations', 9),
        ('habil-news', 10),
        ('messages', 11),
        ('settings', 12),
    ]
    
    for route_key, new_order in routes_to_update:
        try:
            route = MenuRoute.objects.get(route_key=route_key)
            route.order = new_order
            route.save()
            print(f"✅ Actualizado orden de '{route.label}' a {new_order}")
        except MenuRoute.DoesNotExist:
            print(f"⚠️  No existe entrada '{route_key}'")
    
    print("\n✅ Menú actualizado correctamente!")
    print("\nRutas actuales:")
    for route in MenuRoute.objects.filter(is_enabled=True).order_by('order'):
        print(f"  {route.order}. {route.label} ({route.route_key}) -> {route.path}")

if __name__ == '__main__':
    update_menu()

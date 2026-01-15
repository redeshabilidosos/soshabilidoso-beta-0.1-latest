#!/usr/bin/env python
"""
Script para verificar la foto de portada del usuario
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def main():
    print("\n" + "="*60)
    print("  Verificación de Foto de Portada")
    print("="*60 + "\n")
    
    try:
        user = User.objects.get(username='molo')
        
        print(f"Usuario: {user.username}")
        print(f"Display Name: {user.display_name}")
        print(f"\nCampo cover_photo: {user.cover_photo}")
        print(f"Tipo: {type(user.cover_photo)}")
        
        if user.cover_photo:
            print(f"\n✅ Tiene foto de portada")
            print(f"   Ruta: {user.cover_photo}")
            print(f"   URL: {user.cover_photo.url if user.cover_photo else 'N/A'}")
            
            # Verificar si el archivo existe
            if user.cover_photo:
                file_path = user.cover_photo.path
                exists = os.path.exists(file_path)
                print(f"   Archivo existe: {'✅ Sí' if exists else '❌ No'}")
                if exists:
                    size = os.path.getsize(file_path)
                    print(f"   Tamaño: {size} bytes ({size/1024:.2f} KB)")
        else:
            print(f"\n❌ No tiene foto de portada")
        
        # Verificar el serializer
        print(f"\n" + "="*60)
        print("  Datos del Serializer")
        print("="*60 + "\n")
        
        from apps.authentication.serializers import UserProfileSerializer
        from rest_framework.request import Request
        from django.test import RequestFactory
        
        factory = RequestFactory()
        request = factory.get('/')
        
        serializer = UserProfileSerializer(user, context={'request': request})
        data = serializer.data
        
        print(f"cover_photo: {data.get('cover_photo')}")
        print(f"cover_photo_url: {data.get('cover_photo_url')}")
        
    except User.DoesNotExist:
        print("❌ Usuario 'molo' no encontrado")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

"""
Script para crear álbumes de fotos de perfil y portada para usuarios existentes
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from apps.media_storage.models import MediaFile, MediaAlbum

User = get_user_model()

def create_profile_albums():
    """Crear álbumes de perfil y portada para todos los usuarios"""
    
    users = User.objects.filter(is_active=True)
    print(f"📸 Procesando {users.count()} usuarios...")
    
    for user in users:
        print(f"\n👤 Usuario: {user.username}")
        
        # Crear álbum de fotos de perfil
        if user.avatar:
            create_album_with_photo(user, user.avatar, 'Fotos de Perfil')
        else:
            # Crear álbum vacío
            album, created = MediaAlbum.objects.get_or_create(
                owner=user,
                name='Fotos de Perfil',
                defaults={
                    'description': f'Fotos de perfil de {user.display_name}',
                    'is_public': True
                }
            )
            if created:
                print(f"  ✅ Álbum 'Fotos de Perfil' creado (vacío)")
        
        # Crear álbum de fotos de portada
        if user.cover_photo:
            create_album_with_photo(user, user.cover_photo, 'Fotos de Portada')
        else:
            # Crear álbum vacío
            album, created = MediaAlbum.objects.get_or_create(
                owner=user,
                name='Fotos de Portada',
                defaults={
                    'description': f'Fotos de portada de {user.display_name}',
                    'is_public': True
                }
            )
            if created:
                print(f"  ✅ Álbum 'Fotos de Portada' creado (vacío)")
    
    print(f"\n✅ Proceso completado!")

def create_album_with_photo(user, image_field, album_name):
    """Crear álbum y agregar la foto actual"""
    try:
        # Obtener o crear el álbum
        album, created = MediaAlbum.objects.get_or_create(
            owner=user,
            name=album_name,
            defaults={
                'description': f'{album_name} de {user.display_name}',
                'is_public': True
            }
        )
        
        if created:
            print(f"  ✅ Álbum '{album_name}' creado")
        
        # Verificar si ya tiene fotos en el álbum
        if album.files.count() > 0:
            print(f"  ℹ️ Álbum '{album_name}' ya tiene {album.files.count()} fotos")
            return
        
        # Obtener información del archivo
        original_name = os.path.basename(image_field.name)
        
        # Determinar el tipo MIME
        ext = os.path.splitext(original_name)[1].lower()
        mime_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }
        mime_type = mime_types.get(ext, 'image/jpeg')
        
        # Leer el contenido del archivo
        try:
            image_field.seek(0)
            file_content = image_field.read()
            image_field.seek(0)
        except Exception as e:
            print(f"  ⚠️ No se pudo leer el archivo: {e}")
            return
        
        # Crear el registro de MediaFile
        media_file = MediaFile.objects.create(
            file_type='image',
            original_name=original_name,
            file_size=len(file_content),
            mime_type=mime_type,
            uploaded_by=user,
            is_public=True
        )
        
        # Guardar el archivo
        media_file.file.save(original_name, ContentFile(file_content), save=True)
        
        # Agregar al álbum
        album.files.add(media_file)
        
        print(f"  ✅ Foto agregada al álbum '{album_name}'")
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    create_profile_albums()

#!/usr/bin/env python3
"""
Script para probar específicamente la subida de foto de portada
"""
import requests
import os

# Configuración
API_BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{API_BASE_URL}/auth/login/'
UPLOAD_COVER_URL = f'{API_BASE_URL}/auth/upload-cover/'
PROFILE_URL = f'{API_BASE_URL}/auth/profile/'

def test_cover_upload():
    print('🧪 Probando subida de foto de portada...')
    print('=' * 50)
    
    # 1. Login
    print('1. Iniciando sesión...')
    login_data = {
        'email': 'molo@molo.com',
        'password': 'molo123456'
    }
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        response.raise_for_status()
        
        login_result = response.json()
        access_token = login_result['access']
        print(f'✅ Login exitoso')
        
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        
        # 2. Verificar perfil antes
        print('\n2. Verificando perfil antes de subir...')
        response = requests.get(PROFILE_URL, headers=headers)
        if response.status_code == 200:
            profile_before = response.json()
            print(f'Cover photo antes: {profile_before.get("cover_photo", "No definido")}')
            print(f'Cover photo URL antes: {profile_before.get("cover_photo_url", "No definido")}')
        
        # 3. Crear imagen de prueba
        print('\n3. Creando imagen de prueba...')
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xdd\x8d\xb4\x1c\x00\x00\x00\x00IEND\xaeB`\x82'
        
        with open('test_cover_image.png', 'wb') as f:
            f.write(png_data)
        print('✅ Imagen de prueba creada')
        
        # 4. Subir foto de portada
        print('\n4. Subiendo foto de portada...')
        
        with open('test_cover_image.png', 'rb') as f:
            files = {'cover_photo': ('test_cover.png', f, 'image/png')}
            response = requests.post(UPLOAD_COVER_URL, headers=headers, files=files)
            
            print(f'Status Code: {response.status_code}')
            print(f'Response Headers: {dict(response.headers)}')
            print(f'Response Body: {response.text}')
            
            if response.status_code == 200:
                result = response.json()
                print('✅ Respuesta exitosa del servidor')
                print(f'Mensaje: {result.get("message")}')
                print(f'Cover Photo URL: {result.get("cover_photo_url")}')
                
                if 'user' in result:
                    user_data = result['user']
                    print(f'Usuario actualizado - Cover Photo: {user_data.get("cover_photo")}')
                    print(f'Usuario actualizado - Cover Photo URL: {user_data.get("cover_photo_url")}')
            else:
                print(f'❌ Error en la subida: {response.text}')
        
        # 5. Verificar perfil después
        print('\n5. Verificando perfil después de subir...')
        response = requests.get(PROFILE_URL, headers=headers)
        if response.status_code == 200:
            profile_after = response.json()
            print(f'Cover photo después: {profile_after.get("cover_photo", "No definido")}')
            print(f'Cover photo URL después: {profile_after.get("cover_photo_url", "No definido")}')
            
            # Comparar antes y después
            cover_before = profile_before.get("cover_photo")
            cover_after = profile_after.get("cover_photo")
            
            if cover_before != cover_after:
                print('✅ La foto de portada se actualizó correctamente en la base de datos')
            else:
                print('❌ La foto de portada NO se actualizó en la base de datos')
        
        # 6. Verificar archivo físico
        print('\n6. Verificando archivos físicos...')
        import glob
        cover_files = glob.glob('backend/media/covers/*')
        print(f'Archivos en covers/: {len(cover_files)}')
        for file in cover_files[-3:]:  # Mostrar los últimos 3
            print(f'  • {os.path.basename(file)}')
        
        # Limpiar
        if os.path.exists('test_cover_image.png'):
            os.remove('test_cover_image.png')
        
        print('\n🎉 Prueba completada')
        
    except requests.exceptions.RequestException as e:
        print(f'❌ Error en la petición: {e}')
    except Exception as e:
        print(f'❌ Error general: {e}')

if __name__ == '__main__':
    test_cover_upload()
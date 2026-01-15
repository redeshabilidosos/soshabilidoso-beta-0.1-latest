#!/usr/bin/env python3
"""
Script para probar la subida de archivos
"""
import requests
import os

# Configuración
API_BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{API_BASE_URL}/auth/login/'
UPLOAD_AVATAR_URL = f'{API_BASE_URL}/auth/upload-avatar/'
UPLOAD_COVER_URL = f'{API_BASE_URL}/auth/upload-cover/'

def test_upload():
    print('🧪 Probando subida de archivos...')
    print('=' * 50)
    
    # 1. Login para obtener token
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
        print(f'✅ Login exitoso. Token obtenido.')
        
        # Headers con token
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        
        # 2. Crear una imagen de prueba (1x1 pixel PNG)
        print('\n2. Creando imagen de prueba...')
        
        # Crear un PNG mínimo de 1x1 pixel
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xdd\x8d\xb4\x1c\x00\x00\x00\x00IEND\xaeB`\x82'
        
        # Guardar temporalmente
        with open('test_image.png', 'wb') as f:
            f.write(png_data)
        
        print('✅ Imagen de prueba creada.')
        
        # 3. Probar subida de avatar
        print('\n3. Probando subida de avatar...')
        
        with open('test_image.png', 'rb') as f:
            files = {'avatar': ('test_avatar.png', f, 'image/png')}
            response = requests.post(UPLOAD_AVATAR_URL, headers=headers, files=files)
            
            print(f'Status Code: {response.status_code}')
            print(f'Response: {response.text}')
            
            if response.status_code == 200:
                print('✅ Avatar subido exitosamente')
            else:
                print('❌ Error subiendo avatar')
        
        # 4. Probar subida de portada
        print('\n4. Probando subida de foto de portada...')
        
        with open('test_image.png', 'rb') as f:
            files = {'cover_photo': ('test_cover.png', f, 'image/png')}
            response = requests.post(UPLOAD_COVER_URL, headers=headers, files=files)
            
            print(f'Status Code: {response.status_code}')
            print(f'Response: {response.text}')
            
            if response.status_code == 200:
                print('✅ Foto de portada subida exitosamente')
            else:
                print('❌ Error subiendo foto de portada')
        
        # 5. Verificar perfil actualizado
        print('\n5. Verificando perfil actualizado...')
        profile_response = requests.get(f'{API_BASE_URL}/auth/profile/', headers=headers)
        
        if profile_response.status_code == 200:
            profile_data = profile_response.json()
            print(f'Avatar: {profile_data.get("avatar", "No definido")}')
            print(f'Cover Photo: {profile_data.get("cover_photo", "No definido")}')
        else:
            print('❌ Error obteniendo perfil')
        
        # Limpiar archivo temporal
        if os.path.exists('test_image.png'):
            os.remove('test_image.png')
        
        print('\n🎉 Pruebas completadas')
        
    except requests.exceptions.RequestException as e:
        print(f'❌ Error en la petición: {e}')
    except Exception as e:
        print(f'❌ Error general: {e}')

if __name__ == '__main__':
    test_upload()
#!/usr/bin/env python3
"""
Script para probar las APIs de posts
"""
import requests
import json

# Configuración
API_BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{API_BASE_URL}/auth/login/'
POSTS_URL = f'{API_BASE_URL}/posts/'

def test_posts_api():
    print('🧪 Probando APIs de posts...')
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
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        # 2. Crear un post
        print('\n2. Creando un post...')
        post_data = {
            'content': '¡Mi primer post en SOS-HABILIDOSO! 🚀⚽',
            'post_type': 'text',
            'category': 'football',
            'is_public': True,
            'allow_comments': True
        }
        
        response = requests.post(POSTS_URL, json=post_data, headers=headers)
        print(f'Status: {response.status_code}')
        
        if response.status_code == 201:
            post = response.json()
            post_id = post['id']
            print(f'✅ Post creado: {post_id}')
            print(f'Contenido: {post["content"]}')
            
            # 3. Dar like al post
            print('\n3. Dando like al post...')
            reaction_data = {'reaction_type': 'like'}
            reaction_url = f'{POSTS_URL}{post_id}/react/'
            
            response = requests.post(reaction_url, json=reaction_data, headers=headers)
            print(f'Status: {response.status_code}')
            
            if response.status_code == 201:
                print('✅ Like agregado')
                result = response.json()
                print(f'Likes: {result["counts"]["likes_count"]}')
            
            # 4. Comentar el post
            print('\n4. Comentando el post...')
            comment_data = {
                'content': '¡Excelente post! Me encanta esta plataforma 👏'
            }
            comment_url = f'{POSTS_URL}{post_id}/comments/'
            
            response = requests.post(comment_url, json=comment_data, headers=headers)
            print(f'Status: {response.status_code}')
            
            if response.status_code == 201:
                comment = response.json()
                comment_id = comment['id']
                print(f'✅ Comentario creado: {comment_id}')
                print(f'Contenido: {comment["content"]}')
                
                # 5. Dar like al comentario
                print('\n5. Dando like al comentario...')
                comment_like_url = f'{API_BASE_URL}/posts/comments/{comment_id}/like/'
                
                response = requests.post(comment_like_url, headers=headers)
                print(f'Status: {response.status_code}')
                
                if response.status_code == 201:
                    print('✅ Like al comentario agregado')
            
            # 6. Obtener el feed
            print('\n6. Obteniendo feed de posts...')
            response = requests.get(POSTS_URL, headers=headers)
            print(f'Status: {response.status_code}')
            
            if response.status_code == 200:
                posts = response.json()
                print(f'✅ Feed obtenido: {len(posts["results"])} posts')
                
                for post in posts['results']:
                    print(f'  • {post["content"][:50]}...')
                    print(f'    Likes: {post["likes_count"]}, Comentarios: {post["comments_count"]}')
            
            # 7. Compartir post
            print('\n7. Compartiendo post...')
            share_url = f'{POSTS_URL}{post_id}/share/'
            share_data = {'message': 'Compartiendo este excelente post!'}
            
            response = requests.post(share_url, json=share_data, headers=headers)
            print(f'Status: {response.status_code}')
            
            if response.status_code == 201:
                print('✅ Post compartido')
            
            print('\n🎉 Todas las pruebas de posts completadas exitosamente!')
            
        else:
            print(f'❌ Error creando post: {response.text}')
            
    except requests.exceptions.RequestException as e:
        print(f'❌ Error en la petición: {e}')
    except Exception as e:
        print(f'❌ Error general: {e}')

if __name__ == '__main__':
    test_posts_api()
"""
Script para diagnosticar problemas de login
"""
import os
import sys
import django
import requests
import json

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def check_users():
    """Verificar usuarios en la base de datos"""
    print("\n" + "="*80)
    print("USUARIOS EN LA BASE DE DATOS")
    print("="*80 + "\n")
    
    users = User.objects.all()[:10]
    
    if not users:
        print("❌ No hay usuarios en la base de datos")
        return []
    
    print(f"✅ Total de usuarios: {User.objects.count()}\n")
    
    user_list = []
    for user in users:
        print(f"Usuario: {user.username}")
        print(f"  - Email: {user.email}")
        print(f"  - Display Name: {user.display_name}")
        print(f"  - Is Active: {user.is_active}")
        print(f"  - Has usable password: {user.has_usable_password()}")
        print()
        user_list.append({
            'username': user.username,
            'email': user.email,
            'display_name': user.display_name
        })
    
    return user_list

def test_password(username, password):
    """Probar si una contraseña funciona para un usuario"""
    try:
        user = User.objects.get(username=username)
        is_valid = user.check_password(password)
        print(f"  - Contraseña '{password}' para {username}: {'✅ VÁLIDA' if is_valid else '❌ INVÁLIDA'}")
        return is_valid
    except User.DoesNotExist:
        print(f"  - Usuario {username} no existe")
        return False

def test_login_api(login, password):
    """Probar login a través de la API"""
    print(f"\n{'='*80}")
    print(f"PROBANDO LOGIN API: {login}")
    print("="*80 + "\n")
    
    url = "http://127.0.0.1:8000/api/auth/login/"
    
    payload = {
        "login": login,
        "password": password
    }
    
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ LOGIN EXITOSO")
            return True
        else:
            print("\n❌ LOGIN FALLIDO")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: No se pudo conectar al servidor")
        print("   Asegúrate de que el servidor Django esté corriendo en http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

def reset_user_password(username, new_password):
    """Resetear contraseña de un usuario"""
    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        print(f"✅ Contraseña actualizada para {username}")
        return True
    except User.DoesNotExist:
        print(f"❌ Usuario {username} no existe")
        return False

def main():
    print("\n" + "="*80)
    print("DIAGNÓSTICO DE LOGIN")
    print("="*80)
    
    # 1. Verificar usuarios
    users = check_users()
    
    if not users:
        print("\n⚠️  No hay usuarios para probar")
        return
    
    # 2. Probar contraseñas comunes
    print("\n" + "="*80)
    print("PROBANDO CONTRASEÑAS COMUNES")
    print("="*80 + "\n")
    
    common_passwords = ['password123', 'admin123', 'test123', '12345678']
    
    for user in users[:3]:  # Probar solo los primeros 3 usuarios
        username = user['username']
        print(f"Usuario: {username}")
        for pwd in common_passwords:
            test_password(username, pwd)
        print()
    
    # 3. Ofrecer resetear contraseña
    print("\n" + "="*80)
    print("RESETEAR CONTRASEÑA")
    print("="*80 + "\n")
    
    if users:
        first_user = users[0]['username']
        print(f"¿Quieres resetear la contraseña del usuario '{first_user}' a 'password123'?")
        print("Ejecuta: python backend/test_login_debug.py reset")
        
    # 4. Si se pasa argumento 'reset', resetear contraseña
    if len(sys.argv) > 1 and sys.argv[1] == 'reset':
        if users:
            username = users[0]['username']
            reset_user_password(username, 'password123')
            print(f"\n✅ Ahora puedes intentar login con:")
            print(f"   Username/Email: {username}")
            print(f"   Password: password123")
            
            # Probar login
            test_login_api(username, 'password123')
    
    # 5. Si se pasa argumento 'test', probar login
    elif len(sys.argv) > 1 and sys.argv[1] == 'test':
        if users:
            username = users[0]['username']
            test_login_api(username, 'password123')
    
    print("\n" + "="*80)
    print("COMANDOS DISPONIBLES")
    print("="*80)
    print("python backend/test_login_debug.py          # Ver usuarios")
    print("python backend/test_login_debug.py reset    # Resetear contraseña")
    print("python backend/test_login_debug.py test     # Probar login API")
    print()

if __name__ == '__main__':
    main()

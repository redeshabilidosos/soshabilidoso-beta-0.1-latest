#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para importar usuarios desde csvemailequipo_with_usernames.csv a la base de datos
"""

import os
import sys
import csv
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db import transaction
from django.core.exceptions import ValidationError

User = get_user_model()


def import_users_from_csv(csv_file_path):
    """
    Importa usuarios desde el archivo CSV
    """
    print(f"👥 Importando usuarios desde: {csv_file_path}")
    print("-" * 60)
    
    users_created = 0
    users_skipped = 0
    users_updated = 0
    errors = []
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row_num, row in enumerate(reader, start=2):  # Start at 2 (header is row 1)
                full_name = row.get('Nombre Completo', '').strip()
                username = row.get('Usuario', '').strip()
                password = row.get('Contraseña', '').strip()
                email = row.get('Correo Electrónico', '').strip()
                
                # Validar datos requeridos
                if not username or not email:
                    errors.append(f"Fila {row_num}: Faltan datos requeridos (username o email)")
                    users_skipped += 1
                    continue
                
                # Separar nombre completo en first_name y last_name
                name_parts = full_name.split()
                if len(name_parts) >= 2:
                    first_name = name_parts[0]
                    last_name = ' '.join(name_parts[1:])
                else:
                    first_name = full_name
                    last_name = ''
                
                try:
                    with transaction.atomic():
                        # Verificar si el usuario ya existe por email
                        user_exists_email = User.objects.filter(email=email).first()
                        user_exists_username = User.objects.filter(username=username).first()
                        
                        if user_exists_email:
                            # Actualizar usuario existente
                            user = user_exists_email
                            user.username = username
                            user.display_name = full_name
                            user.first_name = first_name
                            user.last_name = last_name
                            
                            # Solo actualizar contraseña si se proporciona
                            if password:
                                user.set_password(password)
                            
                            user.save()
                            users_updated += 1
                            print(f"  ↻ Actualizado: {full_name:40} (@{username})")
                            
                        elif user_exists_username:
                            # Username existe pero email diferente - skip
                            errors.append(f"Fila {row_num}: Username '{username}' ya existe con otro email")
                            users_skipped += 1
                            continue
                            
                        else:
                            # Crear nuevo usuario
                            user = User.objects.create_user(
                                username=username,
                                email=email,
                                password=password if password else 'temporal123',  # Contraseña temporal si no se proporciona
                                display_name=full_name,
                                first_name=first_name,
                                last_name=last_name,
                                is_active=True,
                                email_verified=True,  # Marcar como verificado
                            )
                            users_created += 1
                            print(f"  ✓ Creado: {full_name:40} (@{username})")
                
                except ValidationError as e:
                    errors.append(f"Fila {row_num}: Error de validación - {str(e)}")
                    users_skipped += 1
                    
                except Exception as e:
                    errors.append(f"Fila {row_num}: Error inesperado - {str(e)}")
                    users_skipped += 1
    
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo {csv_file_path}")
        return
    
    except Exception as e:
        print(f"❌ Error leyendo archivo: {e}")
        return
    
    # Mostrar resumen
    print("-" * 60)
    print(f"✅ Importación completada")
    print(f"📊 Estadísticas:")
    print(f"   - Usuarios creados: {users_created}")
    print(f"   - Usuarios actualizados: {users_updated}")
    print(f"   - Usuarios omitidos: {users_skipped}")
    print(f"   - Total procesado: {users_created + users_updated + users_skipped}")
    
    if errors:
        print(f"\n⚠️  Errores encontrados ({len(errors)}):")
        for error in errors[:10]:  # Mostrar solo los primeros 10 errores
            print(f"   - {error}")
        if len(errors) > 10:
            print(f"   ... y {len(errors) - 10} errores más")
    
    # Mostrar total de usuarios en la base de datos
    total_users = User.objects.count()
    print(f"\n📈 Total de usuarios en la base de datos: {total_users}")


def verify_import():
    """
    Verifica la importación mostrando algunos usuarios
    """
    print("\n🔍 Verificando importación...")
    print("-" * 60)
    
    # Mostrar últimos 5 usuarios creados
    recent_users = User.objects.order_by('-created_at')[:5]
    
    if recent_users:
        print("Últimos 5 usuarios creados:")
        for user in recent_users:
            print(f"  - {user.display_name:40} (@{user.username:20}) {user.email}")
    else:
        print("No se encontraron usuarios")


if __name__ == "__main__":
    # Ruta del archivo CSV
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    csv_file = os.path.join(project_root, '..', 'public', 'csvemailequipo_with_usernames.csv')
    
    # Normalizar la ruta
    csv_file = os.path.normpath(csv_file)
    
    # Verificar que el archivo existe
    if not os.path.exists(csv_file):
        print(f"❌ Error: No se encontró el archivo {csv_file}")
        print(f"📁 Buscando en: {csv_file}")
        exit(1)
    
    # Importar usuarios
    import_users_from_csv(csv_file)
    
    # Verificar importación
    verify_import()
    
    print("\n✨ Proceso completado!")

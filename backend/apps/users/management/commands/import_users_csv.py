"""
Comando de Django para importar usuarios desde CSV
"""
import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.core.exceptions import ValidationError

User = get_user_model()


class Command(BaseCommand):
    help = 'Importa usuarios desde csvemailequipo_with_usernames.csv'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='public/csvemailequipo_with_usernames.csv',
            help='Ruta del archivo CSV'
        )

    def handle(self, *args, **options):
        csv_file = options['file']
        
        # Construir ruta completa
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        csv_path = os.path.join(base_dir, csv_file)
        
        self.stdout.write(self.style.SUCCESS(f'👥 Importando usuarios desde: {csv_path}'))
        self.stdout.write('-' * 60)
        
        users_created = 0
        users_skipped = 0
        users_updated = 0
        errors = []
        
        try:
            with open(csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                for row_num, row in enumerate(reader, start=2):
                    full_name = row.get('Nombre Completo', '').strip()
                    username = row.get('Usuario', '').strip()
                    password = row.get('Contraseña', '').strip()
                    email = row.get('Correo Electrónico', '').strip()
                    
                    # Validar datos requeridos
                    if not username or not email:
                        errors.append(f"Fila {row_num}: Faltan datos requeridos")
                        users_skipped += 1
                        continue
                    
                    # Separar nombre completo
                    name_parts = full_name.split()
                    if len(name_parts) >= 2:
                        first_name = name_parts[0]
                        last_name = ' '.join(name_parts[1:])
                    else:
                        first_name = full_name
                        last_name = ''
                    
                    try:
                        with transaction.atomic():
                            # Verificar si existe
                            user_exists_email = User.objects.filter(email=email).first()
                            user_exists_username = User.objects.filter(username=username).first()
                            
                            if user_exists_email:
                                # Actualizar
                                user = user_exists_email
                                user.username = username
                                user.display_name = full_name
                                user.first_name = first_name
                                user.last_name = last_name
                                
                                if password:
                                    user.set_password(password)
                                
                                user.save()
                                users_updated += 1
                                self.stdout.write(f"  ↻ Actualizado: {full_name:40} (@{username})")
                                
                            elif user_exists_username:
                                errors.append(f"Fila {row_num}: Username '{username}' ya existe")
                                users_skipped += 1
                                continue
                                
                            else:
                                # Crear nuevo
                                user = User.objects.create_user(
                                    username=username,
                                    email=email,
                                    password=password if password else 'temporal123',
                                    display_name=full_name,
                                    first_name=first_name,
                                    last_name=last_name,
                                    is_active=True,
                                    email_verified=True,
                                )
                                users_created += 1
                                self.stdout.write(self.style.SUCCESS(f"  ✓ Creado: {full_name:40} (@{username})"))
                    
                    except ValidationError as e:
                        errors.append(f"Fila {row_num}: {str(e)}")
                        users_skipped += 1
                        
                    except Exception as e:
                        errors.append(f"Fila {row_num}: {str(e)}")
                        users_skipped += 1
        
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'❌ No se encontró el archivo: {csv_path}'))
            return
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {e}'))
            return
        
        # Resumen
        self.stdout.write('-' * 60)
        self.stdout.write(self.style.SUCCESS('✅ Importación completada'))
        self.stdout.write(f'📊 Estadísticas:')
        self.stdout.write(f'   - Usuarios creados: {users_created}')
        self.stdout.write(f'   - Usuarios actualizados: {users_updated}')
        self.stdout.write(f'   - Usuarios omitidos: {users_skipped}')
        self.stdout.write(f'   - Total procesado: {users_created + users_updated + users_skipped}')
        
        if errors:
            self.stdout.write(self.style.WARNING(f'\n⚠️  Errores ({len(errors)}):'))
            for error in errors[:10]:
                self.stdout.write(f'   - {error}')
            if len(errors) > 10:
                self.stdout.write(f'   ... y {len(errors) - 10} más')
        
        # Total
        total_users = User.objects.count()
        self.stdout.write(f'\n📈 Total de usuarios en BD: {total_users}')

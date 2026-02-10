"""
Comando de Django para importar usuarios desde csvusuarios_processed.csv
"""
import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.core.exceptions import ValidationError

User = get_user_model()


class Command(BaseCommand):
    help = 'Importa usuarios desde csvusuarios_processed.csv'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='public/csvusuarios_processed.csv',
            help='Ruta del archivo CSV'
        )
        parser.add_argument(
            '--batch-size',
            type=int,
            default=100,
            help='Tamaño del lote para procesamiento'
        )

    def handle(self, *args, **options):
        csv_file = options['file']
        batch_size = options['batch_size']
        
        # Construir ruta completa
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        csv_path = os.path.join(base_dir, csv_file)
        
        self.stdout.write(self.style.SUCCESS(f'👥 Importando usuarios desde: {csv_path}'))
        self.stdout.write(f'📦 Tamaño de lote: {batch_size}')
        self.stdout.write('-' * 60)
        
        users_created = 0
        users_skipped = 0
        users_updated = 0
        errors = []
        
        try:
            with open(csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                batch_count = 0
                for row_num, row in enumerate(reader, start=2):
                    email = row.get('email', '').strip()
                    username = row.get('username', '').strip()
                    password = row.get('password', '').strip()
                    nombre_completo = row.get('nombre_completo', '').strip()
                    
                    # Validar datos requeridos
                    if not username or not email or not password:
                        errors.append(f"Fila {row_num}: Faltan datos requeridos (email, username o password)")
                        users_skipped += 1
                        continue
                    
                    # Validar formato de email
                    if '@' not in email:
                        errors.append(f"Fila {row_num}: Email inválido '{email}'")
                        users_skipped += 1
                        continue
                    
                    # Si nombre_completo está vacío, usar username como display_name temporal
                    display_name = nombre_completo if nombre_completo else username
                    
                    try:
                        with transaction.atomic():
                            # Verificar si existe por email
                            user_exists_email = User.objects.filter(email=email).first()
                            
                            if user_exists_email:
                                # Actualizar usuario existente
                                user = user_exists_email
                                
                                # Solo actualizar si el username no está en uso por otro usuario
                                if User.objects.filter(username=username).exclude(id=user.id).exists():
                                    errors.append(f"Fila {row_num}: Username '{username}' ya existe para otro usuario")
                                    users_skipped += 1
                                    continue
                                
                                user.username = username
                                user.display_name = display_name
                                user.set_password(password)
                                user.save()
                                
                                users_updated += 1
                                if batch_count % 50 == 0:
                                    self.stdout.write(f"  ↻ Actualizado: {email:45} (@{username})")
                                
                            else:
                                # Verificar si el username ya existe
                                if User.objects.filter(username=username).exists():
                                    errors.append(f"Fila {row_num}: Username '{username}' ya existe")
                                    users_skipped += 1
                                    continue
                                
                                # Crear nuevo usuario
                                user = User.objects.create_user(
                                    username=username,
                                    email=email,
                                    password=password,
                                    display_name=display_name,
                                    first_name='',
                                    last_name='',
                                    is_active=True,
                                    email_verified=False,  # No verificado hasta que complete su perfil
                                )
                                
                                users_created += 1
                                if batch_count % 50 == 0:
                                    self.stdout.write(self.style.SUCCESS(f"  ✓ Creado: {email:45} (@{username})"))
                            
                            batch_count += 1
                            
                            # Mostrar progreso cada batch_size registros
                            if batch_count % batch_size == 0:
                                self.stdout.write(self.style.WARNING(f"📊 Progreso: {batch_count} registros procesados..."))
                    
                    except ValidationError as e:
                        errors.append(f"Fila {row_num}: Validación - {str(e)}")
                        users_skipped += 1
                        
                    except Exception as e:
                        errors.append(f"Fila {row_num}: Error - {str(e)}")
                        users_skipped += 1
        
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'❌ No se encontró el archivo: {csv_path}'))
            return
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error leyendo archivo: {e}'))
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
            for error in errors[:20]:
                self.stdout.write(f'   - {error}')
            if len(errors) > 20:
                self.stdout.write(f'   ... y {len(errors) - 20} más')
        
        # Total
        total_users = User.objects.count()
        self.stdout.write(f'\n📈 Total de usuarios en BD: {total_users}')
        
        # Recordatorio
        self.stdout.write(self.style.WARNING('\n💡 Nota: Los usuarios con nombre_completo vacío deben completarlo en su primer acceso'))

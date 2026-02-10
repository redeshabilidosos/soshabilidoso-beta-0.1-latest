#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para generar usernames únicos para el archivo csvemailequipo.csv
Genera usernames basados en el nombre completo de cada persona
"""

import csv
import re
import os
import unicodedata

def remove_accents(text):
    """Elimina acentos y caracteres especiales"""
    # Normalizar el texto (descomponer caracteres acentuados)
    nfkd = unicodedata.normalize('NFKD', text)
    # Filtrar solo caracteres ASCII
    return ''.join([c for c in nfkd if not unicodedata.combining(c)])

def generate_username(full_name, existing_usernames):
    """
    Genera un username único basado en el nombre completo
    Estrategia:
    1. Intenta: nombre.apellido
    2. Si existe: nombre.apellido2
    3. Si existe: nombre.apellido.numero
    """
    # Limpiar y normalizar el nombre
    full_name = full_name.strip()
    full_name = remove_accents(full_name)
    
    # Dividir el nombre en partes
    parts = full_name.lower().split()
    
    if len(parts) == 0:
        return "usuario" + str(len(existing_usernames))
    
    # Eliminar caracteres especiales y espacios
    parts = [re.sub(r'[^a-z0-9]', '', part) for part in parts if part]
    
    if len(parts) == 0:
        return "usuario" + str(len(existing_usernames))
    
    # Estrategia 1: nombre.apellido
    if len(parts) >= 2:
        username = f"{parts[0]}.{parts[1]}"
    else:
        username = parts[0]
    
    # Si el username ya existe, probar variaciones
    original_username = username
    counter = 1
    
    while username in existing_usernames:
        if len(parts) >= 3:
            # Intentar con segundo apellido
            username = f"{parts[0]}.{parts[1]}.{parts[2]}"
            if username not in existing_usernames:
                break
        
        # Si aún existe, agregar número
        username = f"{original_username}{counter}"
        counter += 1
    
    return username

def process_team_csv(input_file, output_file):
    """
    Procesa el archivo CSV del equipo y genera usernames
    """
    print(f"👥 Procesando archivo: {input_file}")
    print(f"📝 Archivo de salida: {output_file}")
    print("-" * 60)
    
    existing_usernames = set()
    rows = []
    usernames_generated = 0
    
    # Leer el archivo CSV
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                full_name = row.get('Nombre Completo', '').strip()
                username = row.get('Usuario', '').strip()
                password = row.get('Contraseña', '').strip()
                email = row.get('Correo Electrónico', '').strip()
                
                # Si no tiene username, generar uno
                if not username:
                    username = generate_username(full_name, existing_usernames)
                    usernames_generated += 1
                    print(f"  ✓ {full_name:40} -> @{username}")
                
                existing_usernames.add(username)
                
                rows.append({
                    'Nombre Completo': full_name,
                    'Usuario': username,
                    'Contraseña': password,
                    'Correo Electrónico': email
                })
    
    except Exception as e:
        print(f"❌ Error leyendo archivo: {e}")
        return
    
    # Guardar el archivo con usernames
    try:
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['Nombre Completo', 'Usuario', 'Contraseña', 'Correo Electrónico']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            
            writer.writeheader()
            writer.writerows(rows)
        
        print("-" * 60)
        print(f"✅ Archivo guardado exitosamente")
        print(f"📊 Estadísticas:")
        print(f"   - Total de registros: {len(rows)}")
        print(f"   - Usernames generados: {usernames_generated}")
        print(f"   - Usernames únicos: {len(existing_usernames)}")
        
    except Exception as e:
        print(f"❌ Error guardando archivo: {e}")

def validate_usernames(file_path):
    """
    Valida que todos los usernames sean únicos
    """
    print("\n🔍 Validando usernames...")
    print("-" * 60)
    
    usernames = []
    duplicates = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                username = row.get('Usuario', '').strip()
                if username in usernames:
                    duplicates.append(username)
                usernames.append(username)
        
        if duplicates:
            print(f"⚠️  Se encontraron {len(duplicates)} usernames duplicados:")
            for dup in set(duplicates):
                print(f"   - @{dup}")
        else:
            print(f"✅ Todos los usernames son únicos ({len(usernames)} registros)")
    
    except Exception as e:
        print(f"❌ Error validando archivo: {e}")

if __name__ == "__main__":
    # Rutas de archivos
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    
    input_file = os.path.join(project_root, 'public', 'csvemailequipo.csv')
    output_file = os.path.join(project_root, 'public', 'csvemailequipo_with_usernames.csv')
    
    # Verificar que el archivo existe
    if not os.path.exists(input_file):
        print(f"❌ Error: No se encontró el archivo {input_file}")
        exit(1)
    
    # Procesar archivo
    process_team_csv(input_file, output_file)
    
    # Validar usernames
    validate_usernames(output_file)
    
    print("\n✨ Proceso completado!")
    print(f"📁 Archivo con usernames: {output_file}")

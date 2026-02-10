#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para procesar csvusuaruios.csv:
1. Corregir emails
2. Generar usernames únicos
3. Preparar para importación
"""

import csv
import re
import os
import unicodedata

def remove_accents(text):
    """Elimina acentos y caracteres especiales"""
    nfkd = unicodedata.normalize('NFKD', text)
    return ''.join([c for c in nfkd if not unicodedata.combining(c)])

def fix_email(email):
    """Corrige errores comunes en emails"""
    email = email.strip().lower()
    
    # Diccionario de correcciones
    domain_corrections = {
        'gmai.com': 'gmail.com',
        'gamil.com': 'gmail.com',
        'gimail.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'gmail.comm': 'gmail.com',
        'gmail.con': 'gmail.com',
        'hotmail.es': 'hotmail.com',
        'hotmail.it': 'hotmail.com',
    }
    
    if '@' in email:
        parts = email.split('@')
        if len(parts) == 2:
            user, domain = parts
            user = user.strip()
            domain = domain.strip()
            
            if domain in domain_corrections:
                domain = domain_corrections[domain]
                print(f"  ✓ Corregido: {email} -> {user}@{domain}")
            
            email = f"{user}@{domain}"
    
    return email

def generate_username_from_email(email, existing_usernames):
    """
    Genera un username único basado en el email
    Estrategia:
    1. Toma la parte antes del @
    2. Limpia caracteres especiales
    3. Si existe, agrega números
    """
    if '@' not in email:
        return f"user{len(existing_usernames)}"
    
    # Obtener parte antes del @
    username_base = email.split('@')[0]
    
    # Limpiar caracteres especiales
    username_base = remove_accents(username_base)
    username_base = re.sub(r'[^a-z0-9_]', '', username_base.lower())
    
    # Limitar longitud
    username_base = username_base[:20]
    
    if not username_base:
        username_base = "user"
    
    # Verificar unicidad
    username = username_base
    counter = 1
    
    while username in existing_usernames:
        username = f"{username_base}{counter}"
        counter += 1
    
    return username

def process_csv(input_file, output_file):
    """Procesa el archivo CSV"""
    print(f"📧 Procesando archivo: {input_file}")
    print(f"📝 Archivo de salida: {output_file}")
    print("-" * 60)
    
    emails_originales = []
    rows_procesados = []
    existing_usernames = set()
    existing_emails = set()
    
    correcciones = 0
    duplicados = 0
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                email = row.get('email', '').strip()
                password = row.get('contraseña', '').strip()
                
                if not email:
                    continue
                
                # Corregir email
                email_original = email
                email = fix_email(email)
                
                if email != email_original:
                    correcciones += 1
                
                # Verificar duplicados
                if email in existing_emails:
                    duplicados += 1
                    print(f"  ⚠ Duplicado: {email}")
                    continue
                
                existing_emails.add(email)
                
                # Generar username
                username = generate_username_from_email(email, existing_usernames)
                existing_usernames.add(username)
                
                rows_procesados.append({
                    'email': email,
                    'username': username,
                    'password': password,
                    'nombre_completo': ''  # Vacío para que el usuario lo complete
                })
                
                print(f"  ✓ {email:50} -> @{username}")
    
    except Exception as e:
        print(f"❌ Error leyendo archivo: {e}")
        return
    
    # Guardar archivo procesado
    try:
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['email', 'username', 'password', 'nombre_completo']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            
            writer.writeheader()
            writer.writerows(rows_procesados)
        
        print("-" * 60)
        print(f"✅ Archivo guardado exitosamente")
        print(f"📊 Estadísticas:")
        print(f"   - Emails procesados: {len(rows_procesados)}")
        print(f"   - Emails corregidos: {correcciones}")
        print(f"   - Duplicados eliminados: {duplicados}")
        print(f"   - Usernames generados: {len(existing_usernames)}")
        
    except Exception as e:
        print(f"❌ Error guardando archivo: {e}")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    
    input_file = os.path.join(project_root, 'public', 'csvusuaruios.csv')
    output_file = os.path.join(project_root, 'public', 'csvusuarios_processed.csv')
    
    input_file = os.path.normpath(input_file)
    output_file = os.path.normpath(output_file)
    
    if not os.path.exists(input_file):
        print(f"❌ Error: No se encontró el archivo {input_file}")
        exit(1)
    
    process_csv(input_file, output_file)
    
    print("\n✨ Proceso completado!")
    print(f"📁 Archivo procesado: {output_file}")

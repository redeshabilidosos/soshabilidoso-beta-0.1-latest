#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para corregir errores ortográficos en emails del archivo csvemails.csv
Corrige dominios mal escritos y elimina espacios
"""

import re
import os

def fix_email(email):
    """
    Corrige errores comunes en emails:
    - Elimina espacios en blanco
    - Corrige dominios mal escritos
    - Convierte a minúsculas
    """
    # Eliminar espacios en blanco
    email = email.strip()
    
    # Convertir a minúsculas
    email = email.lower()
    
    # Diccionario de correcciones comunes de dominios
    domain_corrections = {
        'gmai.com': 'gmail.com',
        'gamil.com': 'gmail.com',
        'gimail.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'gmaill.com': 'gmail.com',
        'gmail.comm': 'gmail.com',
        'gmail.con': 'gmail.com',
        'gmail.coman': 'gmail.com',
        'hotmial.com': 'hotmail.com',
        'hotmai.com': 'hotmail.com',
        'hotmail.es': 'hotmail.com',
        'hotmail.it': 'hotmail.com',
        'homail.com': 'hotmail.com',
        'outloo.com': 'outlook.com',
        'outlok.com': 'outlook.com',
        'iclou.com': 'icloud.com',
        'icoud.com': 'icloud.com',
        'yahooo.es': 'yahoo.es',
        'yaho.es': 'yahoo.es',
        'mail.com': 'gmail.com',  # Asumiendo que mail.com debería ser gmail.com
    }
    
    # Separar usuario y dominio
    if '@' in email:
        parts = email.split('@')
        if len(parts) == 2:
            user, domain = parts
            
            # Eliminar espacios del usuario y dominio
            user = user.strip()
            domain = domain.strip()
            
            # Corregir dominio si está en el diccionario
            if domain in domain_corrections:
                domain = domain_corrections[domain]
                print(f"  ✓ Corregido: {email} -> {user}@{domain}")
            
            email = f"{user}@{domain}"
    
    return email

def process_csv_file(input_file, output_file):
    """
    Procesa el archivo CSV y corrige los emails
    """
    print(f"📧 Procesando archivo: {input_file}")
    print(f"📝 Archivo de salida: {output_file}")
    print("-" * 60)
    
    emails_originales = []
    emails_corregidos = []
    emails_duplicados = set()
    correcciones = 0
    
    # Leer todos los emails
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            emails_originales = [line.strip() for line in f if line.strip()]
    except Exception as e:
        print(f"❌ Error leyendo archivo: {e}")
        return
    
    print(f"📊 Total de emails encontrados: {len(emails_originales)}")
    print("-" * 60)
    
    # Procesar cada email
    for email in emails_originales:
        email_corregido = fix_email(email)
        
        # Verificar si es diferente (fue corregido)
        if email != email_corregido:
            correcciones += 1
        
        # Verificar duplicados
        if email_corregido in emails_corregidos:
            emails_duplicados.add(email_corregido)
        else:
            emails_corregidos.append(email_corregido)
    
    # Guardar emails corregidos
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            for email in emails_corregidos:
                f.write(email + '\n')
        print("-" * 60)
        print(f"✅ Archivo guardado exitosamente")
        print(f"📊 Estadísticas:")
        print(f"   - Emails originales: {len(emails_originales)}")
        print(f"   - Emails corregidos: {correcciones}")
        print(f"   - Emails únicos: {len(emails_corregidos)}")
        print(f"   - Duplicados eliminados: {len(emails_duplicados)}")
        
        if emails_duplicados:
            print(f"\n⚠️  Emails duplicados encontrados: {len(emails_duplicados)}")
            print("   (Solo se guardó una copia de cada uno)")
            
    except Exception as e:
        print(f"❌ Error guardando archivo: {e}")

if __name__ == "__main__":
    # Rutas de archivos
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    
    input_file = os.path.join(project_root, 'public', 'csvemails.csv')
    output_file = os.path.join(project_root, 'public', 'csvemails_fixed.csv')
    
    # Verificar que el archivo existe
    if not os.path.exists(input_file):
        print(f"❌ Error: No se encontró el archivo {input_file}")
        exit(1)
    
    # Procesar archivo
    process_csv_file(input_file, output_file)
    
    print("\n✨ Proceso completado!")
    print(f"📁 Archivo corregido: {output_file}")

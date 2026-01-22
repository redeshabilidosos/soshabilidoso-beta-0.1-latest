#!/usr/bin/env python
"""
Script para activar todas las secciones y temas de learning
Ejecutar desde el directorio backend: python scripts/activar_todo_learning.py
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.learning.models import Seccion, Tema


def main():
    print("🚀 Activando todas las secciones y temas de learning...")
    print("=" * 60)
    
    # Activar todas las secciones
    secciones_actualizadas = Seccion.objects.filter(is_active=False).update(is_active=True)
    print(f"✅ Secciones activadas: {secciones_actualizadas}")
    
    # Activar todos los temas
    temas_actualizados = Tema.objects.filter(is_active=False).update(is_active=True)
    print(f"✅ Temas activados: {temas_actualizados}")
    
    # Mostrar resumen
    total_secciones = Seccion.objects.filter(is_active=True).count()
    total_temas = Tema.objects.filter(is_active=True).count()
    
    print("\n" + "=" * 60)
    print("📊 Estado actual:")
    print(f"📚 Secciones activas: {total_secciones}")
    print(f"📖 Temas activos: {total_temas}")
    
    print("\n🌐 Verifica en:")
    print("- Admin Django: http://127.0.0.1:8000/admin/learning/seccion/")
    print("- Frontend: http://localhost:3000/capacitaciones")
    print("- API: http://127.0.0.1:8000/api/learning/secciones/")
    
    print("\n✅ ¡Todas las secciones y temas están ahora activos!")
    print("Los usuarios pueden ver todo el contenido en el frontend.")


if __name__ == '__main__':
    main()
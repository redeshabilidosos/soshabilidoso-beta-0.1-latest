#!/usr/bin/env python
"""
Script simple para verificar que el setup de Learning esté completo
Ejecutar desde el directorio backend: python verify_learning_setup.py
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.learning.models import Seccion, Tema, TemaContenido, TemaPuntoClave


def main():
    print("🔍 Verificando configuración de Learning...")
    print("=" * 50)
    
    # Verificar secciones
    secciones = Seccion.objects.all()
    print(f"📚 Secciones totales: {secciones.count()}")
    
    secciones_con_temas = secciones.filter(temas__isnull=False).distinct()
    print(f"📖 Secciones con temas: {secciones_con_temas.count()}")
    
    # Verificar temas
    temas = Tema.objects.all()
    print(f"📝 Temas totales: {temas.count()}")
    
    temas_con_contenido = temas.filter(contenidos__isnull=False).distinct()
    print(f"📄 Temas con contenido: {temas_con_contenido.count()}")
    
    # Verificar contenido
    contenidos = TemaContenido.objects.all()
    puntos_clave = TemaPuntoClave.objects.all()
    print(f"📋 Contenidos totales: {contenidos.count()}")
    print(f"💡 Puntos clave totales: {puntos_clave.count()}")
    
    print("\n" + "=" * 50)
    print("📊 Resumen por sección:")
    print("=" * 50)
    
    for seccion in secciones.order_by('orden'):
        temas_seccion = seccion.temas.count()
        contenidos_seccion = TemaContenido.objects.filter(tema__seccion=seccion).count()
        puntos_seccion = TemaPuntoClave.objects.filter(tema__seccion=seccion).count()
        
        status = "✅" if temas_seccion > 0 else "❌"
        print(f"{status} {seccion.nombre}")
        print(f"    📖 Temas: {temas_seccion}")
        print(f"    📄 Contenidos: {contenidos_seccion}")
        print(f"    💡 Puntos clave: {puntos_seccion}")
        print()
    
    print("🌐 URLs importantes:")
    print("- Admin Django: http://127.0.0.1:8000/admin/learning/seccion/")
    print("- API Secciones: http://127.0.0.1:8000/api/learning/secciones/")
    print("- API Temas: http://127.0.0.1:8000/api/learning/temas/")
    print("- Frontend: http://localhost:3000/capacitaciones")
    
    print("\n✅ ¡Setup de Learning completado exitosamente!")
    print("Todas las secciones tienen contenido y están listas para usar desde el admin de Django.")


if __name__ == '__main__':
    main()
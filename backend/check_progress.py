#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings')
django.setup()

from apps.learning.models import ProgresoUsuario, Tema, Seccion
from django.contrib.auth import get_user_model

User = get_user_model()

def main():
    print("🔍 Verificando progreso de usuarios...")
    
    # Obtener primer usuario
    user = User.objects.first()
    if not user:
        print("❌ No hay usuarios en la base de datos")
        return
    
    print(f"👤 Usuario: {user.username}")
    
    # Verificar progreso total
    total_progresos = ProgresoUsuario.objects.filter(usuario=user).count()
    completados = ProgresoUsuario.objects.filter(usuario=user, estado='completado').count()
    
    print(f"📊 Total registros de progreso: {total_progresos}")
    print(f"✅ Temas completados: {completados}")
    
    # Verificar por sección
    print("\n📚 Progreso por sección:")
    secciones = Seccion.objects.all()
    for seccion in secciones:
        temas_seccion = seccion.temas.filter(is_active=True).count()
        completados_seccion = ProgresoUsuario.objects.filter(
            usuario=user,
            tema__seccion=seccion,
            estado='completado'
        ).count()
        
        porcentaje = (completados_seccion / temas_seccion * 100) if temas_seccion > 0 else 0
        print(f"  {seccion.nombre}: {completados_seccion}/{temas_seccion} ({porcentaje:.0f}%)")
    
    # Mostrar últimos progresos
    print("\n📝 Últimos progresos registrados:")
    ultimos = ProgresoUsuario.objects.filter(usuario=user).order_by('-updated_at')[:5]
    for progreso in ultimos:
        print(f"  - {progreso.tema.titulo}: {progreso.estado} ({progreso.updated_at.strftime('%Y-%m-%d %H:%M')})")

if __name__ == '__main__':
    main()
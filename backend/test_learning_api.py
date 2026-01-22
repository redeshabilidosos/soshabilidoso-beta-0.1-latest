#!/usr/bin/env python
"""
Script para verificar que la API de Learning esté funcionando correctamente
Ejecutar desde el directorio backend: python test_learning_api.py
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/learning"

def test_secciones_endpoint():
    """Probar el endpoint de secciones"""
    print("🧪 Probando endpoint de secciones...")
    
    try:
        response = requests.get(f"{BASE_URL}/secciones/")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Secciones obtenidas: {len(data)} secciones")
            
            # Mostrar las primeras 3 secciones
            for i, seccion in enumerate(data[:3]):
                print(f"   {i+1}. {seccion['nombre']} ({seccion['temas_count']} temas)")
            
            return True
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor Django")
        print("   Asegúrate de que el servidor esté corriendo en http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")
        return False


def test_temas_endpoint():
    """Probar el endpoint de temas"""
    print("\n🧪 Probando endpoint de temas...")
    
    try:
        response = requests.get(f"{BASE_URL}/temas/")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Temas obtenidos: {len(data)} temas")
            
            # Mostrar algunos temas por sección
            secciones_temas = {}
            for tema in data:
                seccion = tema['seccion']['nombre']
                if seccion not in secciones_temas:
                    secciones_temas[seccion] = []
                secciones_temas[seccion].append(tema['titulo'])
            
            for seccion, temas in list(secciones_temas.items())[:3]:
                print(f"   📚 {seccion}: {len(temas)} temas")
                for tema in temas[:2]:
                    print(f"      - {tema}")
            
            return True
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_tema_detail():
    """Probar el detalle de un tema específico"""
    print("\n🧪 Probando detalle de tema...")
    
    try:
        # Primero obtener la lista de temas para conseguir un ID
        response = requests.get(f"{BASE_URL}/temas/")
        if response.status_code != 200:
            print("❌ No se pudo obtener lista de temas")
            return False
        
        temas = response.json()
        if not temas:
            print("❌ No hay temas disponibles")
            return False
        
        # Probar el detalle del primer tema
        tema_id = temas[0]['id']
        response = requests.get(f"{BASE_URL}/temas/{tema_id}/")
        
        if response.status_code == 200:
            tema = response.json()
            print(f"✅ Detalle de tema obtenido: {tema['titulo']}")
            print(f"   📖 Sección: {tema['seccion']['nombre']}")
            print(f"   ⏱️ Duración: {tema['duracion_formateada']}")
            print(f"   📝 Contenidos: {len(tema['contenidos'])}")
            print(f"   💡 Puntos clave: {len(tema['puntos_clave'])}")
            
            return True
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_admin_access():
    """Verificar que el admin de Django esté accesible"""
    print("\n🧪 Verificando acceso al admin de Django...")
    
    try:
        response = requests.get("http://127.0.0.1:8000/admin/learning/seccion/")
        
        if response.status_code == 200:
            print("✅ Admin de Django accesible")
            print("   🌐 URL: http://127.0.0.1:8000/admin/learning/seccion/")
            return True
        elif response.status_code == 302:
            print("✅ Admin de Django accesible (redirige a login)")
            print("   🌐 URL: http://127.0.0.1:8000/admin/learning/seccion/")
            return True
        else:
            print(f"❌ Error {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def main():
    """Función principal para ejecutar todas las pruebas"""
    print("🚀 Verificando API de Learning...")
    print("=" * 50)
    
    tests = [
        test_secciones_endpoint,
        test_temas_endpoint,
        test_tema_detail,
        test_admin_access
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Resultados: {passed}/{total} pruebas pasaron")
    
    if passed == total:
        print("✅ ¡Todas las pruebas pasaron! La API de Learning está funcionando correctamente.")
        print("\n🎯 Próximos pasos:")
        print("1. Accede al admin: http://127.0.0.1:8000/admin/learning/seccion/")
        print("2. Revisa la API: http://127.0.0.1:8000/api/learning/secciones/")
        print("3. Prueba el frontend en: /capacitaciones")
    else:
        print("❌ Algunas pruebas fallaron. Revisa la configuración.")
        
        if passed == 0:
            print("\n💡 Posibles soluciones:")
            print("- Asegúrate de que el servidor Django esté corriendo")
            print("- Ejecuta: python manage.py runserver")
            print("- Verifica que la app 'learning' esté en INSTALLED_APPS")


if __name__ == '__main__':
    main()
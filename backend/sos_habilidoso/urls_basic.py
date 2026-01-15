"""
URLs básicas para probar Django
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

def api_test(request):
    """Vista de prueba para verificar que Django funciona"""
    return JsonResponse({
        'message': '¡Django está funcionando!',
        'status': 'success',
        'version': '1.0.0'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/test/', api_test, name='api_test'),
]
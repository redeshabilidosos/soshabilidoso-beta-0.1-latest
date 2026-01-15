from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SeccionViewSet, TemaViewSet, ProgresoViewSet, LogroViewSet

router = DefaultRouter()
router.register(r'secciones', SeccionViewSet, basename='seccion')
router.register(r'temas', TemaViewSet, basename='tema')
router.register(r'progreso', ProgresoViewSet, basename='progreso')
router.register(r'logros', LogroViewSet, basename='logro')

urlpatterns = [
    path('', include(router.urls)),
]

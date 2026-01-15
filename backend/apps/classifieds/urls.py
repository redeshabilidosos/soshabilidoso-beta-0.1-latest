"""
URLs para Clasificados
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductClassifiedViewSet,
    ServiceClassifiedViewSet,
    FreelancerClassifiedViewSet,
    AllClassifiedsViewSet
)

router = DefaultRouter()
router.register(r'products', ProductClassifiedViewSet, basename='products')
router.register(r'services', ServiceClassifiedViewSet, basename='services')
router.register(r'freelancer', FreelancerClassifiedViewSet, basename='freelancer')
router.register(r'all', AllClassifiedsViewSet, basename='all-classifieds')

urlpatterns = [
    path('', include(router.urls)),
]

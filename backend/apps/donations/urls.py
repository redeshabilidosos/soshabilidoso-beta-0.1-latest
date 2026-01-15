"""
URLs para el sistema de donaciones
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SportCategoryViewSet, AthleteProfileViewSet, DonationViewSet

router = DefaultRouter()
router.register(r'sports', SportCategoryViewSet, basename='sports')
router.register(r'athletes', AthleteProfileViewSet, basename='athletes')
router.register(r'donations', DonationViewSet, basename='donations')

urlpatterns = [
    path('', include(router.urls)),
]

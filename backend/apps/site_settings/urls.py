"""
URLs para configuración del sitio
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'site_settings'

router = DefaultRouter()
router.register(r'', views.SiteSettingsViewSet, basename='site-settings')
router.register(r'menu', views.MenuRouteViewSet, basename='menu')

urlpatterns = [
    path('', include(router.urls)),
]

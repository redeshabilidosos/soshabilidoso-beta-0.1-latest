"""
URLs para Media Storage
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaFileViewSet, MediaAlbumViewSet

router = DefaultRouter()
router.register(r'files', MediaFileViewSet, basename='media-file')
router.register(r'albums', MediaAlbumViewSet, basename='media-album')

urlpatterns = [
    path('', include(router.urls)),
]

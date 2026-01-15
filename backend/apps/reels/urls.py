from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReelViewSet, ReelCommentViewSet

router = DefaultRouter()
router.register(r'', ReelViewSet, basename='reel')

urlpatterns = [
    path('', include(router.urls)),
]

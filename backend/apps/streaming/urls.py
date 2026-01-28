from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StreamSessionViewSet, StreamGiftViewSet, StreamViewerViewSet,
    StreamChatMessageViewSet, StreamReportViewSet, StreamEarningsViewSet
)

router = DefaultRouter()
router.register(r'sessions', StreamSessionViewSet, basename='stream-session')
router.register(r'gifts', StreamGiftViewSet, basename='stream-gift')
router.register(r'viewers', StreamViewerViewSet, basename='stream-viewer')
router.register(r'chat', StreamChatMessageViewSet, basename='stream-chat')
router.register(r'reports', StreamReportViewSet, basename='stream-report')
router.register(r'earnings', StreamEarningsViewSet, basename='stream-earnings')

urlpatterns = [
    path('', include(router.urls)),
]

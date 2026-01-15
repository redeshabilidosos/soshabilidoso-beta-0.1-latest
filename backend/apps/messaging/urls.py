"""
URLs para sistema de mensajería
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

app_name = 'messaging'

# Router principal para chats
router = DefaultRouter()
router.register(r'chats', views.ChatRoomViewSet, basename='chats')

# Router anidado para mensajes
chats_router = routers.NestedDefaultRouter(router, r'chats', lookup='chat_room')
chats_router.register(r'messages', views.MessageViewSet, basename='chat-messages')

urlpatterns = [
    # Chats principales
    path('', include(router.urls)),
    
    # Mensajes anidados
    path('', include(chats_router.urls)),
]
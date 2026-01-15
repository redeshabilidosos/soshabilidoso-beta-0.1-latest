"""
URLs para notificaciones
"""
from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    # Listar notificaciones
    path('', views.NotificationListView.as_view(), name='notification_list'),
    
    # Contador de no leídas
    path('unread-count/', views.get_unread_count, name='unread_count'),
    
    # Marcar como leída
    path('<uuid:notification_id>/read/', views.mark_as_read, name='mark_as_read'),
    path('mark-all-read/', views.mark_all_as_read, name='mark_all_as_read'),
    
    # Eliminar
    path('<uuid:notification_id>/delete/', views.delete_notification, name='delete_notification'),
    path('clear-all/', views.clear_all_notifications, name='clear_all'),
]

"""
Admin para notificaciones
"""
from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipient', 'sender', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['recipient__username', 'sender__username', 'message']
    readonly_fields = ['id', 'created_at', 'read_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('id', 'recipient', 'sender', 'notification_type')
        }),
        ('Referencias', {
            'fields': ('post_id', 'comment_id')
        }),
        ('Contenido', {
            'fields': ('message',)
        }),
        ('Estado', {
            'fields': ('is_read', 'read_at')
        }),
        ('Fechas', {
            'fields': ('created_at',)
        }),
    )

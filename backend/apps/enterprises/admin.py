"""
Admin para Empresas
"""
from django.contrib import admin
from .models import Enterprise, EnterpriseFollow


@admin.register(Enterprise)
class EnterpriseAdmin(admin.ModelAdmin):
    list_display = ['name', 'username', 'owner', 'category', 'is_verified', 'is_active', 'created_at']
    list_filter = ['category', 'is_verified', 'is_featured', 'is_active']
    search_fields = ['name', 'username', 'owner__username', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'followers_count', 'posts_count']
    ordering = ['-created_at']


@admin.register(EnterpriseFollow)
class EnterpriseFollowAdmin(admin.ModelAdmin):
    list_display = ['user', 'enterprise', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'enterprise__name']

"""
Admin para Stories
"""
from django.contrib import admin
from .models import Story, StoryView, StoryReaction, StoryReply


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'media_type', 'views_count', 'created_at', 'expires_at', 'is_expired']
    list_filter = ['media_type', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['id', 'created_at', 'views_count']
    ordering = ['-created_at']
    
    def is_expired(self, obj):
        return obj.is_expired
    is_expired.boolean = True
    is_expired.short_description = 'Expirada'


@admin.register(StoryView)
class StoryViewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'story', 'viewed_at']
    list_filter = ['viewed_at']
    search_fields = ['user__username', 'story__user__username']
    readonly_fields = ['id', 'viewed_at']
    ordering = ['-viewed_at']


@admin.register(StoryReaction)
class StoryReactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'story', 'reaction_type', 'created_at']
    list_filter = ['reaction_type', 'created_at']
    search_fields = ['user__username', 'story__user__username']
    readonly_fields = ['id', 'created_at']
    ordering = ['-created_at']


@admin.register(StoryReply)
class StoryReplyAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'story', 'message_preview', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['user__username', 'story__user__username', 'message']
    readonly_fields = ['id', 'created_at']
    ordering = ['-created_at']
    
    def message_preview(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Mensaje'

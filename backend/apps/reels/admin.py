from django.contrib import admin
from .models import Reel, ReelComment

@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = ['author', 'caption_preview', 'get_like_count', 'views_count', 'created_at', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['author__username', 'caption', 'hashtags']
    readonly_fields = ['id', 'views_count', 'created_at', 'updated_at']
    
    def caption_preview(self, obj):
        return obj.caption[:50] + '...' if len(obj.caption) > 50 else obj.caption
    caption_preview.short_description = 'Caption'
    
    def get_like_count(self, obj):
        return obj.like_count
    get_like_count.short_description = 'Likes'

@admin.register(ReelComment)
class ReelCommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'reel', 'content_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['author__username', 'content']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'

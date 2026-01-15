"""
Admin para Posts
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Post, PostReaction, Comment, PostBookmark, PostReport


class PostAdmin(admin.ModelAdmin):
    list_display = ['short_id', 'user', 'post_type', 'category', 'stats_display', 'is_public', 'created_at']
    list_filter = ['post_type', 'category', 'is_public', 'is_pinned', 'created_at']
    search_fields = ['content', 'user__username', 'short_id']
    readonly_fields = ['id', 'short_id', 'likes_count', 'comments_count', 'shares_count', 'views_count', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Información', {
            'fields': ('id', 'short_id', 'user', 'content')
        }),
        ('Multimedia', {
            'fields': ('post_type', 'images', 'video', 'thumbnail', 'podcast_url', 'streaming_url'),
            'classes': ('collapse',)
        }),
        ('Configuración', {
            'fields': ('category', 'is_public', 'is_pinned', 'is_archived', 'allow_comments')
        }),
        ('Estadísticas', {
            'fields': ('likes_count', 'celebrations_count', 'golazos_count', 'comments_count', 'shares_count', 'views_count'),
            'classes': ('collapse',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def stats_display(self, obj):
        return format_html(
            '❤️{} 💬{} 👁{}',
            obj.likes_count, obj.comments_count, obj.views_count
        )
    stats_display.short_description = 'Stats'


class PostReactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'reaction_type', 'created_at']
    list_filter = ['reaction_type', 'created_at']
    search_fields = ['user__username']


class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'content_preview', 'likes_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'user__username']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Contenido'


class PostBookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']
    list_filter = ['created_at']


class PostReportAdmin(admin.ModelAdmin):
    list_display = ['reporter', 'post', 'reason', 'status', 'created_at']
    list_filter = ['reason', 'status', 'created_at']
    search_fields = ['reporter__username', 'description']

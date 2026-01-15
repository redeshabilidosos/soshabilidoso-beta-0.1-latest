"""
Admin para Comunidades
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Community, CommunityCategory, CommunityMembership, CommunitySocialLink, CommunityPost, CommunityPostComment


class CommunityCategoryAdmin(admin.ModelAdmin):
    list_display = ['icon_display', 'name', 'slug', 'color_display', 'community_count', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'slug', 'description']
    readonly_fields = ['id', 'created_at']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'name']
    
    fieldsets = (
        ('Información', {
            'fields': ('id', 'name', 'slug', 'description')
        }),
        ('Apariencia', {
            'fields': ('icon', 'color', 'image')
        }),
        ('Configuración', {
            'fields': ('order', 'is_active')
        }),
        ('Metadatos', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def icon_display(self, obj):
        return format_html('<span style="font-size: 20px;">{}</span>', obj.icon)
    icon_display.short_description = 'Icono'
    
    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 10px; border-radius: 3px;">{}</span>',
            obj.color, obj.color
        )
    color_display.short_description = 'Color'
    
    def community_count(self, obj):
        return obj.communities.filter(is_active=True).count()
    community_count.short_description = 'Comunidades'


class CommunityAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'category_display', 'parent_display', 'owner', 'member_count', 'subcommunity_count', 'is_active', 'created_at']
    list_filter = ['type', 'category_obj', 'is_active', 'is_verified', 'created_at']
    search_fields = ['name', 'description', 'owner__username']
    readonly_fields = ['id', 'slug', 'created_at', 'updated_at']
    filter_horizontal = ['moderators']
    raw_id_fields = ['parent', 'category_obj']
    
    fieldsets = (
        ('📋 Información Básica', {
            'fields': ('id', 'name', 'slug', 'description', 'type')
        }),
        ('🏷️ Categoría y Jerarquía', {
            'fields': ('category_obj', 'category', 'parent'),
            'description': 'Asigna una categoría y opcionalmente una comunidad padre para crear subcomunidades'
        }),
        ('👤 Propietario y Moderadores', {
            'fields': ('owner', 'moderators')
        }),
        ('🖼️ Imágenes', {
            'fields': ('profile_image', 'cover_image')
        }),
        ('⚙️ Configuración', {
            'fields': ('is_active', 'is_verified', 'allow_posts', 'require_approval')
        }),
        ('📍 Ubicación', {
            'fields': ('location',),
            'classes': ('collapse',)
        }),
        ('📅 Metadatos', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def category_display(self, obj):
        if obj.category_obj:
            return format_html(
                '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 3px;">{} {}</span>',
                obj.category_obj.color, obj.category_obj.icon, obj.category_obj.name
            )
        return obj.category or '-'
    category_display.short_description = 'Categoría'
    
    def parent_display(self, obj):
        if obj.parent:
            return format_html('<a href="/admin/communities/community/{}/change/">{}</a>', obj.parent.id, obj.parent.name)
        return '-'
    parent_display.short_description = 'Comunidad Padre'
    
    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = 'Miembros'
    
    def subcommunity_count(self, obj):
        count = obj.subcommunities.filter(is_active=True).count()
        if count > 0:
            return format_html('<span style="color: #007bff;">{} subs</span>', count)
        return '-'
    subcommunity_count.short_description = 'Subcomunidades'


class CommunityMembershipAdmin(admin.ModelAdmin):
    list_display = ['user', 'community', 'role', 'joined_at', 'is_active']
    list_filter = ['role', 'is_active', 'joined_at']
    search_fields = ['user__username', 'community__name']


class CommunitySocialLinkAdmin(admin.ModelAdmin):
    list_display = ['community', 'platform', 'username', 'is_active']
    list_filter = ['platform', 'is_active']
    search_fields = ['community__name', 'username']


class CommunityPostAdmin(admin.ModelAdmin):
    list_display = ['community', 'author', 'post_type', 'like_count', 'is_pinned', 'created_at']
    list_filter = ['post_type', 'is_pinned', 'is_approved', 'is_active', 'created_at']
    search_fields = ['community__name', 'author__username', 'content']
    readonly_fields = ['id', 'created_at', 'updated_at']
    filter_horizontal = ['likes']
    
    def like_count(self, obj):
        return obj.likes.count()
    like_count.short_description = 'Likes'


class CommunityPostCommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author', 'content_preview', 'like_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['author__username', 'content']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = "Contenido"
    
    def like_count(self, obj):
        return obj.likes.count()
    like_count.short_description = 'Likes'


# Registrar modelos - CommunityCategory primero para autocomplete
admin.site.register(CommunityCategory, CommunityCategoryAdmin)
admin.site.register(Community, CommunityAdmin)
admin.site.register(CommunityMembership, CommunityMembershipAdmin)
admin.site.register(CommunitySocialLink, CommunitySocialLinkAdmin)
admin.site.register(CommunityPost, CommunityPostAdmin)
admin.site.register(CommunityPostComment, CommunityPostCommentAdmin)

from django.contrib import admin
from .models import MediaFile, MediaAlbum

@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = ['original_name', 'file_type', 'uploaded_by', 'file_size_mb', 'is_public', 'created_at']
    list_filter = ['file_type', 'is_public', 'created_at']
    search_fields = ['original_name', 'uploaded_by__username']
    readonly_fields = ['id', 'file_size', 'mime_type', 'width', 'height', 'duration', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Archivo', {
            'fields': ('id', 'file', 'original_name', 'file_type')
        }),
        ('Metadatos', {
            'fields': ('file_size', 'mime_type', 'width', 'height', 'duration')
        }),
        ('Propietario y Permisos', {
            'fields': ('uploaded_by', 'is_public')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(MediaAlbum)
class MediaAlbumAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'file_count', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['name', 'description', 'owner__username']
    readonly_fields = ['id', 'created_at', 'updated_at']
    filter_horizontal = ['files']
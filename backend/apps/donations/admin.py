"""
Admin para el sistema de donaciones
"""
from django.contrib import admin
from .models import SportCategory, AthleteProfile, AthleteMedia, Donation


class SportCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'athletes_count', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    
    def athletes_count(self, obj):
        return obj.athletes.filter(status='approved').count()
    athletes_count.short_description = 'Deportistas'


class AthleteMediaInline(admin.StackedInline):
    model = AthleteMedia
    extra = 1
    fields = ['media_type', 'file', 'thumbnail', 'title', 'description', 'order', 'is_cover']


class AthleteProfileAdmin(admin.ModelAdmin):
    list_display = [
        'full_name', 'sport', 'city', 'goal_amount', 
        'raised_amount', 'status', 'is_featured'
    ]
    list_filter = ['status', 'sport', 'is_verified', 'is_featured']
    search_fields = ['full_name', 'city', 'description']
    readonly_fields = ['raised_amount', 'donors_count', 'created_at', 'updated_at']
    inlines = [AthleteMediaInline]
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('user', 'full_name', 'age', 'height', 'weight', 'city', 'country')
        }),
        ('Información Deportiva', {
            'fields': ('sport', 'position', 'team', 'experience_years', 'achievements')
        }),
        ('Campaña', {
            'fields': ('description', 'goal_description', 'goal_amount')
        }),
        ('Estadísticas', {
            'fields': ('raised_amount', 'donors_count'),
        }),
        ('Estado', {
            'fields': ('status', 'is_verified', 'is_featured')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at', 'approved_at'),
        }),
    )
    
    actions = ['approve_profiles', 'feature_profiles', 'unfeature_profiles']
    
    def approve_profiles(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='approved', approved_at=timezone.now())
        self.message_user(request, f'{queryset.count()} perfiles aprobados.')
    approve_profiles.short_description = 'Aprobar perfiles seleccionados'
    
    def feature_profiles(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(request, f'{queryset.count()} perfiles destacados.')
    feature_profiles.short_description = 'Destacar perfiles seleccionados'
    
    def unfeature_profiles(self, request, queryset):
        queryset.update(is_featured=False)
        self.message_user(request, f'{queryset.count()} perfiles quitados de destacados.')
    unfeature_profiles.short_description = 'Quitar de destacados'


class AthleteMediaAdmin(admin.ModelAdmin):
    list_display = ['athlete', 'media_type', 'title', 'order', 'is_cover', 'created_at']
    list_filter = ['media_type', 'is_cover']
    search_fields = ['athlete__full_name', 'title']
    list_editable = ['order', 'is_cover']


class DonationAdmin(admin.ModelAdmin):
    list_display = [
        'athlete', 'donor_display', 'amount',
        'payment_method', 'status', 'created_at'
    ]
    list_filter = ['status', 'payment_method', 'is_anonymous', 'created_at']
    search_fields = ['athlete__full_name', 'donor_name', 'donor_email']
    readonly_fields = ['created_at', 'completed_at']
    
    def donor_display(self, obj):
        if obj.is_anonymous:
            return 'Anónimo'
        if obj.donor:
            return obj.donor.display_name
        return obj.donor_name or 'Sin nombre'
    donor_display.short_description = 'Donante'

"""
Admin para el sistema de publicidad
"""
from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Advertisement, AdImpression, AdClick, AdVideoView


class AdClickInline(admin.TabularInline):
    model = AdClick
    extra = 0
    readonly_fields = ['user', 'ip_address', 'clicked_at']
    can_delete = False
    max_num = 10
    
    def has_add_permission(self, request, obj=None):
        return False


class AdvertisementAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'advertiser_name', 'ad_type', 'position', 
        'status_badge', 'priority_badge', 'stats_display',
        'budget_display', 'date_range', 'is_active'
    ]
    list_filter = ['status', 'ad_type', 'position', 'priority', 'is_active', 'created_at']
    search_fields = ['title', 'advertiser_name', 'advertiser_email', 'description']
    readonly_fields = [
        'id', 'impressions', 'clicks', 'unique_views', 'conversions', 
        'total_spent', 'video_views', 'video_completions',
        'ctr_display', 'conversion_rate_display', 'created_at', 'updated_at'
    ]
    date_hierarchy = 'created_at'
    list_editable = ['is_active']
    list_per_page = 25
    
    fieldsets = (
        ('📋 Información Básica', {
            'fields': ('title', 'description', 'advertiser_name', 'advertiser_email', 'advertiser_logo')
        }),
        ('🎨 Tipo y Contenido', {
            'fields': ('ad_type', 'position', 'image', 'video', 'video_url', 'carousel_images')
        }),
        ('🔗 Enlaces y CTA', {
            'fields': ('link_url', 'call_to_action')
        }),
        ('⚙️ Configuración de Frecuencia en Feed', {
            'fields': (
                'show_every_n_posts', 
                'max_impressions_per_user', 
                'max_impressions_per_day',
                'priority',
                'weight'
            ),
            'description': 'Configura cómo y cuándo aparece el anuncio en el feed'
        }),
        ('🎯 Segmentación', {
            'fields': (
                'target_countries', 'target_cities', 
                ('target_age_min', 'target_age_max'),
                'target_gender', 'target_interests'
            ),
            'classes': ('collapse',)
        }),
        ('💰 Presupuesto y Alcance', {
            'fields': (
                ('budget', 'daily_budget'),
                ('cost_per_click', 'cost_per_impression'),
                ('max_impressions', 'max_clicks')
            )
        }),
        ('📅 Programación', {
            'fields': (
                'status', 'is_active',
                ('start_date', 'end_date'),
                'show_on_weekdays',
                ('show_from_hour', 'show_until_hour')
            )
        }),
        ('📊 Estadísticas', {
            'fields': (
                ('impressions', 'unique_views', 'clicks'),
                ('ctr_display', 'conversion_rate_display'),
                ('video_views', 'video_completions'),
                ('total_spent', 'conversions')
            ),
            'classes': ('collapse',)
        }),
        ('🔐 Aprobación', {
            'fields': ('created_by', 'approved_by', 'approved_at', 'rejection_reason'),
            'classes': ('collapse',)
        }),
        ('ℹ️ Sistema', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [AdClickInline]
    
    def status_badge(self, obj):
        colors = {
            'draft': '#6c757d',
            'pending': '#ffc107',
            'active': '#28a745',
            'paused': '#17a2b8',
            'completed': '#007bff',
            'rejected': '#dc3545',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Estado'
    
    def priority_badge(self, obj):
        colors = {1: '#6c757d', 2: '#17a2b8', 3: '#ffc107', 4: '#fd7e14', 5: '#dc3545'}
        color = colors.get(obj.priority, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 3px; font-size: 11px;">P{}</span>',
            color, obj.priority
        )
    priority_badge.short_description = 'Prioridad'
    
    def stats_display(self, obj):
        return format_html(
            '<small>👁 {} | 👆 {} | CTR: {}%</small>',
            obj.impressions, obj.clicks, obj.ctr
        )
    stats_display.short_description = 'Estadísticas'
    
    def budget_display(self, obj):
        spent_pct = 0
        if obj.budget > 0:
            spent_pct = (float(obj.total_spent) / float(obj.budget)) * 100
        color = '#28a745' if spent_pct < 80 else '#ffc107' if spent_pct < 100 else '#dc3545'
        return format_html(
            '<small style="color: {};">${} / ${}</small>',
            color, f"{float(obj.total_spent):.2f}", f"{float(obj.budget):.2f}"
        )
    budget_display.short_description = 'Gastado/Presupuesto'
    
    def date_range(self, obj):
        now = timezone.now()
        if obj.end_date < now:
            status = '⏹️ Finalizado'
        elif obj.start_date > now:
            status = '⏳ Programado'
        else:
            status = '▶️ En curso'
        return format_html(
            '<small>{}<br/>{} - {}</small>',
            status,
            obj.start_date.strftime('%d/%m/%y'),
            obj.end_date.strftime('%d/%m/%y')
        )
    date_range.short_description = 'Período'
    
    def ctr_display(self, obj):
        return f"{obj.ctr}%"
    ctr_display.short_description = 'CTR'
    
    def conversion_rate_display(self, obj):
        return f"{obj.conversion_rate}%"
    conversion_rate_display.short_description = 'Tasa de Conversión'
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    actions = ['activate_ads', 'pause_ads', 'approve_ads', 'deactivate_ads']
    
    @admin.action(description='✅ Activar anuncios seleccionados')
    def activate_ads(self, request, queryset):
        updated = queryset.update(status='active', is_active=True)
        self.message_user(request, f'{updated} anuncio(s) activado(s) correctamente.')
    
    @admin.action(description='⏸️ Pausar anuncios seleccionados')
    def pause_ads(self, request, queryset):
        updated = queryset.update(status='paused', is_active=False)
        self.message_user(request, f'{updated} anuncio(s) pausado(s) correctamente.')
    
    @admin.action(description='🚫 Desactivar anuncios seleccionados')
    def deactivate_ads(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} anuncio(s) desactivado(s) correctamente.')
    
    @admin.action(description='👍 Aprobar anuncios pendientes')
    def approve_ads(self, request, queryset):
        updated = queryset.filter(status='pending').update(
            status='active',
            is_active=True,
            approved_by=request.user,
            approved_at=timezone.now()
        )
        self.message_user(request, f'{updated} anuncio(s) aprobado(s) correctamente.')


class AdImpressionAdmin(admin.ModelAdmin):
    list_display = ['ad', 'user', 'position_in_feed', 'ip_address', 'viewed_at']
    list_filter = ['viewed_at', 'ad']
    search_fields = ['ad__title', 'user__username', 'ip_address']
    readonly_fields = ['id', 'ad', 'user', 'session_id', 'ip_address', 'user_agent', 'position_in_feed', 'viewed_at']
    date_hierarchy = 'viewed_at'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


class AdClickAdmin(admin.ModelAdmin):
    list_display = ['ad', 'user', 'ip_address', 'clicked_at']
    list_filter = ['clicked_at', 'ad']
    search_fields = ['ad__title', 'user__username', 'ip_address']
    readonly_fields = ['id', 'ad', 'user', 'impression', 'ip_address', 'user_agent', 'clicked_at']
    date_hierarchy = 'clicked_at'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


class AdVideoViewAdmin(admin.ModelAdmin):
    list_display = ['ad', 'user', 'watch_duration', 'video_duration', 'completion_rate', 'completed', 'viewed_at']
    list_filter = ['completed', 'viewed_at', 'ad']
    search_fields = ['ad__title', 'user__username']
    readonly_fields = ['id', 'ad', 'user', 'watch_duration', 'video_duration', 'completed', 'viewed_at']
    date_hierarchy = 'viewed_at'
    
    def completion_rate(self, obj):
        if obj.video_duration > 0:
            rate = (obj.watch_duration / obj.video_duration) * 100
            return f"{rate:.1f}%"
        return "N/A"
    completion_rate.short_description = '% Visto'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


# Registrar los modelos en el admin
admin.site.register(Advertisement, AdvertisementAdmin)
admin.site.register(AdImpression, AdImpressionAdmin)
admin.site.register(AdClick, AdClickAdmin)
admin.site.register(AdVideoView, AdVideoViewAdmin)

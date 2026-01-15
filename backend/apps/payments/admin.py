"""
Admin para Pagos y Transacciones
Panel de control completo para monetización de SOS-HABILIDOSO
"""
from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import (
    PaymentAccount, PricingPlan, Transaction,
    EnterpriseClassifiedPayment, AdvertisingPayment,
    DonationTransaction, PlatformSettings
)


@admin.register(PaymentAccount)
class PaymentAccountAdmin(admin.ModelAdmin):
    list_display = ['name', 'account_type', 'account_number_masked', 'currency', 'is_active', 'is_primary', 'services_display']
    list_filter = ['account_type', 'currency', 'is_active', 'is_primary', 'for_classifieds', 'for_advertising', 'for_donations']
    search_fields = ['name', 'account_holder', 'bank_name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Información General', {
            'fields': ('name', 'account_type', 'currency')
        }),
        ('Datos de la Cuenta', {
            'fields': ('account_number', 'account_holder', 'bank_name')
        }),
        ('Configuración', {
            'fields': ('is_active', 'is_primary')
        }),
        ('Servicios Habilitados', {
            'fields': ('for_classifieds', 'for_advertising', 'for_donations')
        }),
        ('Notas', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Metadatos', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def account_number_masked(self, obj):
        if len(obj.account_number) > 4:
            return f"****{obj.account_number[-4:]}"
        return obj.account_number
    account_number_masked.short_description = 'Número'
    
    def services_display(self, obj):
        services = []
        if obj.for_classifieds:
            services.append('📋')
        if obj.for_advertising:
            services.append('📢')
        if obj.for_donations:
            services.append('💝')
        return ' '.join(services) or '-'
    services_display.short_description = 'Servicios'


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'service_type', 'price_display', 'duration_display', 'is_active']
    list_filter = ['service_type', 'is_active', 'currency']
    search_fields = ['name', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Información del Plan', {
            'fields': ('name', 'service_type', 'description')
        }),
        ('Precio', {
            'fields': ('price', 'currency')
        }),
        ('Duración', {
            'fields': ('duration_value', 'duration_unit')
        }),
        ('Características', {
            'fields': ('features',),
            'description': 'Lista de características en formato JSON'
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
    )
    
    def price_display(self, obj):
        return f"${obj.price:,.0f} {obj.currency}"
    price_display.short_description = 'Precio'
    
    def duration_display(self, obj):
        return obj.get_duration_display_full()
    duration_display.short_description = 'Duración'


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['reference_code', 'user', 'transaction_type', 'amount_display', 'payment_method', 'status_badge', 'created_at']
    list_filter = ['status', 'transaction_type', 'payment_method', 'currency', 'created_at']
    search_fields = ['reference_code', 'user__username', 'user__email', 'enterprise__name']
    readonly_fields = ['id', 'reference_code', 'created_at', 'updated_at', 'completed_at', 'ip_address', 'user_agent']
    date_hierarchy = 'created_at'
    raw_id_fields = ['user', 'enterprise', 'verified_by', 'payment_account', 'pricing_plan']
    
    fieldsets = (
        ('Información de la Transacción', {
            'fields': ('reference_code', 'transaction_type', 'status')
        }),
        ('Usuario/Empresa', {
            'fields': ('user', 'enterprise')
        }),
        ('Monto y Pago', {
            'fields': ('amount', 'currency', 'payment_method', 'payment_account', 'pricing_plan')
        }),
        ('Comprobante', {
            'fields': ('payment_proof', 'payment_proof_url')
        }),
        ('Verificación', {
            'fields': ('verified_by', 'verified_at', 'verification_notes'),
            'classes': ('collapse',)
        }),
        ('Referencia', {
            'fields': ('content_type', 'object_id'),
            'classes': ('collapse',)
        }),
        ('Metadatos', {
            'fields': ('metadata', 'ip_address', 'user_agent', 'created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_transactions', 'reject_transactions']
    
    def amount_display(self, obj):
        return f"${obj.amount:,.0f} {obj.currency}"
    amount_display.short_description = 'Monto'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'pending_verification': '#FFD700',
            'processing': '#1E90FF',
            'completed': '#32CD32',
            'failed': '#DC143C',
            'refunded': '#9370DB',
            'cancelled': '#808080',
        }
        color = colors.get(obj.status, '#808080')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 10px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Estado'
    
    def approve_transactions(self, request, queryset):
        count = queryset.filter(status='pending_verification').update(
            status='completed',
            verified_by=request.user,
            verified_at=timezone.now(),
            completed_at=timezone.now()
        )
        self.message_user(request, f'{count} transacciones aprobadas.')
    approve_transactions.short_description = 'Aprobar transacciones seleccionadas'
    
    def reject_transactions(self, request, queryset):
        count = queryset.filter(status='pending_verification').update(
            status='failed',
            verified_by=request.user,
            verified_at=timezone.now()
        )
        self.message_user(request, f'{count} transacciones rechazadas.')
    reject_transactions.short_description = 'Rechazar transacciones seleccionadas'


@admin.register(EnterpriseClassifiedPayment)
class EnterpriseClassifiedPaymentAdmin(admin.ModelAdmin):
    list_display = ['enterprise', 'pricing_plan', 'status_badge', 'starts_at', 'expires_at', 'created_at']
    list_filter = ['status', 'pricing_plan', 'created_at']
    search_fields = ['enterprise__name', 'enterprise__username']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['enterprise', 'transaction', 'pricing_plan']
    
    def status_badge(self, obj):
        colors = {
            'pending_payment': '#FFA500',
            'pending_verification': '#FFD700',
            'approved': '#32CD32',
            'rejected': '#DC143C',
            'expired': '#808080',
        }
        color = colors.get(obj.status, '#808080')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 10px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Estado'


@admin.register(AdvertisingPayment)
class AdvertisingPaymentAdmin(admin.ModelAdmin):
    list_display = ['ad_title', 'user', 'enterprise', 'pricing_plan', 'status_badge', 'impressions', 'clicks', 'ctr_display']
    list_filter = ['status', 'pricing_plan', 'created_at']
    search_fields = ['ad_title', 'user__username', 'enterprise__name']
    readonly_fields = ['id', 'impressions', 'clicks', 'created_at', 'updated_at']
    raw_id_fields = ['user', 'enterprise', 'transaction', 'pricing_plan']
    
    def status_badge(self, obj):
        colors = {
            'pending_payment': '#FFA500',
            'pending_verification': '#FFD700',
            'approved': '#32CD32',
            'active': '#1E90FF',
            'paused': '#FFD700',
            'completed': '#808080',
            'rejected': '#DC143C',
        }
        color = colors.get(obj.status, '#808080')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 10px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Estado'
    
    def ctr_display(self, obj):
        if obj.impressions > 0:
            ctr = (obj.clicks / obj.impressions) * 100
            return f"{ctr:.2f}%"
        return "0%"
    ctr_display.short_description = 'CTR'


@admin.register(DonationTransaction)
class DonationTransactionAdmin(admin.ModelAdmin):
    list_display = ['donor_display', 'athlete', 'amount_display', 'platform_fee_display', 'athlete_receives_display', 'status_badge', 'created_at']
    list_filter = ['status', 'is_anonymous', 'currency', 'created_at']
    search_fields = ['donor__username', 'athlete__username', 'donor_name', 'donor_email']
    readonly_fields = ['id', 'platform_fee', 'athlete_receives', 'created_at', 'updated_at']
    raw_id_fields = ['donor', 'athlete', 'transaction']
    
    def donor_display(self, obj):
        if obj.is_anonymous:
            return '🎭 Anónimo'
        return obj.donor_name or (obj.donor.username if obj.donor else 'Desconocido')
    donor_display.short_description = 'Donante'
    
    def amount_display(self, obj):
        return f"${obj.amount:,.0f}"
    amount_display.short_description = 'Monto'
    
    def platform_fee_display(self, obj):
        return f"${obj.platform_fee:,.0f}"
    platform_fee_display.short_description = 'Comisión'
    
    def athlete_receives_display(self, obj):
        return f"${obj.athlete_receives:,.0f}"
    athlete_receives_display.short_description = 'Atleta recibe'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'pending_verification': '#FFD700',
            'completed': '#32CD32',
            'failed': '#DC143C',
        }
        color = colors.get(obj.status, '#808080')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 10px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Estado'


@admin.register(PlatformSettings)
class PlatformSettingsAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'donation_fee_percentage', 'default_currency', 'auto_approve_under', 'updated_at']
    readonly_fields = ['id', 'updated_at']
    
    fieldsets = (
        ('Comisiones', {
            'fields': ('donation_fee_percentage',)
        }),
        ('Configuración General', {
            'fields': ('default_currency', 'auto_approve_under')
        }),
        ('Notificaciones', {
            'fields': ('notify_admin_on_payment', 'admin_notification_email')
        }),
        ('Textos', {
            'fields': ('payment_instructions', 'terms_and_conditions'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Solo permitir un registro
        return not PlatformSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False

"""
Configuración del admin para finanzas
"""
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from .models import Transaction, UserWallet, Subscription, PlatformRevenue


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id_short', 'user', 'transaction_type', 'amount_display', 'platform_fee_display', 'status_display', 'created_at']
    list_filter = ['transaction_type', 'status', 'created_at', 'payment_gateway']
    search_fields = ['user__username', 'user__email', 'reference_id', 'description']
    readonly_fields = ['id', 'created_at', 'completed_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('id', 'user', 'recipient', 'transaction_type', 'description')
        }),
        ('Montos', {
            'fields': ('amount', 'currency', 'platform_fee', 'net_amount')
        }),
        ('Estado y Pago', {
            'fields': ('status', 'payment_method', 'payment_gateway', 'reference_id')
        }),
        ('Fechas', {
            'fields': ('created_at', 'completed_at')
        }),
    )
    
    actions = ['mark_as_completed', 'mark_as_failed', 'export_to_csv']
    
    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = 'ID'
    
    def amount_display(self, obj):
        return f"${obj.amount:,.2f}"
    amount_display.short_description = 'Monto'
    amount_display.admin_order_field = 'amount'
    
    def platform_fee_display(self, obj):
        return f"${obj.platform_fee:,.2f}"
    platform_fee_display.short_description = 'Comisión'
    
    def status_display(self, obj):
        colors = {
            'pending': 'orange',
            'completed': 'green',
            'failed': 'red',
            'cancelled': 'gray',
            'refunded': 'blue'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_display.short_description = 'Estado'
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed', completed_at=timezone.now())
        self.message_user(request, f'{updated} transacciones marcadas como completadas.')
    mark_as_completed.short_description = 'Marcar como completadas'
    
    def mark_as_failed(self, request, queryset):
        updated = queryset.update(status='failed')
        self.message_user(request, f'{updated} transacciones marcadas como fallidas.')
    mark_as_failed.short_description = 'Marcar como fallidas'



@admin.register(UserWallet)
class UserWalletAdmin(admin.ModelAdmin):
    list_display = ['user', 'balance_display', 'pending_balance_display', 'total_earned_display', 'total_withdrawn_display']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['id', 'balance', 'pending_balance', 'total_earned', 'total_withdrawn', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Usuario', {
            'fields': ('id', 'user')
        }),
        ('Balances', {
            'fields': ('balance', 'pending_balance', 'total_earned', 'total_withdrawn')
        }),
        ('Información Bancaria', {
            'fields': ('bank_name', 'account_number', 'account_type', 'account_holder_name'),
            'classes': ('collapse',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def balance_display(self, obj):
        return format_html('<span style="color: green; font-weight: bold;">${:,.2f}</span>', obj.balance)
    balance_display.short_description = 'Balance'
    balance_display.admin_order_field = 'balance'
    
    def pending_balance_display(self, obj):
        return f"${obj.pending_balance:,.2f}"
    pending_balance_display.short_description = 'Pendiente'
    
    def total_earned_display(self, obj):
        return f"${obj.total_earned:,.2f}"
    total_earned_display.short_description = 'Total Ganado'
    
    def total_withdrawn_display(self, obj):
        return f"${obj.total_withdrawn:,.2f}"
    total_withdrawn_display.short_description = 'Total Retirado'


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'plan_type', 'price_display', 'status_display', 'start_date', 'end_date', 'is_recurring']
    list_filter = ['plan_type', 'status', 'is_recurring', 'start_date']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Usuario', {
            'fields': ('id', 'user')
        }),
        ('Plan', {
            'fields': ('plan_type', 'price', 'currency')
        }),
        ('Estado', {
            'fields': ('status', 'is_recurring')
        }),
        ('Fechas', {
            'fields': ('start_date', 'end_date', 'next_billing_date', 'cancelled_at', 'created_at', 'updated_at')
        }),
    )
    
    actions = ['cancel_subscriptions', 'activate_subscriptions']
    
    def price_display(self, obj):
        return f"${obj.price:,.2f}"
    price_display.short_description = 'Precio'
    
    def status_display(self, obj):
        colors = {
            'active': 'green',
            'cancelled': 'red',
            'expired': 'gray',
            'suspended': 'orange'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_display.short_description = 'Estado'
    
    def cancel_subscriptions(self, request, queryset):
        updated = queryset.update(status='cancelled', cancelled_at=timezone.now())
        self.message_user(request, f'{updated} suscripciones canceladas.')
    cancel_subscriptions.short_description = 'Cancelar suscripciones'
    
    def activate_subscriptions(self, request, queryset):
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} suscripciones activadas.')
    activate_subscriptions.short_description = 'Activar suscripciones'


@admin.register(PlatformRevenue)
class PlatformRevenueAdmin(admin.ModelAdmin):
    list_display = ['source', 'amount_display', 'date', 'created_at']
    list_filter = ['source', 'date']
    search_fields = ['source', 'description']
    readonly_fields = ['id', 'created_at']
    date_hierarchy = 'date'
    
    def amount_display(self, obj):
        return format_html('<span style="color: green; font-weight: bold;">${:,.2f}</span>', obj.amount)
    amount_display.short_description = 'Monto'
    amount_display.admin_order_field = 'amount'
    
    def changelist_view(self, request, extra_context=None):
        # Agregar estadísticas al contexto
        extra_context = extra_context or {}
        
        # Total de ingresos
        total_revenue = PlatformRevenue.objects.aggregate(total=Sum('amount'))['total'] or 0
        
        # Ingresos del mes actual
        today = timezone.now()
        month_start = today.replace(day=1)
        month_revenue = PlatformRevenue.objects.filter(date__gte=month_start).aggregate(total=Sum('amount'))['total'] or 0
        
        # Ingresos por fuente
        revenue_by_source = PlatformRevenue.objects.values('source').annotate(total=Sum('amount')).order_by('-total')
        
        extra_context['total_revenue'] = total_revenue
        extra_context['month_revenue'] = month_revenue
        extra_context['revenue_by_source'] = revenue_by_source
        
        return super().changelist_view(request, extra_context=extra_context)

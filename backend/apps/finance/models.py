"""
Modelos para el sistema financiero y monetización
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()


class Transaction(models.Model):
    """Modelo para transacciones financieras"""
    
    TRANSACTION_TYPES = [
        ('subscription', 'Suscripción'),
        ('ad_revenue', 'Ingresos por Publicidad'),
        ('community_membership', 'Membresía de Comunidad'),
        ('tip', 'Propina/Donación'),
        ('course_purchase', 'Compra de Curso'),
        ('classified_ad', 'Anuncio Clasificado'),
        ('withdrawal', 'Retiro'),
        ('refund', 'Reembolso'),
        ('commission', 'Comisión'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('completed', 'Completada'),
        ('failed', 'Fallida'),
        ('cancelled', 'Cancelada'),
        ('refunded', 'Reembolsada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Usuarios involucrados
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', verbose_name='Usuario')
    recipient = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='received_transactions', verbose_name='Destinatario')
    
    # Información de la transacción
    transaction_type = models.CharField(max_length=30, choices=TRANSACTION_TYPES, verbose_name='Tipo')
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Monto')
    currency = models.CharField(max_length=3, default='COP', verbose_name='Moneda')
    
    # Comisión de la plataforma
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Comisión Plataforma')
    net_amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Monto Neto')
    
    # Estado y detalles
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Estado')
    description = models.TextField(verbose_name='Descripción')
    reference_id = models.CharField(max_length=200, blank=True, verbose_name='ID de Referencia')
    
    # Método de pago
    payment_method = models.CharField(max_length=50, blank=True, verbose_name='Método de Pago')
    payment_gateway = models.CharField(max_length=50, blank=True, verbose_name='Pasarela de Pago')
    
    # Fechas
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de Completado')
    
    class Meta:
        verbose_name = 'Transacción'
        verbose_name_plural = 'Transacciones'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.get_transaction_type_display()} - ${self.amount} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        # Calcular monto neto si no está establecido
        if not self.net_amount:
            self.net_amount = self.amount - self.platform_fee
        super().save(*args, **kwargs)



class UserWallet(models.Model):
    """Billetera del usuario"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet', verbose_name='Usuario')
    
    # Balances
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Balance Disponible')
    pending_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Balance Pendiente')
    total_earned = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Total Ganado')
    total_withdrawn = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Total Retirado')
    
    # Información bancaria
    bank_name = models.CharField(max_length=100, blank=True, verbose_name='Banco')
    account_number = models.CharField(max_length=50, blank=True, verbose_name='Número de Cuenta')
    account_type = models.CharField(max_length=20, blank=True, verbose_name='Tipo de Cuenta')
    account_holder_name = models.CharField(max_length=200, blank=True, verbose_name='Titular de la Cuenta')
    
    # Fechas
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Billetera'
        verbose_name_plural = 'Billeteras'
    
    def __str__(self):
        return f"Billetera de {self.user.username} - ${self.balance}"


class Subscription(models.Model):
    """Modelo para suscripciones de usuarios"""
    
    PLAN_TYPES = [
        ('free', 'Gratis'),
        ('pro', 'Pro'),
        ('creator', 'Creador'),
        ('business', 'Empresarial'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Activa'),
        ('cancelled', 'Cancelada'),
        ('expired', 'Expirada'),
        ('suspended', 'Suspendida'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions', verbose_name='Usuario')
    
    # Plan
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES, verbose_name='Tipo de Plan')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio')
    currency = models.CharField(max_length=3, default='COP', verbose_name='Moneda')
    
    # Estado
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name='Estado')
    is_recurring = models.BooleanField(default=True, verbose_name='Renovación Automática')
    
    # Fechas
    start_date = models.DateTimeField(verbose_name='Fecha de Inicio')
    end_date = models.DateTimeField(verbose_name='Fecha de Fin')
    next_billing_date = models.DateTimeField(null=True, blank=True, verbose_name='Próxima Facturación')
    cancelled_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de Cancelación')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Suscripción'
        verbose_name_plural = 'Suscripciones'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.get_plan_type_display()}"


class PlatformRevenue(models.Model):
    """Modelo para ingresos de la plataforma"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Tipo de ingreso
    source = models.CharField(max_length=50, verbose_name='Fuente')
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Monto')
    
    # Detalles
    description = models.TextField(verbose_name='Descripción')
    related_transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Transacción Relacionada')
    
    # Fecha
    date = models.DateField(verbose_name='Fecha')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Ingreso de Plataforma'
        verbose_name_plural = 'Ingresos de Plataforma'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.source} - ${self.amount} - {self.date}"

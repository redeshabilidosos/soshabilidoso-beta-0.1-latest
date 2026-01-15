"""
Modelos de Pagos y Transacciones para SOS-HABILIDOSO
Sistema de monetización para:
- Publicaciones de empresas en clasificados (pago)
- Pautas publicitarias
- Donaciones a atletas
"""
import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class PaymentAccount(models.Model):
    """
    Cuentas de pago configuradas por el administrador.
    Define a qué cuentas se reciben los pagos de la plataforma.
    """
    ACCOUNT_TYPE_CHOICES = [
        ('bank', 'Cuenta Bancaria'),
        ('nequi', 'Nequi'),
        ('daviplata', 'Daviplata'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('mercadopago', 'MercadoPago'),
    ]
    
    CURRENCY_CHOICES = [
        ('COP', 'Peso Colombiano'),
        ('USD', 'Dólar Estadounidense'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name='Nombre de la cuenta')
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, verbose_name='Tipo de cuenta')
    
    # Información de la cuenta
    account_number = models.CharField(max_length=100, verbose_name='Número de cuenta/Teléfono')
    account_holder = models.CharField(max_length=200, verbose_name='Titular de la cuenta')
    bank_name = models.CharField(max_length=100, blank=True, verbose_name='Nombre del banco')
    
    # Configuración
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='COP', verbose_name='Moneda')
    is_active = models.BooleanField(default=True, verbose_name='Activa')
    is_primary = models.BooleanField(default=False, verbose_name='Cuenta principal')
    
    # Para servicios específicos
    for_classifieds = models.BooleanField(default=True, verbose_name='Para clasificados')
    for_advertising = models.BooleanField(default=True, verbose_name='Para publicidad')
    for_donations = models.BooleanField(default=True, verbose_name='Para donaciones')
    
    # Metadatos
    notes = models.TextField(blank=True, verbose_name='Notas internas')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_accounts'
        verbose_name = 'Cuenta de Pago'
        verbose_name_plural = 'Cuentas de Pago'
        ordering = ['-is_primary', '-is_active', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_account_type_display()})"
    
    def save(self, *args, **kwargs):
        # Si se marca como principal, desmarcar las demás
        if self.is_primary:
            PaymentAccount.objects.filter(is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class PricingPlan(models.Model):
    """
    Planes de precios para diferentes servicios de la plataforma.
    Configurable desde el admin de Django.
    """
    SERVICE_TYPE_CHOICES = [
        ('classified_basic', 'Clasificado Básico'),
        ('classified_featured', 'Clasificado Destacado'),
        ('classified_premium', 'Clasificado Premium'),
        ('ad_banner', 'Banner Publicitario'),
        ('ad_sponsored_post', 'Post Patrocinado'),
        ('ad_story', 'Historia Patrocinada'),
        ('enterprise_verified', 'Verificación de Empresa'),
    ]
    
    DURATION_UNIT_CHOICES = [
        ('days', 'Días'),
        ('weeks', 'Semanas'),
        ('months', 'Meses'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name='Nombre del plan')
    service_type = models.CharField(max_length=30, choices=SERVICE_TYPE_CHOICES, unique=True, verbose_name='Tipo de servicio')
    description = models.TextField(blank=True, verbose_name='Descripción')
    
    # Precio
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0'))], verbose_name='Precio')
    currency = models.CharField(max_length=3, default='COP', verbose_name='Moneda')
    
    # Duración
    duration_value = models.PositiveIntegerField(default=30, verbose_name='Duración')
    duration_unit = models.CharField(max_length=10, choices=DURATION_UNIT_CHOICES, default='days', verbose_name='Unidad de duración')
    
    # Características
    features = models.JSONField(default=list, blank=True, verbose_name='Características incluidas')
    
    # Estado
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pricing_plans'
        verbose_name = 'Plan de Precios'
        verbose_name_plural = 'Planes de Precios'
        ordering = ['service_type', 'price']
    
    def __str__(self):
        return f"{self.name} - ${self.price:,.0f} {self.currency}"
    
    def get_duration_display_full(self):
        return f"{self.duration_value} {self.get_duration_unit_display()}"


class Transaction(models.Model):
    """
    Registro de todas las transacciones de la plataforma.
    """
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('pending_verification', 'Pendiente de Verificación'),
        ('processing', 'Procesando'),
        ('completed', 'Completada'),
        ('failed', 'Fallida'),
        ('refunded', 'Reembolsada'),
        ('cancelled', 'Cancelada'),
    ]
    
    TRANSACTION_TYPE_CHOICES = [
        ('classified_payment', 'Pago de Clasificado'),
        ('advertising_payment', 'Pago de Publicidad'),
        ('donation', 'Donación'),
        ('subscription', 'Suscripción'),
        ('refund', 'Reembolso'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', 'Transferencia Bancaria'),
        ('nequi', 'Nequi'),
        ('daviplata', 'Daviplata'),
        ('credit_card', 'Tarjeta de Crédito'),
        ('paypal', 'PayPal'),
        ('mercadopago', 'MercadoPago'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference_code = models.CharField(max_length=50, unique=True, verbose_name='Código de referencia')
    
    # Usuario que realiza el pago
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='payment_transactions',
        verbose_name='Usuario'
    )
    
    # Empresa (si aplica)
    enterprise = models.ForeignKey(
        'enterprises.Enterprise',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions',
        verbose_name='Empresa'
    )
    
    # Tipo y estado
    transaction_type = models.CharField(max_length=30, choices=TRANSACTION_TYPE_CHOICES, verbose_name='Tipo')
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending', verbose_name='Estado')
    
    # Monto
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Monto')
    currency = models.CharField(max_length=3, default='COP', verbose_name='Moneda')
    
    # Método de pago
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, verbose_name='Método de pago')
    payment_account = models.ForeignKey(
        PaymentAccount,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Cuenta de destino'
    )
    
    # Plan asociado (si aplica)
    pricing_plan = models.ForeignKey(
        PricingPlan,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Plan'
    )
    
    # Referencia al objeto pagado
    content_type = models.CharField(max_length=50, blank=True, verbose_name='Tipo de contenido')
    object_id = models.CharField(max_length=50, blank=True, verbose_name='ID del objeto')
    
    # Comprobante de pago
    payment_proof = models.ImageField(upload_to='payment_proofs/', null=True, blank=True, verbose_name='Comprobante de pago')
    payment_proof_url = models.URLField(blank=True, verbose_name='URL del comprobante')
    
    # Verificación
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_transactions',
        verbose_name='Verificado por'
    )
    verified_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de verificación')
    verification_notes = models.TextField(blank=True, verbose_name='Notas de verificación')
    
    # Metadatos
    metadata = models.JSONField(default=dict, blank=True, verbose_name='Metadatos')
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name='IP')
    user_agent = models.TextField(blank=True, verbose_name='User Agent')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de completado')
    
    class Meta:
        db_table = 'transactions'
        verbose_name = 'Transacción'
        verbose_name_plural = 'Transacciones'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['transaction_type', '-created_at']),
            models.Index(fields=['reference_code']),
        ]
    
    def __str__(self):
        return f"{self.reference_code} - {self.get_transaction_type_display()} - ${self.amount:,.0f}"
    
    def save(self, *args, **kwargs):
        if not self.reference_code:
            import random
            import string
            self.reference_code = 'TXN-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))
        super().save(*args, **kwargs)


class EnterpriseClassifiedPayment(models.Model):
    """
    Pagos específicos para publicaciones de empresas en clasificados.
    """
    STATUS_CHOICES = [
        ('pending_payment', 'Pendiente de Pago'),
        ('pending_verification', 'Pendiente de Verificación'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
        ('expired', 'Expirado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relaciones
    enterprise = models.ForeignKey(
        'enterprises.Enterprise',
        on_delete=models.CASCADE,
        related_name='classified_payments',
        verbose_name='Empresa'
    )
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='classified_payment',
        verbose_name='Transacción'
    )
    pricing_plan = models.ForeignKey(
        PricingPlan,
        on_delete=models.PROTECT,
        verbose_name='Plan'
    )
    
    # Clasificado asociado (se crea después del pago)
    classified_id = models.CharField(max_length=50, blank=True, verbose_name='ID del clasificado')
    classified_type = models.CharField(max_length=30, blank=True, verbose_name='Tipo de clasificado')
    
    # Estado
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending_payment', verbose_name='Estado')
    
    # Fechas de vigencia
    starts_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de inicio')
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de expiración')
    
    # Metadatos
    classified_data = models.JSONField(default=dict, blank=True, verbose_name='Datos del clasificado')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'enterprise_classified_payments'
        verbose_name = 'Pago de Clasificado Empresarial'
        verbose_name_plural = 'Pagos de Clasificados Empresariales'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.enterprise.name} - {self.pricing_plan.name} - {self.get_status_display()}"


class AdvertisingPayment(models.Model):
    """
    Pagos para pautas publicitarias.
    """
    STATUS_CHOICES = [
        ('pending_payment', 'Pendiente de Pago'),
        ('pending_verification', 'Pendiente de Verificación'),
        ('approved', 'Aprobado'),
        ('active', 'Activo'),
        ('paused', 'Pausado'),
        ('completed', 'Completado'),
        ('rejected', 'Rechazado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Usuario o empresa
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='advertising_payments',
        verbose_name='Usuario'
    )
    enterprise = models.ForeignKey(
        'enterprises.Enterprise',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='advertising_payments',
        verbose_name='Empresa'
    )
    
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='advertising_payment',
        verbose_name='Transacción'
    )
    pricing_plan = models.ForeignKey(
        PricingPlan,
        on_delete=models.PROTECT,
        verbose_name='Plan'
    )
    
    # Contenido publicitario
    ad_title = models.CharField(max_length=200, verbose_name='Título del anuncio')
    ad_content = models.TextField(verbose_name='Contenido')
    ad_image = models.ImageField(upload_to='ads/', null=True, blank=True, verbose_name='Imagen')
    ad_url = models.URLField(blank=True, verbose_name='URL de destino')
    
    # Estado y métricas
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending_payment', verbose_name='Estado')
    impressions = models.PositiveIntegerField(default=0, verbose_name='Impresiones')
    clicks = models.PositiveIntegerField(default=0, verbose_name='Clics')
    
    # Fechas
    starts_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de inicio')
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de expiración')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'advertising_payments'
        verbose_name = 'Pago de Publicidad'
        verbose_name_plural = 'Pagos de Publicidad'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.ad_title} - {self.get_status_display()}"


class DonationTransaction(models.Model):
    """
    Transacciones de donaciones a atletas.
    """
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('pending_verification', 'Pendiente de Verificación'),
        ('completed', 'Completada'),
        ('failed', 'Fallida'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Donante
    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payment_donations_made',
        verbose_name='Donante'
    )
    donor_name = models.CharField(max_length=200, blank=True, verbose_name='Nombre del donante')
    donor_email = models.EmailField(blank=True, verbose_name='Email del donante')
    is_anonymous = models.BooleanField(default=False, verbose_name='Donación anónima')
    
    # Receptor (atleta)
    athlete = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_donations_received',
        verbose_name='Atleta'
    )
    
    # Campaña de donación (si aplica)
    campaign_id = models.CharField(max_length=50, blank=True, verbose_name='ID de campaña')
    
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='donation',
        verbose_name='Transacción'
    )
    
    # Monto
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Monto')
    currency = models.CharField(max_length=3, default='COP', verbose_name='Moneda')
    
    # Mensaje
    message = models.TextField(blank=True, verbose_name='Mensaje de apoyo')
    
    # Estado
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending', verbose_name='Estado')
    
    # Comisión de la plataforma
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Comisión plataforma')
    athlete_receives = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Atleta recibe')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'donation_transactions'
        verbose_name = 'Donación'
        verbose_name_plural = 'Donaciones'
        ordering = ['-created_at']
    
    def __str__(self):
        donor_display = 'Anónimo' if self.is_anonymous else (self.donor_name or self.donor.username if self.donor else 'Desconocido')
        return f"{donor_display} → {self.athlete.username} - ${self.amount:,.0f}"
    
    def save(self, *args, **kwargs):
        # Calcular comisión (5% por defecto)
        if not self.platform_fee:
            self.platform_fee = self.amount * Decimal('0.05')
        self.athlete_receives = self.amount - self.platform_fee
        super().save(*args, **kwargs)


class PlatformSettings(models.Model):
    """
    Configuraciones globales de la plataforma para pagos.
    Singleton - solo debe existir un registro.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Comisiones
    donation_fee_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=5.00,
        verbose_name='Comisión de donaciones (%)'
    )
    
    # Moneda por defecto
    default_currency = models.CharField(max_length=3, default='COP', verbose_name='Moneda por defecto')
    
    # Configuración de verificación
    auto_approve_under = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        verbose_name='Auto-aprobar pagos menores a',
        help_text='0 = requiere verificación manual siempre'
    )
    
    # Notificaciones
    notify_admin_on_payment = models.BooleanField(default=True, verbose_name='Notificar admin en pagos')
    admin_notification_email = models.EmailField(blank=True, verbose_name='Email de notificaciones')
    
    # Textos
    payment_instructions = models.TextField(blank=True, verbose_name='Instrucciones de pago')
    terms_and_conditions = models.TextField(blank=True, verbose_name='Términos y condiciones')
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'platform_settings'
        verbose_name = 'Configuración de Plataforma'
        verbose_name_plural = 'Configuración de Plataforma'
    
    def __str__(self):
        return "Configuración de Pagos"
    
    @classmethod
    def get_settings(cls):
        """Obtener o crear la configuración singleton"""
        settings, _ = cls.objects.get_or_create(pk='00000000-0000-0000-0000-000000000001')
        return settings

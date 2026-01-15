"""
Serializers para Pagos y Transacciones
"""
from rest_framework import serializers
from decimal import Decimal
from .models import (
    PaymentAccount, PricingPlan, Transaction,
    EnterpriseClassifiedPayment, AdvertisingPayment,
    DonationTransaction, PlatformSettings
)


class PaymentAccountPublicSerializer(serializers.ModelSerializer):
    """Serializer público para cuentas de pago (sin datos sensibles)"""
    account_number_masked = serializers.SerializerMethodField()
    
    class Meta:
        model = PaymentAccount
        fields = [
            'id', 'name', 'account_type', 'account_number_masked',
            'account_holder', 'bank_name', 'currency'
        ]
    
    def get_account_number_masked(self, obj):
        if len(obj.account_number) > 4:
            return f"****{obj.account_number[-4:]}"
        return "****"


class PricingPlanSerializer(serializers.ModelSerializer):
    """Serializer para planes de precios"""
    duration_display = serializers.SerializerMethodField()
    price_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = PricingPlan
        fields = [
            'id', 'name', 'service_type', 'description',
            'price', 'price_formatted', 'currency',
            'duration_value', 'duration_unit', 'duration_display',
            'features', 'is_active'
        ]
    
    def get_duration_display(self, obj):
        return obj.get_duration_display_full()
    
    def get_price_formatted(self, obj):
        return f"${obj.price:,.0f} {obj.currency}"


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer para transacciones"""
    user_display = serializers.CharField(source='user.username', read_only=True)
    enterprise_name = serializers.CharField(source='enterprise.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'reference_code', 'user', 'user_display',
            'enterprise', 'enterprise_name',
            'transaction_type', 'type_display',
            'status', 'status_display',
            'amount', 'currency',
            'payment_method', 'payment_method_display',
            'payment_proof', 'payment_proof_url',
            'created_at', 'completed_at'
        ]
        read_only_fields = ['id', 'reference_code', 'created_at', 'completed_at']


class CreateTransactionSerializer(serializers.ModelSerializer):
    """Serializer para crear transacciones"""
    
    class Meta:
        model = Transaction
        fields = [
            'transaction_type', 'amount', 'currency',
            'payment_method', 'payment_account',
            'pricing_plan', 'enterprise',
            'content_type', 'object_id',
            'payment_proof', 'payment_proof_url',
            'metadata'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['status'] = 'pending_verification'
        
        # Obtener IP y User Agent
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = self.get_client_ip(request)
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
        return super().create(validated_data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')


class EnterpriseClassifiedPaymentSerializer(serializers.ModelSerializer):
    """Serializer para pagos de clasificados empresariales"""
    enterprise_name = serializers.CharField(source='enterprise.name', read_only=True)
    plan_name = serializers.CharField(source='pricing_plan.name', read_only=True)
    plan_price = serializers.DecimalField(source='pricing_plan.price', max_digits=12, decimal_places=2, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = EnterpriseClassifiedPayment
        fields = [
            'id', 'enterprise', 'enterprise_name',
            'pricing_plan', 'plan_name', 'plan_price',
            'transaction', 'classified_id', 'classified_type',
            'status', 'status_display',
            'starts_at', 'expires_at',
            'classified_data', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AdvertisingPaymentSerializer(serializers.ModelSerializer):
    """Serializer para pagos de publicidad"""
    user_display = serializers.CharField(source='user.username', read_only=True)
    enterprise_name = serializers.CharField(source='enterprise.name', read_only=True)
    plan_name = serializers.CharField(source='pricing_plan.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    ctr = serializers.SerializerMethodField()
    
    class Meta:
        model = AdvertisingPayment
        fields = [
            'id', 'user', 'user_display',
            'enterprise', 'enterprise_name',
            'pricing_plan', 'plan_name',
            'transaction',
            'ad_title', 'ad_content', 'ad_image', 'ad_url',
            'status', 'status_display',
            'impressions', 'clicks', 'ctr',
            'starts_at', 'expires_at',
            'created_at'
        ]
        read_only_fields = ['id', 'impressions', 'clicks', 'created_at']
    
    def get_ctr(self, obj):
        if obj.impressions > 0:
            return round((obj.clicks / obj.impressions) * 100, 2)
        return 0


class DonationTransactionSerializer(serializers.ModelSerializer):
    """Serializer para donaciones"""
    donor_display = serializers.SerializerMethodField()
    athlete_display = serializers.CharField(source='athlete.username', read_only=True)
    athlete_name = serializers.CharField(source='athlete.display_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = DonationTransaction
        fields = [
            'id', 'donor', 'donor_display', 'donor_name', 'donor_email',
            'is_anonymous', 'athlete', 'athlete_display', 'athlete_name',
            'campaign_id', 'transaction',
            'amount', 'currency', 'message',
            'status', 'status_display',
            'platform_fee', 'athlete_receives',
            'created_at'
        ]
        read_only_fields = ['id', 'platform_fee', 'athlete_receives', 'created_at']
    
    def get_donor_display(self, obj):
        if obj.is_anonymous:
            return 'Anónimo'
        return obj.donor_name or (obj.donor.display_name if obj.donor else 'Desconocido')


class CreateDonationSerializer(serializers.Serializer):
    """Serializer para crear donaciones"""
    athlete_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('1000'))
    currency = serializers.CharField(default='COP', max_length=3)
    message = serializers.CharField(required=False, allow_blank=True, max_length=500)
    is_anonymous = serializers.BooleanField(default=False)
    donor_name = serializers.CharField(required=False, allow_blank=True, max_length=200)
    donor_email = serializers.EmailField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=Transaction.PAYMENT_METHOD_CHOICES)
    payment_proof = serializers.ImageField(required=False)
    campaign_id = serializers.CharField(required=False, allow_blank=True)


class PlatformSettingsSerializer(serializers.ModelSerializer):
    """Serializer para configuración de plataforma"""
    
    class Meta:
        model = PlatformSettings
        fields = [
            'donation_fee_percentage', 'default_currency',
            'payment_instructions', 'terms_and_conditions'
        ]

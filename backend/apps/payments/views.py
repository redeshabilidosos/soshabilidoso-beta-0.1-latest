"""
Views para Pagos y Transacciones
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView
from django.db.models import Sum, Count
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import (
    PaymentAccount, PricingPlan, Transaction,
    EnterpriseClassifiedPayment, AdvertisingPayment,
    DonationTransaction, PlatformSettings
)
from .serializers import (
    PaymentAccountPublicSerializer, PricingPlanSerializer,
    TransactionSerializer, CreateTransactionSerializer,
    EnterpriseClassifiedPaymentSerializer, AdvertisingPaymentSerializer,
    DonationTransactionSerializer, CreateDonationSerializer,
    PlatformSettingsSerializer
)


class PaymentAccountViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para cuentas de pago (solo lectura pública)"""
    serializer_class = PaymentAccountPublicSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = PaymentAccount.objects.filter(is_active=True)
        
        # Filtrar por servicio
        service = self.request.query_params.get('service')
        if service == 'classifieds':
            queryset = queryset.filter(for_classifieds=True)
        elif service == 'advertising':
            queryset = queryset.filter(for_advertising=True)
        elif service == 'donations':
            queryset = queryset.filter(for_donations=True)
        
        return queryset


class PricingPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para planes de precios"""
    serializer_class = PricingPlanSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = PricingPlan.objects.filter(is_active=True)
        
        # Filtrar por tipo de servicio
        service_type = self.request.query_params.get('service_type')
        if service_type:
            queryset = queryset.filter(service_type=service_type)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def classifieds(self, request):
        """Obtener planes para clasificados"""
        plans = PricingPlan.objects.filter(
            is_active=True,
            service_type__startswith='classified_'
        )
        serializer = self.get_serializer(plans, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def advertising(self, request):
        """Obtener planes para publicidad"""
        plans = PricingPlan.objects.filter(
            is_active=True,
            service_type__startswith='ad_'
        )
        serializer = self.get_serializer(plans, many=True)
        return Response(serializer.data)


class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet para transacciones"""
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTransactionSerializer
        return TransactionSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Transaction.objects.filter(user=user)
        
        # Filtrar por estado
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filtrar por tipo
        type_filter = self.request.query_params.get('type')
        if type_filter:
            queryset = queryset.filter(transaction_type=type_filter)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def upload_proof(self, request, pk=None):
        """Subir comprobante de pago"""
        transaction = self.get_object()
        
        if transaction.status not in ['pending', 'pending_verification']:
            return Response(
                {'error': 'No se puede subir comprobante para esta transacción'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if 'payment_proof' not in request.FILES:
            return Response(
                {'error': 'No se proporcionó archivo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transaction.payment_proof = request.FILES['payment_proof']
        transaction.status = 'pending_verification'
        transaction.save()
        
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Resumen de transacciones del usuario"""
        user = request.user
        transactions = Transaction.objects.filter(user=user)
        
        summary = {
            'total_transactions': transactions.count(),
            'total_amount': transactions.filter(status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0,
            'pending': transactions.filter(status__in=['pending', 'pending_verification']).count(),
            'completed': transactions.filter(status='completed').count(),
            'by_type': {}
        }
        
        for t_type, _ in Transaction.TRANSACTION_TYPE_CHOICES:
            count = transactions.filter(transaction_type=t_type).count()
            if count > 0:
                summary['by_type'][t_type] = count
        
        return Response(summary)


class DonationViewSet(viewsets.ModelViewSet):
    """ViewSet para donaciones"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateDonationSerializer
        return DonationTransactionSerializer
    
    def get_queryset(self):
        user = self.request.user
        # Mostrar donaciones hechas y recibidas
        return DonationTransaction.objects.filter(
            donor=user
        ) | DonationTransaction.objects.filter(
            athlete=user
        )
    
    def create(self, request):
        """Crear una donación"""
        serializer = CreateDonationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Obtener atleta
        from apps.users.models import User
        athlete = get_object_or_404(User, id=data['athlete_id'])
        
        # Obtener configuración de plataforma
        settings = PlatformSettings.get_settings()
        
        # Crear transacción principal
        transaction = Transaction.objects.create(
            user=request.user,
            transaction_type='donation',
            amount=data['amount'],
            currency=data['currency'],
            payment_method=data['payment_method'],
            status='pending_verification',
            content_type='donation',
            payment_proof=data.get('payment_proof'),
        )
        
        # Crear donación
        donation = DonationTransaction.objects.create(
            donor=request.user if not data.get('is_anonymous') else None,
            donor_name=data.get('donor_name', request.user.display_name),
            donor_email=data.get('donor_email', request.user.email),
            is_anonymous=data.get('is_anonymous', False),
            athlete=athlete,
            campaign_id=data.get('campaign_id', ''),
            transaction=transaction,
            amount=data['amount'],
            currency=data['currency'],
            message=data.get('message', ''),
            status='pending_verification',
        )
        
        return Response(
            DonationTransactionSerializer(donation).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def received(self, request):
        """Donaciones recibidas por el usuario"""
        donations = DonationTransaction.objects.filter(
            athlete=request.user
        ).order_by('-created_at')
        
        serializer = DonationTransactionSerializer(donations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def made(self, request):
        """Donaciones hechas por el usuario"""
        donations = DonationTransaction.objects.filter(
            donor=request.user
        ).order_by('-created_at')
        
        serializer = DonationTransactionSerializer(donations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas de donaciones del usuario"""
        user = request.user
        
        received = DonationTransaction.objects.filter(athlete=user, status='completed')
        made = DonationTransaction.objects.filter(donor=user, status='completed')
        
        return Response({
            'received': {
                'count': received.count(),
                'total': received.aggregate(total=Sum('athlete_receives'))['total'] or 0,
            },
            'made': {
                'count': made.count(),
                'total': made.aggregate(total=Sum('amount'))['total'] or 0,
            }
        })


class EnterpriseClassifiedPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet para pagos de clasificados empresariales"""
    serializer_class = EnterpriseClassifiedPaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return EnterpriseClassifiedPayment.objects.filter(
            enterprise__owner=user
        )
    
    @action(detail=False, methods=['post'])
    def initiate(self, request):
        """Iniciar proceso de pago para clasificado"""
        enterprise_id = request.data.get('enterprise_id')
        plan_id = request.data.get('plan_id')
        classified_data = request.data.get('classified_data', {})
        
        if not enterprise_id or not plan_id:
            return Response(
                {'error': 'Se requiere enterprise_id y plan_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from apps.enterprises.models import Enterprise
        enterprise = get_object_or_404(Enterprise, id=enterprise_id, owner=request.user)
        plan = get_object_or_404(PricingPlan, id=plan_id, is_active=True)
        
        # Crear registro de pago pendiente
        payment = EnterpriseClassifiedPayment.objects.create(
            enterprise=enterprise,
            pricing_plan=plan,
            classified_data=classified_data,
            status='pending_payment'
        )
        
        # Obtener cuentas de pago disponibles
        accounts = PaymentAccount.objects.filter(is_active=True, for_classifieds=True)
        
        return Response({
            'payment_id': str(payment.id),
            'plan': PricingPlanSerializer(plan).data,
            'payment_accounts': PaymentAccountPublicSerializer(accounts, many=True).data,
            'instructions': PlatformSettings.get_settings().payment_instructions
        })


class AdvertisingPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet para pagos de publicidad"""
    serializer_class = AdvertisingPaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return AdvertisingPayment.objects.filter(user=user)


class PlatformInfoView(APIView):
    """Vista para información pública de la plataforma"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        settings = PlatformSettings.get_settings()
        
        # Planes activos
        classified_plans = PricingPlan.objects.filter(
            is_active=True,
            service_type__startswith='classified_'
        )
        ad_plans = PricingPlan.objects.filter(
            is_active=True,
            service_type__startswith='ad_'
        )
        
        return Response({
            'donation_fee_percentage': settings.donation_fee_percentage,
            'default_currency': settings.default_currency,
            'payment_instructions': settings.payment_instructions,
            'terms_and_conditions': settings.terms_and_conditions,
            'classified_plans': PricingPlanSerializer(classified_plans, many=True).data,
            'advertising_plans': PricingPlanSerializer(ad_plans, many=True).data,
        })

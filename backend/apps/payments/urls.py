"""
URLs para Pagos y Transacciones
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentAccountViewSet, PricingPlanViewSet,
    TransactionViewSet, DonationViewSet,
    EnterpriseClassifiedPaymentViewSet, AdvertisingPaymentViewSet,
    PlatformInfoView
)

router = DefaultRouter()
router.register(r'accounts', PaymentAccountViewSet, basename='payment-account')
router.register(r'plans', PricingPlanViewSet, basename='pricing-plan')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'donations', DonationViewSet, basename='donation')
router.register(r'classified-payments', EnterpriseClassifiedPaymentViewSet, basename='classified-payment')
router.register(r'advertising-payments', AdvertisingPaymentViewSet, basename='advertising-payment')

urlpatterns = [
    path('', include(router.urls)),
    path('info/', PlatformInfoView.as_view(), name='platform-info'),
]

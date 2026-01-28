"""
Personalización del sitio de administración de Django
"""
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import GroupAdmin
from django.db.models import Sum
from django.utils import timezone


# Extender la clase AdminSite para agregar estadísticas
class CustomAdminSite(admin.AdminSite):
    site_header = "SOS-HABILIDOSO - Panel de Administración"
    site_title = "SOS-HABILIDOSO Admin"
    index_title = "Panel de Control"
    
    def index(self, request, extra_context=None):
        """
        Personalizar la página de inicio del admin con estadísticas
        """
        extra_context = extra_context or {}
        
        try:
            # Importar modelos
            from apps.users.models import User
            from apps.finance.models import Transaction, PlatformRevenue
            from apps.advertising.models import Advertisement
            
            # Estadísticas de usuarios
            total_users = User.objects.count()
            active_users = User.objects.filter(is_active=True).count()
            
            # Estadísticas financieras
            total_revenue = PlatformRevenue.objects.aggregate(total=Sum('amount'))['total'] or 0
            
            # Ingresos del mes actual
            today = timezone.now()
            month_start = today.replace(day=1)
            month_revenue = PlatformRevenue.objects.filter(
                date__gte=month_start
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Estadísticas de anuncios
            total_ads = Advertisement.objects.count()
            active_ads = Advertisement.objects.filter(status='active').count()
            
            # Transacciones de hoy
            today_start = today.replace(hour=0, minute=0, second=0, microsecond=0)
            today_transactions = Transaction.objects.filter(created_at__gte=today_start).count()
            today_transaction_amount = Transaction.objects.filter(
                created_at__gte=today_start,
                status='completed'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Agregar al contexto
            extra_context.update({
                'total_users': total_users,
                'active_users': active_users,
                'total_revenue': total_revenue,
                'month_revenue': month_revenue,
                'total_ads': total_ads,
                'active_ads': active_ads,
                'today_transactions': today_transactions,
                'today_transaction_amount': today_transaction_amount,
            })
            
            print(f"[OK] Estadisticas cargadas: {total_users} usuarios totales, {active_users} activos")
        except Exception as e:
            # Si hay algún error, continuar sin estadísticas
            print(f"Error al cargar estadísticas del admin: {e}")
            import traceback
            traceback.print_exc()
        
        return super().index(request, extra_context=extra_context)


# Crear instancia personalizada del admin
custom_admin_site = CustomAdminSite(name='admin')

# Registrar el modelo Group
custom_admin_site.register(Group, GroupAdmin)

# ============================================================
# REGISTRAR MODELOS EN EL ADMIN PERSONALIZADO
# ============================================================

# Publicidad
from apps.advertising.models import Advertisement, AdImpression, AdClick, AdVideoView
from apps.advertising.admin import (
    AdvertisementAdmin, AdImpressionAdmin, AdClickAdmin, AdVideoViewAdmin
)
custom_admin_site.register(Advertisement, AdvertisementAdmin)
custom_admin_site.register(AdImpression, AdImpressionAdmin)
custom_admin_site.register(AdClick, AdClickAdmin)
custom_admin_site.register(AdVideoView, AdVideoViewAdmin)

# Usuarios
from apps.users.models import User, Follow, FriendRequest, Friendship
from apps.users.admin import UserAdmin, FollowAdmin, FriendRequestAdmin, FriendshipAdmin
custom_admin_site.register(User, UserAdmin)
custom_admin_site.register(Follow, FollowAdmin)
custom_admin_site.register(FriendRequest, FriendRequestAdmin)
custom_admin_site.register(Friendship, FriendshipAdmin)

# Posts
from apps.posts.models import Post, PostReaction, Comment, PostBookmark, PostReport
from apps.posts.admin import PostAdmin, PostReactionAdmin, CommentAdmin, PostBookmarkAdmin, PostReportAdmin
custom_admin_site.register(Post, PostAdmin)
custom_admin_site.register(PostReaction, PostReactionAdmin)
custom_admin_site.register(Comment, CommentAdmin)
custom_admin_site.register(PostBookmark, PostBookmarkAdmin)
custom_admin_site.register(PostReport, PostReportAdmin)

# Comunidades
from apps.communities.models import Community, CommunityMembership, CommunityPost, CommunityPostComment, CommunitySocialLink
from apps.communities.admin import CommunityAdmin, CommunityMembershipAdmin, CommunityPostAdmin, CommunityPostCommentAdmin, CommunitySocialLinkAdmin
custom_admin_site.register(Community, CommunityAdmin)
custom_admin_site.register(CommunityMembership, CommunityMembershipAdmin)
custom_admin_site.register(CommunityPost, CommunityPostAdmin)
custom_admin_site.register(CommunityPostComment, CommunityPostCommentAdmin)
custom_admin_site.register(CommunitySocialLink, CommunitySocialLinkAdmin)

# ============================================================
# CAPACITACIONES Y APRENDIZAJE
# ============================================================
from apps.learning.models import Seccion, Tema, TemaContenido, TemaPuntoClave, ProgresoUsuario, Logro, UsuarioLogro
from apps.learning.admin import SeccionAdmin, TemaAdmin, ProgresoUsuarioAdmin, LogroAdmin, UsuarioLogroAdmin
custom_admin_site.register(Seccion, SeccionAdmin)
custom_admin_site.register(Tema, TemaAdmin)
custom_admin_site.register(ProgresoUsuario, ProgresoUsuarioAdmin)
custom_admin_site.register(Logro, LogroAdmin)
custom_admin_site.register(UsuarioLogro, UsuarioLogroAdmin)

# ============================================================
# DONACIONES A DEPORTISTAS
# ============================================================
from apps.donations.models import SportCategory, AthleteProfile, AthleteMedia, Donation
from apps.donations.admin import SportCategoryAdmin, AthleteProfileAdmin, AthleteMediaAdmin, DonationAdmin
custom_admin_site.register(SportCategory, SportCategoryAdmin)
custom_admin_site.register(AthleteProfile, AthleteProfileAdmin)
custom_admin_site.register(AthleteMedia, AthleteMediaAdmin)
custom_admin_site.register(Donation, DonationAdmin)

# ============================================================
# EMPRESAS
# ============================================================
from apps.enterprises.models import Enterprise, EnterpriseFollow
from apps.enterprises.admin import EnterpriseAdmin, EnterpriseFollowAdmin
custom_admin_site.register(Enterprise, EnterpriseAdmin)
custom_admin_site.register(EnterpriseFollow, EnterpriseFollowAdmin)

# ============================================================
# PAGOS Y TRANSACCIONES
# ============================================================
from apps.payments.models import (
    PaymentAccount, PricingPlan, Transaction,
    EnterpriseClassifiedPayment, AdvertisingPayment,
    DonationTransaction, PlatformSettings
)
from apps.payments.admin import (
    PaymentAccountAdmin, PricingPlanAdmin, TransactionAdmin,
    EnterpriseClassifiedPaymentAdmin, AdvertisingPaymentAdmin,
    DonationTransactionAdmin, PlatformSettingsAdmin
)
custom_admin_site.register(PaymentAccount, PaymentAccountAdmin)
custom_admin_site.register(PricingPlan, PricingPlanAdmin)
custom_admin_site.register(Transaction, TransactionAdmin)
custom_admin_site.register(EnterpriseClassifiedPayment, EnterpriseClassifiedPaymentAdmin)
custom_admin_site.register(AdvertisingPayment, AdvertisingPaymentAdmin)
custom_admin_site.register(DonationTransaction, DonationTransactionAdmin)
custom_admin_site.register(PlatformSettings, PlatformSettingsAdmin)

# ============================================================
# CONFIGURACIONES DEL SITIO
# ============================================================
from apps.site_settings.models import SiteSettings
from apps.site_settings.admin import SiteSettingsAdmin
custom_admin_site.register(SiteSettings, SiteSettingsAdmin)

# ============================================================
# SISTEMA DE STREAMING
# ============================================================
from apps.streaming.models import (
    StreamSession, StreamGift, StreamViewer,
    StreamChatMessage, StreamReport, StreamEarnings
)
from apps.streaming.admin import (
    StreamSessionAdmin, StreamGiftAdmin, StreamViewerAdmin,
    StreamChatMessageAdmin, StreamReportAdmin, StreamEarningsAdmin
)
custom_admin_site.register(StreamSession, StreamSessionAdmin)
custom_admin_site.register(StreamGift, StreamGiftAdmin)
custom_admin_site.register(StreamViewer, StreamViewerAdmin)
custom_admin_site.register(StreamChatMessage, StreamChatMessageAdmin)
custom_admin_site.register(StreamReport, StreamReportAdmin)
custom_admin_site.register(StreamEarnings, StreamEarningsAdmin)


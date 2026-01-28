from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from django.db.models import Count, Sum, Avg, Q, F
from django.db.models.functions import TruncDate
from datetime import timedelta
from .models import (
    StreamSession, StreamGift, StreamViewer, 
    StreamChatMessage, StreamReport, StreamEarnings
)


@admin.register(StreamSession)
class StreamSessionAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'streamer', 'status_badge', 'started_at', 'duration_display',
        'peak_viewers', 'total_viewers_count', 'total_gifts_display', 
        'total_messages_count', 'ban_status'
    ]
    list_filter = ['status', 'is_banned', 'started_at']
    search_fields = ['title', 'streamer__username', 'streamer__email']
    readonly_fields = [
        'stream_key', 'started_at', 'peak_viewers', 'total_gifts_received',
        'get_statistics', 'get_viewer_analytics', 'get_earnings_summary'
    ]
    actions = ['ban_stream', 'unban_stream', 'end_stream']
    
    fieldsets = (
        ('Información del Stream', {
            'fields': ('streamer', 'title', 'description', 'stream_key', 'status')
        }),
        ('Estadísticas Básicas', {
            'fields': ('started_at', 'ended_at', 'peak_viewers', 'total_gifts_received')
        }),
        ('📊 Estadísticas Detalladas', {
            'fields': ('get_statistics',),
            'classes': ('collapse',)
        }),
        ('👥 Análisis de Audiencia', {
            'fields': ('get_viewer_analytics',),
            'classes': ('collapse',)
        }),
        ('💰 Resumen de Ganancias', {
            'fields': ('get_earnings_summary',),
            'classes': ('collapse',)
        }),
        ('Moderación', {
            'fields': ('is_banned', 'ban_reason', 'banned_by', 'banned_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'live': 'red',
            'ended': 'gray',
            'banned': 'black'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Estado'
    
    def duration_display(self, obj):
        if obj.ended_at and obj.started_at:
            duration = obj.ended_at - obj.started_at
            hours = duration.seconds // 3600
            minutes = (duration.seconds % 3600) // 60
            return format_html('<strong>{}h {}m</strong>', hours, minutes)
        elif obj.started_at:
            duration = timezone.now() - obj.started_at
            hours = duration.seconds // 3600
            minutes = (duration.seconds % 3600) // 60
            return format_html('<span style="color: red;">🔴 {}h {}m</span>', hours, minutes)
        return '-'
    duration_display.short_description = 'Duración'
    
    def total_viewers_count(self, obj):
        count = obj.viewers.count()
        return format_html('<strong>{}</strong> espectadores', count)
    total_viewers_count.short_description = 'Total Espectadores'
    
    def total_messages_count(self, obj):
        count = obj.chat_messages.filter(is_deleted=False).count()
        return format_html('<strong>{}</strong> mensajes', count)
    total_messages_count.short_description = 'Mensajes'
    
    def total_gifts_display(self, obj):
        return format_html('<strong style="color: green;">${}</strong>', obj.total_gifts_received)
    total_gifts_display.short_description = 'Regalos Totales'
    
    def ban_status(self, obj):
        if obj.is_banned:
            return format_html('<span style="color: red;">🚫 BANEADO</span>')
        return format_html('<span style="color: green;">✅ Activo</span>')
    ban_status.short_description = 'Estado de Ban'
    
    def get_statistics(self, obj):
        """Estadísticas detalladas del stream"""
        # Contar regalos por tipo
        gifts_by_type = obj.gifts.values('gift_type').annotate(
            count=Count('id'),
            total=Sum('amount')
        ).order_by('-total')
        
        # Mensajes por hora
        total_messages = obj.chat_messages.filter(is_deleted=False).count()
        deleted_messages = obj.chat_messages.filter(is_deleted=True).count()
        
        # Reportes
        total_reports = obj.reports.count()
        pending_reports = obj.reports.filter(status='pending').count()
        
        html = '<div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">'
        html += '<h3 style="margin-top: 0;">📊 Estadísticas del Stream</h3>'
        
        # Regalos por tipo
        html += '<h4>🎁 Regalos Recibidos:</h4><ul>'
        for gift in gifts_by_type:
            gift_names = dict(StreamGift.GIFT_TYPES)
            html += f'<li><strong>{gift_names.get(gift["gift_type"])}</strong>: {gift["count"]} unidades (${gift["total"]})</li>'
        html += '</ul>'
        
        # Mensajes
        html += f'<h4>💬 Actividad del Chat:</h4><ul>'
        html += f'<li>Total de mensajes: <strong>{total_messages}</strong></li>'
        html += f'<li>Mensajes eliminados: <strong>{deleted_messages}</strong></li>'
        html += f'<li>Tasa de moderación: <strong>{(deleted_messages/total_messages*100) if total_messages > 0 else 0:.1f}%</strong></li>'
        html += '</ul>'
        
        # Reportes
        html += f'<h4>⚠️ Reportes:</h4><ul>'
        html += f'<li>Total de reportes: <strong>{total_reports}</strong></li>'
        html += f'<li>Reportes pendientes: <strong style="color: orange;">{pending_reports}</strong></li>'
        html += '</ul>'
        
        html += '</div>'
        return format_html(html)
    get_statistics.short_description = 'Estadísticas Detalladas'
    
    def get_viewer_analytics(self, obj):
        """Análisis de audiencia"""
        viewers = obj.viewers.all()
        total_viewers = viewers.count()
        
        # Seguidores nuevos vs antiguos (simulado - necesitarías un modelo de seguidores)
        # Por ahora, consideramos "antiguos" a los que han visto más de 1 stream
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        viewer_users = viewers.values_list('user', flat=True)
        repeat_viewers = StreamViewer.objects.filter(
            user__in=viewer_users
        ).values('user').annotate(
            stream_count=Count('stream_session')
        ).filter(stream_count__gt=1).count()
        
        new_viewers = total_viewers - repeat_viewers
        
        # Tiempo promedio de visualización (si tienes joined_at y left_at)
        viewers_with_duration = viewers.filter(left_at__isnull=False)
        if viewers_with_duration.exists():
            avg_duration = viewers_with_duration.annotate(
                duration=F('left_at') - F('joined_at')
            ).aggregate(avg=Avg('duration'))['avg']
            avg_minutes = avg_duration.seconds // 60 if avg_duration else 0
        else:
            avg_minutes = 0
        
        html = '<div style="background: #e3f2fd; padding: 15px; border-radius: 5px;">'
        html += '<h3 style="margin-top: 0;">👥 Análisis de Audiencia</h3>'
        
        html += f'<h4>📈 Resumen de Espectadores:</h4><ul>'
        html += f'<li>Total de espectadores: <strong>{total_viewers}</strong></li>'
        html += f'<li>Pico de espectadores simultáneos: <strong>{obj.peak_viewers}</strong></li>'
        html += f'<li>Espectadores nuevos: <strong style="color: green;">{new_viewers}</strong></li>'
        html += f'<li>Espectadores recurrentes: <strong style="color: blue;">{repeat_viewers}</strong></li>'
        html += f'<li>Tiempo promedio de visualización: <strong>{avg_minutes} minutos</strong></li>'
        html += '</ul>'
        
        # Tasa de retención
        retention_rate = (repeat_viewers / total_viewers * 100) if total_viewers > 0 else 0
        html += f'<h4>📊 Métricas de Engagement:</h4><ul>'
        html += f'<li>Tasa de retención: <strong>{retention_rate:.1f}%</strong></li>'
        html += f'<li>Mensajes por espectador: <strong>{obj.chat_messages.count() / total_viewers if total_viewers > 0 else 0:.1f}</strong></li>'
        html += f'<li>Regalos por espectador: <strong>{obj.gifts.count() / total_viewers if total_viewers > 0 else 0:.2f}</strong></li>'
        html += '</ul>'
        
        html += '</div>'
        return format_html(html)
    get_viewer_analytics.short_description = 'Análisis de Audiencia'
    
    def get_earnings_summary(self, obj):
        """Resumen de ganancias"""
        earnings = obj.earnings.first()
        gifts = obj.gifts.all()
        
        total_gifts = gifts.aggregate(total=Sum('amount'))['total'] or 0
        gift_count = gifts.count()
        avg_gift = total_gifts / gift_count if gift_count > 0 else 0
        
        # Top donadores
        top_donors = gifts.values('sender__username').annotate(
            total=Sum('amount')
        ).order_by('-total')[:5]
        
        html = '<div style="background: #e8f5e9; padding: 15px; border-radius: 5px;">'
        html += '<h3 style="margin-top: 0;">💰 Resumen de Ganancias</h3>'
        
        html += f'<h4>💵 Ingresos:</h4><ul>'
        html += f'<li>Total bruto: <strong style="color: green;">${total_gifts}</strong></li>'
        if earnings:
            html += f'<li>Comisión plataforma (20%): <strong style="color: orange;">${earnings.platform_fee}</strong></li>'
            html += f'<li>Neto para streamer: <strong style="color: green;">${earnings.net_amount}</strong></li>'
            html += f'<li>Estado de pago: <strong>{"✅ Pagado" if earnings.is_paid else "⏳ Pendiente"}</strong></li>'
        html += f'<li>Total de regalos: <strong>{gift_count}</strong></li>'
        html += f'<li>Regalo promedio: <strong>${avg_gift:.2f}</strong></li>'
        html += '</ul>'
        
        # Top donadores
        if top_donors:
            html += f'<h4>🏆 Top Donadores:</h4><ol>'
            for donor in top_donors:
                html += f'<li><strong>{donor["sender__username"]}</strong>: ${donor["total"]}</li>'
            html += '</ol>'
        
        html += '</div>'
        return format_html(html)
    get_earnings_summary.short_description = 'Resumen de Ganancias'
    
    def ban_stream(self, request, queryset):
        for stream in queryset:
            stream.is_banned = True
            stream.status = 'banned'
            stream.banned_by = request.user
            stream.banned_at = timezone.now()
            stream.save()
        self.message_user(request, f'{queryset.count()} stream(s) baneado(s) exitosamente.')
    ban_stream.short_description = '🚫 Banear streams seleccionados'
    
    def unban_stream(self, request, queryset):
        queryset.update(is_banned=False, status='ended', ban_reason='', banned_by=None, banned_at=None)
        self.message_user(request, f'{queryset.count()} stream(s) desbaneado(s) exitosamente.')
    unban_stream.short_description = '✅ Desbanear streams seleccionados'
    
    def end_stream(self, request, queryset):
        queryset.update(status='ended', ended_at=timezone.now())
        self.message_user(request, f'{queryset.count()} stream(s) finalizado(s) exitosamente.')
    end_stream.short_description = '⏹️ Finalizar streams seleccionados'


@admin.register(StreamGift)
class StreamGiftAdmin(admin.ModelAdmin):
    list_display = ['sender', 'stream_session', 'gift_type_display', 'amount_display', 'sent_at']
    list_filter = ['gift_type', 'sent_at']
    search_fields = ['sender__username', 'stream_session__title']
    readonly_fields = ['sent_at']
    date_hierarchy = 'sent_at'
    
    def gift_type_display(self, obj):
        icons = {
            'heart': '❤️',
            'star': '⭐',
            'zap': '⚡',
            'crown': '👑',
            'diamond': '💎',
            'gift': '🎁'
        }
        return format_html('{} {}', icons.get(obj.gift_type, '🎁'), obj.get_gift_type_display())
    gift_type_display.short_description = 'Tipo de Regalo'
    
    def amount_display(self, obj):
        return format_html('<strong style="color: green;">${}</strong>', obj.amount)
    amount_display.short_description = 'Monto'


@admin.register(StreamViewer)
class StreamViewerAdmin(admin.ModelAdmin):
    list_display = ['user', 'stream_session', 'joined_at', 'left_at', 'ban_status']
    list_filter = ['is_banned', 'joined_at']
    search_fields = ['user__username', 'stream_session__title']
    readonly_fields = ['joined_at']
    actions = ['ban_viewer', 'unban_viewer']
    
    def ban_status(self, obj):
        if obj.is_banned:
            return format_html('<span style="color: red;">🚫 BANEADO</span>')
        return format_html('<span style="color: green;">✅ Activo</span>')
    ban_status.short_description = 'Estado'
    
    def ban_viewer(self, request, queryset):
        for viewer in queryset:
            viewer.is_banned = True
            viewer.banned_by = request.user
            viewer.banned_at = timezone.now()
            viewer.save()
        self.message_user(request, f'{queryset.count()} espectador(es) baneado(s) exitosamente.')
    ban_viewer.short_description = '🚫 Banear espectadores seleccionados'
    
    def unban_viewer(self, request, queryset):
        queryset.update(is_banned=False, ban_reason='', banned_by=None, banned_at=None)
        self.message_user(request, f'{queryset.count()} espectador(es) desbaneado(s) exitosamente.')
    unban_viewer.short_description = '✅ Desbanear espectadores seleccionados'


@admin.register(StreamChatMessage)
class StreamChatMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'stream_session', 'message_preview', 'sent_at', 'is_deleted']
    list_filter = ['is_deleted', 'sent_at']
    search_fields = ['user__username', 'message', 'stream_session__title']
    readonly_fields = ['sent_at']
    actions = ['delete_messages']
    date_hierarchy = 'sent_at'
    
    def message_preview(self, obj):
        return obj.message[:100] + '...' if len(obj.message) > 100 else obj.message
    message_preview.short_description = 'Mensaje'
    
    def delete_messages(self, request, queryset):
        for message in queryset:
            message.is_deleted = True
            message.deleted_by = request.user
            message.deleted_at = timezone.now()
            message.save()
        self.message_user(request, f'{queryset.count()} mensaje(s) eliminado(s) exitosamente.')
    delete_messages.short_description = '🗑️ Eliminar mensajes seleccionados'


@admin.register(StreamReport)
class StreamReportAdmin(admin.ModelAdmin):
    list_display = ['stream_session', 'reported_by', 'reported_user', 'report_type_display', 'status_badge', 'created_at']
    list_filter = ['report_type', 'status', 'created_at']
    search_fields = ['stream_session__title', 'reported_by__username', 'reported_user__username', 'description']
    readonly_fields = ['created_at', 'reported_by']
    actions = ['mark_as_reviewed', 'mark_as_action_taken', 'dismiss_reports']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Información del Reporte', {
            'fields': ('stream_session', 'reported_by', 'reported_user', 'report_type', 'description')
        }),
        ('Estado', {
            'fields': ('status', 'reviewed_by', 'reviewed_at', 'action_taken')
        }),
    )
    
    def report_type_display(self, obj):
        icons = {
            'offensive': '😡',
            'spam': '📧',
            'harassment': '⚠️',
            'inappropriate': '🚫',
            'other': '❓'
        }
        return format_html('{} {}', icons.get(obj.report_type, '❓'), obj.get_report_type_display())
    report_type_display.short_description = 'Tipo de Reporte'
    
    def status_badge(self, obj):
        colors = {
            'pending': 'orange',
            'reviewed': 'blue',
            'action_taken': 'green',
            'dismissed': 'gray'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Estado'
    
    def mark_as_reviewed(self, request, queryset):
        for report in queryset:
            report.status = 'reviewed'
            report.reviewed_by = request.user
            report.reviewed_at = timezone.now()
            report.save()
        self.message_user(request, f'{queryset.count()} reporte(s) marcado(s) como revisado(s).')
    mark_as_reviewed.short_description = '👁️ Marcar como revisado'
    
    def mark_as_action_taken(self, request, queryset):
        for report in queryset:
            report.status = 'action_taken'
            report.reviewed_by = request.user
            report.reviewed_at = timezone.now()
            report.save()
        self.message_user(request, f'{queryset.count()} reporte(s) marcado(s) con acción tomada.')
    mark_as_action_taken.short_description = '✅ Marcar acción tomada'
    
    def dismiss_reports(self, request, queryset):
        queryset.update(status='dismissed')
        self.message_user(request, f'{queryset.count()} reporte(s) descartado(s).')
    dismiss_reports.short_description = '❌ Descartar reportes'


@admin.register(StreamEarnings)
class StreamEarningsAdmin(admin.ModelAdmin):
    list_display = ['streamer', 'stream_session', 'total_amount_display', 'platform_fee_display', 'net_amount_display', 'payment_status', 'created_at']
    list_filter = ['is_paid', 'created_at']
    search_fields = ['streamer__username', 'stream_session__title']
    readonly_fields = ['platform_fee', 'net_amount', 'created_at']
    actions = ['mark_as_paid']
    date_hierarchy = 'created_at'
    
    def total_amount_display(self, obj):
        return format_html('<strong>${}</strong>', obj.total_amount)
    total_amount_display.short_description = 'Total'
    
    def platform_fee_display(self, obj):
        return format_html('<span style="color: orange;">${}</span>', obj.platform_fee)
    platform_fee_display.short_description = 'Comisión (20%)'
    
    def net_amount_display(self, obj):
        return format_html('<strong style="color: green;">${}</strong>', obj.net_amount)
    net_amount_display.short_description = 'Neto para Streamer'
    
    def payment_status(self, obj):
        if obj.is_paid:
            return format_html('<span style="color: green;">✅ Pagado</span>')
        return format_html('<span style="color: orange;">⏳ Pendiente</span>')
    payment_status.short_description = 'Estado de Pago'
    
    def mark_as_paid(self, request, queryset):
        for earning in queryset:
            earning.is_paid = True
            earning.paid_at = timezone.now()
            earning.save()
        self.message_user(request, f'{queryset.count()} pago(s) marcado(s) como pagado(s).')
    mark_as_paid.short_description = '💰 Marcar como pagado'

from rest_framework import serializers
from .models import (
    StreamSession, StreamGift, StreamViewer,
    StreamChatMessage, StreamReport, StreamEarnings
)


class StreamSessionSerializer(serializers.ModelSerializer):
    streamer_name = serializers.CharField(source='streamer.username', read_only=True)
    streamer_avatar = serializers.SerializerMethodField()
    current_viewers = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = StreamSession
        fields = [
            'id', 'streamer', 'streamer_name', 'streamer_avatar',
            'title', 'description', 'stream_key', 'status',
            'started_at', 'ended_at', 'peak_viewers', 'current_viewers',
            'total_gifts_received', 'duration', 'is_banned'
        ]
        read_only_fields = ['stream_key', 'peak_viewers', 'total_gifts_received', 'is_banned']
    
    def get_streamer_avatar(self, obj):
        if hasattr(obj.streamer, 'profile') and obj.streamer.profile.avatar:
            return obj.streamer.profile.avatar.url
        return None
    
    def get_current_viewers(self, obj):
        return obj.viewers.filter(left_at__isnull=True, is_banned=False).count()
    
    def get_duration(self, obj):
        if obj.ended_at:
            delta = obj.ended_at - obj.started_at
        else:
            from django.utils import timezone
            delta = timezone.now() - obj.started_at
        
        hours = int(delta.total_seconds() // 3600)
        minutes = int((delta.total_seconds() % 3600) // 60)
        
        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"


class StreamGiftSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    
    class Meta:
        model = StreamGift
        fields = ['id', 'stream_session', 'sender', 'sender_name', 'gift_type', 'amount', 'message', 'sent_at']
        read_only_fields = ['sent_at']
    
    def create(self, validated_data):
        gift = super().create(validated_data)
        
        # Actualizar total de regalos del stream
        stream = gift.stream_session
        stream.total_gifts_received += gift.amount
        stream.save()
        
        # Crear o actualizar ganancias
        from django.db.models import Sum
        total_gifts = stream.gifts.aggregate(total=Sum('amount'))['total'] or 0
        
        earnings, created = StreamEarnings.objects.get_or_create(
            streamer=stream.streamer,
            stream_session=stream,
            defaults={'total_amount': total_gifts}
        )
        
        if not created:
            earnings.total_amount = total_gifts
            earnings.save()
        
        return gift


class StreamViewerSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = StreamViewer
        fields = ['id', 'stream_session', 'user', 'user_name', 'joined_at', 'left_at', 'is_banned']
        read_only_fields = ['joined_at', 'is_banned']


class StreamChatMessageSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = StreamChatMessage
        fields = ['id', 'stream_session', 'user', 'user_name', 'user_avatar', 'message', 'sent_at', 'is_deleted']
        read_only_fields = ['sent_at', 'is_deleted']
    
    def get_user_avatar(self, obj):
        if hasattr(obj.user, 'profile') and obj.user.profile.avatar:
            return obj.user.profile.avatar.url
        return None


class StreamReportSerializer(serializers.ModelSerializer):
    reported_by_name = serializers.CharField(source='reported_by.username', read_only=True)
    reported_user_name = serializers.CharField(source='reported_user.username', read_only=True, allow_null=True)
    
    class Meta:
        model = StreamReport
        fields = [
            'id', 'stream_session', 'reported_by', 'reported_by_name',
            'reported_user', 'reported_user_name', 'report_type',
            'description', 'status', 'created_at'
        ]
        read_only_fields = ['reported_by', 'status', 'created_at']


class StreamEarningsSerializer(serializers.ModelSerializer):
    streamer_name = serializers.CharField(source='streamer.username', read_only=True)
    
    class Meta:
        model = StreamEarnings
        fields = [
            'id', 'streamer', 'streamer_name', 'stream_session',
            'total_amount', 'platform_fee', 'net_amount',
            'is_paid', 'paid_at', 'created_at'
        ]
        read_only_fields = ['platform_fee', 'net_amount', 'is_paid', 'paid_at', 'created_at']

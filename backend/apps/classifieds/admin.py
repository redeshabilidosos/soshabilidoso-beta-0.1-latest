"""
Admin para Clasificados
"""
from django.contrib import admin
from .models import (
    ProductClassified, ServiceClassified, FreelancerClassified,
    ClassifiedLike, ClassifiedView, ClassifiedContact, ClassifiedReport, ServiceReview
)


@admin.register(ProductClassified)
class ProductClassifiedAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'price', 'condition', 'status', 'created_at']
    list_filter = ['status', 'category', 'condition', 'created_at']
    search_fields = ['title', 'description', 'user__username']
    readonly_fields = ['id', 'short_id', 'views_count', 'likes_count', 'contacts_count', 'created_at', 'updated_at']


@admin.register(ServiceClassified)
class ServiceClassifiedAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'price', 'rating', 'status', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['title', 'description', 'user__username']
    readonly_fields = ['id', 'short_id', 'views_count', 'likes_count', 'contacts_count', 'rating', 'reviews_count', 'created_at', 'updated_at']


@admin.register(FreelancerClassified)
class FreelancerClassifiedAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'price', 'rating', 'status', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['title', 'description', 'user__username']
    readonly_fields = ['id', 'short_id', 'views_count', 'likes_count', 'contacts_count', 'rating', 'reviews_count', 'completed_projects', 'created_at', 'updated_at']


@admin.register(ClassifiedLike)
class ClassifiedLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'classified_type', 'classified_id', 'created_at']
    list_filter = ['classified_type', 'created_at']


@admin.register(ClassifiedView)
class ClassifiedViewAdmin(admin.ModelAdmin):
    list_display = ['classified_type', 'classified_id', 'user', 'ip_address', 'created_at']
    list_filter = ['classified_type', 'created_at']


@admin.register(ClassifiedContact)
class ClassifiedContactAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'classified_type', 'is_read', 'created_at']
    list_filter = ['classified_type', 'is_read', 'created_at']


@admin.register(ClassifiedReport)
class ClassifiedReportAdmin(admin.ModelAdmin):
    list_display = ['reporter', 'classified_type', 'reason', 'status', 'created_at']
    list_filter = ['status', 'reason', 'classified_type', 'created_at']


@admin.register(ServiceReview)
class ServiceReviewAdmin(admin.ModelAdmin):
    list_display = ['reviewer', 'provider', 'classified_type', 'rating', 'created_at']
    list_filter = ['classified_type', 'rating', 'created_at']

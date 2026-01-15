"""
Filtros para Posts
"""
import django_filters
from django.db.models import Q
from .models import Post


class PostFilter(django_filters.FilterSet):
    """Filtros para posts"""
    
    # Filtros básicos
    post_type = django_filters.ChoiceFilter(choices=Post.POST_TYPES)
    category = django_filters.ChoiceFilter(choices=Post.CATEGORIES)
    user = django_filters.UUIDFilter(field_name='user__id')
    community = django_filters.UUIDFilter(field_name='community__id')
    
    # Filtros de fecha
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    # Filtros de popularidad
    min_likes = django_filters.NumberFilter(field_name='likes_count', lookup_expr='gte')
    min_comments = django_filters.NumberFilter(field_name='comments_count', lookup_expr='gte')
    min_views = django_filters.NumberFilter(field_name='views_count', lookup_expr='gte')
    
    # Filtro de contenido
    content = django_filters.CharFilter(method='filter_content')
    
    # Filtros booleanos
    has_media = django_filters.BooleanFilter(method='filter_has_media')
    is_pinned = django_filters.BooleanFilter()
    allow_comments = django_filters.BooleanFilter()
    
    class Meta:
        model = Post
        fields = [
            'post_type', 'category', 'user', 'community',
            'created_after', 'created_before', 'min_likes',
            'min_comments', 'min_views', 'content', 'has_media',
            'is_pinned', 'allow_comments'
        ]
    
    def filter_content(self, queryset, name, value):
        """Filtrar por contenido (búsqueda en texto)"""
        return queryset.filter(
            Q(content__icontains=value) |
            Q(user__username__icontains=value) |
            Q(user__display_name__icontains=value)
        )
    
    def filter_has_media(self, queryset, name, value):
        """Filtrar posts que tienen archivos multimedia"""
        if value:
            return queryset.filter(
                Q(images__len__gt=0) |
                Q(video__isnull=False) |
                Q(podcast_url__isnull=False) |
                Q(streaming_url__isnull=False)
            )
        else:
            return queryset.filter(
                images__len=0,
                video__isnull=True,
                podcast_url__isnull=True,
                streaming_url__isnull=True
            )
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import (
    CommunityViewSet, CommunityCategoryViewSet, CommunityPostListCreateView, 
    CommunityPostViewSet, CommunityPostCommentViewSet
)

# Router para comunidades
community_router = DefaultRouter()
community_router.register(r'', CommunityViewSet, basename='community')

# Router para categorías
category_router = DefaultRouter()
category_router.register(r'', CommunityCategoryViewSet, basename='category')

# Router para posts (para acciones como like)
post_router = DefaultRouter()
post_router.register(r'', CommunityPostViewSet, basename='community-post')

# Router para comentarios
comment_router = DefaultRouter()
comment_router.register(r'', CommunityPostCommentViewSet, basename='community-post-comment')

urlpatterns = [
    # Categorías en /api/communities/categories/
    path('categories/', include(category_router.urls)),
    
    # Posts con acciones (like, etc) en /api/communities/posts/
    path('posts/', include(post_router.urls)),
    
    # Comentarios de posts en /api/communities/posts/<post_id>/comments/
    re_path(
        r'^posts/(?P<post_id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/comments/$',
        CommunityPostCommentViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='community-post-comments'
    ),
    
    # IMPORTANTE: Ruta de posts por comunidad ANTES del router de comunidades
    re_path(
        r'^(?P<community_id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/posts/$',
        CommunityPostListCreateView.as_view(),
        name='community-posts-list-create'
    ),
    
    # Comunidades en /api/communities/ (al final)
    path('', include(community_router.urls)),
]

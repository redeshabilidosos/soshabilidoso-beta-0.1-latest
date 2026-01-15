"""
URLs para posts
"""
from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    # Posts
    path('', views.PostListCreateView.as_view(), name='post_list_create'),
    path('<uuid:pk>/', views.PostDetailView.as_view(), name='post_detail'),
    path('short/<str:pk>/', views.PostDetailView.as_view(), name='post_detail_short'),
    
    # Preview de links
    path('preview/', views.link_preview, name='link_preview'),
    
    # Reacciones
    path('<uuid:post_id>/react/', views.PostReactionView.as_view(), name='post_react'),
    
    # Comentarios
    path('<uuid:post_id>/comments/', views.CommentListCreateView.as_view(), name='comment_list_create'),
    path('comments/<uuid:pk>/', views.CommentDetailView.as_view(), name='comment_detail'),
    path('comments/<uuid:comment_id>/like/', views.CommentLikeView.as_view(), name='comment_like'),
    
    # Acciones
    path('<uuid:post_id>/share/', views.share_post, name='share_post'),
    path('<uuid:post_id>/bookmark/', views.bookmark_post, name='bookmark_post'),
    
    # Estadísticas del usuario
    path('my-reactions-count/', views.my_reactions_count, name='my_reactions_count'),
]
"""
URLs para usuarios
"""
from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # Búsqueda de usuarios
    path('search/', views.UserSearchView.as_view(), name='user_search'),
    path('profile/<str:username>/', views.UserProfileView.as_view(), name='user_profile'),
    path('profile/', views.UserProfileUpdateView.as_view(), name='user_profile_update'),
    
    # Seguimientos
    path('follow/<str:username>/', views.follow_user, name='follow_user'),
    path('unfollow/<str:username>/', views.unfollow_user, name='unfollow_user'),
    path('followers/<str:username>/', views.get_followers, name='get_followers'),
    path('following/<str:username>/', views.get_following, name='get_following'),
    
    # Solicitudes de amistad
    path('friend-requests/', views.get_friend_requests, name='get_friend_requests'),
    path('friend-requests/send/<str:username>/', views.send_friend_request, name='send_friend_request'),
    path('friend-requests/<uuid:request_id>/respond/', views.respond_friend_request, name='respond_friend_request'),
    
    # Amigos
    path('friends/', views.get_friends, name='get_friends'),
    path('friends/<str:username>/', views.get_friends, name='get_user_friends'),
    
    # Mensajería
    path('chat/<str:username>/', views.create_or_get_chat, name='create_or_get_chat'),
    
    # Posts del usuario
    path('<str:username>/posts/', views.get_user_posts, name='get_user_posts'),
    path('<str:username>/posts/stats/', views.get_user_posts_stats, name='get_user_posts_stats'),
]
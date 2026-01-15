"""
URLs para autenticación
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # Autenticación JWT
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout_view, name='logout'),
    path('verify/', views.verify_token_view, name='verify_token'),
    
    # Registro y perfil
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('upload-avatar/', views.UploadAvatarView.as_view(), name='upload_avatar'),
    path('upload-cover/', views.UploadCoverPhotoView.as_view(), name='upload_cover'),
    
    # Cambio de contraseña
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('reset-password/', views.PasswordResetRequestView.as_view(), name='reset_password'),
    path('reset-password/confirm/', views.PasswordResetConfirmView.as_view(), name='reset_password_confirm'),
]
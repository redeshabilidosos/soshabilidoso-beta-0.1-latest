"""
URLs para la app de Reality Show
"""
from django.urls import path
from . import views

app_name = 'reality'

urlpatterns = [
    path('register/', views.register_participante, name='register_participante'),
    path('register-2026/', views.register_participante_2026, name='register_participante_2026'),
    path('check-status/', views.check_registration_status, name='check_status'),
]

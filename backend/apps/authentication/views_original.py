"""
Views para autenticación
"""
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.core.cache import cache
# Imports simplificados para desarrollo
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para obtener tokens JWT"""
    serializer_class = CustomTokenObtainPairSerializer
    
    @extend_schema(
        summary="Iniciar sesión",
        description="Obtener tokens de acceso y refresh con información del usuario",
        responses={
            200: OpenApiResponse(description="Login exitoso"),
            401: OpenApiResponse(description="Credenciales inválidas"),
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserRegistrationView(generics.CreateAPIView):
    """Vista para registro de usuarios"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        summary="Registrar usuario",
        description="Crear una nueva cuenta de usuario",
        responses={
            201: OpenApiResponse(description="Usuario creado exitosamente"),
            400: OpenApiResponse(description="Datos inválidos"),
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generar tokens para el nuevo usuario
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Usuario registrado exitosamente',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Vista para ver y actualizar perfil de usuario"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    @extend_schema(
        summary="Obtener perfil",
        description="Obtener información del perfil del usuario autenticado",
        responses={
            200: UserProfileSerializer,
            401: OpenApiResponse(description="No autenticado"),
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        summary="Actualizar perfil",
        description="Actualizar información del perfil del usuario",
        responses={
            200: UserProfileSerializer,
            400: OpenApiResponse(description="Datos inválidos"),
            401: OpenApiResponse(description="No autenticado"),
        }
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class PasswordChangeView(generics.GenericAPIView):
    """Vista para cambiar contraseña"""
    serializer_class = PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        summary="Cambiar contraseña",
        description="Cambiar la contraseña del usuario autenticado",
        responses={
            200: OpenApiResponse(description="Contraseña cambiada exitosamente"),
            400: OpenApiResponse(description="Datos inválidos"),
            401: OpenApiResponse(description="No autenticado"),
        }
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Contraseña cambiada exitosamente'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(generics.GenericAPIView):
    """Vista para solicitar reset de contraseña"""
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        summary="Solicitar reset de contraseña",
        description="Enviar email con token para resetear contraseña",
        responses={
            200: OpenApiResponse(description="Email enviado si el usuario existe"),
            400: OpenApiResponse(description="Datos inválidos"),
        }
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                
                # Generar token de reset
                reset_token = get_random_string(32)
                
                # Guardar token en cache por 1 hora
                cache.set(f'password_reset_{reset_token}', user.id, 3600)
                
                # Enviar email (en desarrollo se muestra en consola)
                reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
                
                send_mail(
                    subject='Restablecer contraseña - SOS-HABILIDOSO',
                    message=f'''
                    Hola {user.display_name},
                    
                    Has solicitado restablecer tu contraseña en SOS-HABILIDOSO.
                    
                    Haz clic en el siguiente enlace para crear una nueva contraseña:
                    {reset_url}
                    
                    Este enlace expirará en 1 hora.
                    
                    Si no solicitaste este cambio, puedes ignorar este email.
                    
                    Saludos,
                    El equipo de SOS-HABILIDOSO
                    ''',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=True,
                )
                
            except User.DoesNotExist:
                # Por seguridad, no revelamos si el email existe
                pass
            
            return Response({
                'message': 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(generics.GenericAPIView):
    """Vista para confirmar reset de contraseña"""
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        summary="Confirmar reset de contraseña",
        description="Establecer nueva contraseña usando token de reset",
        responses={
            200: OpenApiResponse(description="Contraseña restablecida exitosamente"),
            400: OpenApiResponse(description="Token inválido o expirado"),
        }
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            # Verificar token
            user_id = cache.get(f'password_reset_{token}')
            if not user_id:
                return Response({
                    'error': 'Token inválido o expirado'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                user = User.objects.get(id=user_id)
                user.set_password(new_password)
                user.save()
                
                # Eliminar token usado
                cache.delete(f'password_reset_{token}')
                
                return Response({
                    'message': 'Contraseña restablecida exitosamente'
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    'error': 'Usuario no encontrado'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    summary="Cerrar sesión",
    description="Invalidar token de refresh",
    responses={
        200: OpenApiResponse(description="Sesión cerrada exitosamente"),
        400: OpenApiResponse(description="Token inválido"),
    }
)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Vista para cerrar sesión"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Sesión cerrada exitosamente'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Token inválido'
        }, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    summary="Verificar token",
    description="Verificar si el token de acceso es válido",
    responses={
        200: OpenApiResponse(description="Token válido"),
        401: OpenApiResponse(description="Token inválido"),
    }
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def verify_token_view(request):
    """Vista para verificar token"""
    return Response({
        'message': 'Token válido',
        'user': UserProfileSerializer(request.user, context={'request': request}).data
    }, status=status.HTTP_200_OK)
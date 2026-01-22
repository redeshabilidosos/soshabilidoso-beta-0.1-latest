"""
Vistas de autenticación mejoradas con documentación drf-spectacular
"""
from rest_framework import status, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

# Importaciones de drf-spectacular
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiExample,
    OpenApiResponse,
    inline_serializer
)
from drf_spectacular.types import OpenApiTypes

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

User = get_user_model()


@extend_schema_view(
    post=extend_schema(
        operation_id='auth_login',
        tags=['Authentication'],
        summary='Iniciar sesión',
        description='''
        Autentica un usuario y devuelve tokens JWT.
        
        ## Uso
        Envía las credenciales del usuario para obtener tokens de acceso y refresh.
        
        ## Respuesta exitosa
        - `access`: Token de acceso (válido por 1 hora)
        - `refresh`: Token de refresh (válido por 7 días)
        - `user`: Información del usuario autenticado
        
        ## Códigos de error
        - `400`: Credenciales inválidas
        - `401`: Usuario inactivo o bloqueado
        ''',
        request=CustomTokenObtainPairSerializer,
        responses={
            200: OpenApiResponse(
                response=inline_serializer(
                    name='LoginResponse',
                    fields={
                        'access': serializers.CharField(),
                        'refresh': serializers.CharField(),
                        'user': UserProfileSerializer(),
                    }
                ),
                description='Login exitoso'
            ),
            400: OpenApiResponse(
                description='Credenciales inválidas',
                examples=[
                    OpenApiExample(
                        'Credenciales incorrectas',
                        value={
                            'detail': 'No se encontraron credenciales de autenticación válidas.',
                            'code': 'authentication_failed'
                        }
                    )
                ]
            )
        },
        examples=[
            OpenApiExample(
                'Login con email',
                value={
                    'email': 'usuario@ejemplo.com',
                    'password': 'mi_contraseña_segura'
                },
                request_only=True
            ),
            OpenApiExample(
                'Login con username',
                value={
                    'username': 'mi_usuario',
                    'password': 'mi_contraseña_segura'
                },
                request_only=True
            )
        ]
    )
)
class CustomTokenObtainPairView(APIView):
    """
    Vista personalizada para obtener tokens JWT
    
    Permite autenticación con email o username.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        print(f"DEBUG VIEW: Request data: {request.data}")
        print(f"DEBUG VIEW: Request content type: {request.content_type}")
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        print(f"DEBUG VIEW: Serializer initialized")
        if serializer.is_valid():
            print(f"DEBUG VIEW: Serializer is valid")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        print(f"DEBUG VIEW: Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema_view(
    post=extend_schema(
        operation_id='auth_register',
        tags=['Authentication'],
        summary='Registrar nuevo usuario',
        description='''
        Crea una nueva cuenta de usuario en la plataforma.
        
        ## Campos requeridos
        - `email`: Email único del usuario
        - `username`: Nombre de usuario único
        - `password`: Contraseña (mínimo 8 caracteres)
        - `display_name`: Nombre para mostrar
        
        ## Campos opcionales
        - `position`: Posición o cargo
        - `team`: Equipo al que pertenece
        - `interests`: Lista de intereses
        - `contact_number`: Número de contacto
        
        ## Respuesta exitosa
        Devuelve los datos del usuario creado junto con tokens JWT.
        ''',
        request=UserRegistrationSerializer,
        responses={
            201: OpenApiResponse(
                response=inline_serializer(
                    name='RegisterResponse',
                    fields={
                        'message': serializers.CharField(),
                        'user': UserProfileSerializer(),
                        'tokens': inline_serializer(
                            name='TokenPair',
                            fields={
                                'access': serializers.CharField(),
                                'refresh': serializers.CharField(),
                            }
                        )
                    }
                ),
                description='Usuario registrado exitosamente'
            ),
            400: OpenApiResponse(
                description='Datos de registro inválidos',
                examples=[
                    OpenApiExample(
                        'Email ya existe',
                        value={
                            'email': ['Ya existe un usuario con este email.']
                        }
                    ),
                    OpenApiExample(
                        'Username ya existe',
                        value={
                            'username': ['Ya existe un usuario con este nombre de usuario.']
                        }
                    )
                ]
            )
        },
        examples=[
            OpenApiExample(
                'Registro completo',
                value={
                    'email': 'nuevo@ejemplo.com',
                    'username': 'nuevo_usuario',
                    'password': 'contraseña_segura123',
                    'display_name': 'Nuevo Usuario',
                    'position': 'Desarrollador',
                    'team': 'Equipo Frontend',
                    'interests': ['programación', 'fútbol', 'música'],
                    'contact_number': '+57 300 123 4567'
                },
                request_only=True
            )
        ]
    )
)
class RegisterView(APIView):
    """
    Vista para registro de usuarios
    
    Crea nuevos usuarios y automáticamente los autentica.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Enviar datos a Google Sheets para respaldo
            try:
                self._send_to_google_sheets(user, request)
            except Exception as e:
                print(f"Error al enviar a Google Sheets: {str(e)}")
                # No fallar si Google Sheets falla
            
            # Generar tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Usuario registrado exitosamente',
                'user': UserProfileSerializer(user, context={'request': request}).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _send_to_google_sheets(self, user, request):
        """Enviar datos de registro a Google Sheets"""
        import requests
        import os
        
        webhook_url = os.getenv('GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL')
        if not webhook_url or webhook_url.endswith('YOUR_DEPLOYMENT_ID/exec'):
            print("Google Sheets webhook URL no configurada, saltando envío")
            return
        
        # Preparar datos
        data = {
            'id': str(user.id),
            'email': user.email,
            'username': user.username,
            'display_name': user.display_name,
            'position': user.position or '',
            'team': user.team or '',
            'interests': ','.join(user.interests) if user.interests else '',
            'contact_number': user.contact_number or '',
        }
        
        # Enviar a Google Sheets
        try:
            response = requests.post(webhook_url, json=data, timeout=10)
            print(f"Respuesta de Google Sheets: {response.status_code}")
        except Exception as e:
            print(f"Error al conectar con Google Sheets: {str(e)}")


@extend_schema_view(
    get=extend_schema(
        operation_id='auth_profile_get',
        tags=['Authentication'],
        summary='Obtener perfil del usuario',
        description='Devuelve la información completa del perfil del usuario autenticado.',
        responses={
            200: UserProfileSerializer,
            401: OpenApiResponse(description='No autenticado')
        }
    ),
    put=extend_schema(
        operation_id='auth_profile_update',
        tags=['Authentication'],
        summary='Actualizar perfil completo',
        description='Actualiza todos los campos del perfil del usuario.',
        request=UserProfileSerializer,
        responses={
            200: UserProfileSerializer,
            400: OpenApiResponse(description='Datos inválidos'),
            401: OpenApiResponse(description='No autenticado')
        }
    ),
    patch=extend_schema(
        operation_id='auth_profile_partial_update',
        tags=['Authentication'],
        summary='Actualizar perfil parcial',
        description='Actualiza campos específicos del perfil del usuario.',
        request=UserProfileSerializer,
        responses={
            200: UserProfileSerializer,
            400: OpenApiResponse(description='Datos inválidos'),
            401: OpenApiResponse(description='No autenticado')
        }
    )
)
class ProfileView(RetrieveUpdateAPIView):
    """
    Vista para obtener y actualizar perfil de usuario
    
    Permite obtener y modificar la información del perfil del usuario autenticado.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@extend_schema_view(
    post=extend_schema(
        operation_id='auth_upload_avatar',
        tags=['Authentication'],
        summary='Subir avatar del usuario',
        description='''
        Sube una nueva imagen de avatar para el usuario.
        
        ## Restricciones
        - Formatos permitidos: JPG, PNG, WebP
        - Tamaño máximo: 5MB
        - Se redimensiona automáticamente si es necesario
        
        ## Funcionalidad adicional
        - Se guarda automáticamente en el álbum "Fotos de Perfil"
        - Reemplaza el avatar anterior
        ''',
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'avatar': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'Archivo de imagen para el avatar'
                    }
                },
                'required': ['avatar']
            }
        },
        responses={
            200: OpenApiResponse(
                response=inline_serializer(
                    name='AvatarUploadResponse',
                    fields={
                        'message': serializers.CharField(),
                        'avatar_url': serializers.URLField(),
                        'user': UserProfileSerializer()
                    }
                ),
                description='Avatar subido exitosamente'
            ),
            400: OpenApiResponse(
                description='Error en el archivo',
                examples=[
                    OpenApiExample(
                        'Archivo muy grande',
                        value={'error': 'El archivo es demasiado grande. Máximo 5MB'}
                    ),
                    OpenApiExample(
                        'Tipo no permitido',
                        value={'error': 'Tipo de archivo no permitido. Use JPG, PNG o WebP'}
                    )
                ]
            )
        }
    )
)
class UploadAvatarView(APIView):
    """
    Vista para subir avatar del usuario
    
    Permite a los usuarios subir y actualizar su imagen de perfil.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        if 'avatar' not in request.FILES:
            return Response({
                'error': 'No se proporcionó ningún archivo'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        avatar_file = request.FILES['avatar']
        
        # Validar tipo de archivo
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if avatar_file.content_type not in allowed_types:
            return Response({
                'error': 'Tipo de archivo no permitido. Use JPG, PNG o WebP'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar tamaño (máximo 5MB)
        if avatar_file.size > 5 * 1024 * 1024:
            return Response({
                'error': 'El archivo es demasiado grande. Máximo 5MB'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Actualizar avatar del usuario
        user = request.user
        user.avatar = avatar_file
        user.save()
        
        # Guardar en álbum de fotos de perfil
        try:
            self._save_to_profile_album(user, avatar_file, request)
        except Exception as e:
            print(f"Error guardando en álbum: {e}")
        
        return Response({
            'message': 'Avatar actualizado exitosamente',
            'avatar_url': request.build_absolute_uri(user.avatar.url) if user.avatar else user.get_avatar_url(),
            'user': UserProfileSerializer(user, context={'request': request}).data
        }, status=status.HTTP_200_OK)
    
    def _save_to_profile_album(self, user, avatar_file, request):
        """Guardar avatar en álbum de fotos de perfil"""
        from apps.media_storage.models import MediaFile, MediaAlbum
        
        # Crear o obtener álbum de fotos de perfil
        album, created = MediaAlbum.objects.get_or_create(
            owner=user,
            name='Fotos de Perfil',
            defaults={'description': 'Historial de fotos de perfil', 'is_public': True}
        )
        
        # Crear MediaFile
        media_file = MediaFile.objects.create(
            file=user.avatar,
            file_type='image',
            original_name=avatar_file.name,
            file_size=avatar_file.size,
            mime_type=avatar_file.content_type,
            uploaded_by=user,
            is_public=True
        )
        
        # Agregar al álbum
        album.files.add(media_file)


@extend_schema(
    operation_id='auth_logout',
    tags=['Authentication'],
    summary='Cerrar sesión',
    description='''
    Cierra la sesión del usuario y invalida el token de refresh.
    
    ## Parámetros
    - `refresh_token`: Token de refresh a invalidar (opcional)
    
    ## Funcionalidad
    - Agrega el token a la lista negra
    - Invalida la sesión actual
    ''',
    request=inline_serializer(
        name='LogoutRequest',
        fields={
            'refresh_token': serializers.CharField(required=False, help_text='Token de refresh a invalidar')
        }
    ),
    responses={
        200: OpenApiResponse(
            response=inline_serializer(
                name='LogoutResponse',
                fields={'message': serializers.CharField()}
            ),
            description='Sesión cerrada exitosamente'
        ),
        400: OpenApiResponse(description='Error al cerrar sesión')
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
            'error': 'Error al cerrar sesión'
        }, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id='auth_verify_token',
    tags=['Authentication'],
    summary='Verificar token de acceso',
    description='''
    Verifica si el token de acceso actual es válido.
    
    ## Uso
    Envía una petición con el token en el header Authorization.
    
    ## Respuesta
    - Si es válido: devuelve información del usuario
    - Si es inválido: error 401
    ''',
    responses={
        200: OpenApiResponse(
            response=inline_serializer(
                name='TokenVerifyResponse',
                fields={
                    'valid': serializers.BooleanField(),
                    'user': UserProfileSerializer()
                }
            ),
            description='Token válido'
        ),
        401: OpenApiResponse(description='Token inválido o expirado')
    }
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def verify_token_view(request):
    """Vista para verificar token"""
    return Response({
        'valid': True,
        'user': UserProfileSerializer(request.user).data
    }, status=status.HTTP_200_OK)
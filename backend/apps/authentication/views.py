"""
Vistas de autenticación simplificadas para desarrollo
"""
from rest_framework import status, permissions
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

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

User = get_user_model()


class CustomTokenObtainPairView(APIView):
    """Vista personalizada para obtener tokens JWT"""
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


class RegisterView(APIView):
    """Vista para registro de usuarios"""
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


class ProfileView(RetrieveUpdateAPIView):
    """Vista para obtener y actualizar perfil de usuario"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UploadAvatarView(APIView):
    """Vista para subir avatar del usuario"""
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


class UploadCoverPhotoView(APIView):
    """Vista para subir foto de portada del usuario"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        print(f"[UPLOAD COVER] Petición recibida de usuario: {request.user.username}")
        print(f"[UPLOAD COVER] FILES en request: {list(request.FILES.keys())}")
        
        if 'cover_photo' not in request.FILES:
            print("[UPLOAD COVER] ERROR: No se encontró 'cover_photo' en FILES")
            return Response({
                'error': 'No se proporcionó ningún archivo'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cover_file = request.FILES['cover_photo']
        print(f"[UPLOAD COVER] Archivo recibido: {cover_file.name}, tamaño: {cover_file.size}, tipo: {cover_file.content_type}")
        
        # Validar tipo de archivo
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if cover_file.content_type not in allowed_types:
            print(f"[UPLOAD COVER] ERROR: Tipo no permitido: {cover_file.content_type}")
            return Response({
                'error': 'Tipo de archivo no permitido. Use JPG, PNG o WebP'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar tamaño (máximo 10MB)
        if cover_file.size > 10 * 1024 * 1024:
            print(f"[UPLOAD COVER] ERROR: Archivo muy grande: {cover_file.size}")
            return Response({
                'error': 'El archivo es demasiado grande. Máximo 10MB'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        print("[UPLOAD COVER] Validaciones pasadas, guardando archivo...")
        
        # Actualizar foto de portada del usuario
        user = request.user
        old_cover = user.cover_photo.url if user.cover_photo else None
        print(f"[UPLOAD COVER] Foto de portada anterior: {old_cover}")
        
        user.cover_photo = cover_file
        user.save()
        
        new_cover = user.cover_photo.url if user.cover_photo else None
        print(f"[UPLOAD COVER] Nueva foto de portada guardada: {new_cover}")
        
        # Guardar en álbum de fotos de portada
        try:
            self._save_to_cover_album(user, cover_file, request)
            print("[UPLOAD COVER] Guardado en álbum exitoso")
        except Exception as e:
            print(f"[UPLOAD COVER] Error guardando en álbum: {e}")
        
        cover_photo_url = request.build_absolute_uri(user.cover_photo.url) if user.cover_photo else None
        print(f"[UPLOAD COVER] URL absoluta generada: {cover_photo_url}")
        
        response_data = {
            'message': 'Foto de portada actualizada exitosamente',
            'cover_photo_url': cover_photo_url,
            'user': UserProfileSerializer(user, context={'request': request}).data
        }
        
        print(f"[UPLOAD COVER] Respuesta preparada, cover_photo_url: {response_data['cover_photo_url']}")
        print(f"[UPLOAD COVER] Usuario en respuesta tiene cover_photo_url: {response_data['user'].get('cover_photo_url')}")
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    def _save_to_cover_album(self, user, cover_file, request):
        """Guardar foto de portada en álbum"""
        from apps.media_storage.models import MediaFile, MediaAlbum
        
        # Crear o obtener álbum de fotos de portada
        album, created = MediaAlbum.objects.get_or_create(
            owner=user,
            name='Fotos de Portada',
            defaults={'description': 'Historial de fotos de portada', 'is_public': True}
        )
        
        # Crear MediaFile
        media_file = MediaFile.objects.create(
            file=user.cover_photo,
            file_type='image',
            original_name=cover_file.name,
            file_size=cover_file.size,
            mime_type=cover_file.content_type,
            uploaded_by=user,
            is_public=True
        )
        
        # Agregar al álbum
        album.files.add(media_file)


class ChangePasswordView(APIView):
    """Vista para cambiar contraseña"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Contraseña cambiada exitosamente'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """Vista para solicitar reset de contraseña"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                
                # Generar token
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # En desarrollo, solo imprimir en consola
                reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"
                print(f"Reset password URL: {reset_url}")
                
                return Response({
                    'message': 'Si el email existe, se ha enviado un enlace de recuperación'
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                pass
            
            # Siempre devolver el mismo mensaje por seguridad
            return Response({
                'message': 'Si el email existe, se ha enviado un enlace de recuperación'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """Vista para confirmar reset de contraseña"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                uid = serializer.validated_data['uid']
                token = serializer.validated_data['token']
                new_password = serializer.validated_data['new_password']
                
                # Decodificar UID
                user_id = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=user_id)
                
                # Verificar token
                if default_token_generator.check_token(user, token):
                    user.set_password(new_password)
                    user.save()
                    
                    return Response({
                        'message': 'Contraseña restablecida exitosamente'
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'error': 'Token inválido o expirado'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except (User.DoesNotExist, ValueError, TypeError):
                return Response({
                    'error': 'Token inválido'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def verify_token_view(request):
    """Vista para verificar token"""
    return Response({
        'valid': True,
        'user': UserProfileSerializer(request.user).data
    }, status=status.HTTP_200_OK)
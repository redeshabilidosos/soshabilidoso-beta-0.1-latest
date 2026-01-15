"""
Vistas para Media Storage
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import MediaFile, MediaAlbum
from .serializers import MediaFileSerializer, MediaAlbumSerializer, MediaAlbumListSerializer


class MediaFileViewSet(viewsets.ModelViewSet):
    """ViewSet para archivos multimedia"""
    
    serializer_class = MediaFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar archivos por usuario o públicos"""
        user = self.request.user
        return MediaFile.objects.filter(
            uploaded_by=user
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class MediaAlbumViewSet(viewsets.ModelViewSet):
    """ViewSet para álbumes multimedia"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MediaAlbumListSerializer
        return MediaAlbumSerializer
    
    def get_queryset(self):
        """Filtrar álbumes por usuario"""
        user = self.request.user
        username = self.request.query_params.get('username')
        
        if username:
            # Ver álbumes de otro usuario (solo públicos)
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                target_user = User.objects.get(username=username)
                if target_user == user:
                    return MediaAlbum.objects.filter(owner=user).annotate(
                        file_count=Count('files')
                    ).order_by('-created_at')
                return MediaAlbum.objects.filter(
                    owner=target_user, 
                    is_public=True
                ).annotate(file_count=Count('files')).order_by('-created_at')
            except User.DoesNotExist:
                return MediaAlbum.objects.none()
        
        return MediaAlbum.objects.filter(owner=user).annotate(
            file_count=Count('files')
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_file(self, request, pk=None):
        """Agregar archivo a un álbum"""
        album = self.get_object()
        file_id = request.data.get('file_id')
        
        if not file_id:
            return Response(
                {'error': 'Se requiere file_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            media_file = MediaFile.objects.get(id=file_id, uploaded_by=request.user)
            album.files.add(media_file)
            return Response({'message': 'Archivo agregado al álbum'})
        except MediaFile.DoesNotExist:
            return Response(
                {'error': 'Archivo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_file(self, request, pk=None):
        """Remover archivo de un álbum"""
        album = self.get_object()
        file_id = request.data.get('file_id')
        
        if not file_id:
            return Response(
                {'error': 'Se requiere file_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            media_file = MediaFile.objects.get(id=file_id)
            album.files.remove(media_file)
            return Response({'message': 'Archivo removido del álbum'})
        except MediaFile.DoesNotExist:
            return Response(
                {'error': 'Archivo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def profile_photos(self, request):
        """Obtener álbum de fotos de perfil del usuario"""
        username = request.query_params.get('username')
        
        if username:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                target_user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'Usuario no encontrado'}, status=404)
        else:
            target_user = request.user
        
        album = MediaAlbum.objects.filter(
            owner=target_user,
            name='Fotos de Perfil'
        ).first()
        
        if not album:
            return Response({
                'id': None,
                'name': 'Fotos de Perfil',
                'files': [],
                'file_count': 0
            })
        
        serializer = MediaAlbumSerializer(album, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def cover_photos(self, request):
        """Obtener álbum de fotos de portada del usuario"""
        username = request.query_params.get('username')
        
        if username:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                target_user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'Usuario no encontrado'}, status=404)
        else:
            target_user = request.user
        
        album = MediaAlbum.objects.filter(
            owner=target_user,
            name='Fotos de Portada'
        ).first()
        
        if not album:
            return Response({
                'id': None,
                'name': 'Fotos de Portada',
                'files': [],
                'file_count': 0
            })
        
        serializer = MediaAlbumSerializer(album, context={'request': request})
        return Response(serializer.data)

from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action, api_view, permission_classes as perm_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from .models import Community, CommunityCategory, CommunityPost, CommunityMembership, CommunityPostComment
from .serializers import (
    CommunitySerializer, CommunityListSerializer, CommunityCreateSerializer, 
    CommunityPostSerializer, CommunityPostCreateSerializer, 
    CommunityMembershipSerializer, CommunityPostCommentSerializer,
    CommunityCategorySerializer
)


class CommunityCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para categorías de comunidades"""
    queryset = CommunityCategory.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = CommunityCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def communities(self, request, slug=None):
        """Obtener comunidades principales de una categoría"""
        category = self.get_object()
        communities = Community.objects.filter(
            category_obj=category,
            is_active=True,
            parent__isnull=True  # Solo comunidades principales
        ).order_by('-created_at')
        
        serializer = CommunityListSerializer(communities, many=True, context={'request': request})
        return Response({
            'category': CommunityCategorySerializer(category).data,
            'communities': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def all_communities(self, request, slug=None):
        """Obtener todas las comunidades de una categoría (principales y sub)"""
        category = self.get_object()
        
        # Comunidades principales
        main_communities = Community.objects.filter(
            category_obj=category,
            is_active=True,
            parent__isnull=True
        ).annotate(
            sub_count=Count('subcommunities', filter=Q(subcommunities__is_active=True))
        ).order_by('-sub_count', '-created_at')
        
        # Subcomunidades
        subcommunities = Community.objects.filter(
            category_obj=category,
            is_active=True,
            parent__isnull=False
        ).order_by('-created_at')
        
        return Response({
            'category': CommunityCategorySerializer(category).data,
            'main_communities': CommunityListSerializer(main_communities, many=True, context={'request': request}).data,
            'subcommunities': CommunityListSerializer(subcommunities, many=True, context={'request': request}).data,
            'total_count': main_communities.count() + subcommunities.count()
        })

class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'  # Usar UUID como lookup
    lookup_url_kwarg = 'id'
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommunityCreateSerializer
        return CommunitySerializer
    
    def get_object(self):
        """Override para permitir búsqueda por slug o id"""
        queryset = self.get_queryset()
        lookup_value = self.kwargs.get(self.lookup_url_kwarg)
        
        # Intentar primero por ID (UUID)
        try:
            return queryset.get(id=lookup_value)
        except Community.DoesNotExist:
            # Si no encuentra por ID, intentar por slug
            try:
                return queryset.get(slug=lookup_value)
            except Community.DoesNotExist:
                from rest_framework.exceptions import NotFound
                raise NotFound('Comunidad no encontrada')
    
    def get_queryset(self):
        queryset = Community.objects.filter(is_active=True)
        
        # Filtros
        category = self.request.query_params.get('category')
        category_slug = self.request.query_params.get('category_slug')
        community_type = self.request.query_params.get('type')
        search = self.request.query_params.get('search')
        parent_id = self.request.query_params.get('parent')
        only_main = self.request.query_params.get('only_main')
        only_sub = self.request.query_params.get('only_sub')
        
        # Filtrar por categoría (legacy)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filtrar por categoría (nuevo)
        if category_slug:
            queryset = queryset.filter(category_obj__slug=category_slug)
        
        if community_type:
            queryset = queryset.filter(type=community_type)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Filtrar por comunidad padre
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        
        # Solo comunidades principales (sin padre)
        if only_main == 'true':
            queryset = queryset.filter(parent__isnull=True)
        
        # Solo subcomunidades
        if only_sub == 'true':
            queryset = queryset.filter(parent__isnull=False)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def join(self, request, id=None):
        """Unirse o seguir una comunidad/página"""
        community = self.get_object()
        
        membership, created = CommunityMembership.objects.get_or_create(
            community=community,
            user=request.user,
            defaults={'role': 'member'}
        )
        
        if not created:
            # Si ya existe, alternar el estado
            membership.is_active = not membership.is_active
            membership.save()
            
            action_text = 'unido' if membership.is_active else 'salido'
            if community.type == 'page':
                action_text = 'siguiendo' if membership.is_active else 'dejado de seguir'
        else:
            action_text = 'unido'
            if community.type == 'page':
                action_text = 'siguiendo'
        
        return Response({
            'message': f'Te has {action_text} a {community.name}',
            'is_member': membership.is_active
        })
    
    @action(detail=True, methods=['get', 'post'])
    def posts(self, request, id=None):
        """Obtener o crear publicaciones de una comunidad"""
        community = self.get_object()
        
        if request.method == 'POST':
            # Crear nueva publicación
            if not request.user.is_authenticated:
                return Response({'error': 'Autenticación requerida'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Verificar si es miembro
            if not community.is_member(request.user) and not community.is_owner(request.user):
                return Response({'error': 'Debes ser miembro para publicar'}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = CommunityPostCreateSerializer(data=request.data)
            if serializer.is_valid():
                post = serializer.save(author=request.user, community=community)
                response_serializer = CommunityPostSerializer(post, context={'request': request})
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # GET - Listar publicaciones
        posts = CommunityPost.objects.filter(
            community=community,
            is_active=True,
            is_approved=True
        ).order_by('-is_pinned', '-created_at')
        
        serializer = CommunityPostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def members(self, request, id=None):
        """Obtener miembros/seguidores de una comunidad"""
        community = self.get_object()
        memberships = CommunityMembership.objects.filter(
            community=community,
            is_active=True
        ).order_by('-joined_at')
        
        serializer = CommunityMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_communities(self, request):
        """Obtener comunidades del usuario actual"""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
        
        # Comunidades donde es propietario
        owned = Community.objects.filter(owner=request.user, is_active=True)
        
        # Comunidades donde es miembro
        joined_ids = CommunityMembership.objects.filter(
            user=request.user,
            is_active=True
        ).values_list('community_id', flat=True)
        joined = Community.objects.filter(id__in=joined_ids, is_active=True)
        
        owned_serializer = CommunitySerializer(owned, many=True, context={'request': request})
        joined_serializer = CommunitySerializer(joined, many=True, context={'request': request})
        
        return Response({
            'owned': owned_serializer.data,
            'joined': joined_serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def subcommunities(self, request, id=None):
        """Obtener subcomunidades de una comunidad"""
        community = self.get_object()
        subcommunities = community.subcommunities.filter(is_active=True).order_by('name')
        
        serializer = CommunityListSerializer(subcommunities, many=True, context={'request': request})
        return Response({
            'parent': {
                'id': str(community.id),
                'name': community.name,
                'slug': community.slug,
            },
            'subcommunities': serializer.data,
            'count': subcommunities.count()
        })

class CommunityPostViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommunityPostCreateSerializer
        return CommunityPostSerializer
    
    def get_queryset(self):
        # Obtener community del kwargs (nested router)
        # El router anidado genera 'community_pk' como parámetro
        community_pk = self.kwargs.get('community_pk')
        
        if community_pk:
            # Intentar primero por ID, luego por slug
            try:
                community = Community.objects.get(id=community_pk)
            except Community.DoesNotExist:
                try:
                    community = Community.objects.get(slug=community_pk)
                except Community.DoesNotExist:
                    return CommunityPost.objects.none()
            
            return CommunityPost.objects.filter(
                community=community,
                is_active=True,
                is_approved=True
            ).order_by('-is_pinned', '-created_at')
        return CommunityPost.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Override create para manejar la creación de posts"""
        community_pk = self.kwargs.get('community_pk')
        
        if not community_pk:
            return Response(
                {'error': 'Community ID es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            community = Community.objects.get(id=community_pk)
        except Community.DoesNotExist:
            try:
                community = Community.objects.get(slug=community_pk)
            except Community.DoesNotExist:
                return Response(
                    {'error': 'Comunidad no encontrada'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Verificar permisos
        if not community.allow_posts:
            return Response(
                {'error': 'Esta comunidad no permite publicaciones'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if community.type == 'private' and not community.is_member(request.user):
            return Response(
                {'error': 'Debes ser miembro para publicar en comunidades privadas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        post = serializer.save(
            author=request.user,
            community=community
        )
        
        # Devolver el post completo
        response_serializer = CommunityPostSerializer(post, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def like(self, request, community_id=None, id=None):
        """Dar/quitar like a una publicación"""
        post = self.get_object()
        
        if post.likes.filter(id=request.user.id).exists():
            post.likes.remove(request.user)
            liked = False
        else:
            post.likes.add(request.user)
            liked = True
        
        return Response({
            'liked': liked,
            'like_count': post.like_count
        })

class CommunityPostListCreateView(generics.ListCreateAPIView):
    """Vista para listar y crear posts de comunidades"""
    serializer_class = CommunityPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommunityPostCreateSerializer
        return CommunityPostSerializer
    
    def get_queryset(self):
        community_id = self.kwargs.get('community_id')
        
        if community_id:
            try:
                community = Community.objects.get(id=community_id)
            except Community.DoesNotExist:
                try:
                    community = Community.objects.get(slug=community_id)
                except Community.DoesNotExist:
                    return CommunityPost.objects.none()
            
            return CommunityPost.objects.filter(
                community=community,
                is_active=True,
                is_approved=True
            ).order_by('-is_pinned', '-created_at')
        return CommunityPost.objects.none()
    
    def perform_create(self, serializer):
        community_id = self.kwargs.get('community_id')
        
        if not community_id:
            raise ValidationError("Community ID es requerido")
        
        try:
            community = Community.objects.get(id=community_id)
        except Community.DoesNotExist:
            try:
                community = Community.objects.get(slug=community_id)
            except Community.DoesNotExist:
                raise NotFound('Comunidad no encontrada')
        
        # Verificar permisos
        if not community.allow_posts:
            raise PermissionError("Esta comunidad no permite publicaciones")
        
        if community.type == 'private' and not community.is_member(self.request.user):
            raise PermissionError("Debes ser miembro para publicar en comunidades privadas")
        
        serializer.save(
            author=self.request.user,
            community=community
        )
    
    def create(self, request, *args, **kwargs):
        """Override create para devolver el post con datos completos del autor"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Obtener el post creado y serializarlo con el serializer completo
        post = serializer.instance
        response_serializer = CommunityPostSerializer(post, context={'request': request})
        
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommunityPostCommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityPostCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'
    
    def get_queryset(self):
        # Obtener post del kwargs (nested router o URL directa)
        post_pk = self.kwargs.get('post_pk') or self.kwargs.get('post_id')
        if post_pk:
            return CommunityPostComment.objects.filter(
                post_id=post_pk,
                is_active=True
            ).order_by('-created_at')
        return CommunityPostComment.objects.none()
    
    def perform_create(self, serializer):
        post_pk = self.kwargs.get('post_pk') or self.kwargs.get('post_id')
        post = get_object_or_404(CommunityPost, id=post_pk)
        
        serializer.save(
            author=self.request.user,
            post=post
        )
    
    @action(detail=True, methods=['post'])
    def like(self, request, post_id=None, id=None):
        """Dar/quitar like a un comentario"""
        comment = self.get_object()
        
        if comment.likes.filter(id=request.user.id).exists():
            comment.likes.remove(request.user)
            liked = False
        else:
            comment.likes.add(request.user)
            liked = True
        
        return Response({
            'liked': liked,
            'like_count': comment.like_count
        })
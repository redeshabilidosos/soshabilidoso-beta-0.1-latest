"""
Views para Clasificados
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import (
    ProductClassified, ServiceClassified, FreelancerClassified,
    ClassifiedLike, ClassifiedView, ClassifiedContact, ClassifiedReport, ServiceReview
)
from .serializers import (
    ProductClassifiedSerializer, ProductClassifiedCreateSerializer,
    ServiceClassifiedSerializer, ServiceClassifiedCreateSerializer,
    FreelancerClassifiedSerializer, FreelancerClassifiedCreateSerializer,
    ClassifiedContactSerializer, ServiceReviewSerializer, ClassifiedReportSerializer
)


class ProductClassifiedViewSet(viewsets.ModelViewSet):
    """ViewSet para productos físicos"""
    queryset = ProductClassified.objects.filter(status='active')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductClassifiedCreateSerializer
        return ProductClassifiedSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros
        category = self.request.query_params.get('category')
        condition = self.request.query_params.get('condition')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        location = self.request.query_params.get('location')
        search = self.request.query_params.get('search')
        
        if category:
            queryset = queryset.filter(category=category)
        if condition:
            queryset = queryset.filter(condition=condition)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset.select_related('user')
    
    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """Obtener productos del usuario actual"""
        queryset = ProductClassified.objects.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Dar/quitar like a un producto"""
        product = self.get_object()
        like, created = ClassifiedLike.objects.get_or_create(
            user=request.user,
            classified_type='product',
            classified_id=product.id
        )
        if not created:
            like.delete()
            product.likes_count = max(0, product.likes_count - 1)
            product.save(update_fields=['likes_count'])
            return Response({'liked': False, 'likes_count': product.likes_count})
        
        product.likes_count += 1
        product.save(update_fields=['likes_count'])
        return Response({'liked': True, 'likes_count': product.likes_count})
    
    @action(detail=True, methods=['post'])
    def contact(self, request, pk=None):
        """Contactar al vendedor"""
        product = self.get_object()
        message = request.data.get('message', '')
        
        if not message:
            return Response({'error': 'El mensaje es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        contact = ClassifiedContact.objects.create(
            sender=request.user,
            receiver=product.user,
            classified_type='product',
            classified_id=product.id,
            message=message
        )
        product.contacts_count += 1
        product.save(update_fields=['contacts_count'])
        
        return Response(ClassifiedContactSerializer(contact).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        """Reportar un producto"""
        product = self.get_object()
        serializer = ClassifiedReportSerializer(data={
            **request.data,
            'classified_type': 'product',
            'classified_id': str(product.id)
        })
        if serializer.is_valid():
            serializer.save(reporter=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceClassifiedViewSet(viewsets.ModelViewSet):
    """ViewSet para servicios marketplace"""
    queryset = ServiceClassified.objects.filter(status='active')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ServiceClassifiedCreateSerializer
        return ServiceClassifiedSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        location = self.request.query_params.get('location')
        search = self.request.query_params.get('search')
        min_rating = self.request.query_params.get('min_rating')
        
        if category:
            queryset = queryset.filter(category=category)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        
        return queryset.select_related('user')
    
    @action(detail=False, methods=['get'])
    def my_services(self, request):
        """Obtener servicios del usuario actual"""
        queryset = ServiceClassified.objects.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Dar/quitar like a un servicio"""
        service = self.get_object()
        like, created = ClassifiedLike.objects.get_or_create(
            user=request.user,
            classified_type='service',
            classified_id=service.id
        )
        if not created:
            like.delete()
            service.likes_count = max(0, service.likes_count - 1)
            service.save(update_fields=['likes_count'])
            return Response({'liked': False, 'likes_count': service.likes_count})
        
        service.likes_count += 1
        service.save(update_fields=['likes_count'])
        return Response({'liked': True, 'likes_count': service.likes_count})
    
    @action(detail=True, methods=['post'])
    def contact(self, request, pk=None):
        """Contactar al proveedor del servicio"""
        service = self.get_object()
        message = request.data.get('message', '')
        
        if not message:
            return Response({'error': 'El mensaje es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        contact = ClassifiedContact.objects.create(
            sender=request.user,
            receiver=service.user,
            classified_type='service',
            classified_id=service.id,
            message=message
        )
        service.contacts_count += 1
        service.save(update_fields=['contacts_count'])
        
        return Response(ClassifiedContactSerializer(contact).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """Agregar reseña a un servicio"""
        service = self.get_object()
        serializer = ServiceReviewSerializer(data={
            **request.data,
            'classified_type': 'service',
            'classified_id': str(service.id)
        })
        if serializer.is_valid():
            serializer.save(reviewer=request.user, provider=service.user)
            # Actualizar rating promedio
            reviews = ServiceReview.objects.filter(classified_type='service', classified_id=service.id)
            avg_rating = sum(r.rating for r in reviews) / reviews.count()
            service.rating = avg_rating
            service.reviews_count = reviews.count()
            service.save(update_fields=['rating', 'reviews_count'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FreelancerClassifiedViewSet(viewsets.ModelViewSet):
    """ViewSet para trabajos freelancer"""
    queryset = FreelancerClassified.objects.filter(status='active')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return FreelancerClassifiedCreateSerializer
        return FreelancerClassifiedSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        location = self.request.query_params.get('location')
        search = self.request.query_params.get('search')
        min_rating = self.request.query_params.get('min_rating')
        skill = self.request.query_params.get('skill')
        
        if category:
            queryset = queryset.filter(category=category)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        if skill:
            queryset = queryset.filter(skills__contains=[skill])
        
        return queryset.select_related('user')
    
    @action(detail=False, methods=['get'])
    def my_freelancer_ads(self, request):
        """Obtener anuncios freelancer del usuario actual"""
        queryset = FreelancerClassified.objects.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Dar/quitar like a un anuncio freelancer"""
        freelancer = self.get_object()
        like, created = ClassifiedLike.objects.get_or_create(
            user=request.user,
            classified_type='freelancer',
            classified_id=freelancer.id
        )
        if not created:
            like.delete()
            freelancer.likes_count = max(0, freelancer.likes_count - 1)
            freelancer.save(update_fields=['likes_count'])
            return Response({'liked': False, 'likes_count': freelancer.likes_count})
        
        freelancer.likes_count += 1
        freelancer.save(update_fields=['likes_count'])
        return Response({'liked': True, 'likes_count': freelancer.likes_count})
    
    @action(detail=True, methods=['post'])
    def contact(self, request, pk=None):
        """Contactar al freelancer"""
        freelancer = self.get_object()
        message = request.data.get('message', '')
        
        if not message:
            return Response({'error': 'El mensaje es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        contact = ClassifiedContact.objects.create(
            sender=request.user,
            receiver=freelancer.user,
            classified_type='freelancer',
            classified_id=freelancer.id,
            message=message
        )
        freelancer.contacts_count += 1
        freelancer.save(update_fields=['contacts_count'])
        
        return Response(ClassifiedContactSerializer(contact).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """Agregar reseña a un freelancer"""
        freelancer = self.get_object()
        serializer = ServiceReviewSerializer(data={
            **request.data,
            'classified_type': 'freelancer',
            'classified_id': str(freelancer.id)
        })
        if serializer.is_valid():
            serializer.save(reviewer=request.user, provider=freelancer.user)
            # Actualizar rating promedio
            reviews = ServiceReview.objects.filter(classified_type='freelancer', classified_id=freelancer.id)
            avg_rating = sum(r.rating for r in reviews) / reviews.count()
            freelancer.rating = avg_rating
            freelancer.reviews_count = reviews.count()
            freelancer.save(update_fields=['rating', 'reviews_count'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllClassifiedsViewSet(viewsets.ViewSet):
    """ViewSet para obtener todos los clasificados combinados"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def list(self, request):
        """Listar todos los clasificados"""
        search = request.query_params.get('search', '')
        category_type = request.query_params.get('type')  # product, service, freelancer
        
        results = []
        
        if not category_type or category_type == 'product':
            products = ProductClassified.objects.filter(status='active')
            if search:
                products = products.filter(Q(title__icontains=search) | Q(description__icontains=search))
            for p in products[:20]:
                results.append({
                    'type': 'product',
                    'data': ProductClassifiedSerializer(p, context={'request': request}).data
                })
        
        if not category_type or category_type == 'service':
            services = ServiceClassified.objects.filter(status='active')
            if search:
                services = services.filter(Q(title__icontains=search) | Q(description__icontains=search))
            for s in services[:20]:
                results.append({
                    'type': 'service',
                    'data': ServiceClassifiedSerializer(s, context={'request': request}).data
                })
        
        if not category_type or category_type == 'freelancer':
            freelancers = FreelancerClassified.objects.filter(status='active')
            if search:
                freelancers = freelancers.filter(Q(title__icontains=search) | Q(description__icontains=search))
            for f in freelancers[:20]:
                results.append({
                    'type': 'freelancer',
                    'data': FreelancerClassifiedSerializer(f, context={'request': request}).data
                })
        
        # Ordenar por fecha de creación
        results.sort(key=lambda x: x['data']['created_at'], reverse=True)
        
        return Response(results[:50])
    
    @action(detail=False, methods=['get'])
    def my_classifieds(self, request):
        """Obtener todos los clasificados del usuario actual"""
        results = []
        
        products = ProductClassified.objects.filter(user=request.user)
        for p in products:
            results.append({
                'type': 'product',
                'data': ProductClassifiedSerializer(p, context={'request': request}).data
            })
        
        services = ServiceClassified.objects.filter(user=request.user)
        for s in services:
            results.append({
                'type': 'service',
                'data': ServiceClassifiedSerializer(s, context={'request': request}).data
            })
        
        freelancers = FreelancerClassified.objects.filter(user=request.user)
        for f in freelancers:
            results.append({
                'type': 'freelancer',
                'data': FreelancerClassifiedSerializer(f, context={'request': request}).data
            })
        
        results.sort(key=lambda x: x['data']['created_at'], reverse=True)
        
        return Response(results)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtener estadísticas de clasificados"""
        return Response({
            'total_products': ProductClassified.objects.filter(status='active').count(),
            'total_services': ServiceClassified.objects.filter(status='active').count(),
            'total_freelancers': FreelancerClassified.objects.filter(status='active').count(),
            'total_active': (
                ProductClassified.objects.filter(status='active').count() +
                ServiceClassified.objects.filter(status='active').count() +
                FreelancerClassified.objects.filter(status='active').count()
            )
        })

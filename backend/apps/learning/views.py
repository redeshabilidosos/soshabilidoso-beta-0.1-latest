from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count
from .models import Seccion, Tema, ProgresoUsuario, Logro, UsuarioLogro
from .serializers import (
    SeccionListSerializer, SeccionDetailSerializer,
    TemaListSerializer, TemaDetailSerializer,
    ProgresoUsuarioSerializer, LogroSerializer,
    EstadisticasUsuarioSerializer
)


class SeccionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para secciones de aprendizaje"""
    queryset = Seccion.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    pagination_class = None  # Desactivar paginación para secciones
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SeccionDetailSerializer
        return SeccionListSerializer
    
    def get_queryset(self):
        return Seccion.objects.filter(is_active=True).prefetch_related('temas')


class TemaViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para temas de aprendizaje"""
    queryset = Tema.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TemaDetailSerializer
        return TemaListSerializer
    
    def get_queryset(self):
        queryset = Tema.objects.filter(is_active=True).select_related('seccion')
        
        # Filtrar por sección si se proporciona
        seccion_slug = self.request.query_params.get('seccion')
        if seccion_slug:
            queryset = queryset.filter(seccion__slug=seccion_slug)
        
        return queryset.prefetch_related('contenidos', 'puntos_clave')
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def marcar_completado(self, request, slug=None):
        """Marcar un tema como completado"""
        tema = self.get_object()
        
        progreso, created = ProgresoUsuario.objects.get_or_create(
            usuario=request.user,
            tema=tema,
            defaults={
                'estado': 'completado',
                'fecha_inicio': timezone.now(),
                'fecha_completado': timezone.now()
            }
        )
        
        if not created and progreso.estado != 'completado':
            progreso.estado = 'completado'
            progreso.fecha_completado = timezone.now()
            progreso.save()
        
        # Verificar si se desbloqueó algún logro
        logros_desbloqueados = self._verificar_logros(request.user)
        
        return Response({
            'success': True,
            'message': 'Tema marcado como completado',
            'progreso': ProgresoUsuarioSerializer(progreso).data,
            'logros_desbloqueados': LogroSerializer(logros_desbloqueados, many=True).data
        })
    
    def _verificar_logros(self, usuario):
        """Verifica y otorga logros al usuario"""
        logros_nuevos = []
        temas_completados = ProgresoUsuario.objects.filter(
            usuario=usuario,
            estado='completado'
        ).count()
        
        # Verificar logros por cantidad de temas
        logros_por_temas = Logro.objects.filter(
            is_active=True,
            temas_requeridos__gt=0,
            temas_requeridos__lte=temas_completados
        ).exclude(
            usuarios__usuario=usuario
        )
        
        for logro in logros_por_temas:
            UsuarioLogro.objects.create(usuario=usuario, logro=logro)
            logros_nuevos.append(logro)
        
        # Verificar logros por sección completada
        secciones = Seccion.objects.filter(is_active=True)
        for seccion in secciones:
            temas_seccion = seccion.temas.filter(is_active=True).count()
            completados_seccion = ProgresoUsuario.objects.filter(
                usuario=usuario,
                tema__seccion=seccion,
                estado='completado'
            ).count()
            
            if temas_seccion > 0 and completados_seccion >= temas_seccion:
                logros_seccion = Logro.objects.filter(
                    is_active=True,
                    seccion_requerida=seccion
                ).exclude(usuarios__usuario=usuario)
                
                for logro in logros_seccion:
                    UsuarioLogro.objects.create(usuario=usuario, logro=logro)
                    logros_nuevos.append(logro)
        
        return logros_nuevos


class ProgresoViewSet(viewsets.ModelViewSet):
    """ViewSet para el progreso del usuario"""
    serializer_class = ProgresoUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ProgresoUsuario.objects.filter(
            usuario=self.request.user
        ).select_related('tema', 'tema__seccion')
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas generales del usuario"""
        usuario = request.user
        
        # Contar temas
        temas_totales = Tema.objects.filter(is_active=True).count()
        temas_completados = ProgresoUsuario.objects.filter(
            usuario=usuario,
            estado='completado'
        ).count()
        
        # Calcular porcentaje
        porcentaje = round((temas_completados / temas_totales * 100)) if temas_totales > 0 else 0
        
        # Tiempo total
        tiempo_total = ProgresoUsuario.objects.filter(
            usuario=usuario
        ).aggregate(total=Sum('tiempo_dedicado_minutos'))['total'] or 0
        
        # Logros
        logros_totales = Logro.objects.filter(is_active=True).count()
        logros_obtenidos = UsuarioLogro.objects.filter(usuario=usuario).count()
        
        # Determinar nivel
        if porcentaje >= 80:
            nivel = "Experto"
        elif porcentaje >= 50:
            nivel = "Intermedio"
        elif porcentaje >= 20:
            nivel = "Aprendiz"
        else:
            nivel = "Principiante"
        
        # Progreso por sección
        secciones = Seccion.objects.filter(is_active=True)
        progreso_por_seccion = []
        for seccion in secciones:
            temas_seccion = seccion.temas.filter(is_active=True).count()
            completados = ProgresoUsuario.objects.filter(
                usuario=usuario,
                tema__seccion=seccion,
                estado='completado'
            ).count()
            progreso_por_seccion.append({
                'seccion_id': str(seccion.id),
                'seccion_slug': seccion.slug,
                'seccion_nombre': seccion.nombre,
                'temas_total': temas_seccion,
                'temas_completados': completados,
                'porcentaje': round((completados / temas_seccion * 100)) if temas_seccion > 0 else 0
            })
        
        data = {
            'temas_completados': temas_completados,
            'temas_totales': temas_totales,
            'porcentaje_progreso': porcentaje,
            'tiempo_total_minutos': tiempo_total,
            'logros_obtenidos': logros_obtenidos,
            'logros_totales': logros_totales,
            'nivel': nivel,
            'progreso_por_seccion': progreso_por_seccion
        }
        
        return Response(EstadisticasUsuarioSerializer(data).data)


class LogroViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para logros"""
    queryset = Logro.objects.filter(is_active=True)
    serializer_class = LogroSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mis_logros(self, request):
        """Obtener logros del usuario actual"""
        usuario_logros = UsuarioLogro.objects.filter(
            usuario=request.user
        ).select_related('logro')
        
        logros = [ul.logro for ul in usuario_logros]
        return Response(LogroSerializer(logros, many=True, context={'request': request}).data)

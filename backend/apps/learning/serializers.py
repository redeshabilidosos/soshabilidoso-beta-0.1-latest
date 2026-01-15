from rest_framework import serializers
from .models import Seccion, Tema, TemaContenido, TemaPuntoClave, ProgresoUsuario, Logro, UsuarioLogro


class TemaContenidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemaContenido
        fields = ['id', 'subtitulo', 'contenido', 'orden']


class TemaPuntoClaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemaPuntoClave
        fields = ['id', 'texto', 'orden']


class TemaListSerializer(serializers.ModelSerializer):
    """Serializer para listar temas (sin contenido completo)"""
    duracion = serializers.CharField(source='duracion_formateada', read_only=True)
    completado = serializers.SerializerMethodField()
    imagen_final = serializers.SerializerMethodField()
    video_final = serializers.SerializerMethodField()
    
    class Meta:
        model = Tema
        fields = [
            'id', 'slug', 'titulo', 'descripcion', 'nivel', 
            'duracion', 'duracion_minutos', 'imagen_final', 'video_final',
            'imagen_url', 'video_url', 'orden', 'completado'
        ]
    
    def get_imagen_final(self, obj):
        """Retorna la imagen subida o la URL externa"""
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return obj.imagen_url or None
    
    def get_video_final(self, obj):
        """Retorna el video subido o la URL externa"""
        if obj.video:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return obj.video_url or None
    
    def get_completado(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ProgresoUsuario.objects.filter(
                usuario=request.user,
                tema=obj,
                estado='completado'
            ).exists()
        return False


class TemaDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalle de tema (con contenido completo)"""
    contenidos = TemaContenidoSerializer(many=True, read_only=True)
    puntos_clave = TemaPuntoClaveSerializer(many=True, read_only=True)
    duracion = serializers.CharField(source='duracion_formateada', read_only=True)
    seccion_nombre = serializers.CharField(source='seccion.nombre', read_only=True)
    seccion_slug = serializers.CharField(source='seccion.slug', read_only=True)
    seccion_id = serializers.UUIDField(source='seccion.id', read_only=True)
    completado = serializers.SerializerMethodField()
    tema_anterior = serializers.SerializerMethodField()
    tema_siguiente = serializers.SerializerMethodField()
    imagen_final = serializers.SerializerMethodField()
    video_final = serializers.SerializerMethodField()
    
    class Meta:
        model = Tema
        fields = [
            'id', 'slug', 'titulo', 'descripcion', 'nivel',
            'duracion', 'duracion_minutos', 
            'imagen_final', 'video_final', 'imagen_url', 'video_url',
            'seccion_id', 'seccion_slug', 'seccion_nombre',
            'contenidos', 'puntos_clave',
            'completado', 'tema_anterior', 'tema_siguiente'
        ]
    
    def get_imagen_final(self, obj):
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return obj.imagen_url or None
    
    def get_video_final(self, obj):
        if obj.video:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return obj.video_url or None
    
    def get_completado(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ProgresoUsuario.objects.filter(
                usuario=request.user,
                tema=obj,
                estado='completado'
            ).exists()
        return False
    
    def get_tema_anterior(self, obj):
        anterior = Tema.objects.filter(
            seccion=obj.seccion,
            orden__lt=obj.orden,
            is_active=True
        ).order_by('-orden').first()
        if anterior:
            return {'id': str(anterior.id), 'slug': anterior.slug, 'titulo': anterior.titulo}
        return None
    
    def get_tema_siguiente(self, obj):
        siguiente = Tema.objects.filter(
            seccion=obj.seccion,
            orden__gt=obj.orden,
            is_active=True
        ).order_by('orden').first()
        if siguiente:
            return {'id': str(siguiente.id), 'slug': siguiente.slug, 'titulo': siguiente.titulo}
        return None


class SeccionListSerializer(serializers.ModelSerializer):
    """Serializer para listar secciones"""
    temas_total = serializers.IntegerField(source='temas_count', read_only=True)
    duracion_total = serializers.CharField(read_only=True)
    temas_completados = serializers.SerializerMethodField()
    
    class Meta:
        model = Seccion
        fields = [
            'id', 'slug', 'nombre', 'descripcion', 'icono', 'color',
            'temas_total', 'duracion_total', 'temas_completados', 'orden'
        ]
    
    def get_temas_completados(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ProgresoUsuario.objects.filter(
                usuario=request.user,
                tema__seccion=obj,
                estado='completado'
            ).count()
        return 0


class SeccionDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalle de sección con sus temas"""
    temas = TemaListSerializer(many=True, read_only=True)
    temas_total = serializers.IntegerField(source='temas_count', read_only=True)
    duracion_total = serializers.CharField(read_only=True)
    temas_completados = serializers.SerializerMethodField()
    
    class Meta:
        model = Seccion
        fields = [
            'id', 'slug', 'nombre', 'descripcion', 'icono', 'color',
            'temas_total', 'duracion_total', 'temas_completados',
            'temas', 'orden'
        ]
    
    def get_temas_completados(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ProgresoUsuario.objects.filter(
                usuario=request.user,
                tema__seccion=obj,
                estado='completado'
            ).count()
        return 0


class ProgresoUsuarioSerializer(serializers.ModelSerializer):
    tema_titulo = serializers.CharField(source='tema.titulo', read_only=True)
    seccion_nombre = serializers.CharField(source='tema.seccion.nombre', read_only=True)
    
    class Meta:
        model = ProgresoUsuario
        fields = [
            'id', 'tema', 'tema_titulo', 'seccion_nombre',
            'estado', 'fecha_inicio', 'fecha_completado', 
            'tiempo_dedicado_minutos'
        ]
        read_only_fields = ['id', 'fecha_inicio', 'fecha_completado']


class LogroSerializer(serializers.ModelSerializer):
    desbloqueado = serializers.SerializerMethodField()
    fecha_obtenido = serializers.SerializerMethodField()
    
    class Meta:
        model = Logro
        fields = [
            'id', 'slug', 'nombre', 'descripcion', 'icono', 'color',
            'puntos', 'desbloqueado', 'fecha_obtenido'
        ]
    
    def get_desbloqueado(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UsuarioLogro.objects.filter(
                usuario=request.user,
                logro=obj
            ).exists()
        return False
    
    def get_fecha_obtenido(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            usuario_logro = UsuarioLogro.objects.filter(
                usuario=request.user,
                logro=obj
            ).first()
            if usuario_logro:
                return usuario_logro.fecha_obtenido
        return None


class EstadisticasUsuarioSerializer(serializers.Serializer):
    """Serializer para estadísticas generales del usuario"""
    temas_completados = serializers.IntegerField()
    temas_totales = serializers.IntegerField()
    porcentaje_progreso = serializers.IntegerField()
    tiempo_total_minutos = serializers.IntegerField()
    logros_obtenidos = serializers.IntegerField()
    logros_totales = serializers.IntegerField()
    nivel = serializers.CharField()
    progreso_por_seccion = serializers.ListField()

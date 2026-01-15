from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Seccion, Tema, TemaContenido, TemaPuntoClave, ProgresoUsuario, Logro, UsuarioLogro


class TemaContenidoInline(admin.StackedInline):
    """Inline para agregar contenido de texto a los temas"""
    model = TemaContenido
    extra = 1
    ordering = ['orden']
    
    fieldsets = (
        (None, {
            'fields': (('subtitulo', 'orden'), 'contenido')
        }),
    )


class TemaPuntoClaveInline(admin.TabularInline):
    """Inline para agregar puntos clave a los temas"""
    model = TemaPuntoClave
    extra = 3
    ordering = ['orden']


class TemaInline(admin.TabularInline):
    """Inline para ver y agregar temas dentro de una sección"""
    model = Tema
    extra = 1
    fields = ['titulo', 'slug', 'nivel', 'duracion_minutos', 'orden', 'is_active']
    prepopulated_fields = {'slug': ('titulo',)}
    ordering = ['orden']
    show_change_link = True


@admin.register(Seccion)
class SeccionAdmin(admin.ModelAdmin):
    list_display = ['color_badge', 'nombre', 'slug', 'temas_count', 'duracion_total', 'orden', 'is_active', 'acciones_rapidas']
    list_filter = ['is_active', 'created_at']
    search_fields = ['nombre', 'descripcion']
    prepopulated_fields = {'slug': ('nombre',)}
    ordering = ['orden', 'nombre']
    list_editable = ['orden', 'is_active']
    inlines = [TemaInline]
    actions = ['activar_secciones', 'desactivar_secciones', 'duplicar_seccion']
    
    fieldsets = (
        ('📚 Información General', {
            'fields': ('nombre', 'slug', 'descripcion'),
            'description': 'Información básica de la sección de aprendizaje'
        }),
        ('🎨 Apariencia', {
            'fields': ('icono', 'color', 'imagen'),
            'description': 'Icono: nombre del componente Lucide (ej: Dumbbell, GraduationCap). Color: código hexadecimal.'
        }),
        ('⚙️ Configuración', {
            'fields': ('orden', 'is_active'),
        }),
    )
    
    def color_badge(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 3px 10px; border-radius: 4px; color: white;">{}</span>',
            obj.color, obj.icono or '📁'
        )
    color_badge.short_description = 'Icono'
    
    def acciones_rapidas(self, obj):
        url_agregar_tema = reverse('admin:learning_tema_add') + f'?seccion={obj.pk}'
        return format_html(
            '<a href="{}" style="color: #00ff88;">➕ Agregar Tema</a>',
            url_agregar_tema
        )
    acciones_rapidas.short_description = 'Acciones'
    
    @admin.action(description='✅ Activar secciones seleccionadas')
    def activar_secciones(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} secciones activadas.')
    
    @admin.action(description='❌ Desactivar secciones seleccionadas')
    def desactivar_secciones(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} secciones desactivadas.')
    
    @admin.action(description='📋 Duplicar secciones (con todos sus temas)')
    def duplicar_seccion(self, request, queryset):
        for seccion in queryset:
            nueva_seccion = Seccion.objects.create(
                nombre=f"{seccion.nombre} (Copia)",
                slug=f"{seccion.slug}-copia",
                descripcion=seccion.descripcion,
                icono=seccion.icono,
                color=seccion.color,
                orden=seccion.orden + 100,
                is_active=False
            )
            for tema in seccion.temas.all():
                nuevo_tema = Tema.objects.create(
                    seccion=nueva_seccion,
                    titulo=tema.titulo,
                    slug=f"{tema.slug}-copia",
                    descripcion=tema.descripcion,
                    nivel=tema.nivel,
                    duracion_minutos=tema.duracion_minutos,
                    orden=tema.orden,
                    is_active=False
                )
                for contenido in tema.contenidos.all():
                    TemaContenido.objects.create(
                        tema=nuevo_tema,
                        subtitulo=contenido.subtitulo,
                        contenido=contenido.contenido,
                        orden=contenido.orden
                    )
                for punto in tema.puntos_clave.all():
                    TemaPuntoClave.objects.create(
                        tema=nuevo_tema,
                        texto=punto.texto,
                        orden=punto.orden
                    )
        self.message_user(request, f'{queryset.count()} secciones duplicadas (desactivadas por defecto).')


@admin.register(Tema)
class TemaAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'seccion', 'nivel_badge', 'duracion_formateada', 'contenidos_count', 'orden', 'is_active', 'acciones_tema']
    list_filter = ['seccion', 'nivel', 'is_active']
    search_fields = ['titulo', 'descripcion', 'seccion__nombre']
    prepopulated_fields = {'slug': ('titulo',)}
    ordering = ['seccion', 'orden']
    list_editable = ['orden', 'is_active']
    autocomplete_fields = ['seccion']
    inlines = [TemaContenidoInline, TemaPuntoClaveInline]
    save_on_top = True
    actions = ['activar_temas', 'desactivar_temas', 'duplicar_tema']
    
    fieldsets = (
        ('📖 Información del Tema', {
            'fields': ('seccion', 'titulo', 'slug', 'descripcion'),
            'description': 'Información básica del tema de aprendizaje'
        }),
        ('📊 Configuración de Aprendizaje', {
            'fields': (('nivel', 'duracion_minutos'), 'orden'),
            'description': 'Nivel de dificultad y duración estimada en minutos'
        }),
        ('🖼️ Imagen de Portada', {
            'fields': ('imagen', 'imagen_url'),
            'description': 'Sube una imagen o proporciona una URL externa. Si subes imagen, tiene prioridad sobre la URL.'
        }),
        ('🎬 Video del Tema', {
            'fields': ('video', 'video_url'),
            'description': 'Sube un video o proporciona una URL de YouTube/Vimeo. Si subes video, tiene prioridad sobre la URL.'
        }),
        ('⚙️ Estado', {
            'fields': ('is_active',),
        }),
    )
    
    def nivel_badge(self, obj):
        colors = {
            'basico': '#22c55e',
            'intermedio': '#eab308', 
            'avanzado': '#ef4444'
        }
        return format_html(
            '<span style="background-color: {}; padding: 2px 8px; border-radius: 4px; color: white; font-size: 11px;">{}</span>',
            colors.get(obj.nivel, '#666'), obj.get_nivel_display()
        )
    nivel_badge.short_description = 'Nivel'
    
    def contenidos_count(self, obj):
        count = obj.contenidos.count()
        puntos = obj.puntos_clave.count()
        return f'{count} secciones, {puntos} puntos'
    contenidos_count.short_description = 'Contenido'
    
    def acciones_tema(self, obj):
        return format_html(
            '<a href="{}" style="color: #3b82f6;">✏️ Editar contenido</a>',
            reverse('admin:learning_tema_change', args=[obj.pk])
        )
    acciones_tema.short_description = 'Acciones'
    
    @admin.action(description='✅ Activar temas seleccionados')
    def activar_temas(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} temas activados.')
    
    @admin.action(description='❌ Desactivar temas seleccionados')
    def desactivar_temas(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} temas desactivados.')
    
    @admin.action(description='📋 Duplicar temas seleccionados')
    def duplicar_tema(self, request, queryset):
        for tema in queryset:
            nuevo_tema = Tema.objects.create(
                seccion=tema.seccion,
                titulo=f"{tema.titulo} (Copia)",
                slug=f"{tema.slug}-copia",
                descripcion=tema.descripcion,
                nivel=tema.nivel,
                duracion_minutos=tema.duracion_minutos,
                orden=tema.orden + 100,
                is_active=False
            )
            for contenido in tema.contenidos.all():
                TemaContenido.objects.create(
                    tema=nuevo_tema,
                    subtitulo=contenido.subtitulo,
                    contenido=contenido.contenido,
                    orden=contenido.orden
                )
            for punto in tema.puntos_clave.all():
                TemaPuntoClave.objects.create(
                    tema=nuevo_tema,
                    texto=punto.texto,
                    orden=punto.orden
                )
        self.message_user(request, f'{queryset.count()} temas duplicados.')


@admin.register(ProgresoUsuario)
class ProgresoUsuarioAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'tema', 'seccion_nombre', 'estado_badge', 'fecha_inicio', 'fecha_completado', 'tiempo_dedicado_minutos']
    list_filter = ['estado', 'tema__seccion', 'fecha_completado']
    search_fields = ['usuario__username', 'usuario__email', 'tema__titulo']
    raw_id_fields = ['usuario', 'tema']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('👤 Usuario y Tema', {
            'fields': ('usuario', 'tema')
        }),
        ('📈 Progreso', {
            'fields': ('estado', ('fecha_inicio', 'fecha_completado'), 'tiempo_dedicado_minutos')
        }),
        ('📅 Fechas del Sistema', {
            'fields': ('created_at', 'updated_at'),
            'classes': ['collapse']
        }),
    )
    
    def seccion_nombre(self, obj):
        return obj.tema.seccion.nombre
    seccion_nombre.short_description = 'Sección'
    
    def estado_badge(self, obj):
        colors = {
            'no_iniciado': '#6b7280',
            'en_progreso': '#eab308',
            'completado': '#22c55e'
        }
        return format_html(
            '<span style="background-color: {}; padding: 2px 8px; border-radius: 4px; color: white; font-size: 11px;">{}</span>',
            colors.get(obj.estado, '#666'), obj.get_estado_display()
        )
    estado_badge.short_description = 'Estado'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('usuario', 'tema', 'tema__seccion')


@admin.register(Logro)
class LogroAdmin(admin.ModelAdmin):
    list_display = ['icono_display', 'nombre', 'puntos', 'condicion_display', 'usuarios_count', 'is_active']
    list_filter = ['is_active', 'seccion_requerida']
    search_fields = ['nombre', 'descripcion']
    prepopulated_fields = {'slug': ('nombre',)}
    list_editable = ['is_active']
    
    fieldsets = (
        ('🏆 Información del Logro', {
            'fields': ('nombre', 'slug', 'descripcion'),
            'description': 'Información básica del logro/insignia'
        }),
        ('🎨 Apariencia', {
            'fields': (('icono', 'color'), 'puntos'),
            'description': 'Icono: usa un emoji. Color: código hexadecimal para el badge.'
        }),
        ('🎯 Condiciones para Obtener', {
            'fields': ('seccion_requerida', 'temas_requeridos'),
            'description': 'Define qué debe completar el usuario para obtener este logro. Puedes requerir completar una sección específica O un número mínimo de temas.'
        }),
        ('⚙️ Estado', {
            'fields': ('is_active',),
            'classes': ['collapse']
        }),
    )
    
    def icono_display(self, obj):
        return format_html(
            '<span style="font-size: 24px;">{}</span>',
            obj.icono
        )
    icono_display.short_description = 'Icono'
    
    def condicion_display(self, obj):
        if obj.seccion_requerida:
            return f'Completar: {obj.seccion_requerida.nombre}'
        elif obj.temas_requeridos > 0:
            return f'{obj.temas_requeridos} temas'
        return '-'
    condicion_display.short_description = 'Condición'
    
    def usuarios_count(self, obj):
        return obj.usuarios.count()
    usuarios_count.short_description = 'Usuarios'


@admin.register(UsuarioLogro)
class UsuarioLogroAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'logro_display', 'fecha_obtenido']
    list_filter = ['logro', 'fecha_obtenido']
    search_fields = ['usuario__username', 'logro__nombre']
    raw_id_fields = ['usuario', 'logro']
    date_hierarchy = 'fecha_obtenido'
    
    def logro_display(self, obj):
        return format_html(
            '{} {}',
            obj.logro.icono, obj.logro.nombre
        )
    logro_display.short_description = 'Logro'


# ============================================
# ADMINISTRADORES INDEPENDIENTES PARA CONTENIDO
# ============================================

@admin.register(TemaContenido)
class TemaContenidoAdmin(admin.ModelAdmin):
    """Admin independiente para gestionar contenidos de temas"""
    list_display = ['tema_titulo', 'subtitulo', 'contenido_preview', 'orden', 'acciones']
    list_filter = ['tema__seccion', 'tema']
    search_fields = ['subtitulo', 'contenido', 'tema__titulo']
    ordering = ['tema__seccion__orden', 'tema__orden', 'orden']
    list_editable = ['orden']
    autocomplete_fields = ['tema']
    
    fieldsets = (
        ('📖 Tema', {
            'fields': ('tema',),
        }),
        ('📝 Contenido', {
            'fields': ('subtitulo', 'contenido', 'orden'),
        }),
    )
    
    def tema_titulo(self, obj):
        return format_html(
            '<span style="color: #666;">{}</span> → <strong>{}</strong>',
            obj.tema.seccion.nombre, obj.tema.titulo
        )
    tema_titulo.short_description = 'Sección → Tema'
    
    def contenido_preview(self, obj):
        preview = obj.contenido[:80] + '...' if len(obj.contenido) > 80 else obj.contenido
        return preview
    contenido_preview.short_description = 'Vista Previa'
    
    def acciones(self, obj):
        return format_html(
            '<a href="{}" style="color: #3b82f6;">✏️ Editar</a> | '
            '<a href="{}" style="color: #ef4444;">🗑️ Eliminar</a>',
            reverse('admin:learning_temacontenido_change', args=[obj.pk]),
            reverse('admin:learning_temacontenido_delete', args=[obj.pk])
        )
    acciones.short_description = 'Acciones'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('tema__seccion')


@admin.register(TemaPuntoClave)
class TemaPuntoClaveAdmin(admin.ModelAdmin):
    """Admin independiente para gestionar puntos clave"""
    list_display = ['tema_titulo', 'texto_preview', 'orden', 'acciones']
    list_filter = ['tema__seccion', 'tema']
    search_fields = ['texto', 'tema__titulo']
    ordering = ['tema__seccion__orden', 'tema__orden', 'orden']
    list_editable = ['orden']
    autocomplete_fields = ['tema']
    
    fieldsets = (
        ('📖 Tema', {
            'fields': ('tema',),
        }),
        ('💡 Punto Clave', {
            'fields': ('texto', 'orden'),
        }),
    )
    
    def tema_titulo(self, obj):
        return format_html(
            '<span style="color: #666;">{}</span> → <strong>{}</strong>',
            obj.tema.seccion.nombre, obj.tema.titulo
        )
    tema_titulo.short_description = 'Sección → Tema'
    
    def texto_preview(self, obj):
        preview = obj.texto[:60] + '...' if len(obj.texto) > 60 else obj.texto
        return preview
    texto_preview.short_description = 'Punto Clave'
    
    def acciones(self, obj):
        return format_html(
            '<a href="{}" style="color: #3b82f6;">✏️ Editar</a> | '
            '<a href="{}" style="color: #ef4444;">🗑️ Eliminar</a>',
            reverse('admin:learning_temapuntoclave_change', args=[obj.pk]),
            reverse('admin:learning_temapuntoclave_delete', args=[obj.pk])
        )
    acciones.short_description = 'Acciones'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('tema__seccion')

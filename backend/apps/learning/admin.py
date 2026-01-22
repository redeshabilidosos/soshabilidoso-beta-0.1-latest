from django.contrib import admin
from .models import Seccion, Tema, TemaContenido, TemaPuntoClave, ProgresoUsuario, Logro, UsuarioLogro


@admin.register(Seccion)
class SeccionAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'slug', 'orden', 'is_active']
    search_fields = ['nombre']
    ordering = ['orden']


@admin.register(Tema)
class TemaAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'seccion', 'nivel', 'orden', 'is_active']
    search_fields = ['titulo']
    ordering = ['orden']


@admin.register(TemaContenido)
class TemaContenidoAdmin(admin.ModelAdmin):
    list_display = ['subtitulo', 'tema', 'orden']
    ordering = ['orden']


@admin.register(TemaPuntoClave)
class TemaPuntoClaveAdmin(admin.ModelAdmin):
    list_display = ['texto', 'tema', 'orden']
    ordering = ['orden']


@admin.register(ProgresoUsuario)
class ProgresoUsuarioAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'tema', 'estado']
    raw_id_fields = ['usuario', 'tema']


@admin.register(Logro)
class LogroAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'puntos', 'is_active']


@admin.register(UsuarioLogro)
class UsuarioLogroAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'logro', 'fecha_obtenido']
    raw_id_fields = ['usuario', 'logro']

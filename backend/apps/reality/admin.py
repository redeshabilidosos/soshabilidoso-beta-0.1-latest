"""
Admin para la app de Reality Show
"""
from django.contrib import admin
from .models import Participante


@admin.register(Participante)
class ParticipanteAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'codigo', 'nombres', 'apellidos', 'edad', 
        'municipio', 'email', 'timestamp'
    ]
    list_filter = ['subregion', 'municipio', 'genero', 'nivel_educacion']
    search_fields = ['nombres', 'apellidos', 'documento_participante', 'email', 'codigo']
    readonly_fields = ['id', 'timestamp', 'created_at']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('codigo', 'nombres', 'apellidos', 'genero', 'edad')
        }),
        ('Documentación', {
            'fields': ('tipo_documento_participante', 'documento_participante')
        }),
        ('Datos Médicos', {
            'fields': ('fecha_nacimiento', 'tipo_sangre', 'rh', 'eps_sisben', 'certificado_eps')
        }),
        ('Ubicación', {
            'fields': ('subregion', 'municipio', 'municipio_residencia')
        }),
        ('Contacto', {
            'fields': ('telefono_contacto', 'email', 'confirm_email')
        }),
        ('Educación', {
            'fields': ('nivel_educacion', 'nombre_ie_educativa')
        }),
        ('Deportivo', {
            'fields': ('position',)
        }),
        ('Acudiente', {
            'fields': (
                'nombre_acudiente', 
                'tipo_documento_acudiente', 
                'numero_documento_acudiente',
                'telefono_acudiente',
                'email_acudiente'
            )
        }),
        ('Autorizaciones', {
            'fields': ('sensitive_data', 'habeas_data')
        }),
        ('Metadata', {
            'fields': ('timestamp', 'created_at', 'observacion_general')
        }),
    )

"""
Serializers para el registro de participantes del Reality Show
"""
from rest_framework import serializers
from .models import Participante
from datetime import date


class ParticipanteSerializer(serializers.ModelSerializer):
    """
    Serializer para crear participantes del Reality Show
    """
    
    class Meta:
        model = Participante
        fields = [
            'id',
            'nombres',
            'apellidos',
            'genero',
            'position',
            'tipo_documento_participante',
            'documento_participante',
            'fecha_nacimiento',
            'edad',
            'tipo_sangre',
            'rh',
            'eps_sisben',
            'certificado_eps',
            'subregion',
            'municipio',
            'telefono_contacto',
            'email',
            'confirm_email',
            'nivel_educacion',
            'nombre_ie_educativa',
            'nombre_acudiente',
            'tipo_documento_acudiente',
            'numero_documento_acudiente',
            'telefono_acudiente',
            'email_acudiente',
            'municipio_residencia',
            'sensitive_data',
            'habeas_data',
        ]
        read_only_fields = ['id', 'edad']
    
    def validate(self, data):
        """
        Validaciones personalizadas
        """
        # Validar que el documento no esté ya registrado
        documento = data.get('documento_participante')
        if documento:
            existe = Participante.objects.using('habilidosos_clean').filter(
                documento_participante=documento
            ).exists()
            
            if existe:
                raise serializers.ValidationError({
                    'documento_participante': f'El documento {documento} ya está registrado en el programa. Si crees que esto es un error, contacta con el administrador.'
                })
        
        # Validar que los emails coincidan
        if data.get('email') != data.get('confirm_email'):
            raise serializers.ValidationError({
                'confirm_email': 'Los correos electrónicos no coinciden'
            })
        
        # Calcular edad
        if 'fecha_nacimiento' in data:
            birth_date = data['fecha_nacimiento']
            today = date.today()
            age = today.year - birth_date.year - (
                (today.month, today.day) < (birth_date.month, birth_date.day)
            )
            data['edad'] = age
            
            # Validar rango de edad
            if age < 13 or age > 19:
                raise serializers.ValidationError({
                    'fecha_nacimiento': 'Debes tener entre 13 y 19 años para participar'
                })
        
        # Validar autorizaciones
        if not data.get('sensitive_data'):
            raise serializers.ValidationError({
                'sensitive_data': 'Debes aceptar el tratamiento de datos sensibles'
            })
        
        if not data.get('habeas_data'):
            raise serializers.ValidationError({
                'habeas_data': 'Debes aceptar el tratamiento de datos personales'
            })
        
        return data
    
    def create(self, validated_data):
        """
        Crear participante
        """
        # Generar código único si no existe
        if not validated_data.get('codigo'):
            ultimo_id = Participante.objects.using('habilidosos_clean').count()
            validated_data['codigo'] = f"PART-{ultimo_id + 1:05d}"
        
        # Crear participante en la base de datos habilidosos_clean
        participante = Participante.objects.using('habilidosos_clean').create(**validated_data)
        return participante


class Participante2026Serializer(serializers.ModelSerializer):
    """
    Serializer para crear participantes del Reality Show 2026
    Guarda en la tabla participantes_2026_1
    """
    
    class Meta:
        model = None  # Se asignará dinámicamente
        fields = [
            'id',
            'codigo',
            'nombres',
            'apellidos',
            'edad',
            'genero',
            'nombre_acudiente',
            'tipo_documento_acudiente',
            'numero_documento_acudiente',
            'telefono_acudiente',
            'email_acudiente',
            'tipo_documento_participante',
            'documento_participante',
            'fecha_nacimiento',
            'tipo_sangre',
            'position',
            'subregion',
            'municipio',
            'municipio_residencia',
            'telefono_contacto',
            'email',
            'confirm_email',
            'nivel_educacion',
            'nombre_ie_educativa',
            'sensitive_data',
            'habeas_data',
            'avatar_url',
        ]
        read_only_fields = ['id', 'codigo', 'edad']
    
    def __init__(self, *args, **kwargs):
        from .models import Participante2026
        self.Meta.model = Participante2026
        super().__init__(*args, **kwargs)
    
    def validate(self, data):
        """
        Validaciones personalizadas
        """
        from .models import Participante2026
        
        # Validar que el documento no esté ya registrado
        documento = data.get('documento_participante')
        if documento:
            existe = Participante2026.objects.using('habilidosos_clean').filter(
                documento_participante=documento
            ).exists()
            
            if existe:
                raise serializers.ValidationError({
                    'documento_participante': f'El documento {documento} ya está registrado en el programa 2026. Si crees que esto es un error, contacta con el administrador.'
                })
        
        # Validar que los emails coincidan
        if data.get('email') and data.get('confirm_email'):
            if data.get('email') != data.get('confirm_email'):
                raise serializers.ValidationError({
                    'confirm_email': 'Los correos electrónicos no coinciden'
                })
        
        # Calcular edad
        if 'fecha_nacimiento' in data and data['fecha_nacimiento']:
            birth_date = data['fecha_nacimiento']
            today = date.today()
            age = today.year - birth_date.year - (
                (today.month, today.day) < (birth_date.month, birth_date.day)
            )
            data['edad'] = age
            
            # Validar rango de edad
            if age < 13 or age > 19:
                raise serializers.ValidationError({
                    'fecha_nacimiento': 'Debes tener entre 13 y 19 años para participar'
                })
        
        # Validar autorizaciones
        if not data.get('sensitive_data'):
            raise serializers.ValidationError({
                'sensitive_data': 'Debes aceptar el tratamiento de datos sensibles'
            })
        
        if not data.get('habeas_data'):
            raise serializers.ValidationError({
                'habeas_data': 'Debes aceptar el tratamiento de datos personales'
            })
        
        return data
    
    def create(self, validated_data):
        """
        Crear participante en la tabla participantes_2026_1
        """
        from .models import Participante2026
        import random
        import string
        
        # Generar código único
        prefix = "HAB2026"
        random_part = ''.join(random.choices(string.digits, k=4))
        validated_data['codigo'] = f"{prefix}-{random_part}"
        
        # NO establecer fase_actual ni estado_fase_X - esos campos son manejados por la otra aplicación
        
        # Crear participante en la base de datos habilidosos_clean
        participante = Participante2026.objects.using('habilidosos_clean').create(**validated_data)
        return participante

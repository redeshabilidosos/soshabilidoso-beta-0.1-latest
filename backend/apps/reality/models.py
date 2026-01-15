"""
Modelo para participantes del Reality Show
Conecta con la tabla participantes en habilidosos_clean
"""
from django.db import models
import uuid
from datetime import date


class Participante(models.Model):
    """
    Modelo para participantes del Reality Show
    Tabla: participantes en base de datos habilidosos_clean
    """
    id = models.AutoField(primary_key=True)
    uuid_interno = models.CharField(max_length=36, blank=True, null=True)
    codigo = models.CharField(max_length=50, blank=True, null=True)
    
    # Datos personales del deportista
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    genero = models.CharField(max_length=10)  # ENUM: 'hombre', 'mujer', 'otro'
    documento_participante = models.CharField(max_length=50)
    tipo_documento_participante = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    edad = models.IntegerField(blank=True, null=True)
    
    # Datos médicos
    tipo_sangre = models.CharField(max_length=5)
    rh = models.CharField(max_length=5)
    eps_sisben = models.CharField(max_length=200)
    certificado_eps = models.BinaryField(blank=True, null=True)  # LONGBLOB para archivos
    
    # Ubicación
    subregion = models.CharField(max_length=100)
    municipio = models.CharField(max_length=100)
    municipio_residencia = models.CharField(max_length=100)
    
    # Contacto
    telefono_contacto = models.CharField(max_length=20)
    email = models.EmailField()
    confirm_email = models.EmailField()
    
    # Educación
    nivel_educacion = models.CharField(max_length=100)
    nombre_ie_educativa = models.CharField(max_length=200)
    
    # Deportivo
    position = models.CharField(max_length=100, db_column='position')
    
    # Acudiente
    nombre_acudiente = models.CharField(max_length=100)
    tipo_documento_acudiente = models.CharField(max_length=50)
    numero_documento_acudiente = models.CharField(max_length=50)
    telefono_acudiente = models.CharField(max_length=20)
    email_acudiente = models.EmailField()
    
    # Autorizaciones
    sensitive_data = models.BooleanField(default=False)
    habeas_data = models.BooleanField(default=False)
    
    # Metadata
    timestamp = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    avatar_url = models.CharField(max_length=500, blank=True, null=True)
    clasificado_portugal = models.BooleanField(default=False)
    observacion_general = models.TextField(blank=True, null=True)
    equipo_id = models.IntegerField(blank=True, null=True)

    class Meta:
        app_label = 'reality'
        db_table = 'participantes'
        managed = False  # Django no manejará las migraciones de esta tabla
        verbose_name = 'Participante'
        verbose_name_plural = 'Participantes'

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"


class Participante2026(models.Model):
    """
    Modelo para participantes del Reality Show 2026
    Tabla: participantes_2026_1 en base de datos habilidosos_clean
    """
    GENERO_CHOICES = [
        ('hombre', 'Hombre'),
        ('mujer', 'Mujer'),
        ('otro', 'Otro'),
    ]
    
    FASE_CHOICES = [
        ('inscrito', 'Inscrito'),
        ('fase_1', 'Fase 1'),
        ('fase_2', 'Fase 2'),
        ('fase_3', 'Fase 3'),
        ('finalista', 'Finalista'),
        ('eliminado', 'Eliminado'),
    ]
    
    ESTADO_FASE_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('en_revision', 'En Revisión'),
    ]
    
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=20, unique=True, blank=True)
    
    # Datos personales del deportista
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    edad = models.IntegerField(blank=True, null=True)
    genero = models.CharField(max_length=6, choices=GENERO_CHOICES)
    
    # Datos del acudiente
    nombre_acudiente = models.CharField(max_length=100, blank=True, null=True)
    tipo_documento_acudiente = models.CharField(max_length=10, blank=True, null=True)
    numero_documento_acudiente = models.CharField(max_length=20, blank=True, null=True)
    telefono_acudiente = models.CharField(max_length=20, blank=True, null=True)
    email_acudiente = models.EmailField(blank=True, null=True)
    
    # Documento del participante
    tipo_documento_participante = models.CharField(max_length=10, blank=True, null=True)
    documento_participante = models.CharField(max_length=20, unique=True)
    
    # Datos adicionales
    fecha_nacimiento = models.DateField(blank=True, null=True)
    tipo_sangre = models.CharField(max_length=5, blank=True, null=True)
    position = models.CharField(max_length=50, blank=True, null=True)
    
    # Ubicación
    subregion = models.CharField(max_length=100, blank=True, null=True)
    municipio = models.CharField(max_length=100, blank=True, null=True)
    municipio_residencia = models.CharField(max_length=100, blank=True, null=True)
    
    # Contacto
    telefono_contacto = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    confirm_email = models.EmailField(blank=True, null=True)
    
    # Educación
    nivel_educacion = models.CharField(max_length=50, blank=True, null=True)
    nombre_ie_educativa = models.CharField(max_length=200, blank=True, null=True)
    
    # Autorizaciones
    sensitive_data = models.BooleanField(default=False)
    habeas_data = models.BooleanField(default=False)
    
    # Metadata
    timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    avatar_url = models.TextField(blank=True, null=True)  # Foto de perfil para el reality
    
    # Nota: Los campos fase_actual, estado_fase_X, clasificado_argentina, fecha_clasificacion
    # son manejados por la otra aplicación (puerto 3000), no se incluyen aquí para evitar conflictos

    class Meta:
        app_label = 'reality'
        db_table = 'participantes_2026_1'
        managed = False  # Django no manejará las migraciones de esta tabla
        verbose_name = 'Participante 2026'
        verbose_name_plural = 'Participantes 2026'

    def __str__(self):
        return f"{self.codigo} - {self.nombres} {self.apellidos}"
    
    def save(self, *args, **kwargs):
        # Generar código único si no existe
        if not self.codigo:
            self.codigo = self.generate_codigo()
        
        # Calcular edad si hay fecha de nacimiento
        if self.fecha_nacimiento:
            today = date.today()
            self.edad = today.year - self.fecha_nacimiento.year - (
                (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
            )
        
        super().save(*args, **kwargs)
    
    def generate_codigo(self):
        """Genera un código único para el participante"""
        import random
        import string
        prefix = "HAB2026"
        random_part = ''.join(random.choices(string.digits, k=4))
        return f"{prefix}-{random_part}"

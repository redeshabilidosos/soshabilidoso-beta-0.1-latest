import uuid
import os
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator

User = get_user_model()

def upload_to_media(instance, filename):
    """Función para generar path de upload"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    
    # Organizar por tipo de archivo
    if instance.file_type == 'image':
        return f"images/{filename}"
    elif instance.file_type == 'video':
        return f"videos/{filename}"
    elif instance.file_type == 'audio':
        return f"audio/{filename}"
    else:
        return f"documents/{filename}"

class MediaFile(models.Model):
    """Modelo para almacenar archivos multimedia"""
    
    FILE_TYPES = [
        ('image', 'Imagen'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('document', 'Documento'),
    ]
    
    # ID único inmutable
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Información del archivo
    file = models.FileField(upload_to=upload_to_media, verbose_name="Archivo")
    file_type = models.CharField(max_length=10, choices=FILE_TYPES, verbose_name="Tipo de archivo")
    original_name = models.CharField(max_length=255, verbose_name="Nombre original")
    file_size = models.PositiveIntegerField(verbose_name="Tamaño del archivo (bytes)")
    mime_type = models.CharField(max_length=100, verbose_name="Tipo MIME")
    
    # Metadatos para imágenes
    width = models.PositiveIntegerField(null=True, blank=True, verbose_name="Ancho")
    height = models.PositiveIntegerField(null=True, blank=True, verbose_name="Alto")
    
    # Metadatos para videos/audio
    duration = models.DurationField(null=True, blank=True, verbose_name="Duración")
    
    # Propietario y permisos
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files', verbose_name="Subido por")
    is_public = models.BooleanField(default=True, verbose_name="Público")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de subida")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")
    
    class Meta:
        verbose_name = "Archivo Multimedia"
        verbose_name_plural = "Archivos Multimedia"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['uploaded_by', '-created_at']),
            models.Index(fields=['file_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.original_name} ({self.get_file_type_display()})"
    
    @property
    def file_url(self):
        """Obtener URL del archivo"""
        if self.file:
            return self.file.url
        return None
    
    @property
    def file_size_mb(self):
        """Obtener tamaño en MB"""
        return round(self.file_size / (1024 * 1024), 2)
    
    def delete(self, *args, **kwargs):
        """Eliminar archivo del sistema al eliminar el registro"""
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)

class MediaAlbum(models.Model):
    """Modelo para álbumes de archivos multimedia"""
    
    # ID único inmutable
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Información del álbum
    name = models.CharField(max_length=100, verbose_name="Nombre del álbum")
    description = models.TextField(blank=True, verbose_name="Descripción")
    
    # Archivos del álbum
    files = models.ManyToManyField(MediaFile, related_name='albums', verbose_name="Archivos")
    
    # Propietario
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='media_albums', verbose_name="Propietario")
    
    # Configuración
    is_public = models.BooleanField(default=True, verbose_name="Público")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")
    
    class Meta:
        verbose_name = "Álbum Multimedia"
        verbose_name_plural = "Álbumes Multimedia"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def file_count(self):
        """Obtener número de archivos en el álbum"""
        return self.files.count()
    
    @property
    def cover_image(self):
        """Obtener imagen de portada del álbum"""
        image = self.files.filter(file_type='image').first()
        return image.file_url if image else None